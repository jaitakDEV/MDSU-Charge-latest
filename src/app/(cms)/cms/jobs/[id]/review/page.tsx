import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { ListingReviewPanel } from "@/features/cms/components/jobs/ListingReviewPanel";

export default async function JobReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const { id } = await params;

  const listing = await db.jobListing.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      opportunityType: true,
      description: true,
      responsibilities: true,
      requirements: true,
      skills: true,
      workMode: true,
      location: true,
      state: true,
      compensationType: true,
      salaryMin: true,
      salaryMax: true,
      stipendMin: true,
      stipendMax: true,
      projectBudget: true,
      durationType: true,
      durationValue: true,
      durationUnit: true,
      walkInDate: true,
      walkInTime: true,
      walkInVenue: true,
      targetColleges: true,
      targetBatchYears: true,
      certificateOffered: true,
      ppoOffered: true,
      minCgpa: true,
      educationLevel: true,
      educationStream: true,
      minExperienceYears: true,
      maxExperienceYears: true,
      openings: true,
      applicationDeadline: true,
      status: true,
      approvalStatus: true,
      rejectedReason: true,
      company: {
        select: {
          companyName: true,
          logoUrl: true,
          contactPerson: true,
          contactEmail: true,
        },
      },
    },
  });

  if (!listing) notFound();

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "780px",
      }}
    >
      <Link
        href={ROUTES.cmsJobs}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "12.5px",
          color: "#64748b",
          textDecoration: "none",
          marginBottom: "1rem",
        }}
      >
        ← All Jobs
      </Link>
      <ListingReviewPanel listing={listing} />
    </div>
  );
}
