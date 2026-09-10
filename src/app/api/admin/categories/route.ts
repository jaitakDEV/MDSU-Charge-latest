import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiSuccess, apiError } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  displayOrder: z.number(),
});

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json(apiError(parsed.error.issues[0].message), {
      status: 400,
    });
  const existing = await db.category.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing)
    return NextResponse.json(
      apiError("Category with this name already exists."),
      { status: 409 },
    );
  const cat = await db.category.create({ data: parsed.data });
  return NextResponse.json(apiSuccess(cat), { status: 201 });
}
