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
  await db.lecture.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      ...(data.isPreview !== undefined && { isPreview: data.isPreview }),
      ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
      ...(data.documentUrl !== undefined && { documentUrl: data.documentUrl }),
      ...(data.duration !== undefined && { duration: data.duration }),
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
  const lecture = await db.lecture.findUnique({
    where: { id },
    select: { videoUrl: true },
  });

  // UploadThing cleanup agar video hai
  if (lecture?.videoUrl) {
    await fetch("/api/uploadthing/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileKey: lecture.videoUrl }),
    }).catch(console.error);
  }

  await db.lecture.delete({ where: { id } });
  return NextResponse.json(apiSuccess(null));
}
