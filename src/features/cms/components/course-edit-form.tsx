"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";
import { UploadField } from "./upload-field";
import {
  ACCESS_DURATION_LABELS,
  getCheckoutExpiryPreview,
} from "@/lib/access-utils";
import {
  Field,
  inputStyle,
  textareaStyle,
} from "./course-wizard/step1-basic-info";
import type { AccessDuration, CourseLevel, CourseStatus } from "@prisma/client";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  about: string | null;
  level: CourseLevel;
  language: string;
  categoryId: string;
  price: number;
  mrp: number;
  accessDuration: AccessDuration;
  status: CourseStatus;
  thumbnail: string | null;
  previewVideoUrl: string | null;
  isFeatured: boolean;
};

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
const LANGUAGES = ["Hindi", "English", "Hindi + English"];
const DURATION_OPTIONS: {
  value: AccessDuration;
  label: string;
  desc: string;
}[] = [
  { value: "FIFTEEN_DAYS", label: "15 Days", desc: "Trial courses" },
  { value: "ONE_MONTH", label: "1 Month", desc: "Short topic sprints" },
  { value: "THREE_MONTHS", label: "3 Months", desc: "Standard — default" },
  { value: "SIX_MONTHS", label: "6 Months", desc: "Medium courses" },
  { value: "ONE_YEAR", label: "1 Year", desc: "Comprehensive" },
  { value: "LIFETIME", label: "Lifetime", desc: "No expiry — premium" },
];

