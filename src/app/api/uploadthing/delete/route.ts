import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { requireAdminApi } from "@/server/api-guard";

const utapi = new UTApi();

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { fileKey } = await req.json();
  if (!fileKey) {
    return NextResponse.json(
      { success: false, error: "fileKey required" },
      { status: 400 },
    );
  }

  await utapi.deleteFiles(fileKey);
  return NextResponse.json({ success: true });
}
