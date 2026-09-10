import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const data = await req.json();

  const post = await db.blogPost.findUnique({
    where: { id },
    select: { authorId: true },
  });
  if (!post) return NextResponse.json(apiError("Not found."), { status: 404 });
  if (guard.role !== "ADMIN" && post.authorId !== guard.userId)
    return NextResponse.json(apiError("Forbidden."), { status: 403 });

  await db.blogPost.update({
    where: { id },
    data: {
      ...data,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json(apiSuccess(null));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  await db.blogPost.deleteMany({ where: { id } });
  return NextResponse.json(apiSuccess(null));
}
