"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inp: React.CSSProperties = {
  width: "100%",
  height: "42px",
  padding: "0 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13.5px",
  outline: "none",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function CareerProfileForm({ initial }: { initial: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    headline: initial.headline ?? "",
    summary: initial.summary ?? "",
    currentCity: initial.currentCity ?? "",
    currentState: initial.currentState ?? "",
    preferredWorkMode: initial.preferredWorkMode ?? "ONSITE",
    skills: initial.skills?.join(", ") ?? "",
    languages: initial.languages?.join(", ") ?? "",
    isProfileVisible: initial.isProfileVisible ?? true,
    isOpenToWork: initial.isOpenToWork ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/career/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        skills: form.skills
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        languages: form.languages
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setSuccess("Saved!");
      setTimeout(() => setSuccess(""), 2500);
      router.refresh();
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8edf2",
        borderRadius: "16px",
        padding: "1.5rem",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 1.1rem",
        }}
      >
        Basic Information
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Field label="Headline">
          <input
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            placeholder="Final year CS student | Web Developer"
            style={inp}
          />
        </Field>
        <Field label="Summary">
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            style={{
              ...inp,
              height: "100px",
              padding: "10px 12px",
              resize: "vertical",
            }}
          />
        </Field>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <Field label="Current City">
            <input
              value={form.currentCity}
              onChange={(e) =>
                setForm({ ...form, currentCity: e.target.value })
              }
              style={inp}
            />
          </Field>
          <Field label="Current State">
            <input
              value={form.currentState}
              onChange={(e) =>
                setForm({ ...form, currentState: e.target.value })
              }
              style={inp}
            />
          </Field>
        </div>
        <Field label="Preferred Work Mode">
          <select
            value={form.preferredWorkMode}
            onChange={(e) =>
              setForm({ ...form, preferredWorkMode: e.target.value })
            }
            style={inp}
          >
            <option value="ONSITE">On-site</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </Field>
        <Field label="Skills">
          <input
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="React, Python, SQL"
            style={inp}
          />
        </Field>
        <Field label="Languages">
          <input
            value={form.languages}
            onChange={(e) => setForm({ ...form, languages: e.target.value })}
            placeholder="English, Hindi"
            style={inp}
          />
        </Field>

        <div style={{ display: "flex", gap: "16px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={form.isProfileVisible}
              onChange={(e) =>
                setForm({ ...form, isProfileVisible: e.target.checked })
              }
            />
            Visible to recruiters
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={form.isOpenToWork}
              onChange={(e) =>
                setForm({ ...form, isOpenToWork: e.target.checked })
              }
            />
            Open to work
          </label>
        </div>
      </div>
      {success && (
        <p style={{ fontSize: "12.5px", color: "#16a34a", marginTop: "10px" }}>
          {success}
        </p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          marginTop: "1.25rem",
          height: "40px",
          padding: "0 22px",
          border: "none",
          borderRadius: "10px",
          background: "#1d4ed8",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
