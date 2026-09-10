import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { getOrCreateCareerProfile } from "@/lib/career-utils";

export const metadata = { title: "Career Profile — MDSSC" };

export default async function CareerOverviewPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  await getOrCreateCareerProfile(session.user.id);

  const profile = await db.studentCareerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      education: { orderBy: { displayOrder: "asc" }, take: 1 },
      experience: { orderBy: { displayOrder: "asc" }, take: 1 },
      _count: {
        select: {
          education: true,
          experience: true,
          projects: true,
          certifications: true,
        },
      },
    },
  });

  const applications = await db.jobApplication.findMany({
    where: { profile: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      status: true,
      createdAt: true,
      listing: {
        select: { title: true, company: { select: { companyName: true } } },
      },
    },
  });

  const pct = profile?.completionPercent ?? 0;
  const isLowCompletion = pct < 60;

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
          My Career Profile
        </h1>
      </div>

      {/* Completion score */}
      <div
        style={{
          background: isLowCompletion ? "#fffbeb" : "#f0fdf4",
          border: `1.5px solid ${isLowCompletion ? "#fde68a" : "#86efac"}`,
          borderRadius: "16px",
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <p
            style={{
              fontSize: "13.5px",
              fontWeight: 700,
              color: isLowCompletion ? "#92400e" : "#166534",
              margin: 0,
            }}
          >
            Profile Completion
          </p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: isLowCompletion ? "#92400e" : "#166534",
              margin: 0,
            }}
          >
            {pct}%
          </p>
        </div>
        <div
          style={{
            height: "8px",
            background: "#fff",
            borderRadius: "99px",
            overflow: "hidden",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              height: "8px",
              borderRadius: "99px",
              background: isLowCompletion ? "#f59e0b" : "#16a34a",
              width: `${pct}%`,
              transition: "width 0.3s",
            }}
          />
        </div>
        {isLowCompletion && (
          <p style={{ fontSize: "12.5px", color: "#b45309", margin: 0 }}>
            Complete your profile to improve visibility and increase your
            chances of getting shortlisted.
          </p>
        )}
        <Link
          href={ROUTES.careerEdit}
          style={{
            display: "inline-block",
            marginTop: "10px",
            fontSize: "12.5px",
            fontWeight: 700,
            color: isLowCompletion ? "#92400e" : "#166534",
            textDecoration: "none",
          }}
        >
          Complete profile →
        </Link>
      </div>

      {/* Resume status */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "16px",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: profile?.resumeUrl ? "#f0fdf4" : "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "18px" }}>
              {profile?.resumeUrl ? "📄" : "⚠️"}
            </span>
          </div>
          <div>
            <p
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 2px",
              }}
            >
              {profile?.resumeUrl ? "Resume Uploaded" : "No Resume Uploaded"}
            </p>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
              {profile?.resumeUrl
                ? "You can apply to jobs"
                : "Upload a resume to start applying"}
            </p>
          </div>
        </div>
        <Link
          href={ROUTES.careerResume}
          style={{
            height: "36px",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            borderRadius: "9px",
            background: "#1d4ed8",
            color: "#fff",
            fontSize: "12.5px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {profile?.resumeUrl ? "Manage" : "Upload"}
        </Link>
      </div>

      {/* Quick stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { label: "Education", value: profile?._count.education ?? 0 },
          { label: "Experience", value: profile?._count.experience ?? 0 },
          { label: "Projects", value: profile?._count.projects ?? 0 },
          {
            label: "Certifications",
            value: profile?._count.certifications ?? 0,
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#f8fafc",
              borderRadius: "12px",
              padding: "12px 14px",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 3px",
              }}
            >
              {s.value}
            </p>
            <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #f1f5f9",
            background: "#fafafa",
          }}
        >
          <p
            style={{
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
            }}
          >
            Recent Applications
          </p>
          <Link
            href={ROUTES.applications}
            style={{
              fontSize: "12px",
              color: "#1d4ed8",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View all →
          </Link>
        </div>
        <div style={{ padding: "8px 0" }}>
          {applications.length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  margin: "0 0 10px",
                }}
              >
                No applications yet
              </p>
              <Link
                href={ROUTES.jobs}
                style={{
                  fontSize: "12.5px",
                  color: "#1d4ed8",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Browse jobs →
              </Link>
            </div>
          ) : (
            applications.map((app) => (
              <Link
                key={app.id}
                href={ROUTES.applicationDetail(app.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 1.25rem",
                  textDecoration: "none",
                  borderBottom: "1px solid #f8fafc",
                }}
              >
                <p
                  style={{
                    flex: 1,
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#0f172a",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {app.listing.title}{" "}
                  <span style={{ color: "#94a3b8" }}>
                    · {app.listing.company.companyName}
                  </span>
                </p>
                <span
                  style={{
                    fontSize: "10.5px",
                    color: "#94a3b8",
                    flexShrink: 0,
                  }}
                >
                  {app.status.replace(/_/g, " ")}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
