import { db } from "@/server/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await db.newsArticle.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      excerpt: true,
      coverImage: true,
    },
  });
  if (!article) return { title: "Not Found" };
  return {
    title: article.metaTitle ?? `${article.title} — MDSSC`,
    description: article.metaDescription ?? article.excerpt ?? "",
    openGraph: {
      title: article.metaTitle ?? article.title,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await db.newsArticle.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      coverImage: true,
      tags: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });

  if (!article) notFound();

  const related = await db.newsArticle.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: slug },
      tags: { hasSome: article.tags ?? [] },
    },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  const readingTime = estimateReadingTime(article.content);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "760px",
        margin: "0 auto",
        padding: "2.5rem 1.5rem",
      }}
    >
      <Link
        href="/news"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "13px",
          color: "#64748b",
          textDecoration: "none",
          marginBottom: "1.5rem",
          fontWeight: 500,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        All News
      </Link>

      {article.coverImage && (
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "2rem",
            aspectRatio: "16/7",
          }}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        {article.tags?.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            {article.tags.map((t) => (
              <Link
                key={t}
                href={`/news?tag=${t}`}
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  border: "1px solid #bfdbfe",
                  textDecoration: "none",
                }}
              >
                #{t}
              </Link>
            ))}
          </div>
        )}
        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 800,
            color: "#0f172a",
            margin: "0 0 12px",
            letterSpacing: "-0.6px",
            lineHeight: 1.25,
          }}
        >
          {article.title}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                color: "#1d4ed8",
              }}
            >
              {article.author.name?.[0]?.toUpperCase() ?? "M"}
            </div>
            <span style={{ fontWeight: 600 }}>
              {article.author.name ?? "MDSSC"}
            </span>
          </div>
          {article.publishedAt && (
            <>
              <span style={{ color: "#e2e8f0" }}>·</span>
              <span>
                {article.publishedAt.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </>
          )}
          <span style={{ color: "#e2e8f0" }}>·</span>
          <span>{readingTime} min read</span>
        </div>
      </div>

      <div
        style={{ fontSize: "15.5px", color: "#334155", lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {related.length > 0 && (
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 1rem",
            }}
          >
            Related News
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/news/${r.slug}`}
                style={{
                  textDecoration: "none",
                  display: "block",
                  background: "#fff",
                  border: "1px solid #e8edf2",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {r.coverImage && (
                  <div style={{ height: "100px", overflow: "hidden" }}>
                    <img
                      src={r.coverImage}
                      alt={r.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: "10px 12px" }}>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0f172a",
                      margin: 0,
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {r.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
