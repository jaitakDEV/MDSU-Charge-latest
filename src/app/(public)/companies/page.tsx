import { db } from "@/server/db";
import { CompanyCard } from "@/features/jobs/components/CompanyCard";

export const metadata = {
  title: "Companies — MDSSC",
  description: "Explore companies hiring MDSU students",
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string; q?: string }>;
}) {
  const { industry, q } = await searchParams;
  const query = q?.trim() ?? "";

  const companies = await db.companyProfile.findMany({
    where: {
      approvalStatus: "APPROVED",
      ...(industry
        ? { industry: { equals: industry, mode: "insensitive" } }
        : {}),
      ...(query
        ? { companyName: { contains: query, mode: "insensitive" } }
        : {}),
    },
    orderBy: { companyName: "asc" },
    select: {
      id: true,
      companyName: true,
      slug: true,
      companyType: true,
      industry: true,
      logoUrl: true,
      city: true,
      state: true,
      _count: { select: { jobListings: { where: { status: "PUBLISHED" } } } },
    },
  });

  const allIndustries = await db.companyProfile.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { industry: true },
    distinct: ["industry"],
  });

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#1d4ed8",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 8px",
            }}
          >
            Companies
          </p>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 34px)",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 10px",
              letterSpacing: "-0.6px",
            }}
          >
            Explore Companies
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {companies.length} companies hiring MDSU students
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <form method="GET" style={{ position: "relative" }}>
            {industry && (
              <input type="hidden" name="industry" value={industry} />
            )}
            <input
              name="q"
              defaultValue={query}
              placeholder="Search companies…"
              style={{
                height: "42px",
                padding: "0 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                fontSize: "13.5px",
                width: "260px",
                background: "#fff",
              }}
            />
          </form>
          {allIndustries.map((i) => (
            <a
              key={i.industry}
              href={`?industry=${i.industry}`}
              style={{
                height: "38px",
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                borderRadius: "20px",
                fontSize: "12.5px",
                fontWeight: 600,
                background: industry === i.industry ? "#1d4ed8" : "#fff",
                color: industry === i.industry ? "#fff" : "#475569",
                border: "1px solid #e2e8f0",
                textDecoration: "none",
              }}
            >
              {i.industry}
            </a>
          ))}
        </div>

        {companies.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e8edf2",
            }}
          >
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>
              No companies found
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {companies.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
