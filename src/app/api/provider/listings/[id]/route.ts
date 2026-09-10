import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

async function getOwnedListing(userId: string, listingId: string) {
  const company = await db.companyProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!company) return { company: null, listing: null };

  const listing = await db.jobListing.findFirst({
    where: { id: listingId, companyId: company.id },
  });
  return { company, listing };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "JOB_PROVIDER")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const { id } = await params;
  const { listing } = await getOwnedListing(guard.userId, id);

  if (!listing)
    return NextResponse.json(apiError("Listing not found."), { status: 404 });
  return NextResponse.json(apiSuccess(listing));
}

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
    const { listing } = await getOwnedListing(guard.userId, id);
    if (!listing)
      return NextResponse.json(apiError("Listing not found."), { status: 404 });

    if (listing.status === "SUBMITTED") {
      return NextResponse.json(
        apiError(
          "This listing is under review and cannot be edited right now.",
        ),
        { status: 400 },
      );
    }

    const body = await req.json();

    const wasPublished = listing.status === "PUBLISHED";

    await db.jobListing.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.responsibilities !== undefined && {
          responsibilities: body.responsibilities,
        }),
        ...(body.requirements !== undefined && {
          requirements: body.requirements,
        }),
        ...(body.skills !== undefined && { skills: body.skills }),
        ...(body.workMode !== undefined && { workMode: body.workMode }),
        ...(body.location !== undefined && { location: body.location || null }),
        ...(body.compensationType !== undefined && {
          compensationType: body.compensationType,
        }),
        ...(body.salaryMin !== undefined && { salaryMin: body.salaryMin }),
        ...(body.salaryMax !== undefined && { salaryMax: body.salaryMax }),
        ...(body.stipendMin !== undefined && { stipendMin: body.stipendMin }),
        ...(body.stipendMax !== undefined && { stipendMax: body.stipendMax }),
        ...(body.openings !== undefined && { openings: body.openings }),
        ...(body.applicationDeadline !== undefined && {
          applicationDeadline: body.applicationDeadline
            ? new Date(body.applicationDeadline)
            : null,
        }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(wasPublished && {
          status: "DRAFT",
          approvalStatus: "PENDING_REVIEW",
        }),
      },
    });

    return NextResponse.json(apiSuccess({ requiresResubmit: wasPublished }));
  } catch (error) {
    console.error("[PROVIDER_LISTING_PATCH]", error);
    return NextResponse.json(apiError("Failed to update listing."), {
      status: 500,
    });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "JOB_PROVIDER")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const { id } = await params;
  const { listing } = await getOwnedListing(guard.userId, id);
  if (!listing)
    return NextResponse.json(apiError("Listing not found."), { status: 404 });

  if (listing.status !== "DRAFT") {
    return NextResponse.json(
      apiError(
        "Only draft listings can be deleted. Close published listings instead.",
      ),
      { status: 400 },
    );
  }

  await db.jobListing.delete({ where: { id } });
  return NextResponse.json(apiSuccess(null));
}
