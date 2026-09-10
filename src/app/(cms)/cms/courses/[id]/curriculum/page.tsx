import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { CurriculumBuilder } from "@/features/cms/components/curriculum/curriculum-builder";
import Link from "next/link";

export const metadata = { title: "Curriculum — CMS" };

export default async function CurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CMS_EDITOR")
    redirect(ROUTES.login);

  const { id } = await params;

  const course = await db.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      status: true,
      authorId: true,
      totalLectures: true,
      totalDuration: true,
      sections: {
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          title: true,
          displayOrder: true,
          lectures: {
            orderBy: { displayOrder: "asc" },
            select: {
              id: true,
              title: true,
              type: true,
              isPreview: true,
              isPublished: true,
              duration: true,
              videoUrl: true,
              documentUrl: true,
              displayOrder: true,
            },
          },
        },
      },
    },
  });

  if (!course) notFound();
  if (course.authorId !== session.user.id) redirect(ROUTES.cmsCourses);

  const isLocked = course.status === "REVIEW";

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "820px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <Link
              href={ROUTES.cmsCourseEdit(id)}
              style={{
                fontSize: "12.5px",
                color: "#64748b",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Edit
            </Link>
          </div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
              letterSpacing: "-0.4px",
            }}
          >
            Curriculum
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            {course.title} · {course.totalLectures} lectures ·{" "}
            {course.totalDuration} min
          </p>
        </div>
      </div>

      {isLocked && (
        <div
          style={{
            padding: "12px 16px",
            background: "#fefce8",
            border: "1px solid #fde68a",
            borderRadius: "12px",
            fontSize: "13px",
            color: "#854d0e",
            marginBottom: "1.5rem",
          }}
        >
          Course is under review — curriculum editing is disabled.
        </div>
      )}

      {/* <CurriculumBuilder
        courseId={course.id}
        initialSections={course.sections}
        isLocked={isLocked}
      /> */}
      <CurriculumBuilder
        courseId={course.id}
        courseStatus={course.status} // ← add karo
        initialSections={course.sections}
        isLocked={isLocked}
      />
    </div>
  );
}
