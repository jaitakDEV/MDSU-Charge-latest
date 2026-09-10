import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { slugify } from "@/lib/utils";
import { validateListingFields } from "@/lib/job-utils";
import { z } from "zod";

const createSchema = z.object({
  title: z.string(),
  opportunityType: z.enum([
    "FULL_TIME_JOB",
    "INTERNSHIP",
    "APPRENTICESHIP",
    "FREELANCE",
    "WALK_IN_DRIVE",
    "CAMPUS_HIRING",
    "PART_TIME",
  ]),
  description: z.string(),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  workMode: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
  location: z.string().optional(),
  state: z.string().optional(),
  compensationType: z.enum(["PAID", "UNPAID", "NEGOTIABLE"]),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  stipendMin: z.number().optional(),
  stipendMax: z.number().optional(),
  projectBudget: z.number().optional(),
  isSalaryDisclosed: z.boolean().default(true),
  durationType: z.enum(["PERMANENT", "FIXED", "PROJECT_BASED", "EVENT"]),
  durationValue: z.number().optional(),
  durationUnit: z.enum(["WEEKS", "MONTHS", "YEARS"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  walkInDate: z.string().datetime().optional(),
  walkInTime: z.string().optional(),
  walkInVenue: z.string().optional(),
  targetColleges: z.array(z.string()).default([]),
  targetBatchYears: z.array(z.number()).default([]),
  certificateOffered: z.boolean().default(false),
  ppoOffered: z.boolean().default(false),
  minCgpa: z.number().optional(),
  educationLevel: z
    .enum(["ANY", "DIPLOMA", "GRADUATE", "POSTGRADUATE"])
    .optional(),
  educationStream: z.string().optional(),
  minExperienceYears: z.number().default(0),
  maxExperienceYears: z.number().optional(),
  genderPreference: z.string().default("Any"),
  openings: z.number().default(1),
  applicationDeadline: z.string().datetime().optional(),
  venue: z.string().optional(),
  joinLink: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export async function GET(req: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "JOB_PROVIDER")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";

  const company = await db.companyProfile.findUnique({
    where: { userId: guard.userId },
    select: { id: true },
  });
  if (!company)
    return NextResponse.json(apiError("Company profile not found."), {
      status: 404,
    });

  const listings = await db.jobListing.findMany({
    where: {
      companyId: company.id,
      ...(status ? { status: status as any } : {}),
    },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      opportunityType: true,
      workMode: true,
      status: true,
      approvalStatus: true,
      applicationDeadline: true,
      applicationCount: true,
      openings: true,
      isFeatured: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(apiSuccess(listings));
}

export async function POST(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "JOB_PROVIDER")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const company = await db.companyProfile.findUnique({
      where: { userId: guard.userId },
      select: { id: true, approvalStatus: true },
    });
    if (!company)
      return NextResponse.json(apiError("Company profile not found."), {
        status: 404,
      });

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const d = parsed.data;

    // Slug — unique
    const baseSlug = slugify(d.title);
    let slug = baseSlug;
    let suffix = 1;
    while (await db.jobListing.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const listing = await db.jobListing.create({
      data: {
        companyId: company.id,
        slug,
        title: d.title,
        opportunityType: d.opportunityType,
        description: d.description,
        responsibilities: d.responsibilities,
        requirements: d.requirements,
        skills: d.skills,
        workMode: d.workMode,
        location: d.location || null,
        state: d.state || null,
        compensationType: d.compensationType,
        salaryMin: d.salaryMin ?? null,
        salaryMax: d.salaryMax ?? null,
        stipendMin: d.stipendMin ?? null,
        stipendMax: d.stipendMax ?? null,
        projectBudget: d.projectBudget ?? null,
        isSalaryDisclosed: d.isSalaryDisclosed,
        durationType: d.durationType,
        durationValue: d.durationValue ?? null,
        durationUnit: d.durationUnit ?? null,
        startDate: d.startDate ? new Date(d.startDate) : null,
        endDate: d.endDate ? new Date(d.endDate) : null,
        walkInDate: d.walkInDate ? new Date(d.walkInDate) : null,
        walkInTime: d.walkInTime || null,
        walkInVenue: d.walkInVenue || null,
        targetColleges: d.targetColleges,
        targetBatchYears: d.targetBatchYears,
        certificateOffered: d.certificateOffered,
        ppoOffered: d.ppoOffered,
        minCgpa: d.minCgpa ?? null,
        educationLevel: d.educationLevel ?? null,
        educationStream: d.educationStream || null,
        minExperienceYears: d.minExperienceYears,
        maxExperienceYears: d.maxExperienceYears ?? null,
        genderPreference: d.genderPreference,
        openings: d.openings,
        applicationDeadline: d.applicationDeadline
          ? new Date(d.applicationDeadline)
          : null,
        tags: d.tags,
        metaTitle: d.metaTitle || null,
        metaDescription: d.metaDescription || null,
        status: "DRAFT",
        approvalStatus: "PENDING_REVIEW",
      },
    });

    return NextResponse.json(
      apiSuccess({ id: listing.id, slug: listing.slug }),
      { status: 201 },
    );
  } catch (error) {
    console.error("[PROVIDER_LISTING_CREATE]", error);
    return NextResponse.json(apiError("Failed to create listing."), {
      status: 500,
    });
  }
}
