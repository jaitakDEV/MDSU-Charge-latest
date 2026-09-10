import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { NewsForm } from "@/features/cms/components/news/news-form";

export const metadata = { title: "Edit Article — CMS" };

export default async function EditNewsPage({
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

  const article = await db.newsArticle.findUnique({
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
      isFeatured: true,
      metaTitle: true,
      metaDescription: true,
      authorId: true,
    },
  });

  if (!article) notFound();

  if (
    session.user.role === "CMS_EDITOR" &&
    article.authorId !== session.user.id
  ) {
    redirect(ROUTES.cmsNews);
  }

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
          Edit Article
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          {article.status === "PUBLISHED" ? "Published" : "Draft"}
        </p>
      </div>
      <NewsForm
        articleId={article.id}
        initialData={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? "",
          content: article.content,
          coverImage: article.coverImage ?? "",
          tags: article.tags?.join(", ") ?? "",
          metaTitle: article.metaTitle ?? "",
          metaDescription: article.metaDescription ?? "",
          status: article.status,
          isFeatured: article.isFeatured,
        }}
        isAdmin={session.user.role === "ADMIN"}
      />
    </div>
  );
}
