import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";
import type { AccessDuration, CourseLevel } from "@prisma/client";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3),
  description: z.string().optional(),
  about: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  language: z.string().default("Hindi"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().min(0).default(0),
  mrp: z.number().min(0).default(0),
  accessDuration: z.enum([
    "FIFTEEN_DAYS",
    "ONE_MONTH",
    "THREE_MONTHS",
    "SIX_MONTHS",
    "ONE_YEAR",
    "LIFETIME",
  ]),
  thumbnail: z.string().optional(),
  previewVideoUrl: z.string().optional(),
  learningOutcomes: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "REVIEW"]).default("DRAFT"),
});

export async function POST(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN") {
      return NextResponse.json(apiError("Forbidden"), { status: 403 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const d = parsed.data;

    // Slug unique check
    const existing = await db.course.findUnique({ where: { slug: d.slug } });
    if (existing) {
      return NextResponse.json(
        apiError(
          "A course with this slug already exists. Please edit the URL slug.",
        ),
        { status: 409 },
      );
    }

    // accessDuration required for REVIEW
    if (d.status === "REVIEW" && !d.accessDuration) {
      return NextResponse.json(
        apiError("Access duration is required before submitting for review."),
        { status: 400 },
      );
    }

    const course = await db.course.create({
      data: {
        title: d.title,
        slug: d.slug,
        description: d.description ?? "",
        about: d.about ?? "",
        level: d.level as CourseLevel,
        language: d.language,
        categoryId: d.categoryId,
        price: d.price,
        mrp: d.mrp,
        accessDuration: d.accessDuration as AccessDuration,
        thumbnail: d.thumbnail ?? null,
        previewVideoUrl: d.previewVideoUrl ?? null,
        status: d.status,
        authorId: guard.userId,
      },
    });

    return NextResponse.json(apiSuccess({ id: course.id, slug: course.slug }), {
      status: 201,
    });
  } catch (error) {
    console.error("[CMS_COURSES_POST]", error);
    return NextResponse.json(apiError("Failed to create course."), {
      status: 500,
    });
  }
}
