import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { CourseWizard } from "@/features/cms/components/course-wizard/course-wizard";

export const metadata = { title: "New Course — CMS" };

export default async function NewCoursePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CMS_EDITOR")
    redirect(ROUTES.login);

  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true },
  });

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
          Create New Course
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Fill in the details below. You can save as draft and continue later.
        </p>
      </div>
      <CourseWizard categories={categories} authorId={session.user.id} />
    </div>
  );
}
