import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import {
  getAccessStatus,
  getDaysRemaining,
  formatExpiryDate,
  ACCESS_DURATION_LABELS,
} from "@/lib/access-utils";
import { ExpiryBadge } from "@/features/enrolments/components/expiry-badge";
import { AccessDurationBadge } from "@/features/courses/components/access-duration-badge";
import Link from "next/link";
import type { AccessDuration } from "@prisma/client";

export const metadata = { title: "My Courses — MDSSC" };

type Filter = "ALL" | "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "LIFETIME";

export default async function MyCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const { filter: filterParam, q } = await searchParams;
  const filter = (filterParam ?? "ALL") as Filter;
  const query = q?.trim() ?? "";

  const enrolments = await db.enrolment.findMany({
    where: {
      userId: session.user.id,
      ...(query
        ? {
            course: {
              title: { contains: query, mode: "insensitive" as const },
            },
          }
        : {}),
    },
    orderBy: { accessGrantedAt: "desc" },
    select: {
      id: true,
      accessDuration: true,
      accessGrantedAt: true,
      accessExpiresAt: true,
      completionPercent: true,
      completedAt: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          totalLectures: true,
          totalDuration: true,
          level: true,
          category: { select: { name: true } },
        },
      },
    },
  });

  // Client-side filter by access status
  const now = new Date();
  const filtered = enrolments.filter((e) => {
    const status = getAccessStatus(e.accessExpiresAt);
    if (filter === "ALL") return true;
    return status === filter;
  });

  // Counts for tabs
  const counts = {
    ALL: enrolments.length,
    ACTIVE: enrolments.filter(
      (e) => getAccessStatus(e.accessExpiresAt) === "ACTIVE",
    ).length,
    EXPIRING_SOON: enrolments.filter(
      (e) => getAccessStatus(e.accessExpiresAt) === "EXPIRING_SOON",
    ).length,
    EXPIRED: enrolments.filter(
      (e) => getAccessStatus(e.accessExpiresAt) === "EXPIRED",
    ).length,
    LIFETIME: enrolments.filter(
      (e) => getAccessStatus(e.accessExpiresAt) === "LIFETIME",
    ).length,
  };

  const filterTabs: { key: Filter; label: string; urgent?: boolean }[] = [
    { key: "ALL", label: "All Courses" },
    { key: "ACTIVE", label: "Active" },
    { key: "EXPIRING_SOON", label: "Expiring Soon", urgent: true },
    { key: "EXPIRED", label: "Expired" },
    { key: "LIFETIME", label: "Lifetime" },
  ];

  const LEVEL_LABELS: Record<string, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
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
            Student Dashboard
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
            My Courses
          </h1>
        </div>
        <Link
          href={ROUTES.courses}
          style={{
            height: "36px",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: "1px solid #bfdbfe",
            borderRadius: "9px",
            background: "#eff6ff",
            color: "#1d4ed8",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Browse Courses
        </Link>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.25rem",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
          flexWrap: "wrap",
        }}
      >
        {filterTabs.map((tab) => {
          const isActive = filter === tab.key;
          const count = counts[tab.key];
          return (
            <Link
              key={tab.key}
              href={`${ROUTES.myCourses}?filter=${tab.key}${query ? `&q=${query}` : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9px",
                fontSize: "12.5px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1d4ed8" : "#64748b",
                background: isActive ? "#fff" : "transparent",
                textDecoration: "none",
                border: isActive
                  ? "1px solid #bfdbfe"
                  : "1px solid transparent",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background:
                    tab.urgent && count > 0
                      ? "#fef9c3"
                      : isActive
                        ? "#dbeafe"
                        : "#e2e8f0",
                  color:
                    tab.urgent && count > 0
                      ? "#854d0e"
                      : isActive
                        ? "#1d4ed8"
                        : "#64748b",
                }}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form method="GET" style={{ marginBottom: "1.5rem" }}>
        {filter !== "ALL" && (
          <input type="hidden" name="filter" value={filter} />
        )}
        <div style={{ position: "relative", width: "fit-content" }}>
          <svg
            style={{
              position: "absolute",
              left: "11px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              pointerEvents: "none",
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            name="q"
            defaultValue={query}
            placeholder="Search your courses…"
            style={{
              height: "38px",
              paddingLeft: "34px",
              paddingRight: "12px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "13px",
              width: "280px",
              background: "#fff",
            }}
          />
        </div>
      </form>

      {/* Course list */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            background: "#fff",
            border: "1px dashed #bfdbfe",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            {query
              ? "No courses found"
              : filter !== "ALL"
                ? `No ${filter.toLowerCase().replace("_", " ")} courses`
                : "No courses enrolled yet"}
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 1rem" }}>
            {query
              ? "Try a different search"
              : "Browse our catalogue to start learning"}
          </p>
          <Link
            href={ROUTES.courses}
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
            Browse Courses →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((enrolment) => {
            const course = enrolment.course;
            const status = getAccessStatus(enrolment.accessExpiresAt);
            const days = getDaysRemaining(enrolment.accessExpiresAt);
            const isExpired = status === "EXPIRED";
            const isExpiring = status === "EXPIRING_SOON";
            const isCompleted = enrolment.completionPercent === 100;

            return (
              <div
                key={enrolment.id}
                style={{
                  background: "#fff",
                  border: `1px solid ${isExpired ? "#fecaca" : isExpiring ? "#fde68a" : "#e8edf2"}`,
                  borderRadius: "16px",
                  padding: "1.25rem",
                  display: "flex",
                  gap: "1.25rem",
                  alignItems: "flex-start",
                  opacity: isExpired ? 0.8 : 1,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: "100px",
                    height: "64px",
                    borderRadius: "10px",
                    background: "#f1f5f9",
                    flexShrink: 0,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                  )}
                  {isExpired && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                      }}
                    >
                      🔒
                    </div>
                  )}
                  {isCompleted && !isExpired && (
                    <div
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#16a34a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "14.5px",
                          fontWeight: 700,
                          color: "#0f172a",
                          margin: "0 0 3px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          letterSpacing: "-0.2px",
                        }}
                      >
                        {course.title}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          fontSize: "11.5px",
                          color: "#94a3b8",
                          flexWrap: "wrap",
                        }}
                      >
                        {course.category && <span>{course.category.name}</span>}
                        <span>
                          · {LEVEL_LABELS[course.level] ?? course.level}
                        </span>
                        <span>· {course.totalLectures} lectures</span>
                      </div>
                    </div>
                    <ExpiryBadge
                      accessExpiresAt={enrolment.accessExpiresAt}
                      size="sm"
                    />
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "11.5px",
                        color: "#94a3b8",
                        marginBottom: "4px",
                      }}
                    >
                      <span>Progress</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: isCompleted ? "#16a34a" : "#0f172a",
                        }}
                      >
                        {enrolment.completionPercent}%
                        {isCompleted && " · Completed ✓"}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "5px",
                        background: "#f1f5f9",
                        borderRadius: "99px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "5px",
                          borderRadius: "99px",
                          width: `${enrolment.completionPercent}%`,
                          background: isCompleted
                            ? "#16a34a"
                            : isExpired
                              ? "#fca5a5"
                              : "#1d4ed8",
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>

                  {/* Access info row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        fontSize: "12px",
                        color: "#94a3b8",
                      }}
                    >
                      <span>
                        <AccessDurationBadge
                          duration={enrolment.accessDuration as AccessDuration}
                          variant="short"
                        />
                      </span>
                      <span>
                        Enrolled{" "}
                        {enrolment.accessGrantedAt.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {!isExpired && enrolment.accessExpiresAt && (
                        <span
                          style={{ color: isExpiring ? "#854d0e" : "#94a3b8" }}
                        >
                          Expires {formatExpiryDate(enrolment.accessExpiresAt)}
                          {days !== null && days <= 7 && ` (${days}d)`}
                        </span>
                      )}
                      {isExpired && (
                        <span style={{ color: "#ef4444" }}>
                          Expired {formatExpiryDate(enrolment.accessExpiresAt)}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    {isExpired ? (
                      <Link
                        href={ROUTES.courseDetail(course.slug)}
                        style={{
                          height: "32px",
                          padding: "0 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          border: "1px solid #fecaca",
                          borderRadius: "8px",
                          background: "#fef2f2",
                          color: "#dc2626",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Re-enrol
                      </Link>
                    ) : isCompleted ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Link
                          href={ROUTES.certificates}
                          style={{
                            height: "32px",
                            padding: "0 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            border: "1px solid #bbf7d0",
                            borderRadius: "8px",
                            background: "#f0fdf4",
                            color: "#166534",
                            fontSize: "12px",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          📜 Certificate
                        </Link>
                        <Link
                          href={ROUTES.coursePlayer(course.slug)}
                          style={{
                            height: "32px",
                            padding: "0 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            border: "1px solid #bfdbfe",
                            borderRadius: "8px",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            fontSize: "12px",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          Revisit
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={ROUTES.coursePlayer(course.slug)}
                        style={{
                          height: "32px",
                          padding: "0 16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          border: "none",
                          borderRadius: "8px",
                          background:
                            "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                          boxShadow: "0 2px 6px rgba(29,78,216,0.25)",
                        }}
                      >
                        Continue →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
