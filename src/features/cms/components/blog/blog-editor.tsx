"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadField } from "@/features/cms/components/upload-field";

type BlogData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  status: "DRAFT" | "PUBLISHED";
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const INITIAL: BlogData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: "",
  metaTitle: "",
  metaDescription: "",
  status: "DRAFT",
};

export function BlogEditor({
  postId,
  initialData,
}: {
  postId?: string;
  initialData?: Partial<BlogData>;
}) {
  const router = useRouter();
  const isEdit = !!postId;

  const [data, setData] = useState<BlogData>({ ...INITIAL, ...initialData });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState<"write" | "seo">("write");

  useEffect(() => {
    if (!isEdit && data.title) {
      setData((p) => ({ ...p, slug: slugify(data.title) }));
    }
  }, [data.title, isEdit]);

  function update(key: keyof BlogData, value: string) {
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
      isEdit ? `/api/cms/blog/${postId}` : "/api/cms/blog",
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
      router.push(`/cms/blog/${json.data.id}`);
      return;
    }

    setSuccess(publish ? "Post published!" : "Draft saved.");
    setTimeout(() => setSuccess(""), 3000);
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
          {/* Cover image */}
          <UploadField
            label="Cover Image"
            hint="Shown on blog card and article header"
            endpoint="blogCoverUploader"
            fileType="image"
            currentUrl={data.coverImage}
            onUploadComplete={(url) => update("coverImage", url)}
          />

          {/* Title */}
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

          {/* Slug */}
          {fieldBox(
            "URL Slug",
            <input
              value={data.slug}
              onChange={(e) => update("slug", slugify(e.target.value))}
              style={inp}
            />,
            "/blog/" + (data.slug || "url-will-appear-here"),
          )}

          {/* Excerpt */}
          {fieldBox(
            "Excerpt",
            <textarea
              value={data.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="Short summary shown on blog list page"
              style={{
                ...inp,
                height: "80px",
                padding: "10px 12px",
                resize: "vertical",
              }}
            />,
          )}

          {/* Content */}
          {fieldBox(
            "Content *",
            <textarea
              value={data.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="Write your article here... (HTML supported)"
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

          {/* Tags */}
          {fieldBox(
            "Tags",
            <input
              value={data.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="react, javascript, tutorial (comma separated)"
              style={inp}
            />,
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
              placeholder="SEO title — defaults to post title"
              style={inp}
            />,
          )}
          {fieldBox(
            "Meta Description",
            <textarea
              value={data.metaDescription}
              onChange={(e) => update("metaDescription", e.target.value)}
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

      {/* Error / Success */}
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

      {/* Action buttons */}
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
          onClick={() => router.push("/cms/blog")}
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
