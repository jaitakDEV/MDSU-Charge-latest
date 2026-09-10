import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { ACCESS_DURATION_LABELS } from "@/lib/access-utils";

export const metadata = { title: "Courses — Admin" };

const STATUS_CONFIG = {
  DRAFT: { label: "Draft", bg: "#f1f5f9", color: "#64748b" },
  REVIEW: { label: "In Review", bg: "#fefce8", color: "#854d0e" },
  PUBLISHED: { label: "Published", bg: "#f0fdf4", color: "#166534" },
  ARCHIVED: { label: "Archived", bg: "#fef2f2", color: "#991b1b" },
} as const;

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { status, q } = await searchParams;
  const filter = status ?? "ALL";
  const query = q?.trim() ?? "";

  const where = {
    ...(filter !== "ALL"
      ? { status: filter as keyof typeof STATUS_CONFIG }
      : {}),
    ...(query
      ? { title: { contains: query, mode: "insensitive" as const } }
      : {}),
  };

  // REVIEW pehle — admin ki priority
  const courses = await db.course.findMany({
    where,
    orderBy: [
      { status: "asc" }, // DRAFT < PUBLISHED < REVIEW alphabetically — manual sort better
    ],
    select: {
      id: true,
      title: true,
      status: true,
      price: true,
      accessDuration: true,
      isFeatured: true,
      updatedAt: true,
      author: { select: { name: true, email: true } },
      category: { select: { name: true } },
    },
  });

  // Manual priority sort: REVIEW first
  const priorityOrder = { REVIEW: 0, DRAFT: 1, PUBLISHED: 2, ARCHIVED: 3 };
  courses.sort((a, b) => priorityOrder[a.status] - priorityOrder[b.status]);

  const counts = await db.course.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const countMap = counts.reduce(
    (acc, c) => ({ ...acc, [c.status]: c._count._all }),
    {} as Record<string, number>,
  );
  const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

  const tabs = [
    { key: "ALL", label: "All", count: totalCount },
    {
      key: "REVIEW",
      label: "In Review",
      count: countMap.REVIEW ?? 0,
      urgent: true,
    },
    { key: "PUBLISHED", label: "Published", count: countMap.PUBLISHED ?? 0 },
    { key: "DRAFT", label: "Drafts", count: countMap.DRAFT ?? 0 },
    { key: "ARCHIVED", label: "Archived", count: countMap.ARCHIVED ?? 0 },
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1100px",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
            letterSpacing: "-0.4px",
          }}
        >
          Courses
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Review and manage all courses across the platform
        </p>
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
        {tabs.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={`${ROUTES.adminCourses}?status=${tab.key}${query ? `&q=${query}` : ""}`}
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
                    tab.urgent && tab.count > 0
                      ? "#fef9c3"
                      : isActive
                        ? "#dbeafe"
                        : "#e2e8f0",
                  color:
                    tab.urgent && tab.count > 0
                      ? "#854d0e"
                      : isActive
                        ? "#1d4ed8"
                        : "#64748b",
                }}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form method="GET" style={{ marginBottom: "1.25rem" }}>
        {filter !== "ALL" && (
          <input type="hidden" name="status" value={filter} />
        )}
        <input
          name="q"
          defaultValue={query}
          placeholder="Search courses…"
          style={{
            height: "38px",
            padding: "0 14px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            width: "280px",
          }}
        />
      </form>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {courses.map((course) => {
          const cfg = STATUS_CONFIG[course.status];
          const isUrgent = course.status === "REVIEW";
          return (
            <Link
              key={course.id}
              href={ROUTES.adminCourseDetail(course.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "#fff",
                padding: "1rem 1.25rem",
                borderRadius: "14px",
                border: isUrgent ? "1.5px solid #fde68a" : "1px solid #e8edf2",
                textDecoration: "none",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: "20px",
                  background: cfg.bg,
                  color: cfg.color,
                  flexShrink: 0,
                }}
              >
                {cfg.label}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: "0 0 3px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {course.title}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    fontSize: "11.5px",
                    color: "#94a3b8",
                  }}
                >
                  <span>{course.author.name ?? course.author.email}</span>
                  {course.category && <span>· {course.category.name}</span>}
                  <span>· {ACCESS_DURATION_LABELS[course.accessDuration]}</span>
                  <span>
                    ·{" "}
                    {course.price === 0
                      ? "Free"
                      : `₹${(course.price / 100).toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>

              {isUrgent && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#854d0e",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    flexShrink: 0,
                  }}
                >
                  Review needed →
                </span>
              )}
            </Link>
          );
        })}
        {courses.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            No courses found.
          </div>
        )}
      </div>
    </div>
  );
}
