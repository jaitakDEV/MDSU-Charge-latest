import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { slugify } from "@/lib/utils";
import {
  sendVerificationEmail,
  sendProviderWelcomeEmail,
} from "@/server/email";
import crypto from "crypto";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const registerSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companyType: z.enum([
    "COMPANY",
    "STARTUP",
    "NGO",
    "INSTITUTE",
    "FREELANCER",
    "RECRUITER",
  ]),
  industry: z.string().min(2, "Industry is required"),
  website: z.string().url().optional().or(z.literal("")),
  companySize: z.enum([
    "STARTUP_1_10",
    "SMALL_11_50",
    "MEDIUM_51_200",
    "LARGE_201_500",
    "ENTERPRISE_500_PLUS",
  ]),
  description: z.string().optional(),
  headquarters: z.string().min(2, "Headquarters is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  designation: z.string().min(2, "Designation is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  logoUrl: z.string().optional(),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter a valid PAN number"),
  udyamCertificateUrl: z.string().min(1, "Udyam Certificate is required"),
  termsAccepted: z.literal(true, {
    error: "You must accept the Terms & Conditions.",
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const d = parsed.data;

    const existingEmail = await db.user.findUnique({
      where: { email: d.email },
    });
    if (existingEmail) {
      return NextResponse.json(
        apiError("An account with this email already exists."),
        { status: 409 },
      );
    }

    const existingPhone = await db.user.findFirst({
      where: { phoneNumber: d.contactPhone },
    });
    if (existingPhone) {
      return NextResponse.json(
        apiError("An account with this phone number already exists."),
        { status: 409 },
      );
    }

    const baseSlug = slugify(d.companyName);
    let slug = baseSlug;
    let suffix = 1;
    while (await db.companyProfile.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const hashedPassword = await bcrypt.hash(d.password, 12);
    const verificationToken = crypto.randomUUID();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: d.contactPerson,
          email: d.email,
          hashedPassword,
          phoneNumber: d.contactPhone,
          role: "JOB_PROVIDER",
          isActive: false,
        },
      });

      const company = await tx.companyProfile.create({
        data: {
          userId: user.id,
          companyName: d.companyName,
          slug,
          companyType: d.companyType,
          industry: d.industry,
          website: d.website || null,
          logoUrl: d.logoUrl || null,
          description: d.description || null,
          companySize: d.companySize,
          headquarters: d.headquarters,
          city: d.city,
          state: d.state,
          contactPerson: d.contactPerson,
          contactEmail: d.email,
          contactPhone: d.contactPhone,
          designation: d.designation,
          approvalStatus: "PENDING",
          panNumber: d.panNumber.toUpperCase(),
          udyamCertificateUrl: d.udyamCertificateUrl,
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          email: user.email,
          token: verificationToken,
          expires: tokenExpires,
        },
      });

      return { user, company };
    });

    try {
      await sendVerificationEmail(d.email, verificationToken);
      await sendProviderWelcomeEmail({
        email: d.email,
        contactPerson: d.contactPerson,
        companyName: d.companyName,
      });
    } catch (emailError) {
      console.error("[PROVIDER_REGISTER_EMAIL_FAILED]", emailError);
    }

    return NextResponse.json(
      apiSuccess({
        message:
          "Registration submitted. Check your email to verify your account.",
      }),
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target as string[] | undefined;
      if (target?.includes("email")) {
        return NextResponse.json(
          apiError("An account with this email already exists."),
          { status: 409 },
        );
      }
      if (target?.includes("slug")) {
        return NextResponse.json(
          apiError("A company with a similar name already exists."),
          { status: 409 },
        );
      }
      return NextResponse.json(
        apiError("This information is already registered."),
        { status: 409 },
      );
    }

    console.error("[PROVIDER_REGISTER]", error);
    return NextResponse.json(
      apiError("Something went wrong. Please try again."),
      { status: 500 },
    );
  }
}
