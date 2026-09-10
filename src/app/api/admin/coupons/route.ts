import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiSuccess, apiError } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(3).max(20),
  discountType: z.enum(["PERCENT", "FLAT"]),
  discountValue: z.number().positive(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime().nullable(),
  maxUses: z.number().positive().nullable(),
  minOrderValue: z.number().min(0).default(0),
});

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json(apiError(parsed.error.issues[0].message), {
      status: 400,
    });
  const existing = await db.coupon.findUnique({
    where: { code: parsed.data.code },
  });
  if (existing)
    return NextResponse.json(apiError("Coupon code already exists."), {
      status: 409,
    });
  const coupon = await db.coupon.create({
    data: {
      ...parsed.data,
      validFrom: new Date(parsed.data.validFrom),
      validUntil: parsed.data.validUntil
        ? new Date(parsed.data.validUntil)
        : null,
    },
  });
  return NextResponse.json(apiSuccess(coupon), { status: 201 });
}
