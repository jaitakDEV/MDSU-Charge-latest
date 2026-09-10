import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const registration = await db.eventRegistration.findUnique({
    where: { id },
    select: { status: true, checkedIn: true },
  });

  if (!registration)
    return NextResponse.json(apiError("Registration not found."), {
      status: 404,
    });
  if (registration.status !== "CONFIRMED")
    return NextResponse.json(
      apiError("Only confirmed registrations can be checked in."),
      { status: 400 },
    );

  await db.eventRegistration.update({
    where: { id },
    data: { checkedIn: true, checkedInAt: new Date() },
  });

  return NextResponse.json(apiSuccess(null));
}
