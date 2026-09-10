import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { JobCard } from "@/features/jobs/components/JobCard";

export const metadata = {
  title: "Walk-in Drives — MDSSC",
  description: "Browse walk-in interview drives for MDSU students",
};

export default async function WalkInDrivesPage() {
  const jobs = await db.jobListing.findMany({
    where: {
      status: "PUBLISHED",
      opportunityType: "WALK_IN_DRIVE",
      OR: [{ walkInDate: { gte: new Date() } }, { walkInDate: null }],
    },
    orderBy: [{ isFeatured: "desc" }, { walkInDate: "asc" }],
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
      walkInDate: true,
      walkInTime: true,
      walkInVenue: true,
      company: { select: { companyName: true, logoUrl: true } },
    },
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
          maxWidth: "900px",
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
                color: "#991b1b",
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
              Walk-in Drives
            </h1>
            <p
              style={{ fontSize: "14px", color: "#64748b", margin: "8px 0 0" }}
            >
              {jobs.length} upcoming drives
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
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>
              No walk-in drives scheduled
            </p>
            <p style={{ fontSize: "13px", color: "#64748b" }}>
              Check back soon for new drives
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={ROUTES.jobDetail(job.slug)}
                style={{
                  display: "flex",
                  gap: "16px",
                  background: "#fff",
                  border: "1px solid #e8edf2",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "#f1f5f9",
                    flexShrink: 0,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {job.company.logoUrl ? (
                    <img
                      src={job.company.logoUrl}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#94a3b8",
                      }}
                    >
                      {job.company.companyName[0]}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 4px",
                    }}
                  >
                    {job.title}
                  </p>
                  <p
                    style={{
                      fontSize: "12.5px",
                      color: "#64748b",
                      margin: "0 0 10px",
                    }}
                  >
                    {job.company.companyName}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      flexWrap: "wrap",
                      fontSize: "12.5px",
                      color: "#dc2626",
                      fontWeight: 600,
                    }}
                  >
                    {job.walkInDate && (
                      <span>
                        📅{" "}
                        {new Date(job.walkInDate).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {job.walkInTime && <span>⏰ {job.walkInTime}</span>}
                    {job.walkInVenue && <span>📍 {job.walkInVenue}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
