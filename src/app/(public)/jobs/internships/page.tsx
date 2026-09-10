import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { JobCard } from "@/features/jobs/components/JobCard";
import { JobFilters } from "@/features/jobs/components/JobFilters";

export const metadata = {
  title: "Internships — MDSSC",
  description: "Browse internship opportunities for MDSU students",
};

const PAGE_SIZE = 15;

export default async function InternshipsPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string;
    location?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const { mode, location, q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, Number(pageParam ?? 1));

  const where: any = {
    status: "PUBLISHED",
    opportunityType: "INTERNSHIP",
    ...(mode ? { workMode: mode as any } : {}),
    ...(location
      ? { location: { contains: location, mode: "insensitive" } }
      : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { skills: { has: query } },
            {
              company: {
                companyName: { contains: query, mode: "insensitive" },
              },
            },
          ],
        }
      : {}),
  };

  const [jobs, total] = await Promise.all([
    db.jobListing.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        slug: true,
        opportunityType: true,
        workMode: true,
        location: true,
        compensationType: true,
        salaryMin: true,
        salaryMax: true,
        stipendMin: true,
        stipendMax: true,
        isSalaryDisclosed: true,
        applicationDeadline: true,
        createdAt: true,
        isFeatured: true,
        skills: true,
        company: { select: { companyName: true, logoUrl: true } },
      },
    }),
    db.jobListing.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

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
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#166534",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 8px",
              }}
            >
              Careers
            </p>
            <h1
              style={{
                fontSize: "clamp(24px, 4vw, 34px)",
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.6px",
              }}
            >
              Internships
            </h1>
            <p
              style={{ fontSize: "14px", color: "#64748b", margin: "8px 0 0" }}
            >
              {total} internships available
            </p>
          </div>
          <Link
            href={ROUTES.jobs}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "38px",
              padding: "0 18px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              background: "#fff",
              color: "#475569",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ← All Opportunities
          </Link>
        </div>

        <form method="GET" style={{ marginBottom: "1.5rem" }}>
          <input
            name="q"
            defaultValue={query}
            placeholder="Search internships…"
            style={{
              height: "44px",
              padding: "0 16px",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "14px",
              width: "100%",
              maxWidth: "500px",
              background: "#fff",
            }}
          />
        </form>

        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
          <div style={{ width: "240px", flexShrink: 0 }}>
            <JobFilters
              currentType=""
              currentMode={mode ?? ""}
              currentLocation={location ?? ""}
              currentExp=""
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {jobs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem",
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #e8edf2",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  No internships found
                </p>
                <p style={{ fontSize: "13px", color: "#64748b" }}>
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  justifyContent: "center",
                  marginTop: "1.5rem",
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <a
                      key={p}
                      href={`?page=${p}`}
                      style={{
                        fontSize: "12.5px",
                        padding: "6px 14px",
                        borderRadius: "9px",
                        border: "1px solid #e2e8f0",
                        textDecoration: "none",
                        background: p === page ? "#eff6ff" : "#fff",
                        color: p === page ? "#1d4ed8" : "#475569",
                      }}
                    >
                      {p}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
