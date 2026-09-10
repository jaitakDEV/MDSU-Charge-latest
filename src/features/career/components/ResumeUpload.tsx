"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/server/uploadthing";

const UploadButton = generateUploadButton<OurFileRouter>();

export function ResumeUpload({
  currentUrl,
  updatedAt,
}: {
  currentUrl: string | null;
  updatedAt: Date | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveResume(url: string, key: string) {
    setSaving(true);
    const res = await fetch("/api/career/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, key }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.success) {
      setError(json.error);
      return;
    }
    router.refresh();
  }

  async function removeResume() {
    if (
      !confirm(
        "Remove your resume? You won't be able to apply until you upload a new one.",
      )
    )
      return;
    await fetch("/api/career/resume", { method: "DELETE" });
    router.refresh();
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
      {currentUrl ? (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "12px",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "24px" }}>📄</span>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#166534",
                  margin: "0 0 2px",
                }}
              >
                Resume uploaded
              </p>
              <p style={{ fontSize: "11.5px", color: "#16a34a", margin: 0 }}>
                {updatedAt
                  ? `Updated ${new Date(updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                  : ""}
              </p>
            </div>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "12px",
                color: "#1d4ed8",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Preview
            </a>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <UploadButton
              endpoint="resumeUploader"
              onClientUploadComplete={(res) => {
                if (res[0]) saveResume(res[0].ufsUrl, res[0].key);
              }}
              onUploadError={(err) => setError(err.message)}
              content={{ button: saving ? "Saving…" : "Replace Resume" }}
              appearance={{
                button: {
                  height: "40px",
                  padding: "0 18px",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  border: "1px solid #bfdbfe",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                },
              }}
            />
            <button
              onClick={removeResume}
              style={{
                height: "40px",
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
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "2rem 1rem",
            border: "2px dashed #bfdbfe",
            borderRadius: "14px",
            background: "#f8fbff",
          }}
        >
          <p style={{ fontSize: "32px", margin: "0 0 10px" }}>📄</p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
            }}
          >
            No resume uploaded
          </p>
          <p
            style={{ fontSize: "12.5px", color: "#64748b", margin: "0 0 16px" }}
          >
            You need a resume to apply for jobs
          </p>
          <UploadButton
            endpoint="resumeUploader"
            onClientUploadComplete={(res) => {
              if (res[0]) saveResume(res[0].ufsUrl, res[0].key);
            }}
            onUploadError={(err) => setError(err.message)}
            content={{ button: saving ? "Saving…" : "Upload Resume" }}
            appearance={{
              button: {
                height: "42px",
                padding: "0 22px",
                background: "#1d4ed8",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
              },
            }}
          />
        </div>
      )}
      {error && (
        <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
