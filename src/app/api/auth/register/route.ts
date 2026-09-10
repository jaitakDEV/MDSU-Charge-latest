import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { registerSchema } from "@/validations/auth";
import { sendVerificationEmail } from "@/server/email";
import { apiError, apiSuccess } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const { name, email, password, phoneNumber, registrationType, collegeId } =
      parsed.data;

    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        apiError("An account with this email already exists"),
        { status: 409 },
      );
    }

    const existingPhone = await db.user.findFirst({ where: { phoneNumber } });
    if (existingPhone) {
      return NextResponse.json(
        apiError("An account with this phone number already exists"),
        { status: 409 },
      );
    }

    const college = await db.college.findUnique({
      where: { id: collegeId },
      select: { id: true, isActive: true, isOther: true },
    });
    if (!college || !college.isActive) {
      return NextResponse.json(apiError("Selected college is invalid"), {
        status: 400,
      });
    }

    if (registrationType === "FACULTY" && !college.isOther) {
      const existingFaculty = await db.user.findFirst({
        where: { collegeId, role: "FACULTY", isActive: true },
        select: { id: true },
      });
      if (existingFaculty) {
        return NextResponse.json(
          apiError("A faculty member is already registered for this college."),
          { status: 409 },
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomUUID();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const finalCollegeId = college.isOther ? null : collegeId;

    // const user = await db.$transaction(async (tx) => {
    //   const newUser = await tx.user.create({
    //     data: {
    //       name,
    //       email,
    //       hashedPassword,
    //       phoneNumber,
    //       collegeId: finalCollegeId,
    //       role: registrationType,
    //     },
    //   });

    //   await tx.emailVerificationToken.create({
    //     data: {
    //       userId: newUser.id,
    //       email: newUser.email,
    //       token: verificationToken,
    //       expires: tokenExpires,
    //     },
    //   });

    //   return newUser;
    // });

    const user = await db.$transaction(async (tx) => {
      let registrationNumber: string | undefined;
      let rollNumber: string | undefined;
      let batchYear: number | undefined;

      if (registrationType === "STUDENT") {
        const year = new Date().getFullYear();

        await tx.$executeRaw`
  INSERT INTO student_counters (id, year, "lastCount")
  VALUES (gen_random_uuid(), ${year}, 0)
  ON CONFLICT (year) DO NOTHING
`;

        const [counter] = await tx.$queryRaw<
          { id: string; lastCount: number }[]
        >`
  SELECT id, "lastCount" FROM student_counters
  WHERE year = ${year}
  FOR UPDATE
`;

        const newCount = counter.lastCount + 1;

        await tx.$executeRaw`
  UPDATE student_counters
  SET "lastCount" = ${newCount}
  WHERE id = ${counter.id}
`;
        registrationNumber = `MDSU/CHARGE/${year}/${String(newCount).padStart(5, "0")}`;
        rollNumber = `${year}${String(newCount).padStart(4, "0")}`;
        batchYear = year;
      }

      const newUser = await tx.user.create({
        data: {
          name,
          email,
          hashedPassword,
          phoneNumber,
          collegeId: finalCollegeId,
          role: registrationType,
          ...(registrationType === "STUDENT" && {
            registrationNumber,
            rollNumber,
            batchYear,
          }),
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          userId: newUser.id,
          email: newUser.email,
          token: verificationToken,
          expires: tokenExpires,
        },
      });

      return newUser;
    });

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error("[REGISTER_EMAIL_SEND_FAILED]", emailError);
    }

    return NextResponse.json(
      apiSuccess({ message: "Check your email to verify your account" }),
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target as string[] | undefined;

      if (target?.includes("one_active_faculty_per_college")) {
        return NextResponse.json(
          apiError(
            "A faculty member is already registered for this college. Only one active faculty per college is allowed.",
          ),
          { status: 409 },
        );
      }

      if (target?.includes("email")) {
        return NextResponse.json(
          apiError("An account with this email already exists"),
          { status: 409 },
        );
      }

      return NextResponse.json(
        apiError("This information is already registered."),
        { status: 409 },
      );
    }

    console.error("[REGISTER_POST]", error);
    return NextResponse.json(
      apiError("Something went wrong. Please try again."),
      { status: 500 },
    );
  }
}
