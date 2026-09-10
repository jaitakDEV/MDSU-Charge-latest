import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { JobCard } from "@/features/jobs/components/JobCard";
import Link from "next/link";

export const metadata = { title: "Saved Jobs — MDSSC" };

export default async function SavedJobsPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const profile = await db.studentCareerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const savedJobs = profile
    ? await db.savedJob.findMany({
        where: { profileId: profile.id },
        orderBy: { savedAt: "desc" },
        select: {
          listing: {
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
              status: true,
              company: { select: { companyName: true, logoUrl: true } },
            },
          },
        },
      })
    : [];

  const activeSaved = savedJobs.filter((s) => s.listing.status === "PUBLISHED");

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div
        style={{
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "1.75rem",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#94a3b8",
            margin: "0 0 4px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Career
        </p>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          Saved Jobs
        </h1>
      </div>

      {activeSaved.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            background: "#fff",
            border: "1px dashed #bfdbfe",
            borderRadius: "16px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            No saved jobs
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 1rem" }}>
            Save jobs while browsing to view them here later
          </p>
          <Link
            href={ROUTES.jobs}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "36px",
              padding: "0 16px",
              borderRadius: "9px",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Browse Jobs →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {activeSaved.map((s) => (
            <JobCard key={s.listing.id} job={s.listing} />
          ))}
        </div>
      )}
    </div>
  );
}
