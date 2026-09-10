import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  accessExpiresAt: z.string().datetime().nullable(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAdminApi();
    if (!guard.ok) return guard.response;

    const { id } = await params;

    const enrolment = await db.enrolment.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!enrolment) {
      return NextResponse.json(apiError("Enrolment not found."), {
        status: 404,
      });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const newExpiry = parsed.data.accessExpiresAt
      ? new Date(parsed.data.accessExpiresAt)
      : null;

    // Agar date past mein hai — warn karo
    if (newExpiry && newExpiry <= new Date()) {
      return NextResponse.json(
        apiError("New expiry date must be in the future."),
        { status: 400 },
      );
    }

    await db.enrolment.update({
      where: { id },
      data: {
        accessExpiresAt: newExpiry,
        renewedAt: new Date(), // audit trail
      },
    });

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[EXTEND_ACCESS]", error);
    return NextResponse.json(apiError("Failed to update access."), {
      status: 500,
    });
  }
}
