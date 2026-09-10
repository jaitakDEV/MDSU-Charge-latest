import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { ACCESS_DURATION_LABELS } from "@/lib/access-utils";
import { CourseApprovalActions } from "@/features/admin/components/courses/course-approval-actions";
import Link from "next/link";

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { id } = await params;

  const course = await db.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      about: true,
      status: true,
      accessDuration: true,
      price: true,
      mrp: true,
      level: true,
      language: true,
      thumbnail: true,
      isFeatured: true,
      author: { select: { id: true, name: true, email: true } },
      category: { select: { name: true } },
      sections: {
        orderBy: { displayOrder: "asc" },
        select: {
          title: true,
          lectures: {
            select: {
              title: true,
              type: true,
              isPublished: true,
              duration: true,
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  const totalLectures = course.sections.reduce(
    (a, s) => a + s.lectures.length,
    0,
  );
  const publishedLectures = course.sections.reduce(
    (a, s) => a + s.lectures.filter((l) => l.isPublished).length,
    0,
  );

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "780px",
      }}
    >
      <Link
        href={ROUTES.adminCourses}
        style={{
          fontSize: "12.5px",
          color: "#64748b",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          marginBottom: "1rem",
        }}
      >
        ← Back to Courses
      </Link>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
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
            }}
          >
            {course.title}
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            By {course.author.name ?? course.author.email} ·{" "}
            {course.category?.name}
          </p>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: "20px",
            background: course.status === "REVIEW" ? "#fefce8" : "#f1f5f9",
            color: course.status === "REVIEW" ? "#854d0e" : "#64748b",
            flexShrink: 0,
          }}
        >
          {course.status}
        </span>
      </div>

      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          style={{
            width: "100%",
            maxHeight: "260px",
            objectFit: "cover",
            borderRadius: "14px",
            marginBottom: "1.5rem",
          }}
        />
      )}

      {/* Key facts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Price",
            value:
              course.price === 0
                ? "Free"
                : `₹${(course.price / 100).toLocaleString("en-IN")}`,
          },
          {
            label: "Access",
            value: ACCESS_DURATION_LABELS[course.accessDuration],
          },
          { label: "Level", value: course.level },
          {
            label: "Lectures",
            value: `${publishedLectures}/${totalLectures} published`,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "10px 12px",
            }}
          >
            <p
              style={{
                fontSize: "10.5px",
                color: "#94a3b8",
                margin: "0 0 3px",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          padding: "1.25rem",
          marginBottom: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 8px",
          }}
        >
          Description
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "#475569",
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {course.about || course.description}
        </p>
      </div>

      {/* Curriculum preview */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 10px",
          }}
        >
          Curriculum
        </p>
        {course.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <p
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#334155",
                margin: "0 0 4px",
              }}
            >
              {s.title}
            </p>
            {s.lectures.map((l, li) => (
              <div
                key={li}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 0 4px 12px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: l.isPublished ? "#16a34a" : "#cbd5e1",
                  }}
                />
                {l.title} <span style={{ color: "#cbd5e1" }}>· {l.type}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Approval actions — only for REVIEW status */}
      {course.status === "REVIEW" && (
        <CourseApprovalActions courseId={course.id} />
      )}

      {/* Already published — admin override option */}
      {course.status === "PUBLISHED" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "14px",
            padding: "1.25rem",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 8px",
            }}
          >
            Course is live
          </p>
          <p style={{ fontSize: "12.5px", color: "#64748b", margin: 0 }}>
            This course is published and visible on the public catalogue.
          </p>
        </div>
      )}
    </div>
  );
}
