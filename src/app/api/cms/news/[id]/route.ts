import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";
import type { NewsStatus } from "@prisma/client";

const updateNewsSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const article = await db.newsArticle.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        authorId: true,
        excerpt: true,
        content: true,
        coverImage: true,
        status: true,
        isFeatured: true,
        tags: true,
        publishedAt: true,
        metaTitle: true,
        metaDescription: true,
        author: { select: { name: true, email: true } },
      },
    });

    if (!article)
      return NextResponse.json(apiError("Article not found."), { status: 404 });

    if (guard.role === "CMS_EDITOR" && article.authorId !== guard.userId)
      return NextResponse.json(apiError("Forbidden."), { status: 403 });

    return NextResponse.json(apiSuccess(article));
  } catch (error) {
    console.error("[CMS_NEWS_GET_ONE]", error);
    return NextResponse.json(apiError("Failed to fetch article."), {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const existing = await db.newsArticle.findUnique({
      where: { id },
      select: { authorId: true, status: true, publishedAt: true },
    });

    if (!existing)
      return NextResponse.json(apiError("Article not found."), { status: 404 });

    if (guard.role === "CMS_EDITOR" && existing.authorId !== guard.userId)
      return NextResponse.json(apiError("Forbidden."), { status: 403 });

    const body = await req.json();
    const parsed = updateNewsSchema.safeParse(body);

    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const d = parsed.data;

    if (d.isFeatured !== undefined && guard.role !== "ADMIN")
      delete d.isFeatured;

    if (d.slug) {
      const slugExists = await db.newsArticle.findFirst({
        where: { slug: d.slug, id: { not: id } },
      });
      if (slugExists)
        return NextResponse.json(
          apiError("A different article already uses this slug."),
          { status: 409 },
        );
    }

    const isPublishingNow =
      d.status === "PUBLISHED" && existing.status !== "PUBLISHED";
    const publishedAt = isPublishingNow ? new Date() : existing.publishedAt;

    await db.newsArticle.update({
      where: { id },
      data: {
        ...(d.title !== undefined && { title: d.title }),
        ...(d.slug !== undefined && { slug: d.slug }),
        ...(d.excerpt !== undefined && { excerpt: d.excerpt || null }),
        ...(d.content !== undefined && { content: d.content }),
        ...(d.coverImage !== undefined && { coverImage: d.coverImage || null }),
        ...(d.status !== undefined && { status: d.status as NewsStatus }),
        ...(d.isFeatured !== undefined && { isFeatured: d.isFeatured }),
        ...(d.tags !== undefined && { tags: d.tags }),
        ...(d.metaTitle !== undefined && { metaTitle: d.metaTitle || null }),
        ...(d.metaDescription !== undefined && {
          metaDescription: d.metaDescription || null,
        }),
        publishedAt,
      },
    });

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[CMS_NEWS_PATCH]", error);
    return NextResponse.json(apiError("Failed to update article."), {
      status: 500,
    });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const article = await db.newsArticle.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!article)
      return NextResponse.json(apiError("Article not found."), { status: 404 });

    if (guard.role === "CMS_EDITOR" && article.authorId !== guard.userId)
      return NextResponse.json(apiError("Forbidden."), { status: 403 });

    await db.newsArticle.delete({ where: { id } });

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[CMS_NEWS_DELETE]", error);
    return NextResponse.json(apiError("Failed to delete article."), {
      status: 500,
    });
  }
}
