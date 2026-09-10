import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { ProviderListingsList } from "@/features/provider/components/ProviderListingsList";

export const metadata = { title: "My Listings — Provider" };

export default async function ProviderListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "JOB_PROVIDER")
    redirect(ROUTES.login);

  const { status } = await searchParams;
  const filter = status ?? "ALL";

  const company = await db.companyProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!company) redirect(ROUTES.providerCompany);

  const listings = await db.jobListing.findMany({
    where: {
      companyId: company.id,
      ...(filter !== "ALL" ? { status: filter as any } : {}),
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

  const counts = await db.jobListing.groupBy({
    by: ["status"],
    where: { companyId: company.id },
    _count: { _all: true },
  });
  const countMap = counts.reduce(
    (acc, c) => ({ ...acc, [c.status]: c._count._all }),
    {} as Record<string, number>,
  );

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1000px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
            }}
          >
            My Listings
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            Manage your job postings and view applicants
          </p>
        </div>
        <Link
          href={ROUTES.providerListingsNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "38px",
            padding: "0 18px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          + New Listing
        </Link>
      </div>

      <ProviderListingsList
        listings={listings}
        currentFilter={filter}
        countMap={countMap}
      />
    </div>
  );
}
