"use client";

import { useState } from "react";
import type { Section } from "./curriculum-builder";

export function AddSectionForm({
  courseId,
  order,
  onAdd,
}: {
  courseId: string;
  order: number;
  onAdd: (s: Section) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd() {
    if (!title.trim()) {
      setError("Section title is required.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/cms/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, title, displayOrder: order }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.success) {
      setError(json.error ?? "Failed.");
      return;
    }
    onAdd({ id: json.data.id, title, displayOrder: order, lectures: [] });
    setTitle("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          height: "44px",
          border: "1.5px dashed #bfdbfe",
          borderRadius: "12px",
          background: "#f8fbff",
          color: "#1d4ed8",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginTop: "4px",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Section
      </button>
    );
  }

  return (
    <div
      style={{
        border: "1.5px solid #bfdbfe",
        borderRadius: "12px",
        padding: "14px",
        background: "#f8fbff",
        marginTop: "4px",
      }}
    >
      <p
        style={{
          fontSize: "12.5px",
          fontWeight: 600,
          color: "#1d4ed8",
          margin: "0 0 10px",
        }}
      >
        New Section
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="e.g. Module 1: Introduction"
          autoFocus
          style={{
            flex: 1,
            height: "38px",
            padding: "0 12px",
            border: "1px solid #bfdbfe",
            borderRadius: "9px",
            fontSize: "13px",
            outline: "none",
            background: "#fff",
          }}
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          style={{
            height: "38px",
            padding: "0 16px",
            border: "none",
            borderRadius: "9px",
            background: "#1d4ed8",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {saving ? "Adding…" : "Add"}
        </button>
        <button
          onClick={() => setOpen(false)}
          style={{
            height: "38px",
            padding: "0 14px",
            border: "1px solid #e2e8f0",
            borderRadius: "9px",
            background: "#fff",
            fontSize: "13px",
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
      {error && (
        <p style={{ fontSize: "12px", color: "#ef4444", margin: "6px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}
