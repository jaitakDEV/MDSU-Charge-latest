import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";

const updateSchema = z.object({
  companyName: z.string().min(2).optional(),
  companyType: z
    .enum(["COMPANY", "STARTUP", "NGO", "INSTITUTE", "FREELANCER", "RECRUITER"])
    .optional(),
  industry: z.string().min(2).optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  companySize: z
    .enum([
      "STARTUP_1_10",
      "SMALL_11_50",
      "MEDIUM_51_200",
      "LARGE_201_500",
      "ENTERPRISE_500_PLUS",
    ])
    .optional(),
  headquarters: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  contactPerson: z.string().min(2).optional(),
  contactPhone: z.string().min(10).optional(),
  designation: z.string().min(2).optional(),
  linkedinUrl: z.string().optional(),
  glassdoorUrl: z.string().optional(),
});

// ── GET — own company profile ────────────────────────────────
export async function GET() {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "JOB_PROVIDER")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const company = await db.companyProfile.findUnique({
    where: { userId: guard.userId },
  });

  if (!company)
    return NextResponse.json(apiError("Company profile not found."), {
      status: 404,
    });

  return NextResponse.json(apiSuccess(company));
}

// ── PATCH — update own company profile ───────────────────────
export async function PATCH(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "JOB_PROVIDER")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const existing = await db.companyProfile.findUnique({
      where: { userId: guard.userId },
      select: {
        id: true,
        approvalStatus: true,
        companyName: true,
        industry: true,
        headquarters: true,
      },
    });

    if (!existing)
      return NextResponse.json(apiError("Company profile not found."), {
        status: 404,
      });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const d = parsed.data;

    // ── Major change detection — Section 18 edge case ────────
    // If company name, industry, or headquarters change on an already-
    // approved company, treat it as a major change requiring re-review.
    const isMajorChange =
      existing.approvalStatus === "APPROVED" &&
      ((d.companyName !== undefined &&
        d.companyName !== existing.companyName) ||
        (d.industry !== undefined && d.industry !== existing.industry) ||
        (d.headquarters !== undefined &&
          d.headquarters !== existing.headquarters));

    await db.companyProfile.update({
      where: { id: existing.id },
      data: {
        ...(d.companyName !== undefined && { companyName: d.companyName }),
        ...(d.companyType !== undefined && { companyType: d.companyType }),
        ...(d.industry !== undefined && { industry: d.industry }),
        ...(d.website !== undefined && { website: d.website || null }),
        ...(d.logoUrl !== undefined && { logoUrl: d.logoUrl || null }),
        ...(d.description !== undefined && {
          description: d.description || null,
        }),
        ...(d.companySize !== undefined && { companySize: d.companySize }),
        ...(d.headquarters !== undefined && { headquarters: d.headquarters }),
        ...(d.city !== undefined && { city: d.city }),
        ...(d.state !== undefined && { state: d.state }),
        ...(d.contactPerson !== undefined && {
          contactPerson: d.contactPerson,
        }),
        ...(d.contactPhone !== undefined && { contactPhone: d.contactPhone }),
        ...(d.designation !== undefined && { designation: d.designation }),
        ...(d.linkedinUrl !== undefined && {
          linkedinUrl: d.linkedinUrl || null,
        }),
        ...(d.glassdoorUrl !== undefined && {
          glassdoorUrl: d.glassdoorUrl || null,
        }),
        ...(isMajorChange && {
          approvalStatus: "PENDING",
          approvedById: null,
          approvedAt: null,
        }),
      },
    });

    return NextResponse.json(apiSuccess({ requiresReapproval: isMajorChange }));
  } catch (error) {
    console.error("[PROVIDER_COMPANY_PATCH]", error);
    return NextResponse.json(apiError("Failed to update company profile."), {
      status: 500,
    });
  }
}
