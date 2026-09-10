"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/config/app";

const OPP_TYPES = [
  { value: "FULL_TIME_JOB", label: "Full-time Job" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "APPRENTICESHIP", label: "Apprenticeship" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "WALK_IN_DRIVE", label: "Walk-in Drive" },
  { value: "CAMPUS_HIRING", label: "Campus Hiring" },
  { value: "PART_TIME", label: "Part-time" },
];

export function JobFilters({
  currentType,
  currentMode,
  currentLocation,
  currentExp,
}: {
  currentType: string;
  currentMode: string;
  currentLocation: string;
  currentExp: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${ROUTES.jobs}?${params.toString()}`);
  }

  const filterGroupStyle: React.CSSProperties = { marginBottom: "1.5rem" };
  const labelStyle: React.CSSProperties = {
    fontSize: "10.5px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "8px",
    display: "block",
  };
  const optionStyle = (active: boolean): React.CSSProperties => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "7px 10px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: active ? 600 : 400,
    color: active ? "#1d4ed8" : "#475569",
    background: active ? "#eff6ff" : "transparent",
    border: "none",
    cursor: "pointer",
    marginBottom: "2px",
  });

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8edf2",
        borderRadius: "16px",
        padding: "1.25rem",
      }}
    >
      <div style={filterGroupStyle}>
        <span style={labelStyle}>Opportunity Type</span>
        <button
          onClick={() => updateFilter("type", "")}
          style={optionStyle(!currentType)}
        >
          All Types
        </button>
        {OPP_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => updateFilter("type", t.value)}
            style={optionStyle(currentType === t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={filterGroupStyle}>
        <span style={labelStyle}>Work Mode</span>
        {["", "ONSITE", "REMOTE", "HYBRID"].map((m) => (
          <button
            key={m}
            onClick={() => updateFilter("mode", m)}
            style={optionStyle(currentMode === m)}
          >
            {m === ""
              ? "Any"
              : m === "ONSITE"
                ? "On-site"
                : m === "REMOTE"
                  ? "Remote"
                  : "Hybrid"}
          </button>
        ))}
      </div>

      <div style={filterGroupStyle}>
        <span style={labelStyle}>Location</span>
        <input
          defaultValue={currentLocation}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              updateFilter("location", (e.target as HTMLInputElement).value);
          }}
          placeholder="City or Remote"
          style={{
            width: "100%",
            height: "36px",
            padding: "0 10px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
      </div>

      <div>
        <span style={labelStyle}>Experience</span>
        {[
          { value: "", label: "Any" },
          { value: "0-1", label: "Fresher (0-1yr)" },
          { value: "1-3", label: "1-3 years" },
          { value: "3-5", label: "3-5 years" },
          { value: "5-99", label: "5+ years" },
        ].map((e) => (
          <button
            key={e.value}
            onClick={() => updateFilter("exp", e.value)}
            style={optionStyle(currentExp === e.value)}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}
