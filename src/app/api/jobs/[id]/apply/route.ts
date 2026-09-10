import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import {
  sendApplicationConfirmationEmail,
  sendNewApplicantEmail,
} from "@/server/email";
import { z } from "zod";

const applySchema = z.object({
  coverLetter: z.string().max(2000).optional(),
  expectedSalary: z.number().optional(),
  noticePeriod: z.number().optional(),
  availableFrom: z.string().datetime().optional(),
  portfolioUrl: z.string().optional(),
  screeningAnswers: z.record(z.string(), z.any()).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "STUDENT")
      return NextResponse.json(
        apiError("Only students can apply to listings."),
        { status: 403 },
      );

    const { id: listingId } = await params;

    const body = await req.json();
    const parsed = applySchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const d = parsed.data;

    const listing = await db.jobListing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        status: true,
        applicationDeadline: true,
        openings: true,
        applicationCount: true,
        opportunityType: true,
        targetBatchYears: true,
        companyId: true,
        company: {
          select: {
            contactEmail: true,
            contactPerson: true,
            companyName: true,
          },
        },
        screeningQuestions: {
          select: { id: true, question: true, isRequired: true },
        },
      },
    });

    if (!listing)
      return NextResponse.json(apiError("Listing not found."), { status: 404 });

    if (listing.status !== "PUBLISHED") {
      return NextResponse.json(
        apiError("This listing is not open for applications."),
        { status: 400 },
      );
    }

    if (
      listing.applicationDeadline &&
      listing.applicationDeadline < new Date()
    ) {
      return NextResponse.json(
        apiError("The application deadline for this listing has passed."),
        { status: 400 },
      );
    }

    if (listing.applicationCount >= listing.openings * 50) {
      return NextResponse.json(
        apiError("This listing is no longer accepting new applications."),
        { status: 400 },
      );
    }

    const profile = await db.studentCareerProfile.findUnique({
      where: { userId: guard.userId },
      select: {
        id: true,
        resumeUrl: true,
        resumeKey: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!profile) {
      return NextResponse.json(
        apiError("Please complete your career profile before applying."),
        { status: 400 },
      );
    }

    if (!profile.resumeUrl) {
      return NextResponse.json(
        apiError("Please upload a resume before applying."),
        { status: 400 },
      );
    }

    const existing = await db.jobApplication.findUnique({
      where: { listingId_profileId: { listingId, profileId: profile.id } },
    });
    if (existing) {
      return NextResponse.json(
        apiError("You have already applied to this listing."),
        { status: 409 },
      );
    }

    if (
      listing.opportunityType === "CAMPUS_HIRING" &&
      listing.targetBatchYears.length > 0
    ) {
      const education = await db.studentEducation.findFirst({
        where: { profileId: profile.id, isCurrently: true },
        orderBy: { displayOrder: "asc" },
        select: { endYear: true },
      });
      const studentBatch = education?.endYear;
      if (!studentBatch || !listing.targetBatchYears.includes(studentBatch)) {
        return NextResponse.json(
          apiError(
            `This listing is only for ${listing.targetBatchYears.join("/")} batch students.`,
          ),
          { status: 403 },
        );
      }
    }

    const requiredQuestions = listing.screeningQuestions.filter(
      (q) => q.isRequired,
    );
    if (requiredQuestions.length > 0) {
      const answers = d.screeningAnswers ?? {};
      const missing = requiredQuestions.filter(
        (q) => !(q.id in answers) || !answers[q.id],
      );
      if (missing.length > 0) {
        return NextResponse.json(
          apiError(
            `Please answer all required questions: ${missing.map((q) => q.question).join(", ")}`,
          ),
          { status: 400 },
        );
      }
    }

    const application = await db.$transaction(async (tx) => {
      const app = await tx.jobApplication.create({
        data: {
          listingId,
          profileId: profile.id,
          coverLetter: d.coverLetter || null,
          resumeUrl: profile.resumeUrl!, // snapshot at time of application
          resumeKey: profile.resumeKey,
          portfolioUrl: d.portfolioUrl || null,
          expectedSalary: d.expectedSalary ?? null,
          noticePeriod: d.noticePeriod ?? null,
          availableFrom: d.availableFrom ? new Date(d.availableFrom) : null,
          screeningAnswers: d.screeningAnswers ?? undefined,
          status: "APPLIED",
          statusUpdatedAt: new Date(),
        },
      });

      await tx.jobListing.update({
        where: { id: listingId },
        data: { applicationCount: { increment: 1 } },
      });

      return app;
    });

    try {
      await sendApplicationConfirmationEmail({
        email: profile.user.email,
        studentName: profile.user.name ?? "Student",
        listingTitle: listing.title,
        companyName: listing.company.companyName,
        applicationId: application.id,
      });

      await sendNewApplicantEmail({
        companyEmail: listing.company.contactEmail,
        contactPerson: listing.company.contactPerson,
        applicantName: profile.user.name ?? "A student",
        listingTitle: listing.title,
        listingId: listing.id,
      });
    } catch (emailError) {
      console.error("[APPLICATION_EMAIL_FAILED]", emailError);
    }

    return NextResponse.json(apiSuccess({ applicationId: application.id }), {
      status: 201,
    });
  } catch (error) {
    console.error("[JOB_APPLY]", error);
    return NextResponse.json(
      apiError("Failed to submit application. Please try again."),
      { status: 500 },
    );
  }
}
