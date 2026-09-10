import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  sectionId: z.string(),
  courseId: z.string(),
  title: z.string().min(1),
  type: z.enum(["VIDEO", "DOCUMENT", "TEXT"]),
  duration: z.number().default(0),
  displayOrder: z.number(),
});

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json(apiError(parsed.error.issues[0].message), {
      status: 400,
    });

  const { courseId, ...data } = parsed.data;
  const lecture = await db.lecture.create({ data });
  return NextResponse.json(apiSuccess({ id: lecture.id }), { status: 201 });
}
