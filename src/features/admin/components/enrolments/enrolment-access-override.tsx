"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EnrolmentAccessOverride({
  enrolmentId,
  currentExpiry,
}: {
  enrolmentId: string;
  currentExpiry: string | null; // null = LIFETIME
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"date" | "lifetime">("date");
  const [newDate, setNewDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isCurrentlyLifetime = currentExpiry === null;

  // Default new date — 1 year from today
  function defaultDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  }

  function handleOpen() {
    setMode(isCurrentlyLifetime ? "date" : "date");
    setNewDate(defaultDate());
    setError("");
    setOpen(true);
  }

  async function handleSave() {
    if (mode === "date" && !newDate) {
      setError("Please select a new expiry date.");
      return;
    }

    setSaving(true);
    setError("");

    const body =
      mode === "lifetime"
        ? { accessExpiresAt: null }
        : { accessExpiresAt: new Date(newDate).toISOString() };

    const res = await fetch(`/api/admin/enrolments/${enrolmentId}/extend`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setSaving(false);

    if (!json.success) {
      setError(json.error ?? "Failed to update.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        style={{
          height: "28px",
          padding: "0 10px",
          border: "1px solid #bfdbfe",
          borderRadius: "7px",
          background: "#eff6ff",
          color: "#1d4ed8",
          fontSize: "11.5px",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Override access
      </button>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Inline popover */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "32px",
          zIndex: 30,
          background: "#fff",
          border: "1.5px solid #bfdbfe",
          borderRadius: "14px",
          padding: "1rem",
          width: "260px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <p
          style={{
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 10px",
          }}
        >
          Override Access
        </p>

        {/* Current state */}
        <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: "0 0 10px" }}>
          Current:{" "}
          {isCurrentlyLifetime
            ? "Lifetime (no expiry)"
            : new Date(currentExpiry!).toLocaleDateString("en-IN")}
        </p>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
          <button
            onClick={() => setMode("date")}
            style={{
              flex: 1,
              height: "30px",
              border: `1.5px solid ${mode === "date" ? "#1d4ed8" : "#e2e8f0"}`,
              borderRadius: "8px",
              background: mode === "date" ? "#eff6ff" : "#fff",
              color: mode === "date" ? "#1d4ed8" : "#64748b",
              fontSize: "11.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Set date
          </button>
          <button
            onClick={() => setMode("lifetime")}
            style={{
              flex: 1,
              height: "30px",
              border: `1.5px solid ${mode === "lifetime" ? "#f59e0b" : "#e2e8f0"}`,
              borderRadius: "8px",
              background: mode === "lifetime" ? "#fffbeb" : "#fff",
              color: mode === "lifetime" ? "#92400e" : "#64748b",
              fontSize: "11.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ∞ Lifetime
          </button>
        </div>

        {mode === "date" && (
          <input
            type="date"
            value={newDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setNewDate(e.target.value)}
            style={{
              width: "100%",
              height: "36px",
              padding: "0 10px",
              border: "1px solid #e2e8f0",
              borderRadius: "9px",
              fontSize: "13px",
              marginBottom: "8px",
            }}
          />
        )}

        {mode === "lifetime" && (
          <div
            style={{
              padding: "8px 10px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "9px",
              fontSize: "11.5px",
              color: "#92400e",
              marginBottom: "8px",
            }}
          >
            Student will have permanent access with no expiry date.
          </div>
        )}

        {error && (
          <p
            style={{ fontSize: "11.5px", color: "#dc2626", margin: "0 0 8px" }}
          >
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              height: "34px",
              border: "none",
              borderRadius: "8px",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{
              height: "34px",
              padding: "0 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "12px",
              color: "#64748b",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
