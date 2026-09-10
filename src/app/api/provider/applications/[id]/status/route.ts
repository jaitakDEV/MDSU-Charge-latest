import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import {
  sendApplicationStatusEmail,
  sendInterviewScheduledEmail,
} from "@/server/email";
import { z } from "zod";

const schema = z.object({
  status: z
    .enum([
      "UNDER_REVIEW",
      "SHORTLISTED",
      "INTERVIEW_SCHEDULED",
      "INTERVIEWED",
      "OFFERED",
      "REJECTED",
    ])
    .optional(),
  statusNote: z.string().max(1000).optional(),
  interviewDate: z.string().datetime().optional(),
  interviewMode: z.string().optional(),
  interviewLink: z.string().optional(),
  isShortlisted: z.boolean().optional(),
  isStarred: z.boolean().optional(),
  companyNotes: z.string().optional(),
});

// ── Statuses that trigger a student email (Section 10.4) ────────
const EMAIL_TRIGGER_STATUSES = new Set([
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "OFFERED",
  "REJECTED",
]);

// ── Terminal statuses — company can no longer change these ──────
const TERMINAL_STATUSES = new Set([
  "WITHDRAWN",
  "OFFER_ACCEPTED",
  "OFFER_REJECTED",
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "JOB_PROVIDER")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const d = parsed.data;

    // ── Ownership verification ────────────────────────────────
    const company = await db.companyProfile.findUnique({
      where: { userId: guard.userId },
      select: { id: true },
    });
    if (!company)
      return NextResponse.json(apiError("Company profile not found."), {
        status: 404,
      });

    const application = await db.jobApplication.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        listing: {
          select: { id: true, companyId: true, title: true },
        },
        profile: {
          select: { user: { select: { name: true, email: true } } },
        },
      },
    });

    if (!application)
      return NextResponse.json(apiError("Application not found."), {
        status: 404,
      });

    if (application.listing.companyId !== company.id)
      return NextResponse.json(
        apiError("Forbidden — this is not your listing."),
        { status: 403 },
      );

    // ── Section 18: cannot update status of WITHDRAWN applications ──
    if (TERMINAL_STATUSES.has(application.status)) {
      // Allow starring/notes even on terminal applications, but block status changes
      if (d.status) {
        return NextResponse.json(
          apiError(
            `Cannot update status — this application has been ${application.status.toLowerCase()}.`,
          ),
          { status: 400 },
        );
      }
    }

    // ── Interview fields require INTERVIEW_SCHEDULED status ──────
    if (d.status === "INTERVIEW_SCHEDULED" && !d.interviewDate) {
      return NextResponse.json(
        apiError("Interview date is required when scheduling an interview."),
        { status: 400 },
      );
    }

    // ── Build update payload — only touch fields that were sent ──
    const updateData: Record<string, any> = {};

    if (d.status !== undefined) {
      updateData.status = d.status;
      updateData.statusUpdatedAt = new Date();
    }
    if (d.statusNote !== undefined) updateData.statusNote = d.statusNote;
    if (d.interviewDate !== undefined)
      updateData.interviewDate = new Date(d.interviewDate);
    if (d.interviewMode !== undefined)
      updateData.interviewMode = d.interviewMode;
    if (d.interviewLink !== undefined)
      updateData.interviewLink = d.interviewLink;
    if (d.isShortlisted !== undefined)
      updateData.isShortlisted = d.isShortlisted;
    if (d.isStarred !== undefined) updateData.isStarred = d.isStarred;
    if (d.companyNotes !== undefined) updateData.companyNotes = d.companyNotes; // never sent to student

    await db.jobApplication.update({
      where: { id },
      data: updateData,
    });

    // ── Send appropriate email — fail-safe ───────────────────────
    if (d.status && EMAIL_TRIGGER_STATUSES.has(d.status)) {
      const studentEmail = application.profile.user.email;
      const studentName = application.profile.user.name ?? "Student";

      try {
        if (d.status === "INTERVIEW_SCHEDULED" && d.interviewDate) {
          await sendInterviewScheduledEmail({
            email: studentEmail,
            studentName,
            listingTitle: application.listing.title,
            companyName:
              (
                await db.companyProfile.findUnique({
                  where: { id: company.id },
                  select: { companyName: true },
                })
              )?.companyName ?? "the company",
            interviewDate: new Date(d.interviewDate),
            interviewMode: d.interviewMode ?? null,
            interviewLink: d.interviewLink ?? null,
            applicationId: application.id,
          });
        } else {
          const companyProfile = await db.companyProfile.findUnique({
            where: { id: company.id },
            select: { companyName: true },
          });
          await sendApplicationStatusEmail({
            email: studentEmail,
            studentName,
            listingTitle: application.listing.title,
            companyName: companyProfile?.companyName ?? "the company",
            status: d.status,
            statusNote: d.statusNote ?? null,
            applicationId: application.id,
          });
        }
      } catch (emailError) {
        console.error("[APPLICATION_STATUS_EMAIL_FAILED]", emailError);
      }
    }

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[APPLICATION_STATUS_UPDATE]", error);
    return NextResponse.json(apiError("Failed to update application status."), {
      status: 500,
    });
  }
}
