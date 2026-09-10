import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { getOrCreateCareerProfile } from "@/lib/career-utils";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  issuingOrg: z.string().min(2),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional(),
});

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "STUDENT")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json(apiError(parsed.error.issues[0].message), {
      status: 400,
    });

  const profile = await getOrCreateCareerProfile(guard.userId);
  const count = await db.studentCertification.count({
    where: { profileId: profile.id },
  });
  const d = parsed.data;

  const entry = await db.studentCertification.create({
    data: {
      profileId: profile.id,
      displayOrder: count,
      name: d.name,
      issuingOrg: d.issuingOrg,
      issueDate: new Date(d.issueDate),
      expiryDate: d.expiryDate ? new Date(d.expiryDate) : null,
      credentialId: d.credentialId || null,
      credentialUrl: d.credentialUrl || null,
    },
  });

  return NextResponse.json(apiSuccess(entry), { status: 201 });
}
