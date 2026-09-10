"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OPPORTUNITY_TYPE_LABELS, formatSalary } from "@/lib/job-utils";

type Listing = {
  id: string;
  title: string;
  opportunityType: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  workMode: string;
  location: string | null;
  state: string | null;
  compensationType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  stipendMin: number | null;
  stipendMax: number | null;
  projectBudget: number | null;
  durationType: string;
  durationValue: number | null;
  durationUnit: string | null;
  walkInDate: Date | null;
  walkInTime: string | null;
  walkInVenue: string | null;
  targetColleges: string[];
  targetBatchYears: number[];
  certificateOffered: boolean;
  ppoOffered: boolean;
  minCgpa: number | null;
  educationLevel: string | null;
  educationStream: string | null;
  minExperienceYears: number;
  maxExperienceYears: number | null;
  openings: number;
  applicationDeadline: Date | null;
  status: string;
  approvalStatus: string;
  rejectedReason: string | null;
  company: {
    companyName: string;
    logoUrl: string | null;
    contactPerson: string;
    contactEmail: string;
  };
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #f1f5f9",
        fontSize: "13px",
      }}
    >
      <span style={{ color: "#64748b" }}>{label}</span>
      <span style={{ fontWeight: 600, color: "#0f172a", textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

export function ListingReviewPanel({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [action, setAction] = useState<"reject" | "revision" | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleApprove() {
    setLoading("approve");
    setError("");
    const res = await fetch(`/api/cms/listings/${listing.id}/approve`, {
      method: "PATCH",
    });
    const json = await res.json();
    setLoading(null);
    if (!json.success) {
      setError(json.error);
      return;
    }
    router.refresh();
  }

  async function handleReject() {
    if (text.trim().length < 10) {
      setError("Please provide a detailed reason (min 10 characters).");
      return;
    }
    setLoading("reject");
    setError("");
    const res = await fetch(`/api/cms/listings/${listing.id}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: text }),
    });
    const json = await res.json();
    setLoading(null);
    if (!json.success) {
      setError(json.error);
      return;
    }
    setAction(null);
    router.refresh();
  }

  async function handleRevision() {
    if (text.trim().length < 10) {
      setError("Please provide detailed notes (min 10 characters).");
      return;
    }
    setLoading("revision");
    setError("");
    const res = await fetch(`/api/cms/listings/${listing.id}/revision`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: text }),
    });
    const json = await res.json();
    setLoading(null);
    if (!json.success) {
      setError(json.error);
      return;
    }
    setAction(null);
    router.refresh();
  }

  const compensationText =
    listing.compensationType === "UNPAID"
      ? "Unpaid"
      : listing.compensationType === "NEGOTIABLE"
        ? "Negotiable"
        : listing.salaryMin || listing.salaryMax
          ? formatSalary(listing.salaryMin, listing.salaryMax)
          : listing.stipendMin || listing.stipendMax
            ? formatSalary(listing.stipendMin, listing.stipendMax)
            : listing.projectBudget
              ? `₹${listing.projectBudget.toLocaleString("en-IN")} (project)`
              : "Not disclosed";

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            background: "#f1f5f9",
            flexShrink: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {listing.company.logoUrl ? (
            <img
              src={listing.company.logoUrl}
              alt={listing.company.companyName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{ fontSize: "18px", fontWeight: 700, color: "#94a3b8" }}
            >
              {listing.company.companyName[0]}
            </span>
          )}
        </div>
        <div>
          <h1
            style={{
              fontSize: "19px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 3px",
            }}
          >
            {listing.title}
          </h1>
          <p style={{ fontSize: "12.5px", color: "#64748b", margin: 0 }}>
            {listing.company.companyName} ·{" "}
            {OPPORTUNITY_TYPE_LABELS[listing.opportunityType]}
          </p>
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          padding: "1.1rem",
          marginBottom: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: "0 0 8px",
          }}
        >
          Description
        </p>
        <p
          style={{
            fontSize: "13.5px",
            color: "#475569",
            margin: 0,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {listing.description}
        </p>
      </div>

      {/* Responsibilities + Requirements */}
      {(listing.responsibilities.length > 0 ||
        listing.requirements.length > 0) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          {listing.responsibilities.length > 0 && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e8edf2",
                borderRadius: "14px",
                padding: "1.1rem",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0 0 8px",
                }}
              >
                Responsibilities
              </p>
              <ul style={{ margin: 0, paddingLeft: "18px" }}>
                {listing.responsibilities.map((r, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "13px",
                      color: "#475569",
                      marginBottom: "4px",
                    }}
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {listing.requirements.length > 0 && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e8edf2",
                borderRadius: "14px",
                padding: "1.1rem",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0 0 8px",
                }}
              >
                Requirements
              </p>
              <ul style={{ margin: 0, paddingLeft: "18px" }}>
                {listing.requirements.map((r, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "13px",
                      color: "#475569",
                      marginBottom: "4px",
                    }}
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {listing.skills.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          {listing.skills.map((s) => (
            <span
              key={s}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "20px",
                background: "#eff6ff",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Key facts */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          padding: "1.1rem",
          marginBottom: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: "0 0 8px",
          }}
        >
          Key Facts
        </p>
        <InfoRow
          label="Work Mode"
          value={
            listing.workMode === "ONSITE"
              ? "On-site"
              : listing.workMode === "REMOTE"
                ? "Remote"
                : "Hybrid"
          }
        />
        <InfoRow
          label="Location"
          value={
            listing.location
              ? `${listing.location}${listing.state ? `, ${listing.state}` : ""}`
              : null
          }
        />
        <InfoRow label="Compensation" value={compensationText} />
        <InfoRow label="Openings" value={listing.openings} />
        <InfoRow
          label="Application Deadline"
          value={
            listing.applicationDeadline?.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }) ?? null
          }
        />
        <InfoRow label="Min CGPA" value={listing.minCgpa} />
        <InfoRow label="Education Level" value={listing.educationLevel} />
        <InfoRow
          label="Experience Required"
          value={`${listing.minExperienceYears}${listing.maxExperienceYears ? `-${listing.maxExperienceYears}` : "+"} years`}
        />

        {/* Walk-in specific */}
        {listing.opportunityType === "WALK_IN_DRIVE" && (
          <>
            <InfoRow
              label="Walk-in Date"
              value={
                listing.walkInDate?.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }) ?? null
              }
            />
            <InfoRow label="Time Slot" value={listing.walkInTime} />
            <InfoRow label="Venue" value={listing.walkInVenue} />
          </>
        )}

        {/* Campus specific */}
        {listing.opportunityType === "CAMPUS_HIRING" && (
          <>
            <InfoRow
              label="Target Colleges"
              value={listing.targetColleges.join(", ")}
            />
            <InfoRow
              label="Target Batch Years"
              value={listing.targetBatchYears.join(", ")}
            />
          </>
        )}

        {/* Internship specific */}
        {listing.opportunityType === "INTERNSHIP" && (
          <>
            <InfoRow
              label="Certificate Offered"
              value={listing.certificateOffered ? "Yes" : "No"}
            />
            <InfoRow
              label="PPO Offered"
              value={listing.ppoOffered ? "Yes" : "No"}
            />
          </>
        )}
      </div>

      {/* Company contact */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          padding: "1.1rem",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: "0 0 8px",
          }}
        >
          Posted By
        </p>
        <InfoRow label="Contact Person" value={listing.company.contactPerson} />
        <InfoRow label="Email" value={listing.company.contactEmail} />
      </div>

      {error && (
        <p
          style={{ fontSize: "12.5px", color: "#dc2626", marginBottom: "10px" }}
        >
          {error}
        </p>
      )}

      {/* Actions — only for SUBMITTED */}
      {listing.status === "SUBMITTED" && (
        <div
          style={{
            background: "#fffbeb",
            border: "1.5px solid #fde68a",
            borderRadius: "14px",
            padding: "1.25rem",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#92400e",
              margin: "0 0 4px",
            }}
          >
            Review Required
          </p>
          <p
            style={{ fontSize: "12.5px", color: "#b45309", margin: "0 0 14px" }}
          >
            Approve to publish, request changes, or reject with a reason.
          </p>

          {!action ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleApprove}
                disabled={loading !== null}
                style={{
                  height: "38px",
                  padding: "0 18px",
                  border: "none",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {loading === "approve" ? "Approving…" : "✓ Approve & Publish"}
              </button>
              <button
                onClick={() => setAction("revision")}
                disabled={loading !== null}
                style={{
                  height: "38px",
                  padding: "0 18px",
                  border: "1px solid #fde68a",
                  borderRadius: "10px",
                  background: "#fffbeb",
                  color: "#92400e",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Request Revision
              </button>
              <button
                onClick={() => setAction("reject")}
                disabled={loading !== null}
                style={{
                  height: "38px",
                  padding: "0 18px",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  background: "#fef2f2",
                  color: "#dc2626",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ✕ Reject
              </button>
            </div>
          ) : (
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  action === "reject"
                    ? "Explain why this listing is being rejected…"
                    : "What needs to change before this can be approved…"
                }
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "10px 12px",
                  border: "1px solid #fde68a",
                  borderRadius: "10px",
                  fontSize: "13px",
                  resize: "vertical",
                  marginBottom: "10px",
                }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={action === "reject" ? handleReject : handleRevision}
                  disabled={loading !== null}
                  style={{
                    height: "36px",
                    padding: "0 18px",
                    border: "none",
                    borderRadius: "9px",
                    background: action === "reject" ? "#dc2626" : "#d97706",
                    color: "#fff",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {loading
                    ? "Sending…"
                    : action === "reject"
                      ? "Confirm Rejection"
                      : "Send Revision Request"}
                </button>
                <button
                  onClick={() => {
                    setAction(null);
                    setText("");
                    setError("");
                  }}
                  style={{
                    height: "36px",
                    padding: "0 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "9px",
                    background: "#fff",
                    color: "#64748b",
                    fontSize: "12.5px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {listing.status === "PUBLISHED" && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "14px",
            padding: "1.1rem",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#166534",
              margin: 0,
            }}
          >
            ✓ This listing is live on the portal
          </p>
        </div>
      )}
    </div>
  );
}
