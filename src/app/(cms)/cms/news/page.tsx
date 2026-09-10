import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { NewsList } from "@/features/cms/components/news/news-list";
import Link from "next/link";

export const metadata = { title: "News — CMS" };

export default async function CmsNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const { q, status } = await searchParams;
  const query = q?.trim() ?? "";
  const filter = status ?? "ALL";

  const articles = await db.newsArticle.findMany({
    where: {
      ...(session.user.role === "CMS_EDITOR"
        ? { authorId: session.user.id }
        : {}),
      ...(filter !== "ALL" ? { status: filter as any } : {}),
      ...(query
        ? { title: { contains: query, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      isFeatured: true,
      excerpt: true,
      coverImage: true,
      tags: true,
      publishedAt: true,
      updatedAt: true,
      author: { select: { name: true } },
    },
  });

  const [totalDraft, totalPublished] = await Promise.all([
    db.newsArticle.count({
      where: {
        ...(session.user.role === "CMS_EDITOR"
          ? { authorId: session.user.id }
          : {}),
        status: "DRAFT",
      },
    }),
    db.newsArticle.count({
      where: {
        ...(session.user.role === "CMS_EDITOR"
          ? { authorId: session.user.id }
          : {}),
        status: "PUBLISHED",
      },
    }),
  ]);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "860px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
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
            News
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            Manage news articles for the public website
          </p>
        </div>
        <Link
          href={ROUTES.cmsNewsNew}
          style={{
            height: "38px",
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderRadius: "10px",
            background: "#1d4ed8",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          + New Article
        </Link>
      </div>

      <NewsList
        articles={articles}
        countMap={{
          ALL: totalDraft + totalPublished,
          PUBLISHED: totalPublished,
          DRAFT: totalDraft,
        }}
        currentFilter={filter}
        currentQuery={query}
      />
    </div>
  );
}
