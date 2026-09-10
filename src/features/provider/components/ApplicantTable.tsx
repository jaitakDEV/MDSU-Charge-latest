"use client";

import Link from "next/link";
import { ROUTES } from "@/config/app";
import { getApplicationStatusLabel } from "@/lib/job-utils";

type Applicant = {
  id: string;
  status: string;
  createdAt: Date;
  isShortlisted: boolean;
  isStarred: boolean;
  expectedSalary: number | null;
  noticePeriod: number | null;
  profile: {
    headline: string | null;
    skills: string[];
    completionPercent: number;
    user: { name: string | null; email: string; image: string | null };
  };
};

const STATUS_CONFIG: Record<string, { bg: string; color: string }> = {
  APPLIED: { bg: "#eff6ff", color: "#1d4ed8" },
  UNDER_REVIEW: { bg: "#fefce8", color: "#854d0e" },
  SHORTLISTED: { bg: "#f0fdf4", color: "#166534" },
  INTERVIEW_SCHEDULED: { bg: "#faf5ff", color: "#6b21a8" },
  INTERVIEWED: { bg: "#f0fdfa", color: "#0f766e" },
  OFFERED: { bg: "#f0fdf4", color: "#16a34a" },
  OFFER_ACCEPTED: { bg: "#f0fdf4", color: "#166534" },
  OFFER_REJECTED: { bg: "#f8fafc", color: "#64748b" },
  REJECTED: { bg: "#fef2f2", color: "#991b1b" },
  WITHDRAWN: { bg: "#f8fafc", color: "#64748b" },
};

const TABS = [
  { key: "ALL", label: "All" },
  { key: "APPLIED", label: "New" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW_SCHEDULED", label: "Interview" },
  { key: "OFFERED", label: "Offered" },
  { key: "REJECTED", label: "Rejected" },
];

export function ApplicantTable({
  listingId,
  applications,
  countMap,
  currentFilter,
  currentQuery,
}: {
  listingId: string;
  applications: Applicant[];
  countMap: Record<string, number>;
  currentFilter: string;
  currentQuery: string;
}) {
  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      ...(currentFilter !== "ALL" ? { status: currentFilter } : {}),
      ...(currentQuery ? { q: currentQuery } : {}),
      ...overrides,
    });
    return `${ROUTES.providerListingApps(listingId)}${params.toString() ? `?${params}` : ""}`;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        {TABS.map((tab) => {
          const isActive = currentFilter === tab.key;
          return (
            <Link
              key={tab.key}
              href={buildHref({ status: tab.key })}
              style={{
                height: "32px",
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                borderRadius: "9px",
                fontSize: "12px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1d4ed8" : "#64748b",
                background: isActive ? "#eff6ff" : "#f8fafc",
                border: isActive ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                textDecoration: "none",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background: isActive ? "#dbeafe" : "#e2e8f0",
                }}
              >
                {countMap[tab.key] ?? 0}
              </span>
            </Link>
          );
        })}
      </div>

      <form method="GET" style={{ marginBottom: "1.25rem" }}>
        {currentFilter !== "ALL" && (
          <input type="hidden" name="status" value={currentFilter} />
        )}
        <input
          name="q"
          defaultValue={currentQuery}
          placeholder="Search by name…"
          style={{
            height: "38px",
            padding: "0 14px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            width: "260px",
          }}
        />
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {applications.map((app) => {
          const cfg = STATUS_CONFIG[app.status] ?? {
            bg: "#f8fafc",
            color: "#64748b",
          };
          return (
            <Link
              key={app.id}
              href={`${ROUTES.providerListingApps(listingId)}/${app.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "#fff",
                border: "1px solid #e8edf2",
                borderRadius: "14px",
                padding: "1rem 1.25rem",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  flexShrink: 0,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {app.profile.user.image ? (
                  <img
                    src={app.profile.user.image}
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
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1d4ed8",
                    }}
                  >
                    {app.profile.user.name?.[0]?.toUpperCase() ?? "S"}
                  </span>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "3px",
                  }}
                >
                  {app.isStarred && (
                    <span style={{ fontSize: "12px" }}>⭐</span>
                  )}
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {app.profile.user.name ?? "Student"}
                  </p>
                </div>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  {app.profile.headline ?? app.profile.user.email}
                </p>
              </div>

              {app.profile.skills.slice(0, 3).map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: "10.5px",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: "#f8fafc",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    flexShrink: 0,
                  }}
                >
                  {s}
                </span>
              ))}

              <span
                style={{ fontSize: "10.5px", color: "#94a3b8", flexShrink: 0 }}
              >
                {app.createdAt.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: cfg.bg,
                  color: cfg.color,
                  flexShrink: 0,
                }}
              >
                {getApplicationStatusLabel(app.status)}
              </span>
            </Link>
          );
        })}
        {applications.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}
          >
            No applicants found.
          </div>
        )}
      </div>
    </div>
  );
}
