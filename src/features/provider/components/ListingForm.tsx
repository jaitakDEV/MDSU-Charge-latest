"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";

type ListingFormData = {
  title: string;
  opportunityType: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string;
  workMode: string;
  location: string;
  state: string;
  compensationType: string;
  salaryMin: string;
  salaryMax: string;
  stipendMin: string;
  stipendMax: string;
  projectBudget: string;
  isSalaryDisclosed: boolean;
  durationType: string;
  durationValue: string;
  durationUnit: string;
  startDate: string;
  endDate: string;
  walkInDate: string;
  walkInTime: string;
  walkInVenue: string;
  targetColleges: string;
  targetBatchYears: string;
  certificateOffered: boolean;
  ppoOffered: boolean;
  minCgpa: string;
  educationLevel: string;
  educationStream: string;
  minExperienceYears: string;
  maxExperienceYears: string;
  genderPreference: string;
  openings: string;
  applicationDeadline: string;
  tags: string;
};

const INITIAL: ListingFormData = {
  title: "",
  opportunityType: "FULL_TIME_JOB",
  description: "",
  responsibilities: "",
  requirements: "",
  skills: "",
  workMode: "ONSITE",
  location: "",
  state: "",
  compensationType: "PAID",
  salaryMin: "",
  salaryMax: "",
  stipendMin: "",
  stipendMax: "",
  projectBudget: "",
  isSalaryDisclosed: true,
  durationType: "PERMANENT",
  durationValue: "",
  durationUnit: "MONTHS",
  startDate: "",
  endDate: "",
  walkInDate: "",
  walkInTime: "",
  walkInVenue: "",
  targetColleges: "",
  targetBatchYears: "",
  certificateOffered: false,
  ppoOffered: false,
  minCgpa: "",
  educationLevel: "ANY",
  educationStream: "",
  minExperienceYears: "0",
  maxExperienceYears: "",
  genderPreference: "Any",
  openings: "1",
  applicationDeadline: "",
  tags: "",
};

const OPPORTUNITY_TYPES = [
  { value: "FULL_TIME_JOB", label: "Full-time Job", durationType: "PERMANENT" },
  { value: "INTERNSHIP", label: "Internship", durationType: "FIXED" },
  { value: "APPRENTICESHIP", label: "Apprenticeship", durationType: "FIXED" },
  { value: "FREELANCE", label: "Freelance", durationType: "PROJECT_BASED" },
  { value: "WALK_IN_DRIVE", label: "Walk-in Drive", durationType: "EVENT" },
  { value: "CAMPUS_HIRING", label: "Campus Hiring", durationType: "EVENT" },
  { value: "PART_TIME", label: "Part-time", durationType: "PERMANENT" },
];

const inp: React.CSSProperties = {
  width: "100%",
  height: "40px",
  padding: "0 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13.5px",
  outline: "none",
  background: "#fff",
};

const textarea: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13.5px",
  outline: "none",
  resize: "vertical",
  lineHeight: 1.6,
};

function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
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

const sectionCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e8edf2",
  borderRadius: "16px",
  padding: "1.5rem",
  marginBottom: "1rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

function SectionTitle({ text, desc }: { text: string; desc?: string }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <p
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 3px",
        }}
      >
        {text}
      </p>
      {desc && (
        <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{desc}</p>
      )}
    </div>
  );
}

