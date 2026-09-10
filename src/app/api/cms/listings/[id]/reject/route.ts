import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { sendListingRejectedEmail } from "@/server/email";
import { z } from "zod";

const schema = z.object({
  reason: z.string().min(10, "Rejection reason must be at least 10 characters"),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const listing = await db.jobListing.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        company: {
          select: { contactPerson: true, contactEmail: true },
        },
      },
    });

    if (!listing)
      return NextResponse.json(apiError("Listing not found."), { status: 404 });

    if (listing.status !== "SUBMITTED") {
      return NextResponse.json(
        apiError("Only listings under review (SUBMITTED) can be rejected."),
        { status: 400 },
      );
    }

    // ── Rejected listing goes back to DRAFT — provider must ─────
    // create a fresh submission (Section 9.3 state machine: cannot
    // resubmit the same listing, must create a new one). We still
    // revert to DRAFT so the provider can see what was rejected and
    // the record is preserved, but "Submit for Review" will be
    // disabled by treating REJECTED as a terminal approvalStatus
    // that provider UI checks before allowing resubmission.
    await db.jobListing.update({
      where: { id },
      data: {
        status: "DRAFT",
        approvalStatus: "REJECTED",
        rejectedReason: parsed.data.reason,
        approvedById: null,
        approvedAt: null,
      },
    });

    try {
      await sendListingRejectedEmail({
        email: listing.company.contactEmail,
        contactPerson: listing.company.contactPerson,
        listingTitle: listing.title,
        reason: parsed.data.reason,
        listingId: listing.id,
      });
    } catch (emailError) {
      console.error("[LISTING_REJECT_EMAIL_FAILED]", emailError);
    }

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[CMS_LISTING_REJECT]", error);
    return NextResponse.json(apiError("Failed to reject listing."), {
      status: 500,
    });
  }
}
