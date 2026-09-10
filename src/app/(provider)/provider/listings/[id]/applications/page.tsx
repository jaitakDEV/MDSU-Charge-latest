import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { getApplicationStatusLabel } from "@/lib/job-utils";
import { ApplicantTable } from "@/features/provider/components/ApplicantTable";

export const metadata = { title: "Applicants — Provider" };

export default async function ListingApplicationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "JOB_PROVIDER")
    redirect(ROUTES.login);

  const { id } = await params;
  const { status, q } = await searchParams;
  const filter = status ?? "ALL";
  const query = q?.trim() ?? "";

  const company = await db.companyProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!company) redirect(ROUTES.providerCompany);

  const listing = await db.jobListing.findFirst({
    where: { id, companyId: company.id },
    select: { id: true, title: true, applicationCount: true },
  });
  if (!listing) notFound();

  const applications = await db.jobApplication.findMany({
    where: {
      listingId: id,
      ...(filter !== "ALL" ? { status: filter as any } : {}),
      ...(query
        ? {
            profile: {
              user: { name: { contains: query, mode: "insensitive" as const } },
            },
          }
        : {}),
    },
    orderBy: [{ isStarred: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      status: true,
      createdAt: true,
      isShortlisted: true,
      isStarred: true,
      expectedSalary: true,
      noticePeriod: true,
      profile: {
        select: {
          headline: true,
          skills: true,
          completionPercent: true,
          user: { select: { name: true, email: true, image: true } },
        },
      },
    },
  });

  const counts = await db.jobApplication.groupBy({
    by: ["status"],
    where: { listingId: id },
    _count: { _all: true },
  });
  const countMap = counts.reduce(
    (acc, c) => ({ ...acc, [c.status]: c._count._all }),
    {} as Record<string, number>,
  );
  const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1000px",
      }}
    >
      <Link
        href={ROUTES.providerListings}
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
        ← My Listings
      </Link>

      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          Applicants
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          {listing.title} · {totalCount} applications
        </p>
      </div>

      <ApplicantTable
        listingId={id}
        applications={applications}
        countMap={{ ...countMap, ALL: totalCount }}
        currentFilter={filter}
        currentQuery={query}
      />
    </div>
  );
}
