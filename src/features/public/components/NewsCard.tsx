import Link from "next/link";
import { ROUTES } from "@/config/app";

type NewsCardData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  publishedAt: Date | null;
  isFeatured: boolean;
  author: { name: string | null };
};

const GRADIENT_BG = ["#eff6ff", "#faf5ff", "#f0fdf4", "#fff7ed"];

export function NewsCard({
  article,
  index = 0,
}: {
  article: NewsCardData;
  index?: number;
}) {
  return (
    <Link
      href={ROUTES.newsDetail(article.slug)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        border: "1px solid #e8edf2",
        borderRadius: "16px",
        overflow: "hidden",
        textDecoration: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.14s",
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: "190px",
          background: "#f1f5f9",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${GRADIENT_BG[index % 4]} 0%, #f8fafc 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#bfdbfe"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Z" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8v4h-8V6Z" />
            </svg>
          </div>
        )}
        {article.isFeatured && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "20px",
              background: "#fbbf24",
              color: "#451a03",
            }}
          >
            ★ Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: "1.1rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {article.tags?.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "5px",
              marginBottom: "8px",
              flexWrap: "wrap",
            }}
          >
            {article.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  border: "1px solid #bfdbfe",
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        <h3
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 6px",
            letterSpacing: "-0.2px",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.title}
        </h3>

        {article.excerpt && (
          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              margin: "0 0 14px",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.excerpt}
          </p>
        )}

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 700,
                color: "#1d4ed8",
              }}
            >
              {article.author.name?.[0]?.toUpperCase() ?? "M"}
            </div>
            <span
              style={{ fontSize: "12px", color: "#475569", fontWeight: 500 }}
            >
              {article.author.name ?? "MDSSC"}
            </span>
          </div>
          {article.publishedAt && (
            <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
              {article.publishedAt.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
