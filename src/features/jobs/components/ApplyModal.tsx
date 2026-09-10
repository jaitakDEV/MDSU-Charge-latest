"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ScreeningQuestion = {
  id: string;
  question: string;
  type: "TEXT" | "YES_NO" | "MCQ" | "NUMBER";
  options: string[];
  isRequired: boolean;
};

export function ApplyModal({
  jobId,
  jobTitle,
  companyName,
  resumeUrl,
  screeningQuestions = [],
  onClose,
}: {
  jobId: string;
  jobTitle: string;
  companyName: string;
  resumeUrl: string;
  screeningQuestions?: ScreeningQuestion[];
  onClose: () => void;
}) {
  const router = useRouter();

  const [coverLetter, setCoverLetter] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [useAltResume, setUseAltResume] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function updateAnswer(questionId: string, value: string) {
    setAnswers((p) => ({ ...p, [questionId]: value }));
    setError("");
  }

  function validate(): string | null {
    const missing = screeningQuestions.filter(
      (q) => q.isRequired && !answers[q.id]?.trim(),
    );
    if (missing.length > 0) return `Please answer: "${missing[0].question}"`;
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coverLetter: coverLetter || undefined,
        expectedSalary: expectedSalary ? Number(expectedSalary) : undefined,
        noticePeriod: noticePeriod ? Number(noticePeriod) : undefined,
        availableFrom: availableFrom
          ? new Date(availableFrom).toISOString()
          : undefined,
        portfolioUrl: portfolioUrl || undefined,
        screeningAnswers: Object.keys(answers).length > 0 ? answers : undefined,
      }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!json.success) {
      setError(json.error ?? "Failed to submit application.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onClose();
      router.refresh();
    }, 1800);
  }

  const inp: React.CSSProperties = {
    width: "100%",
    height: "40px",
    padding: "0 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "13.5px",
    outline: "none",
  };

  if (success) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(15,23,42,0.55)",
          backdropFilter: "blur(3px)",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "2.5rem",
            textAlign: "center",
            maxWidth: "360px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "#f0fdf4",
              border: "2px solid #86efac",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "24px",
            }}
          >
            ✓
          </div>
          <p
            style={{
              fontSize: "17px",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            Application Submitted!
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            Good luck with your application to {companyName}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(15,23,42,0.55)",
          backdropFilter: "blur(3px)",
        }}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          pointerEvents: "none",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "88vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            pointerEvents: "auto",
            fontFamily: "'Inter', -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              height: "4px",
              background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
              flexShrink: 0,
            }}
          />

          {/* Header */}
          <div
            style={{
              padding: "1.5rem 1.5rem 1rem",
              borderBottom: "1px solid #f1f5f9",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "17px",
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: "0 0 4px",
                    letterSpacing: "-0.3px",
                  }}
                >
                  Apply to {jobTitle}
                </p>
                <p style={{ fontSize: "12.5px", color: "#64748b", margin: 0 }}>
                  {companyName}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#64748b",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div
            style={{ padding: "1.25rem 1.5rem", overflowY: "auto", flex: 1 }}
          >
            {/* Resume preview */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "12px",
                marginBottom: "1.25rem",
              }}
            >
              <span style={{ fontSize: "20px" }}>📄</span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#166534",
                    margin: "0 0 2px",
                  }}
                >
                  Resume attached
                </p>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "11.5px",
                    color: "#16a34a",
                    fontWeight: 600,
                  }}
                >
                  Preview resume →
                </a>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
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
                  Cover Letter{" "}
                  <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell them why you're a great fit..."
                  style={{
                    width: "100%",
                    minHeight: "90px",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "13.5px",
                    resize: "vertical",
                  }}
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
                    Expected Salary{" "}
                    <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                      (₹/mo)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="35000"
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
                    Notice Period{" "}
                    <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                      (days)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    placeholder="30"
                    style={inp}
                  />
                </div>
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
                  Available From
                </label>
                <input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  style={{ ...inp, width: "200px" }}
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
                  Portfolio URL{" "}
                  <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                    (optional)
                  </span>
                </label>
                <input
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  style={inp}
                />
              </div>

              {/* Screening questions */}
              {screeningQuestions.length > 0 && (
                <div
                  style={{ paddingTop: "6px", borderTop: "1px solid #f1f5f9" }}
                >
                  <p
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "10px 0",
                    }}
                  >
                    Screening Questions
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {screeningQuestions.map((q) => (
                      <div key={q.id}>
                        <label
                          style={{
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: "#374151",
                            display: "flex",
                            gap: "4px",
                            marginBottom: "5px",
                          }}
                        >
                          {q.question}
                          {q.isRequired && (
                            <span style={{ color: "#ef4444" }}>*</span>
                          )}
                        </label>

                        {q.type === "TEXT" && (
                          <input
                            value={answers[q.id] ?? ""}
                            onChange={(e) => updateAnswer(q.id, e.target.value)}
                            style={inp}
                          />
                        )}

                        {q.type === "NUMBER" && (
                          <input
                            type="number"
                            value={answers[q.id] ?? ""}
                            onChange={(e) => updateAnswer(q.id, e.target.value)}
                            style={inp}
                          />
                        )}

                        {q.type === "YES_NO" && (
                          <div style={{ display: "flex", gap: "8px" }}>
                            {["Yes", "No"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => updateAnswer(q.id, opt)}
                                style={{
                                  flex: 1,
                                  height: "36px",
                                  border: `1.5px solid ${answers[q.id] === opt ? "#1d4ed8" : "#e2e8f0"}`,
                                  borderRadius: "9px",
                                  background:
                                    answers[q.id] === opt ? "#eff6ff" : "#fff",
                                  color:
                                    answers[q.id] === opt
                                      ? "#1d4ed8"
                                      : "#64748b",
                                  fontSize: "12.5px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {q.type === "MCQ" && (
                          <select
                            value={answers[q.id] ?? ""}
                            onChange={(e) => updateAnswer(q.id, e.target.value)}
                            style={inp}
                          >
                            <option value="">Select an option</option>
                            {q.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "10px 12px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  fontSize: "12.5px",
                  color: "#dc2626",
                }}
              >
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid #f1f5f9",
              background: "#fafafa",
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              flexShrink: 0,
            }}
          >
            <button
              onClick={onClose}
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
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                height: "40px",
                padding: "0 22px",
                border: "none",
                borderRadius: "10px",
                background: submitting
                  ? "#93c5fd"
                  : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