export function CourseEditForm({
  course,
  categories,
  isLocked,
  openSubmitDialog,
}: {
  course: Course;
  categories: { id: string; name: string }[];
  isLocked: boolean;
  openSubmitDialog: boolean;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: course.title,
    slug: course.slug,
    description: course.description ?? "",
    about: course.about ?? "",
    level: course.level,
    language: course.language,
    categoryId: course.categoryId,
    price: course.price / 100,
    mrp: course.mrp / 100,
    accessDuration: course.accessDuration,
    thumbnail: course.thumbnail ?? "",
    previewVideoUrl: course.previewVideoUrl ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSubmit, setShowSubmit] = useState(openSubmitDialog);

  // Was accessDuration changed on published course?
  const durationChanged =
    course.status === "PUBLISHED" &&
    form.accessDuration !== course.accessDuration;

  function update(key: keyof typeof form, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/cms/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Math.round(form.price * 100),
          mrp: Math.round(form.mrp * 100),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSuccess("Changes saved successfully.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitReview() {
    if (!form.accessDuration) {
      setError("Access duration is required before submitting for review.");
      setShowSubmit(false);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      // Save first, then submit
      await fetch(`/api/cms/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Math.round(form.price * 100),
          mrp: Math.round(form.mrp * 100),
        }),
      });
      const res = await fetch(`/api/cms/courses/${course.id}/submit-review`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      router.push(ROUTES.cmsCourses + "?submitted=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit.");
    } finally {
      setSubmitting(false);
      setShowSubmit(false);
    }
  }

  const fieldsetStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e8edf2",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  };

  const sectionTitle = (text: string) => (
    <p
      style={{
        fontSize: "14px",
        fontWeight: 700,
        color: "#0f172a",
        margin: "0 0 1.25rem",
        letterSpacing: "-0.3px",
      }}
    >
      {text}
    </p>
  );

  return (
    <div
      style={{
        opacity: isLocked ? 0.6 : 1,
        pointerEvents: isLocked ? "none" : "auto",
      }}
    >
      {/* ── Section 1: Basic Info ── */}
      <div style={fieldsetStyle}>
        {sectionTitle("Basic Information")}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
        >
          <Field label="Course Title" required>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="URL Slug">
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              style={inputStyle}
            />
            <span
              style={{
                fontSize: "11.5px",
                color: "#94a3b8",
                marginTop: "3px",
                display: "block",
              }}
            >
              /courses/{form.slug}
            </span>
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
            }}
          >
            <Field label="Level">
              <select
                value={form.level}
                onChange={(e) => update("level", e.target.value)}
                style={inputStyle}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l[0] + l.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Language">
              <select
                value={form.language}
                onChange={(e) => update("language", e.target.value)}
                style={inputStyle}
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Category" required>
              <select
                value={form.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                style={inputStyle}
              >
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </div>

      {/* ── Section 2: Description ── */}
      <div style={fieldsetStyle}>
        {sectionTitle("Description")}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
        >
          <Field
            label="Short Description"
            hint="Max 160 characters — shown on course card"
          >
            <input
              value={form.description}
              onChange={(e) =>
                update("description", e.target.value.slice(0, 160))
              }
              maxLength={160}
              style={inputStyle}
            />
            <span
              style={{
                fontSize: "11px",
                color: form.description.length > 140 ? "#ef4444" : "#94a3b8",
              }}
            >
              {form.description.length}/160
            </span>
          </Field>
          <Field label="Full Description">
            <textarea
              value={form.about}
              onChange={(e) => update("about", e.target.value)}
              style={{ ...textareaStyle, minHeight: "120px" }}
            />
          </Field>
        </div>
      </div>

      {/* ── Section 3: Pricing & Access Duration ── */}
      <div style={fieldsetStyle}>
        {sectionTitle("Pricing & Access Duration")}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Field label="Price (₹)">
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                    fontWeight: 600,
                    fontSize: "13.5px",
                  }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  value={form.price || ""}
                  onChange={(e) => update("price", Number(e.target.value))}
                  placeholder="499"
                  style={{ ...inputStyle, paddingLeft: "28px" }}
                />
              </div>
            </Field>
            <Field label="MRP (₹)" hint="Strikethrough price">
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                    fontWeight: 600,
                    fontSize: "13.5px",
                  }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  value={form.mrp || ""}
                  onChange={(e) => update("mrp", Number(e.target.value))}
                  placeholder="999"
                  style={{ ...inputStyle, paddingLeft: "28px" }}
                />
              </div>
            </Field>
          </div>

          {/* Access Duration */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Access Duration <span style={{ color: "#ef4444" }}>*</span>
              </label>
              {course.status === "PUBLISHED" && (
                <span
                  style={{
                    fontSize: "10.5px",
                    padding: "2px 8px",
                    background: "#fef3c7",
                    color: "#92400e",
                    borderRadius: "20px",
                    fontWeight: 600,
                    border: "1px solid #fde68a",
                  }}
                >
                  Changes affect new purchases only
                </span>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = form.accessDuration === opt.value;
                const isLifetime = opt.value === "LIFETIME";
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update("accessDuration", opt.value)}
                    style={{
                      padding: "10px 14px",
                      border: isSelected
                        ? isLifetime
                          ? "2px solid #f59e0b"
                          : "2px solid #1d4ed8"
                        : "1.5px solid #e2e8f0",
                      borderRadius: "12px",
                      background: isSelected
                        ? isLifetime
                          ? "#fffbeb"
                          : "#eff6ff"
                        : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.14s",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: isSelected
                          ? isLifetime
                            ? "#92400e"
                            : "#1d4ed8"
                          : "#0f172a",
                        margin: "0 0 2px",
                      }}
                    >
                      {isLifetime ? "∞ " : ""}
                      {opt.label}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: isSelected
                          ? isLifetime
                            ? "#b45309"
                            : "#3b82f6"
                          : "#94a3b8",
                        margin: 0,
                      }}
                    >
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Expiry preview */}
            {form.accessDuration && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "9px 13px",
                  background:
                    form.accessDuration === "LIFETIME" ? "#fffbeb" : "#f0fdf4",
                  border: `1px solid ${form.accessDuration === "LIFETIME" ? "#fde68a" : "#bbf7d0"}`,
                  borderRadius: "10px",
                  fontSize: "12px",
                  color:
                    form.accessDuration === "LIFETIME" ? "#92400e" : "#166534",
                }}
              >
                <strong>Example:</strong> If purchased today access{" "}
                {form.accessDuration === "LIFETIME"
                  ? "never expires (Lifetime)"
                  : `valid until ${getCheckoutExpiryPreview(form.accessDuration as AccessDuration)}`}
              </div>
            )}

            {/* Warning if changed on published */}
            {durationChanged && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "9px 13px",
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#92400e",
                }}
              >
                ⚠ Changing access duration on a published course only affects
                new purchases. Existing students keep their original access
                window.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 4: Media ── */}
      {/* <div style={fieldsetStyle}>
        {sectionTitle("Media")}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
        >
          <Field
            label="Thumbnail URL"
            hint="Upload via UploadThing and paste URL"
          >
            <input
              value={form.thumbnail}
              onChange={(e) => update("thumbnail", e.target.value)}
              placeholder="https://utfs.io/f/..."
              style={inputStyle}
            />
            {form.thumbnail && (
              <img
                src={form.thumbnail}
                alt="Preview"
                style={{
                  marginTop: "8px",
                  width: "160px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              />
            )}
          </Field>
          <Field label="Preview Video URL">
            <input
              value={form.previewVideoUrl}
              onChange={(e) => update("previewVideoUrl", e.target.value)}
              placeholder="https://utfs.io/f/..."
              style={inputStyle}
            />
          </Field>
        </div>
      </div> */}

      <div style={fieldsetStyle}>
        {sectionTitle("Media")}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <UploadField
            label="Course Thumbnail"
            hint="Shown on course card and detail page"
            endpoint="courseThumbnailUploader"
            fileType="image"
            currentUrl={form.thumbnail}
            onUploadComplete={(url) => update("thumbnail", url)}
          />
          <UploadField
            label="Preview Video"
            hint="Free teaser shown before purchase"
            endpoint="coursePreviewVideoUploader"
            fileType="video"
            currentUrl={form.previewVideoUrl}
            onUploadComplete={(url) => update("previewVideoUrl", url)}
          />
        </div>
      </div>

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
            marginBottom: "1rem",
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
            marginBottom: "1rem",
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
          paddingBottom: "2rem",
        }}
      >
        <button
          onClick={() => router.push(ROUTES.cmsCourses)}
          style={{
            height: "38px",
            padding: "0 18px",
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

        {course.status === "DRAFT" && (
          <button
            onClick={() => setShowSubmit(true)}
            disabled={submitting || saving}
            style={{
              height: "38px",
              padding: "0 18px",
              border: "1px solid #bfdbfe",
              borderRadius: "10px",
              background: "#eff6ff",
              fontSize: "13px",
              fontWeight: 600,
              color: "#1d4ed8",
              cursor: "pointer",
            }}
          >
            Submit for Review
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            height: "38px",
            padding: "0 20px",
            borderRadius: "10px",
            border: "none",
            background: saving
              ? "#93c5fd"
              : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(29,78,216,0.25)",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Submit confirmation modal */}
      {showSubmit && (
        <div
          onClick={() => setShowSubmit(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(15,23,42,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              width: "100%",
              maxWidth: "420px",
              overflow: "hidden",
              margin: "0 16px",
              fontFamily: "'Inter', -apple-system, sans-serif",
            }}
          >
            <div
              style={{
                height: "4px",
                background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
              }}
            />
            <div style={{ padding: "1.5rem" }}>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 8px",
                  letterSpacing: "-0.3px",
                }}
              >
                Submit for Review?
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Your course will be sent to admin for review. You will not be
                able to edit it until the admin approves or rejects it.
              </p>
              {form.accessDuration && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px 12px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "10px",
                    fontSize: "12.5px",
                    color: "#166534",
                  }}
                >
                  Access Duration:{" "}
                  <strong>
                    {
                      ACCESS_DURATION_LABELS[
                        form.accessDuration as AccessDuration
                      ]
                    }
                  </strong>
                </div>
              )}
            </div>
            <div
              style={{
                padding: "1rem 1.5rem 1.5rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <button
                onClick={() => setShowSubmit(false)}
                style={{
                  height: "36px",
                  padding: "0 16px",
                  borderRadius: "9px",
                  border: "1px solid #e2e8f0",
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
                onClick={handleSubmitReview}
                disabled={submitting}
                style={{
                  height: "36px",
                  padding: "0 18px",
                  borderRadius: "9px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(29,78,216,0.3)",
                }}
              >
                {submitting ? "Submitting…" : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
