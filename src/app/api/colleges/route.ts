import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const colleges = await db.college.findMany({
      where: { isActive: true },
      select: { id: true, name: true, city: true, state: true, isOther: true },
      orderBy: [{ isOther: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(apiSuccess(colleges));
  } catch (error) {
    console.error("[COLLEGES_GET]", error);
    return NextResponse.json(apiError("Failed to fetch colleges"), {
      status: 500,
    });
  }
}
