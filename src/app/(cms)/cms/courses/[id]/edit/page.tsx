import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { CourseEditForm } from "@/features/cms/components/course-edit-form";

export const metadata = { title: "Edit Course — CMS" };

export default async function EditCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submit?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CMS_EDITOR")
    redirect(ROUTES.login);

  const { id } = await params;
  const { submit } = await searchParams;

  const [course, categories] = await Promise.all([
    db.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        about: true,
        level: true,
        language: true,
        categoryId: true,
        price: true,
        mrp: true,
        accessDuration: true,
        status: true,
        thumbnail: true,
        previewVideoUrl: true,
        isFeatured: true,
        authorId: true,
      },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!course) notFound();

  // CMS Editor sirf apna course edit kar sakta hai
  if (course.authorId !== session.user.id) redirect(ROUTES.cmsCourses);

  // REVIEW / PUBLISHED / ARCHIVED mein CMS Editor edit nahi kar sakta
  const isLocked = course.status === "REVIEW";

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: "740px",
      }}
    >
      <div style={{ marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
            letterSpacing: "-0.4px",
          }}
        >
          Edit Course
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          {isLocked
            ? "This course is in review — editing is disabled until admin responds."
            : "Update course details and save changes."}
        </p>
      </div>

      {/* Locked banner */}
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#eab308"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Course is under review. Wait for admin to approve or reject before
          editing.
        </div>
      )}

      <CourseEditForm
        course={course}
        categories={categories}
        isLocked={isLocked}
        openSubmitDialog={submit === "1"}
      />
    </div>
  );
}
