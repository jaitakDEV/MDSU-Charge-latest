import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { validateListingFields } from "@/lib/job-utils";
import { sendListingSubmittedToCmsEmail } from "@/server/email";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "JOB_PROVIDER")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const company = await db.companyProfile.findUnique({
      where: { userId: guard.userId },
      select: { id: true, approvalStatus: true, companyName: true },
    });
    if (!company)
      return NextResponse.json(apiError("Company profile not found."), {
        status: 404,
      });

    if (company.approvalStatus !== "APPROVED")
      return NextResponse.json(
        apiError("Company profile must be approved before posting listings."),
        { status: 403 },
      );

    const listing = await db.jobListing.findFirst({
      where: { id, companyId: company.id },
    });
    if (!listing)
      return NextResponse.json(apiError("Listing not found."), { status: 404 });

    if (listing.approvalStatus === "REJECTED")
      return NextResponse.json(
        apiError(
          "This listing was rejected. Please create a new listing instead of resubmitting.",
        ),
        { status: 400 },
      );

    if (listing.status !== "DRAFT")
      return NextResponse.json(
        apiError("Only draft listings can be submitted for review."),
        { status: 400 },
      );

    const validationError = validateListingFields({
      title: listing.title,
      description: listing.description,
      skills: listing.skills,
      openings: listing.openings,
      opportunityType: listing.opportunityType,
      workMode: listing.workMode,
      compensationType: listing.compensationType,
      salaryMin: listing.salaryMin,
      salaryMax: listing.salaryMax,
      stipendMin: listing.stipendMin,
      stipendMax: listing.stipendMax,
      venue: listing.location,
      applicationDeadline: listing.applicationDeadline,
      startDate: listing.startDate,
      endDate: listing.endDate,
      walkInDate: listing.walkInDate,
      targetColleges: listing.targetColleges,
    });
    if (validationError)
      return NextResponse.json(apiError(validationError), { status: 400 });

    await db.jobListing.update({
      where: { id },
      data: { status: "SUBMITTED", approvalStatus: "PENDING_REVIEW" },
    });

    try {
      const cmsEditors = await db.user.findMany({
        where: { role: "CMS_EDITOR", isActive: true },
        select: { email: true },
      });
      for (const editor of cmsEditors) {
        await sendListingSubmittedToCmsEmail({
          cmsEmail: editor.email,
          listingTitle: listing.title,
          companyName: company.companyName,
          listingId: listing.id,
        });
      }
    } catch (emailError) {
      console.error("[LISTING_SUBMIT_EMAIL_FAILED]", emailError);
    }

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[PROVIDER_LISTING_SUBMIT]", error);
    return NextResponse.json(apiError("Failed to submit listing."), {
      status: 500,
    });
  }
}
