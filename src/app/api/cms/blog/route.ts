import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
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

  const d = parsed.data;

  const existing = await db.blogPost.findUnique({ where: { slug: d.slug } });
  if (existing)
    return NextResponse.json(
      apiError("A post with this slug already exists."),
      { status: 409 },
    );

  const post = await db.blogPost.create({
    data: {
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt ?? null,
      content: d.content,
      coverImage: d.coverImage ?? null,
      tags: d.tags ?? [],
      metaTitle: d.metaTitle ?? null,
      metaDescription: d.metaDescription ?? null,
      status: d.status,
      authorId: guard.userId,
      publishedAt: d.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json(apiSuccess({ id: post.id, slug: post.slug }), {
    status: 201,
  });
}
