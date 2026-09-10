"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OPP_TYPES = [
  "FULL_TIME_JOB",
  "INTERNSHIP",
  "APPRENTICESHIP",
  "FREELANCE",
  "WALK_IN_DRIVE",
  "CAMPUS_HIRING",
  "PART_TIME",
];
const inp: React.CSSProperties = {
  width: "100%",
  height: "42px",
  padding: "0 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13.5px",
};

export function PreferencesForm({ initial }: { initial: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    preferredTypes: initial?.preferredTypes ?? [],
    preferredRoles: initial?.preferredRoles?.join(", ") ?? "",
    preferredLocations: initial?.preferredLocations?.join(", ") ?? "",
    preferredWorkMode: initial?.preferredWorkMode ?? "",
    minSalary: initial?.minSalary ?? "",
    isAlertEnabled: initial?.isAlertEnabled ?? true,
    alertFrequency: initial?.alertFrequency ?? "DAILY",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  function toggleType(type: string) {
    setForm((p) => ({
      ...p,
      preferredTypes: p.preferredTypes.includes(type)
        ? p.preferredTypes.filter((t: string) => t !== type)
        : [...p.preferredTypes, type],
    }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/career/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        preferredRoles: form.preferredRoles
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        preferredLocations: form.preferredLocations
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        minSalary: form.minSalary ? Number(form.minSalary) : undefined,
        preferredWorkMode: form.preferredWorkMode || undefined,
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setSuccess("Preferences saved!");
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
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            fontSize: "12.5px",
            fontWeight: 600,
            color: "#374151",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Preferred Opportunity Types
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {OPP_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleType(t)}
              style={{
                height: "32px",
                padding: "0 12px",
                border: `1.5px solid ${form.preferredTypes.includes(t) ? "#1d4ed8" : "#e2e8f0"}`,
                borderRadius: "20px",
                background: form.preferredTypes.includes(t)
                  ? "#eff6ff"
                  : "#fff",
                color: form.preferredTypes.includes(t) ? "#1d4ed8" : "#64748b",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Preferred Roles
          </label>
          <input
            value={form.preferredRoles}
            onChange={(e) =>
              setForm({ ...form, preferredRoles: e.target.value })
            }
            placeholder="Frontend Developer, Data Analyst"
            style={inp}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Preferred Locations
          </label>
          <input
            value={form.preferredLocations}
            onChange={(e) =>
              setForm({ ...form, preferredLocations: e.target.value })
            }
            placeholder="Jaipur, Remote"
            style={inp}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Work Mode
            </label>
            <select
              value={form.preferredWorkMode}
              onChange={(e) =>
                setForm({ ...form, preferredWorkMode: e.target.value })
              }
              style={inp}
            >
              <option value="">Any</option>
              <option value="ONSITE">On-site</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Min Salary (₹/month)
            </label>
            <input
              type="number"
              value={form.minSalary}
              onChange={(e) => setForm({ ...form, minSalary: e.target.value })}
              style={inp}
            />
          </div>
        </div>

        <div
          style={{
            padding: "14px",
            background: "#f8fafc",
            borderRadius: "12px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              checked={form.isAlertEnabled}
              onChange={(e) =>
                setForm({ ...form, isAlertEnabled: e.target.checked })
              }
            />
            Email me about new matching jobs
          </label>
          {form.isAlertEnabled && (
            <select
              value={form.alertFrequency}
              onChange={(e) =>
                setForm({ ...form, alertFrequency: e.target.value })
              }
              style={{ ...inp, width: "180px" }}
            >
              <option value="INSTANT">Instant</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
            </select>
          )}
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
        {saving ? "Saving…" : "Save Preferences"}
      </button>
    </div>
  );
}
