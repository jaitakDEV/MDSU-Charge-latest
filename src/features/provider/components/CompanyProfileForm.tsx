"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadField } from "@/features/cms/components/upload-field";

type CompanyData = {
  companyName: string;
  companyType: string;
  industry: string;
  website: string;
  logoUrl: string;
  description: string;
  companySize: string;
  headquarters: string;
  city: string;
  state: string;
  contactPerson: string;
  contactPhone: string;
  designation: string;
  linkedinUrl: string;
  glassdoorUrl: string;
};

const COMPANY_TYPES = [
  { value: "COMPANY", label: "Company" },
  { value: "STARTUP", label: "Startup" },
  { value: "NGO", label: "NGO" },
  { value: "INSTITUTE", label: "Institute" },
  { value: "FREELANCER", label: "Freelancer" },
  { value: "RECRUITER", label: "Recruiter / Agency" },
];

const COMPANY_SIZES = [
  { value: "STARTUP_1_10", label: "1-10 employees" },
  { value: "SMALL_11_50", label: "11-50 employees" },
  { value: "MEDIUM_51_200", label: "51-200 employees" },
  { value: "LARGE_201_500", label: "201-500 employees" },
  { value: "ENTERPRISE_500_PLUS", label: "500+ employees" },
];

const inp: React.CSSProperties = {
  width: "100%",
  height: "42px",
  padding: "0 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13.5px",
  outline: "none",
  background: "#fff",
};

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151" }}>
        {label}
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

const sectionCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e8edf2",
  borderRadius: "16px",
  padding: "1.5rem",
  marginBottom: "1rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

export function CompanyProfileForm({
  initialData,
  approvalStatus,
}: {
  initialData: CompanyData;
  approvalStatus: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(key: keyof CompanyData, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/provider/company", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);

    if (!json.success) {
      setError(json.error ?? "Failed to save.");
      return;
    }

    setSuccess(
      json.data.requiresReapproval
        ? "Changes saved. Since you made major changes, your profile has been sent for re-approval."
        : "Changes saved successfully.",
    );
    setTimeout(() => setSuccess(""), 4000);
    router.refresh();
  }

  return (
    <div>
      {approvalStatus === "APPROVED" && (
        <div
          style={{
            padding: "12px 16px",
            background: "#fefce8",
            border: "1px solid #fde68a",
            borderRadius: "12px",
            marginBottom: "1.25rem",
            fontSize: "12.5px",
            color: "#854d0e",
          }}
        >
          ⚠ Changing company name, industry, or headquarters will require
          re-approval by our team.
        </div>
      )}

      {/* ── Basic Info ── */}
      <div style={sectionCard}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 1rem",
          }}
        >
          Basic Information
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Company Name">
            <input
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              style={inp}
            />
          </Field>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Field label="Company Type">
              <select
                value={form.companyType}
                onChange={(e) => update("companyType", e.target.value)}
                style={inp}
              >
                {COMPANY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Company Size">
              <select
                value={form.companySize}
                onChange={(e) => update("companySize", e.target.value)}
                style={inp}
              >
                {COMPANY_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Industry">
            <input
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
              style={inp}
            />
          </Field>

          <Field label="Website">
            <input
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://acme.com"
              style={inp}
            />
          </Field>

          <Field label="Company Logo">
            <UploadField
              label="Company Logo"
              endpoint="companyLogoUploader"
              fileType="image"
              currentUrl={form.logoUrl}
              onUploadComplete={(url) => update("logoUrl", url)}
            />
          </Field>

          <Field label="About the Company">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              style={{
                ...inp,
                height: "100px",
                padding: "10px 12px",
                resize: "vertical",
              }}
            />
          </Field>
        </div>
      </div>

      {/* ── Location ── */}
      <div style={sectionCard}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 1rem",
          }}
        >
          Location
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Headquarters Address">
            <input
              value={form.headquarters}
              onChange={(e) => update("headquarters", e.target.value)}
              style={inp}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Field label="City">
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                style={inp}
              />
            </Field>
            <Field label="State">
              <input
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                style={inp}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* ── Contact ── */}
      <div style={sectionCard}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 1rem",
          }}
        >
          Contact Person
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Field label="Contact Name">
              <input
                value={form.contactPerson}
                onChange={(e) => update("contactPerson", e.target.value)}
                style={inp}
              />
            </Field>
            <Field label="Designation">
              <input
                value={form.designation}
                onChange={(e) => update("designation", e.target.value)}
                style={inp}
              />
            </Field>
          </div>
          <Field label="Phone">
            <input
              value={form.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              style={inp}
            />
          </Field>
        </div>
      </div>

      {/* ── Social Links ── */}
      <div style={sectionCard}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 1rem",
          }}
        >
          Social Links
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <Field label="LinkedIn">
            <input
              value={form.linkedinUrl}
              onChange={(e) => update("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/company/..."
              style={inp}
            />
          </Field>
          <Field label="Glassdoor">
            <input
              value={form.glassdoorUrl}
              onChange={(e) => update("glassdoorUrl", e.target.value)}
              placeholder="https://glassdoor.com/..."
              style={inp}
            />
          </Field>
        </div>
      </div>

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

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            height: "40px",
            padding: "0 24px",
            border: "none",
            borderRadius: "10px",
            background: saving
              ? "#93c5fd"
              : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
