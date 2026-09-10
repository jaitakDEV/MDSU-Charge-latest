import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/app";
import { BlogEditor } from "@/features/cms/components/blog/blog-editor";

export const metadata = { title: "New Post — CMS" };

export default async function NewBlogPostPage() {
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
          New Post
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Write and publish an article
        </p>
      </div>
      <BlogEditor />
    </div>
  );
}
