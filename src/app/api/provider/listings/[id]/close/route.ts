import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "JOB_PROVIDER")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const { id } = await params;

  const company = await db.companyProfile.findUnique({
    where: { userId: guard.userId },
    select: { id: true },
  });
  if (!company)
    return NextResponse.json(apiError("Company profile not found."), {
      status: 404,
    });

  const listing = await db.jobListing.findFirst({
    where: { id, companyId: company.id },
  });
  if (!listing)
    return NextResponse.json(apiError("Listing not found."), { status: 404 });

  if (listing.status !== "PUBLISHED") {
    return NextResponse.json(
      apiError("Only published listings can be closed."),
      { status: 400 },
    );
  }

  await db.$transaction(async (tx) => {
    await tx.jobListing.update({
      where: { id },
      data: { status: "CLOSED" },
    });

    await tx.jobApplication.updateMany({
      where: { listingId: id, status: "APPLIED" },
      data: { status: "UNDER_REVIEW" },
    });
  });

  return NextResponse.json(apiSuccess(null));
}
