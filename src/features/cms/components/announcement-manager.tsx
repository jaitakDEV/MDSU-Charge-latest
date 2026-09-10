"use client";

import { useState } from "react";

type Announcement = {
  id: string;
  title: string;
  content: string;
  type: string;
  isActive: boolean;
};

export function AnnouncementManager({ initial }: { initial: Announcement[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState({ title: "", content: "", type: "info" });
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!form.content) return;
    setSaving(true);
    const res = await fetch("/api/cms/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setItems([json.data, ...items]);
      setForm({ title: "", content: "", type: "info" });
    }
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/cms/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setItems(items.map((i) => (i.id === id ? { ...i, isActive } : i)));
  }

  async function remove(id: string) {
    await fetch(`/api/cms/announcements/${id}`, { method: "DELETE" });
    setItems(items.filter((i) => i.id !== id));
  }

  const typeColors: Record<string, { bg: string; color: string }> = {
    info: { bg: "#eff6ff", color: "#1d4ed8" },
    warning: { bg: "#fefce8", color: "#854d0e" },
    success: { bg: "#f0fdf4", color: "#16a34a" },
  };

  return (
    <div>
      <div
        style={{
          background: "#f8fbff",
          border: "1.5px solid #bfdbfe",
          borderRadius: "14px",
          padding: "1.25rem",
          marginBottom: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <input
          placeholder="Title (optional)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{
            height: "38px",
            padding: "0 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "9px",
            fontSize: "13px",
          }}
        />
        <textarea
          placeholder="Announcement text"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          style={{
            padding: "10px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "9px",
            fontSize: "13px",
            minHeight: "70px",
            resize: "vertical",
          }}
        />
        <div style={{ display: "flex", gap: "6px" }}>
          {["info", "warning", "success"].map((t) => (
            <button
              key={t}
              onClick={() => setForm({ ...form, type: t })}
              style={{
                height: "32px",
                padding: "0 14px",
                border: `1.5px solid ${form.type === t ? "#1d4ed8" : "#e2e8f0"}`,
                borderRadius: "8px",
                background: form.type === t ? "#eff6ff" : "#fff",
                color: form.type === t ? "#1d4ed8" : "#64748b",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={add}
          disabled={saving}
          style={{
            height: "36px",
            border: "none",
            borderRadius: "9px",
            background: "#1d4ed8",
            color: "#fff",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
            alignSelf: "flex-end",
            padding: "0 18px",
          }}
        >
          {saving ? "Adding…" : "Add Announcement"}
        </button>
      </div>

      {items.map((item) => {
        const c = typeColors[item.type] ?? typeColors.info;
        return (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#fff",
              border: "1px solid #e8edf2",
              borderRadius: "12px",
              padding: "12px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "20px",
                background: c.bg,
                color: c.color,
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              {item.type}
            </span>
            <p
              style={{ flex: 1, fontSize: "13px", color: "#334155", margin: 0 }}
            >
              {item.content}
            </p>
            <button
              onClick={() => toggle(item.id, !item.isActive)}
              style={{
                fontSize: "11px",
                padding: "4px 10px",
                borderRadius: "20px",
                border: "none",
                background: item.isActive ? "#f0fdf4" : "#f1f5f9",
                color: item.isActive ? "#16a34a" : "#94a3b8",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {item.isActive ? "Active" : "Inactive"}
            </button>
            <button
              onClick={() => remove(item.id)}
              style={{
                fontSize: "11px",
                padding: "4px 10px",
                borderRadius: "8px",
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
