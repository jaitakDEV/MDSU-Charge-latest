import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { CategoryManager } from "@/features/admin/components/commerce/category-manager";

export const metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const categories = await db.category.findMany({
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      displayOrder: true,
      _count: { select: { courses: true } },
    },
  });

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "700px",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          Categories
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Manage course categories
        </p>
      </div>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
