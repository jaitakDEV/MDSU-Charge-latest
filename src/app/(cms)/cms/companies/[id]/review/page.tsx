import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { CompanyReviewPanel } from "@/features/cms/components/jobs/CompanyReviewPanel";

export default async function CompanyReviewPage({
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

  const company = await db.companyProfile.findUnique({
    where: { id },
    select: {
      id: true,
      companyName: true,
      slug: true,
      companyType: true,
      industry: true,
      website: true,
      logoUrl: true,
      description: true,
      companySize: true,
      headquarters: true,
      city: true,
      state: true,
      country: true,
      contactPerson: true,
      contactEmail: true,
      contactPhone: true,
      designation: true,
      approvalStatus: true,
      rejectedReason: true,
      approvedAt: true,
      linkedinUrl: true,
      glassdoorUrl: true,
      createdAt: true,
      panNumber: true,
      udyamCertificateUrl: true,
      _count: { select: { jobListings: true } },
    },
  });

  if (!company) notFound();

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "760px",
      }}
    >
      <Link
        href={ROUTES.cmsCompanies}
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
        ← All Companies
      </Link>

      <CompanyReviewPanel company={company} />
    </div>
  );
}
