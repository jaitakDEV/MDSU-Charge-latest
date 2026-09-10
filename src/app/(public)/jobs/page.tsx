import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { JobCard } from "@/features/jobs/components/JobCard";
import { JobFilters } from "@/features/jobs/components/JobFilters";
import Link from "next/link";
import { JobsHeroSection } from "@/features/jobs/components/JobsHeroSection";
export const metadata = {
  title: "Jobs & Internships — MDSSC",
  description:
    "Browse job opportunities, internships and career openings for MDSU students",
};

const PAGE_SIZE = 15;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    mode?: string;
    location?: string;
    exp?: string;
    q?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const {
    type,
    mode,
    location,
    exp,
    q,
    sort,
    page: pageParam,
  } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, Number(pageParam ?? 1));

  const where: any = {
    status: "PUBLISHED",
    ...(type ? { opportunityType: type as any } : {}),
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
    ...(exp
      ? (() => {
          const [min, max] = exp.split("-").map(Number);
          return {
            minExperienceYears: { gte: min },
            ...(max < 99 ? { maxExperienceYears: { lte: max } } : {}),
          };
        })()
      : {}),
  };

  const orderBy =
    sort === "salary-desc"
      ? { salaryMax: "desc" as const }
      : sort === "deadline"
        ? { applicationDeadline: "asc" as const }
        : sort === "popular"
          ? { applicationCount: "desc" as const }
          : { createdAt: "desc" as const };

  const [jobs, total] = await Promise.all([
    db.jobListing.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, orderBy],
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
      <JobsHeroSection />
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* <div style={{ marginBottom: "2rem" }}>
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
            Jobs & Internships
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "8px 0 0" }}>
            {total} opportunities available
          </p>
        </div> */}

        {/* <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
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
              Jobs & Internships
            </h1>
            <p
              style={{ fontSize: "14px", color: "#64748b", margin: "8px 0 0" }}
            >
              {total} opportunities available
            </p>
          </div>

          <Link
            href="/jobs/employer/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "40px",
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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Register as Employer
          </Link>
        </div> */}

        <form method="GET" style={{ marginBottom: "1.5rem" }}>
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by title, skill, or company…"
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
              currentType={type ?? ""}
              currentMode={mode ?? ""}
              currentLocation={location ?? ""}
              currentExp={exp ?? ""}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
              }}
            >
              {/* <select
                defaultValue={sort ?? "relevant"}
                onChange={(e) => {
                  window.location.search = `?sort=${e.target.value}`;
                }}
                style={{
                  height: "36px",
                  padding: "0 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "9px",
                  fontSize: "12.5px",
                  background: "#fff",
                }}
              >
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="salary-desc">Salary: High to Low</option>
                <option value="deadline">Deadline: Soonest</option>
                <option value="popular">Most Applied</option>
              </select> */}
            </div>

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
                  No opportunities found
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