export function ListingForm({
  listingId,
  initialData,
}: {
  listingId?: string;
  initialData?: Partial<ListingFormData>;
}) {
  const router = useRouter();
  const isEdit = !!listingId;
  const [form, setForm] = useState<ListingFormData>({
    ...INITIAL,
    ...initialData,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const type = form.opportunityType;
  const isInternship = type === "INTERNSHIP";
  const isWalkIn = type === "WALK_IN_DRIVE";
  const isCampus = type === "CAMPUS_HIRING";
  const isFreelance = type === "FREELANCE";
  const isJobLike = type === "FULL_TIME_JOB" || type === "PART_TIME";
  const showSalary = isJobLike;
  const showStipend = isInternship || type === "APPRENTICESHIP";
  const showBudget = isFreelance;

  // Auto-set durationType based on opportunity type
  useEffect(() => {
    const cfg = OPPORTUNITY_TYPES.find((o) => o.value === type);
    if (cfg) setForm((p) => ({ ...p, durationType: cfg.durationType }));
  }, [type]);

  function update(key: keyof ListingFormData, value: string | boolean) {
    setForm((p) => ({ ...p, [key]: value }));
    setError("");
  }

  function validate(): string | null {
    if (form.title.trim().length < 5)
      return "Title must be at least 5 characters.";
    if (form.description.trim().length < 100)
      return (
        "Description must be at least 100 characters (currently " +
        form.description.trim().length +
        ")."
      );
    if (!form.skills.trim()) return "Add at least 1 skill.";
    if (
      (form.workMode === "ONSITE" || form.workMode === "HYBRID") &&
      !form.location.trim()
    )
      return "Location is required for onsite/hybrid opportunities.";
    if (isWalkIn && !form.walkInDate) return "Walk-in date is required.";
    if (isCampus && !form.targetColleges.trim())
      return "Target colleges are required for campus hiring.";
    if (form.compensationType === "PAID") {
      if (showSalary && !form.salaryMin && !form.salaryMax)
        return "Salary is required for paid jobs.";
      if (showStipend && !form.stipendMin && !form.stipendMax)
        return "Stipend is required for paid internships.";
      if (showBudget && !form.projectBudget)
        return "Project budget is required.";
    }
    return null;
  }

  function buildPayload() {
    return {
      title: form.title.trim(),
      opportunityType: form.opportunityType,
      description: form.description.trim(),
      responsibilities: form.responsibilities
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      requirements: form.requirements
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      workMode: form.workMode,
      location: form.location || undefined,
      state: form.state || undefined,
      compensationType: form.compensationType,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      stipendMin: form.stipendMin ? Number(form.stipendMin) : undefined,
      stipendMax: form.stipendMax ? Number(form.stipendMax) : undefined,
      projectBudget: form.projectBudget
        ? Number(form.projectBudget)
        : undefined,
      isSalaryDisclosed: form.isSalaryDisclosed,
      durationType: form.durationType,
      durationValue: form.durationValue
        ? Number(form.durationValue)
        : undefined,
      durationUnit: form.durationUnit || undefined,
      startDate: form.startDate
        ? new Date(form.startDate).toISOString()
        : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      walkInDate: form.walkInDate
        ? new Date(form.walkInDate).toISOString()
        : undefined,
      walkInTime: form.walkInTime || undefined,
      walkInVenue: form.walkInVenue || undefined,
      targetColleges: form.targetColleges
        ? form.targetColleges
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      targetBatchYears: form.targetBatchYears
        ? form.targetBatchYears
            .split(",")
            .map((s) => Number(s.trim()))
            .filter(Boolean)
        : [],
      certificateOffered: form.certificateOffered,
      ppoOffered: form.ppoOffered,
      minCgpa: form.minCgpa ? Number(form.minCgpa) : undefined,
      educationLevel: form.educationLevel || undefined,
      educationStream: form.educationStream || undefined,
      minExperienceYears: Number(form.minExperienceYears || 0),
      maxExperienceYears: form.maxExperienceYears
        ? Number(form.maxExperienceYears)
        : undefined,
      genderPreference: form.genderPreference,
      openings: Number(form.openings || 1),
      applicationDeadline: form.applicationDeadline
        ? new Date(form.applicationDeadline).toISOString()
        : undefined,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };
  }

  async function handleSaveDraft() {
    setSaving(true);
    setError("");
    setSuccess("");

    const res = await fetch(
      isEdit ? `/api/provider/listings/${listingId}` : "/api/provider/listings",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      },
    );
    const json = await res.json();
    setSaving(false);

    if (!json.success) {
      setError(json.error ?? "Failed to save.");
      return;
    }

    if (!isEdit) {
      router.push(ROUTES.providerListingEdit(json.data.id));
      return;
    }
    setSuccess("Draft saved.");
    setTimeout(() => setSuccess(""), 3000);
    router.refresh();
  }

  async function handleSubmitForReview() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setSaving(true);
    setError("");

    // Save first
    const saveRes = await fetch(
      isEdit ? `/api/provider/listings/${listingId}` : "/api/provider/listings",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      },
    );
    const saveJson = await saveRes.json();
    if (!saveJson.success) {
      setSaving(false);
      setError(saveJson.error);
      return;
    }

    const id = listingId ?? saveJson.data.id;

    // Then submit
    const submitRes = await fetch(`/api/provider/listings/${id}/submit`, {
      method: "PATCH",
    });
    const submitJson = await submitRes.json();
    setSaving(false);

    if (!submitJson.success) {
      setError(submitJson.error ?? "Failed to submit.");
      return;
    }
    router.push(ROUTES.providerListings + "?submitted=1");
  }

  return (
    <div>
      {/* ── Basic Info ── */}
      <div style={sectionCard}>
        <SectionTitle text="Basic Information" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Job Title" required>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Frontend Developer Intern"
              style={{
                ...inp,
                height: "44px",
                fontSize: "15px",
                fontWeight: 600,
              }}
            />
          </Field>

          <Field label="Opportunity Type" required>
            <select
              value={form.opportunityType}
              onChange={(e) => update("opportunityType", e.target.value)}
              style={inp}
            >
              {OPPORTUNITY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Description"
            required
            hint={`${form.description.trim().length}/5000 characters — minimum 100 required`}
          >
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the role, team, and what makes it exciting..."
              style={{ ...textarea, minHeight: "140px" }}
            />
          </Field>

          <Field label="Responsibilities" hint="One per line">
            <textarea
              value={form.responsibilities}
              onChange={(e) => update("responsibilities", e.target.value)}
              placeholder={
                "Build responsive UIs\nCollaborate with design team\nWrite unit tests"
              }
              style={{ ...textarea, minHeight: "90px" }}
            />
          </Field>

          <Field label="Requirements" hint="One per line">
            <textarea
              value={form.requirements}
              onChange={(e) => update("requirements", e.target.value)}
              placeholder={"2+ years React experience\nStrong CSS fundamentals"}
              style={{ ...textarea, minHeight: "90px" }}
            />
          </Field>

          <Field
            label="Skills"
            required
            hint="Comma separated — e.g. React, TypeScript, Node.js"
          >
            <input
              value={form.skills}
              onChange={(e) => update("skills", e.target.value)}
              placeholder="React, TypeScript, Node.js"
              style={inp}
            />
          </Field>
        </div>
      </div>

      {/* ── Work Details ── */}
      <div style={sectionCard}>
        <SectionTitle text="Work Details" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Work Mode" required>
            <div style={{ display: "flex", gap: "8px" }}>
              {["ONSITE", "REMOTE", "HYBRID"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => update("workMode", m)}
                  style={{
                    flex: 1,
                    height: "40px",
                    border: `1.5px solid ${form.workMode === m ? "#1d4ed8" : "#e2e8f0"}`,
                    borderRadius: "10px",
                    background: form.workMode === m ? "#eff6ff" : "#fff",
                    color: form.workMode === m ? "#1d4ed8" : "#64748b",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {m === "ONSITE"
                    ? "On-site"
                    : m === "REMOTE"
                      ? "Remote"
                      : "Hybrid"}
                </button>
              ))}
            </div>
          </Field>

          {(form.workMode === "ONSITE" || form.workMode === "HYBRID") && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <Field label="Location" required>
                <input
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="e.g. Ajmer"
                  style={inp}
                />
              </Field>
              <Field label="State">
                <input
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  placeholder="e.g. Rajasthan"
                  style={inp}
                />
              </Field>
            </div>
          )}

          <Field label="Openings" required>
            <input
              type="number"
              min={1}
              max={500}
              value={form.openings}
              onChange={(e) => update("openings", e.target.value)}
              style={{ ...inp, width: "140px" }}
            />
          </Field>

          <Field label="Application Deadline">
            <input
              type="datetime-local"
              value={form.applicationDeadline}
              onChange={(e) => update("applicationDeadline", e.target.value)}
              style={{ ...inp, width: "240px" }}
            />
          </Field>

          <Field
            label="Tags"
            hint="Comma separated — helps students discover your listing"
          >
            <input
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="tech, urgent-hiring"
              style={inp}
            />
          </Field>
        </div>
      </div>

      {/* ── Walk-in Drive specific ── */}
      {isWalkIn && (
        <div style={sectionCard}>
          <SectionTitle text="Walk-in Drive Details" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Field label="Walk-in Date" required>
              <input
                type="datetime-local"
                value={form.walkInDate}
                onChange={(e) => update("walkInDate", e.target.value)}
                style={inp}
              />
            </Field>
            <Field label="Time Slot" hint="e.g. 10:00 AM - 4:00 PM">
              <input
                value={form.walkInTime}
                onChange={(e) => update("walkInTime", e.target.value)}
                placeholder="10:00 AM - 4:00 PM"
                style={inp}
              />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Venue" required>
                <input
                  value={form.walkInVenue}
                  onChange={(e) => update("walkInVenue", e.target.value)}
                  placeholder="Full venue address"
                  style={inp}
                />
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* ── Campus Hiring specific ── */}
      {isCampus && (
        <div style={sectionCard}>
          <SectionTitle text="Campus Hiring Details" />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field
              label="Target Colleges"
              required
              hint="Comma separated college names"
            >
              <input
                value={form.targetColleges}
                onChange={(e) => update("targetColleges", e.target.value)}
                placeholder="MDS University, GEC Ajmer"
                style={inp}
              />
            </Field>
            <Field
              label="Target Batch Years"
              hint="Comma separated — e.g. 2025, 2026"
            >
              <input
                value={form.targetBatchYears}
                onChange={(e) => update("targetBatchYears", e.target.value)}
                placeholder="2025, 2026"
                style={inp}
              />
            </Field>
          </div>
        </div>
      )}

      {/* ── Internship specific ── */}
      {isInternship && (
        <div style={sectionCard}>
          <SectionTitle text="Internship Perks" />
          <div style={{ display: "flex", gap: "16px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.certificateOffered}
                onChange={(e) => update("certificateOffered", e.target.checked)}
              />
              Certificate offered
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.ppoOffered}
                onChange={(e) => update("ppoOffered", e.target.checked)}
              />
              PPO offered
            </label>
          </div>
        </div>
      )}

      {/* ── Duration ── */}
      {!isWalkIn && !isCampus && (
        <div style={sectionCard}>
          <SectionTitle text="Duration" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {!isJobLike && (
              <>
                <Field label="Duration">
                  <input
                    type="number"
                    min={1}
                    value={form.durationValue}
                    onChange={(e) => update("durationValue", e.target.value)}
                    placeholder="6"
                    style={inp}
                  />
                </Field>
                <Field label="Unit">
                  <select
                    value={form.durationUnit}
                    onChange={(e) => update("durationUnit", e.target.value)}
                    style={inp}
                  >
                    <option value="WEEKS">Weeks</option>
                    <option value="MONTHS">Months</option>
                    <option value="YEARS">Years</option>
                  </select>
                </Field>
              </>
            )}
            <Field label="Start Date">
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                style={inp}
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => update("endDate", e.target.value)}
                style={inp}
              />
            </Field>
          </div>
        </div>
      )}

      {/* ── Compensation ── */}
      <div style={sectionCard}>
        <SectionTitle text="Compensation" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Compensation Type" required>
            <div style={{ display: "flex", gap: "8px" }}>
              {["PAID", "UNPAID", "NEGOTIABLE"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update("compensationType", c)}
                  style={{
                    flex: 1,
                    height: "40px",
                    border: `1.5px solid ${form.compensationType === c ? "#1d4ed8" : "#e2e8f0"}`,
                    borderRadius: "10px",
                    background:
                      form.compensationType === c ? "#eff6ff" : "#fff",
                    color: form.compensationType === c ? "#1d4ed8" : "#64748b",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {c === "PAID"
                    ? "Paid"
                    : c === "UNPAID"
                      ? "Unpaid"
                      : "Negotiable"}
                </button>
              ))}
            </div>
          </Field>

          {form.compensationType === "PAID" && showSalary && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <Field label="Min Salary (₹/month)">
                <input
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) => update("salaryMin", e.target.value)}
                  placeholder="25000"
                  style={inp}
                />
              </Field>
              <Field label="Max Salary (₹/month)">
                <input
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) => update("salaryMax", e.target.value)}
                  placeholder="40000"
                  style={inp}
                />
              </Field>
            </div>
          )}

          {form.compensationType === "PAID" && showStipend && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <Field label="Min Stipend (₹/month)">
                <input
                  type="number"
                  value={form.stipendMin}
                  onChange={(e) => update("stipendMin", e.target.value)}
                  placeholder="8000"
                  style={inp}
                />
              </Field>
              <Field label="Max Stipend (₹/month)">
                <input
                  type="number"
                  value={form.stipendMax}
                  onChange={(e) => update("stipendMax", e.target.value)}
                  placeholder="15000"
                  style={inp}
                />
              </Field>
            </div>
          )}

          {form.compensationType === "PAID" && showBudget && (
            <Field label="Project Budget (₹)">
              <input
                type="number"
                value={form.projectBudget}
                onChange={(e) => update("projectBudget", e.target.value)}
                placeholder="50000"
                style={{ ...inp, width: "220px" }}
              />
            </Field>
          )}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={form.isSalaryDisclosed}
              onChange={(e) => update("isSalaryDisclosed", e.target.checked)}
            />
            Show compensation publicly on listing
          </label>
        </div>
      </div>

      {/* ── Eligibility ── */}
      <div style={sectionCard}>
        <SectionTitle text="Eligibility Criteria" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Field label="Education Level">
              <select
                value={form.educationLevel}
                onChange={(e) => update("educationLevel", e.target.value)}
                style={inp}
              >
                <option value="ANY">Any</option>
                <option value="DIPLOMA">Diploma</option>
                <option value="GRADUATE">Graduate</option>
                <option value="POSTGRADUATE">Postgraduate</option>
              </select>
            </Field>
            <Field label="Education Stream">
              <input
                value={form.educationStream}
                onChange={(e) => update("educationStream", e.target.value)}
                placeholder="e.g. Computer Science, Any"
                style={inp}
              />
            </Field>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
            }}
          >
            <Field label="Min CGPA">
              <input
                type="number"
                step="0.1"
                value={form.minCgpa}
                onChange={(e) => update("minCgpa", e.target.value)}
                placeholder="7.0"
                style={inp}
              />
            </Field>
            <Field label="Min Experience (yrs)">
              <input
                type="number"
                min={0}
                value={form.minExperienceYears}
                onChange={(e) => update("minExperienceYears", e.target.value)}
                style={inp}
              />
            </Field>
            <Field label="Max Experience (yrs)">
              <input
                type="number"
                value={form.maxExperienceYears}
                onChange={(e) => update("maxExperienceYears", e.target.value)}
                style={inp}
              />
            </Field>
          </div>
          <Field label="Gender Preference">
            <select
              value={form.genderPreference}
              onChange={(e) => update("genderPreference", e.target.value)}
              style={{ ...inp, width: "180px" }}
            >
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
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

      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
          paddingBottom: "2rem",
        }}
      >
        <button
          onClick={() => router.push(ROUTES.providerListings)}
          style={{
            height: "40px",
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
        <button
          onClick={handleSaveDraft}
          disabled={saving}
          style={{
            height: "40px",
            padding: "0 20px",
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
          onClick={handleSubmitForReview}
          disabled={saving}
          style={{
            height: "40px",
            padding: "0 22px",
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
          {saving ? "Submitting…" : "Submit for Review"}
        </button>
      </div>
    </div>
  );
}
