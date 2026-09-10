"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  isFeatured: boolean;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  publishedAt: Date | null;
  updatedAt: Date;
  author: { name: string | null };
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  DRAFT: { label: "Draft", bg: "#f1f5f9", color: "#64748b" },
  PUBLISHED: { label: "Published", bg: "#f0fdf4", color: "#166534" },
  ARCHIVED: { label: "Archived", bg: "#fef2f2", color: "#991b1b" },
};

export function NewsList({
  articles,
  countMap,
  currentFilter,
  currentQuery,
}: {
  articles: NewsItem[];
  countMap: Record<string, number>;
  currentFilter: string;
  currentQuery: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      ...(currentFilter !== "ALL" ? { status: currentFilter } : {}),
      ...(currentQuery ? { q: currentQuery } : {}),
      ...overrides,
    });
    return `${ROUTES.cmsNews}${params.toString() ? `?${params}` : ""}`;
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    await fetch(`/api/cms/news/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div>
      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.25rem",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        {[
          { key: "ALL", label: "All" },
          { key: "PUBLISHED", label: "Published" },
          { key: "DRAFT", label: "Drafts" },
        ].map((tab) => {
          const isActive = currentFilter === tab.key;
          return (
            <Link
              key={tab.key}
              href={buildHref({ status: tab.key })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9px",
                fontSize: "12.5px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1d4ed8" : "#64748b",
                background: isActive ? "#fff" : "transparent",
                textDecoration: "none",
                border: isActive
                  ? "1px solid #bfdbfe"
                  : "1px solid transparent",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background: isActive ? "#dbeafe" : "#e2e8f0",
                  color: isActive ? "#1d4ed8" : "#64748b",
                }}
              >
                {countMap[tab.key] ?? 0}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form method="GET" style={{ marginBottom: "1.25rem" }}>
        {currentFilter !== "ALL" && (
          <input type="hidden" name="status" value={currentFilter} />
        )}
        <input
          name="q"
          defaultValue={currentQuery}
          placeholder="Search articles…"
          style={{
            height: "38px",
            padding: "0 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            width: "260px",
          }}
        />
      </form>

      {articles.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "#fff",
            border: "1px dashed #bfdbfe",
            borderRadius: "14px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            No articles yet
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 1rem" }}>
            Start writing your first news article
          </p>
          <Link
            href={ROUTES.cmsNewsNew}
            style={{
              fontSize: "13px",
              color: "#1d4ed8",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + New Article
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {articles.map((article) => {
            const cfg = STATUS_CONFIG[article.status];
            return (
              <div
                key={article.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e8edf2",
                  borderRadius: "14px",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div style={{ width: "100px", flexShrink: 0 }}>
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: cfg?.bg,
                          color: cfg?.color,
                        }}
                      >
                        {cfg?.label}
                      </span>
                      {article.isFeatured && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "20px",
                            background: "#fef9c3",
                            color: "#854d0e",
                          }}
                        >
                          ★ Featured
                        </span>
                      )}
                      {article.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "10.5px",
                            padding: "1px 7px",
                            borderRadius: "6px",
                            background: "#f8fafc",
                            color: "#64748b",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: "0 0 3px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {article.title}
                    </p>
                    {article.excerpt && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11.5px",
                        color: "#94a3b8",
                        margin: 0,
                      }}
                    >
                      {article.updatedAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <Link
                      href={ROUTES.cmsNewsEdit(article.id)}
                      style={{
                        height: "30px",
                        padding: "0 12px",
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid #bfdbfe",
                        borderRadius: "8px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      disabled={deleting === article.id}
                      style={{
                        height: "30px",
                        padding: "0 10px",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        background: "#fef2f2",
                        color: "#ef4444",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {deleting === article.id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
