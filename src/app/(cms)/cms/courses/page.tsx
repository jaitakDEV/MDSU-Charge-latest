import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { CmsCourseActions } from "@/features/cms/components/cms-course-actions";
import { ACCESS_DURATION_LABELS } from "@/lib/access-utils";

export const metadata = { title: "My Courses — CMS" };

const STATUS_CONFIG = {
  DRAFT: { label: "Draft", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  REVIEW: {
    label: "In Review",
    bg: "#fefce8",
    color: "#854d0e",
    dot: "#eab308",
  },
  PUBLISHED: {
    label: "Published",
    bg: "#f0fdf4",
    color: "#166534",
    dot: "#16a34a",
  },
  ARCHIVED: {
    label: "Archived",
    bg: "#fef2f2",
    color: "#991b1b",
    dot: "#ef4444",
  },
} as const;

export default async function CmsCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CMS_EDITOR")
    redirect(ROUTES.login);

  const { q, status } = await searchParams;
  const query = q?.trim() ?? "";
  const filter = status ?? "ALL";

  const where = {
    authorId: session.user.id,
    ...(filter !== "ALL"
      ? { status: filter as keyof typeof STATUS_CONFIG }
      : {}),
    ...(query
      ? { title: { contains: query, mode: "insensitive" as const } }
      : {}),
  };

  const courses = await db.course.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      accessDuration: true,
      price: true,
      level: true,
      totalLectures: true,
      totalDuration: true,
      isFeatured: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { name: true } },
    },
  });

  const counts = await db.course.groupBy({
    by: ["status"],
    where: { authorId: session.user.id },
    _count: { _all: true },
  });

  const countMap = counts.reduce(
    (acc, c) => ({ ...acc, [c.status]: c._count._all }),
    {} as Record<string, number>,
  );
  const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

  const filterTabs = [
    { key: "ALL", label: "All", count: totalCount },
    { key: "DRAFT", label: "Drafts", count: countMap.DRAFT ?? 0 },
    { key: "REVIEW", label: "In Review", count: countMap.REVIEW ?? 0 },
    { key: "PUBLISHED", label: "Published", count: countMap.PUBLISHED ?? 0 },
    { key: "ARCHIVED", label: "Archived", count: countMap.ARCHIVED ?? 0 },
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: "1100px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
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
              letterSpacing: "-0.4px",
            }}
          >
            My Courses
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            Create and manage your course content
          </p>
        </div>
        <Link
          href={ROUTES.cmsCoursesNew}
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
            boxShadow: "0 2px 6px rgba(29,78,216,0.25)",
            letterSpacing: "-0.1px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Course
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
        }}
      >
        {filterTabs.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={`${ROUTES.cmsCourses}?status=${tab.key}${query ? `&q=${query}` : ""}`}
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
                transition: "all 0.14s ease",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background: isActive ? "#dbeafe" : "#e2e8f0",
                  color: isActive ? "#1d4ed8" : "#64748b",
                }}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form
        method="GET"
        style={{ display: "flex", gap: "8px", marginBottom: "1.25rem" }}
      >
        {filter !== "ALL" && (
          <input type="hidden" name="status" value={filter} />
        )}
        <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
          <svg
            style={{
              position: "absolute",
              left: "11px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
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
            placeholder="Search courses…"
            style={{
              width: "100%",
              height: "38px",
              paddingLeft: "34px",
              paddingRight: "12px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "13px",
              color: "#0f172a",
              background: "#fff",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            height: "38px",
            padding: "0 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            background: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569",
            cursor: "pointer",
          }}
        >
          Search
        </button>
        {query && (
          <Link
            href={`${ROUTES.cmsCourses}${filter !== "ALL" ? `?status=${filter}` : ""}`}
            style={{
              height: "38px",
              padding: "0 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              background: "#fff",
              fontSize: "13px",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            Clear
          </Link>
        )}
      </form>

      {/* Course list */}
      {courses.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            {query ? "No courses found" : "No courses yet"}
          </p>
          <p
            style={{ fontSize: "13px", color: "#64748b", margin: "0 0 1.5rem" }}
          >
            {query
              ? "Try a different search term"
              : "Create your first course to get started"}
          </p>
          {!query && (
            <Link
              href={ROUTES.cmsCoursesNew}
              style={{
                display: "inline-flex",
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
              Create your first course
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {courses.map((course) => {
            const statusCfg = STATUS_CONFIG[course.status];
            const priceDisplay =
              course.price === 0
                ? "Free"
                : `₹${(course.price / 100).toLocaleString("en-IN")}`;

            return (
              <div
                key={course.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e8edf2",
                  borderRadius: "14px",
                  padding: "1.1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  transition: "box-shadow 0.14s",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                {/* Status dot */}
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: statusCfg.dot,
                    flexShrink: 0,
                  }}
                />

                {/* Course info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginBottom: "4px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#0f172a",
                        margin: 0,
                        letterSpacing: "-0.2px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "380px",
                      }}
                    >
                      {course.title}
                    </p>

                    {/* Status badge */}
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: statusCfg.bg,
                        color: statusCfg.color,
                        border: `1px solid ${statusCfg.dot}30`,
                        flexShrink: 0,
                      }}
                    >
                      {statusCfg.label}
                    </span>

                    {/* Featured badge */}
                    {course.isFeatured && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: "#fef9c3",
                          color: "#854d0e",
                          border: "1px solid #fde68a",
                          flexShrink: 0,
                        }}
                      >
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* Meta row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    {course.category && (
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 3h18v18H3z" />
                        </svg>
                        {course.category.name}
                      </span>
                    )}
                    <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                      {course.totalLectures} lecture
                      {course.totalLectures !== 1 ? "s" : ""}
                    </span>
                    <span
                      style={{
                        fontSize: "11.5px",
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {ACCESS_DURATION_LABELS[course.accessDuration]}
                    </span>
                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: course.price === 0 ? "#16a34a" : "#0f172a",
                      }}
                    >
                      {priceDisplay}
                    </span>
                    <span style={{ fontSize: "11.5px", color: "#cbd5e1" }}>
                      Updated{" "}
                      {new Date(course.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <CmsCourseActions
                  courseId={course.id}
                  courseSlug={course.slug}
                  status={course.status}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
