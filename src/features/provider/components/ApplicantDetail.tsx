"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApplicationStatusLabel } from "@/lib/job-utils";

const STATUS_OPTIONS = [
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEWED",
  "OFFERED",
  "REJECTED",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8edf2",
        borderRadius: "16px",
        padding: "1.25rem",
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
          margin: "0 0 10px",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

export function ApplicantDetail({
  application,
  listingId,
}: {
  application: any;
  listingId: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(application.status);
  const [note, setNote] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewMode, setInterviewMode] = useState("");
  const [interviewLink, setInterviewLink] = useState("");
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [starred, setStarred] = useState(application.isStarred);

  async function handleStatusUpdate() {
    setSaving(true);
    await fetch(`/api/provider/applications/${application.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        statusNote: note || undefined,
        interviewDate: interviewDate
          ? new Date(interviewDate).toISOString()
          : undefined,
        interviewMode: interviewMode || undefined,
        interviewLink: interviewLink || undefined,
      }),
    });
    setSaving(false);
    setShowStatusForm(false);
    router.refresh();
  }

  async function toggleStar() {
    setStarred(!starred);
    await fetch(`/api/provider/applications/${application.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isStarred: !starred }),
    });
  }

  const profile = application.profile;
  const isTerminal = [
    "REJECTED",
    "WITHDRAWN",
    "OFFER_ACCEPTED",
    "OFFER_REJECTED",
  ].includes(application.status);

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
            borderRadius: "50%",
            background: "#eff6ff",
            flexShrink: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {profile.user.image ? (
            <img
              src={profile.user.image}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{ fontSize: "20px", fontWeight: 700, color: "#1d4ed8" }}
            >
              {profile.user.name?.[0]?.toUpperCase() ?? "S"}
            </span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "19px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 3px",
            }}
          >
            {profile.user.name}
          </h1>
          <p style={{ fontSize: "12.5px", color: "#64748b", margin: 0 }}>
            {profile.headline ?? "—"}
          </p>
        </div>
        <button
          onClick={toggleStar}
          style={{
            fontSize: "22px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {starred ? "⭐" : "☆"}
        </button>
      </div>

      {/* Contact */}
      <Section title="Contact">
        <p style={{ fontSize: "13px", margin: "0 0 4px" }}>
          {profile.user.email}
        </p>
        {profile.user.phoneNumber && (
          <p style={{ fontSize: "13px", margin: 0 }}>
            {profile.user.phoneNumber}
          </p>
        )}
      </Section>

      {/* Summary */}
      {profile.summary && (
        <Section title="Summary">
          <p
            style={{
              fontSize: "13.5px",
              color: "#475569",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            {profile.summary}
          </p>
        </Section>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {profile.skills.map((s: string) => (
              <span
                key={s}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {profile.education.length > 0 && (
        <Section title="Education">
          {profile.education.map((e: any) => (
            <div key={e.id} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: "0 0 2px",
                }}
              >
                {e.degree} — {e.fieldOfStudy}
              </p>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                {e.institution} · {e.startYear}-{e.endYear ?? "Present"}
                {e.cgpa ? ` · CGPA ${e.cgpa}` : ""}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Experience */}
      {profile.experience.length > 0 && (
        <Section title="Experience">
          {profile.experience.map((e: any) => (
            <div key={e.id} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: "0 0 2px",
                }}
              >
                {e.title}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  margin: "0 0 4px",
                }}
              >
                {e.company} · {e.employmentType}
              </p>
              {e.description && (
                <p style={{ fontSize: "12.5px", color: "#475569", margin: 0 }}>
                  {e.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {profile.projects.length > 0 && (
        <Section title="Projects">
          {profile.projects.map((p: any) => (
            <div key={p.id} style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: "0 0 2px",
                }}
              >
                {p.title}
              </p>
              <p
                style={{
                  fontSize: "12.5px",
                  color: "#475569",
                  margin: "0 0 4px",
                }}
              >
                {p.description}
              </p>
              {p.technologies.length > 0 && (
                <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
                  {p.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {profile.certifications.length > 0 && (
        <Section title="Certifications">
          {profile.certifications.map((c: any) => (
            <p
              key={c.id}
              style={{ fontSize: "13px", color: "#0f172a", margin: "0 0 6px" }}
            >
              {c.name} —{" "}
              <span style={{ color: "#94a3b8" }}>{c.issuingOrg}</span>
            </p>
          ))}
        </Section>
      )}

      {/* Application specifics */}
      <Section title="Application Details">
        {application.coverLetter && (
          <p
            style={{
              fontSize: "13px",
              color: "#475569",
              margin: "0 0 10px",
              lineHeight: 1.6,
            }}
          >
            {application.coverLetter}
          </p>
        )}
        {application.expectedSalary && (
          <p
            style={{ fontSize: "12.5px", color: "#64748b", margin: "0 0 4px" }}
          >
            Expected: ₹{application.expectedSalary.toLocaleString("en-IN")}/mo
          </p>
        )}
        {application.noticePeriod && (
          <p
            style={{ fontSize: "12.5px", color: "#64748b", margin: "0 0 4px" }}
          >
            Notice Period: {application.noticePeriod} days
          </p>
        )}
        {application.portfolioUrl && (
          <p style={{ fontSize: "12.5px", margin: "0 0 4px" }}>
            <a href={application.portfolioUrl} style={{ color: "#1d4ed8" }}>
              Portfolio →
            </a>
          </p>
        )}
        <a
          href={application.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "8px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#1d4ed8",
          }}
        >
          📄 Download Resume
        </a>

        {application.screeningAnswers &&
          Object.keys(application.screeningAnswers).length > 0 && (
            <div
              style={{
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              {application.listing.screeningQuestions.map((q: any) => (
                <div key={q.id} style={{ marginBottom: "8px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#374151",
                      margin: "0 0 2px",
                    }}
                  >
                    {q.question}
                  </p>
                  <p style={{ fontSize: "13px", color: "#0f172a", margin: 0 }}>
                    {application.screeningAnswers[q.id]}
                  </p>
                </div>
              ))}
            </div>
          )}
      </Section>

      {/* Status update */}
      {!isTerminal && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "16px",
            padding: "1.25rem",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 10px",
            }}
          >
            Update Status
          </p>
          {!showStatusForm ? (
            <button
              onClick={() => {
                setShowStatusForm(true);
                setStatus(application.status);
              }}
              style={{
                height: "38px",
                padding: "0 18px",
                border: "none",
                borderRadius: "10px",
                background: "#1d4ed8",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Change Status
            </button>
          ) : (
            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "0 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  marginBottom: "10px",
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {getApplicationStatusLabel(s)}
                  </option>
                ))}
              </select>

              {status === "INTERVIEW_SCHEDULED" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    style={{
                      height: "38px",
                      padding: "0 10px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "9px",
                      fontSize: "12.5px",
                    }}
                  />
                  <input
                    value={interviewMode}
                    onChange={(e) => setInterviewMode(e.target.value)}
                    placeholder="Online / In-person"
                    style={{
                      height: "38px",
                      padding: "0 10px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "9px",
                      fontSize: "12.5px",
                    }}
                  />
                  <input
                    value={interviewLink}
                    onChange={(e) => setInterviewLink(e.target.value)}
                    placeholder="Meeting link"
                    style={{
                      height: "38px",
                      padding: "0 10px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "9px",
                      fontSize: "12.5px",
                      gridColumn: "1 / -1",
                    }}
                  />
                </div>
              )}

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for the applicant (optional)"
                style={{
                  width: "100%",
                  minHeight: "70px",
                  padding: "10px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "9px",
                  fontSize: "13px",
                  resize: "vertical",
                  marginBottom: "10px",
                }}
              />

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleStatusUpdate}
                  disabled={saving}
                  style={{
                    height: "36px",
                    padding: "0 18px",
                    border: "none",
                    borderRadius: "9px",
                    background: "#1d4ed8",
                    color: "#fff",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => setShowStatusForm(false)}
                  style={{
                    height: "36px",
                    padding: "0 14px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "9px",
                    background: "#fff",
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
    </div>
  );
}
