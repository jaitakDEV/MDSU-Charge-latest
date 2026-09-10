import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { sendListingApprovedEmail } from "@/server/email";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const listing = await db.jobListing.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
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
        apiError("Only listings under review (SUBMITTED) can be approved."),
        { status: 400 },
      );
    }

    await db.jobListing.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        approvalStatus: "APPROVED",
        approvedById: guard.userId,
        approvedAt: new Date(),
        rejectedReason: null,
      },
    });

    try {
      await sendListingApprovedEmail({
        email: listing.company.contactEmail,
        contactPerson: listing.company.contactPerson,
        listingTitle: listing.title,
        listingSlug: listing.slug,
      });
    } catch (emailError) {
      console.error("[LISTING_APPROVE_EMAIL_FAILED]", emailError);
    }

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[CMS_LISTING_APPROVE]", error);
    return NextResponse.json(apiError("Failed to approve listing."), {
      status: 500,
    });
  }
}
