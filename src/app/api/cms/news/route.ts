import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";
import type { NewsStatus } from "@prisma/client";

const createNewsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const status = searchParams.get("status") ?? "";

    const where = {
      ...(guard.role === "CMS_EDITOR" ? { authorId: guard.userId } : {}),
      ...(status ? { status: status as NewsStatus } : {}),
      ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
    };

    const articles = await db.newsArticle.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        isFeatured: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        publishedAt: true,
        updatedAt: true,
        author: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(apiSuccess(articles));
  } catch (error) {
    console.error("[CMS_NEWS_GET]", error);
    return NextResponse.json(apiError("Failed to fetch news."), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const body = await req.json();
    const parsed = createNewsSchema.safeParse(body);

    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const d = parsed.data;

    const existing = await db.newsArticle.findUnique({
      where: { slug: d.slug },
    });
    if (existing)
      return NextResponse.json(
        apiError("A news article with this slug already exists."),
        { status: 409 },
      );

    const isFeatured = guard.role === "ADMIN" ? d.isFeatured : false;

    const article = await db.newsArticle.create({
      data: {
        title: d.title,
        slug: d.slug,
        excerpt: d.excerpt ?? null,
        content: d.content,
        coverImage: d.coverImage ?? null,
        status: d.status as NewsStatus,
        isFeatured,
        tags: d.tags,
        metaTitle: d.metaTitle ?? null,
        metaDescription: d.metaDescription ?? null,
        publishedAt: d.status === "PUBLISHED" ? new Date() : null,
        authorId: guard.userId,
      },
    });

    return NextResponse.json(
      apiSuccess({ id: article.id, slug: article.slug }),
      { status: 201 },
    );
  } catch (error) {
    console.error("[CMS_NEWS_POST]", error);
    return NextResponse.json(apiError("Failed to create article."), {
      status: 500,
    });
  }
}
