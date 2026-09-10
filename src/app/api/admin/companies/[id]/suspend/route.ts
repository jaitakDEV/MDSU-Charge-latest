import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const company = await db.companyProfile.findUnique({
    where: { id },
    select: { userId: true, approvalStatus: true },
  });

  if (!company)
    return NextResponse.json(apiError("Company not found."), { status: 404 });

  await db.$transaction(async (tx) => {
    await tx.companyProfile.update({
      where: { id },
      data: { approvalStatus: "SUSPENDED" },
    });

    await tx.user.update({
      where: { id: company.userId },
      data: { isActive: false },
    });

    await tx.jobListing.updateMany({
      where: { companyId: id, status: "PUBLISHED" },
      data: { status: "ARCHIVED" },
    });
  });

  return NextResponse.json(apiSuccess(null));
}
