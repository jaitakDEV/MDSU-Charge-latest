"use client";

import { useEffect } from "react";
import type { WizardData } from "./course-wizard";

const LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const LANGUAGES = ["Hindi", "English", "Hindi + English"];

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function Step1BasicInfo({
  data,
  update,
  categories,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  categories: { id: string; name: string }[];
}) {
  // Auto-generate slug from title
  useEffect(() => {
    if (data.title) update({ slug: slugify(data.title) });
  }, [data.title]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <h2
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#0f172a",
          margin: 0,
          letterSpacing: "-0.3px",
        }}
      >
        Basic Information
      </h2>

      <Field label="Course Title" required>
        <input
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="e.g. Complete React.js Course for Beginners"
          style={inputStyle}
        />
      </Field>

      <Field label="URL Slug" hint="Auto-generated from title — edit if needed">
        <input
          value={data.slug}
          onChange={(e) => update({ slug: slugify(e.target.value) })}
          placeholder="complete-react-js-course"
          style={inputStyle}
        />
        {data.slug && (
          <span
            style={{
              fontSize: "11.5px",
              color: "#94a3b8",
              marginTop: "4px",
              display: "block",
            }}
          >
            /courses/{data.slug}
          </span>
        )}
      </Field>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <Field label="Level" required>
          <select
            value={data.level}
            onChange={(e) =>
              update({ level: e.target.value as WizardData["level"] })
            }
            style={inputStyle}
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Language">
          <select
            value={data.language}
            onChange={(e) => update({ language: e.target.value })}
            style={inputStyle}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Category" required>
        <select
          value={data.categoryId}
          onChange={(e) => update({ categoryId: e.target.value })}
          style={inputStyle}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────────────
export function Field({
  label,
  children,
  required,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontSize: "12.5px",
          fontWeight: 600,
          color: "#374151",
          display: "flex",
          gap: "4px",
        }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {hint && (
        <span
          style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "-2px" }}
        >
          {hint}
        </span>
      )}
      {children}
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  height: "40px",
  width: "100%",
  padding: "0 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13.5px",
  color: "#0f172a",
  background: "#fff",
  outline: "none",
};

export const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  minHeight: "100px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13.5px",
  color: "#0f172a",
  background: "#fff",
  outline: "none",
  resize: "vertical",
  lineHeight: 1.6,
};
