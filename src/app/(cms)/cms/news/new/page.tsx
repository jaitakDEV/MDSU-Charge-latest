import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/app";
import { NewsForm } from "@/features/cms/components/news/news-form";

export const metadata = { title: "New Article — CMS" };

export default async function NewNewsPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "740px",
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
          New Article
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Write and publish a news article
        </p>
      </div>
      <NewsForm isAdmin={session.user.role === "ADMIN"} />
    </div>
  );
}
