import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { BlogEditor } from "@/features/cms/components/blog/blog-editor";

export const metadata = { title: "Edit Post — CMS" };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const { id } = await params;

  const post = await db.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      tags: true,
      status: true,
      metaTitle: true,
      metaDescription: true,
    },
  });

  if (!post) notFound();

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
          Edit Post
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Last updated {post.status === "PUBLISHED" ? "· Published" : "· Draft"}
        </p>
      </div>
      <BlogEditor
        postId={post.id}
        initialData={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          tags: post.tags?.join(", ") ?? "",
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          status: post.status as "DRAFT" | "PUBLISHED",
        }}
      />
    </div>
  );
}
