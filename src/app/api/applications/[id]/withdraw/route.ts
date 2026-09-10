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
  if (guard.role !== "STUDENT")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const { id } = await params;

  const application = await db.jobApplication.findUnique({
    where: { id },
    select: { id: true, status: true, profile: { select: { userId: true } } },
  });

  if (!application)
    return NextResponse.json(apiError("Application not found."), {
      status: 404,
    });
  if (application.profile.userId !== guard.userId)
    return NextResponse.json(apiError("Forbidden."), { status: 403 });

  if (
    ["REJECTED", "WITHDRAWN", "OFFER_ACCEPTED", "OFFER_REJECTED"].includes(
      application.status,
    )
  ) {
    return NextResponse.json(
      apiError("This application cannot be withdrawn."),
      { status: 400 },
    );
  }

  await db.jobApplication.update({
    where: { id },
    data: { status: "WITHDRAWN", statusUpdatedAt: new Date() },
  });

  return NextResponse.json(apiSuccess(null));
}
