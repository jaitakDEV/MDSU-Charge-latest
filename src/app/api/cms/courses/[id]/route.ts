// src/app/api/cms/courses/[id]/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";
import type { AccessDuration, CourseLevel } from "@prisma/client";

const schema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().optional(),
  about: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  language: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.number().min(0).optional(),
  mrp: z.number().min(0).optional(),
  accessDuration: z
    .enum([
      "FIFTEEN_DAYS",
      "ONE_MONTH",
      "THREE_MONTHS",
      "SIX_MONTHS",
      "ONE_YEAR",
      "LIFETIME",
    ])
    .optional(),
  thumbnail: z.string().optional(),
  previewVideoUrl: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;

    const { id } = await params;

    const course = await db.course.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    });

    if (!course)
      return NextResponse.json(apiError("Course not found."), { status: 404 });

    // Only author or admin can edit
    if (guard.role !== "ADMIN" && course.authorId !== guard.userId) {
      return NextResponse.json(apiError("Forbidden."), { status: 403 });
    }

    // Cannot edit while in REVIEW
    if (course.status === "REVIEW" && guard.role !== "ADMIN") {
      return NextResponse.json(
        apiError("Course is under review — editing is disabled."),
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const d = parsed.data;

    await db.course.update({
      where: { id },
      data: {
        ...(d.title && { title: d.title }),
        ...(d.slug && { slug: d.slug }),
        ...(d.description !== undefined && { description: d.description }),
        ...(d.about !== undefined && { about: d.about }),
        ...(d.level && { level: d.level as CourseLevel }),
        ...(d.language && { language: d.language }),
        ...(d.categoryId && { categoryId: d.categoryId }),
        ...(d.price !== undefined && { price: d.price }),
        ...(d.mrp !== undefined && { mrp: d.mrp }),
        ...(d.accessDuration && {
          accessDuration: d.accessDuration as AccessDuration,
        }),
        ...(d.thumbnail !== undefined && { thumbnail: d.thumbnail || null }),
        ...(d.previewVideoUrl !== undefined && {
          previewVideoUrl: d.previewVideoUrl || null,
        }),
      },
    });

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[CMS_COURSE_PATCH]", error);
    return NextResponse.json(apiError("Failed to update course."), {
      status: 500,
    });
  }
}
