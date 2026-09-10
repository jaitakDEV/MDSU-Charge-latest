"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";
import { UploadField } from "@/features/cms/components/upload-field";

type NewsData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
};

const INITIAL: NewsData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: "",
  metaTitle: "",
  metaDescription: "",
  status: "DRAFT",
  isFeatured: false,
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function NewsForm({
  articleId,
  initialData,
  isAdmin,
}: {
  articleId?: string;
  initialData?: Partial<NewsData>;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const isEdit = !!articleId;

  const [data, setData] = useState<NewsData>({ ...INITIAL, ...initialData });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState<"write" | "seo">("write");

  useEffect(() => {
    if (!isEdit && data.title) {
      setData((p) => ({ ...p, slug: slugify(data.title) }));
    }
  }, [data.title, isEdit]);

  function update(key: keyof NewsData, value: string | boolean) {
    setData((p) => ({ ...p, [key]: value }));
    setError("");
  }

  async function save(publish: boolean) {
    if (!data.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!data.content.trim()) {
      setError("Content is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const body = {
      ...data,
      tags: data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: publish ? "PUBLISHED" : "DRAFT",
    };

    const res = await fetch(
      isEdit ? `/api/cms/news/${articleId}` : "/api/cms/news",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const json = await res.json();
    setSaving(false);

    if (!json.success) {
      setError(json.error ?? "Failed to save.");
      return;
    }

    if (!isEdit) {
      router.push(`/cms/news/${json.data.id}`);
      return;
    }

    setSuccess(publish ? "Article published!" : "Draft saved.");
    setTimeout(() => setSuccess(""), 3000);
    router.refresh();
  }

  const inp: React.CSSProperties = {
    width: "100%",
    height: "40px",
    padding: "0 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "13.5px",
    outline: "none",
  };

  const fieldBox = (
    label: string,
    children: React.ReactNode,
    hint?: string,
  ) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151" }}>
        {label}
      </label>
      {hint && (
        <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>{hint}</span>
      )}
      {children}
    </div>
  );

  return (
    <div>
      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.25rem",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        {(["write", "seo"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              height: "30px",
              padding: "0 16px",
              border: tab === t ? "1px solid #bfdbfe" : "1px solid transparent",
              borderRadius: "8px",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#1d4ed8" : "#64748b",
              fontSize: "12.5px",
              fontWeight: tab === t ? 600 : 500,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t === "write" ? "Write" : "SEO & Meta"}
          </button>
        ))}
      </div>

      {tab === "write" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
        >
          <UploadField
            label="Cover Image"
            hint="Shown on news card and article header — max 8MB"
            endpoint="newsCoverUploader"
            fileType="image"
            currentUrl={data.coverImage}
            onUploadComplete={(url) => update("coverImage", url)}
          />

          {fieldBox(
            "Title *",
            <input
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Article title"
              style={{
                ...inp,
                fontSize: "16px",
                height: "46px",
                fontWeight: 600,
              }}
            />,
          )}

          {fieldBox(
            "URL Slug",
            <input
              value={data.slug}
              onChange={(e) => update("slug", slugify(e.target.value))}
              style={inp}
            />,
            "/news/" + (data.slug || "url-will-appear-here"),
          )}

          {fieldBox(
            "Excerpt",
            <textarea
              value={data.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="Short summary shown on news list page"
              style={{
                ...inp,
                height: "80px",
                padding: "10px 12px",
                resize: "vertical",
              }}
            />,
          )}

          {fieldBox(
            "Content *",
            <textarea
              value={data.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="Write your news article here... (HTML supported)"
              style={{
                ...inp,
                height: "320px",
                padding: "12px",
                resize: "vertical",
                lineHeight: 1.7,
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "13px",
              }}
            />,
            "HTML is supported — use <h2>, <p>, <strong>, <ul>, <li> etc.",
          )}

          {fieldBox(
            "Tags",
            <input
              value={data.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="admission, results, event (comma separated)"
              style={inp}
            />,
          )}

          {isAdmin && (
            <div>
              <label
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Featured Article
              </label>
              <div
                onClick={() => update("isFeatured", !data.isFeatured)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  background: data.isFeatured ? "#fffbeb" : "#f8fafc",
                  border: `1.5px solid ${data.isFeatured ? "#fde68a" : "#e2e8f0"}`,
                  borderRadius: "10px",
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "22px",
                    borderRadius: "11px",
                    background: data.isFeatured ? "#f59e0b" : "#e2e8f0",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: data.isFeatured ? "21px" : "3px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.2s",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: data.isFeatured ? "#92400e" : "#64748b",
                  }}
                >
                  {data.isFeatured
                    ? "★ Priority in homepage slider"
                    : "Not featured"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "seo" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
        >
          {fieldBox(
            "Meta Title",
            <input
              value={data.metaTitle}
              onChange={(e) => update("metaTitle", e.target.value)}
              placeholder="SEO title — defaults to article title"
              style={inp}
            />,
          )}
          {fieldBox(
            "Meta Description",
            <textarea
              value={data.metaDescription}
              onChange={(e) =>
                update("metaDescription", e.target.value.slice(0, 160))
              }
              placeholder="SEO description — max 160 chars"
              maxLength={160}
              style={{
                ...inp,
                height: "90px",
                padding: "10px 12px",
                resize: "vertical",
              }}
            />,
          )}
          <p style={{ fontSize: "11.5px", color: "#94a3b8" }}>
            {data.metaDescription.length}/160 characters
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#dc2626",
            marginTop: "1rem",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            padding: "10px 14px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#166534",
            marginTop: "1rem",
          }}
        >
          {success}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <button
          onClick={() => router.push(ROUTES.cmsNews)}
          style={{
            height: "38px",
            padding: "0 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            background: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => save(false)}
          disabled={saving}
          style={{
            height: "38px",
            padding: "0 18px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            background: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569",
            cursor: "pointer",
          }}
        >
          {saving ? "Saving…" : "Save Draft"}
        </button>
        <button
          onClick={() => save(true)}
          disabled={saving}
          style={{
            height: "38px",
            padding: "0 20px",
            border: "none",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(29,78,216,0.25)",
          }}
        >
          {saving
            ? "Publishing…"
            : data.status === "PUBLISHED"
              ? "Update"
              : "Publish"}
        </button>
      </div>
    </div>
  );
}
