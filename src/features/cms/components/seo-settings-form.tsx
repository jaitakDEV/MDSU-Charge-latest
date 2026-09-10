"use client";

import { useState } from "react";
import { UploadField } from "@/features/cms/components/upload-field";

type SeoData = {
  siteTitleSuffix: string;
  metaDescription: string;
  ogImage: string | null;
  googleAnalyticsId: string | null;
  searchConsoleVerify: string | null;
  robotsIndex: boolean;
};

export function SeoSettingsForm({ initial }: { initial: SeoData }) {
  const [form, setForm] = useState<SeoData>(initial);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof SeoData>(key: K, value: SeoData[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setSuccess(false);
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/cms/seo", {
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
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

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

  const fieldsetStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e8edf2",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  };

  const sectionTitle = (text: string, desc?: string) => (
    <div style={{ marginBottom: "1.1rem" }}>
      <p
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 3px",
          letterSpacing: "-0.2px",
        }}
      >
        {text}
      </p>
      {desc && (
        <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{desc}</p>
      )}
    </div>
  );

  const field = (label: string, children: React.ReactNode, hint?: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151" }}>
        {label}
      </label>
      {children}
      {hint && (
        <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>{hint}</span>
      )}
    </div>
  );

  return (
    <div>
      {/* ── Site Identity ── */}
      <div style={fieldsetStyle}>
        {sectionTitle(
          "Site Identity",
          "Shown in browser tab and search results",
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {field(
            "Site Title Suffix",
            <input
              value={form.siteTitleSuffix}
              onChange={(e) => update("siteTitleSuffix", e.target.value)}
              placeholder="— MDSSC"
              style={inp}
            />,
            `Page titles will appear as: "Course Name ${form.siteTitleSuffix}"`,
          )}
          {field(
            "Default Meta Description",
            <textarea
              value={form.metaDescription}
              onChange={(e) =>
                update("metaDescription", e.target.value.slice(0, 160))
              }
              placeholder="Used when a page has no custom description"
              style={{
                ...inp,
                height: "80px",
                padding: "10px 12px",
                resize: "vertical",
              }}
            />,
            `${form.metaDescription.length}/160 characters`,
          )}
        </div>
      </div>

      {/* ── Open Graph ── */}
      <div style={fieldsetStyle}>
        {sectionTitle(
          "Open Graph / Social Sharing",
          "Default image shown when pages are shared on WhatsApp, Twitter, Facebook",
        )}
        <UploadField
          label="Default OG Image"
          hint="Recommended: 1200×630px — used when page has no specific image"
          endpoint="bannerImageUploader"
          fileType="image"
          currentUrl={form.ogImage ?? ""}
          onUploadComplete={(url) => update("ogImage", url || null)}
        />

        {/* Preview */}
        {form.ogImage && (
          <div
            style={{
              marginTop: "1rem",
              padding: "12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 8px",
              }}
            >
              Preview — WhatsApp / Social Share
            </p>
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                overflow: "hidden",
                maxWidth: "360px",
              }}
            >
              <img
                src={form.ogImage}
                alt="OG preview"
                style={{
                  width: "100%",
                  aspectRatio: "1200/630",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div style={{ padding: "8px 10px", background: "#fff" }}>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    margin: "0 0 2px",
                  }}
                >
                  mdsu-charge.in
                </p>
                <p
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  MDSSC {form.siteTitleSuffix}
                </p>
                <p
                  style={{
                    fontSize: "11.5px",
                    color: "#64748b",
                    margin: "2px 0 0",
                  }}
                >
                  {form.metaDescription.slice(0, 80) || "No description set"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Google ── */}
      <div style={fieldsetStyle}>
        {sectionTitle("Google Integration", "Analytics and Search Console")}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {field(
            "Google Analytics 4 — Measurement ID",
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "12px",
                  color: "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                G-
              </span>
              <input
                value={(form.googleAnalyticsId ?? "").replace(/^G-/, "")}
                onChange={(e) =>
                  update(
                    "googleAnalyticsId",
                    e.target.value ? `G-${e.target.value}` : null,
                  )
                }
                placeholder="XXXXXXXXXX"
                style={{ ...inp, paddingLeft: "32px", fontFamily: "monospace" }}
              />
            </div>,
            "Find in Google Analytics → Admin → Data Streams → Measurement ID",
          )}
          {field(
            "Search Console Verification Tag",
            <input
              value={form.searchConsoleVerify ?? ""}
              onChange={(e) =>
                update("searchConsoleVerify", e.target.value || null)
              }
              placeholder="google-site-verification=xxxxxxxx"
              style={{ ...inp, fontFamily: "monospace", fontSize: "12.5px" }}
            />,
            "From Google Search Console → Verify → HTML tag method → content attribute value",
          )}
        </div>
      </div>

      {/* ── Indexing ── */}
      <div style={fieldsetStyle}>
        {sectionTitle(
          "Search Engine Indexing",
          "Control whether search engines index your site",
        )}
        <div
          onClick={() => update("robotsIndex", !form.robotsIndex)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            padding: "12px 14px",
            background: "#f8fafc",
            border: `1.5px solid ${form.robotsIndex ? "#bbf7d0" : "#fecaca"}`,
            borderRadius: "12px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "13.5px",
                fontWeight: 600,
                color: "#0f172a",
                margin: "0 0 2px",
              }}
            >
              {form.robotsIndex ? "✓ Indexing Enabled" : "✕ Indexing Disabled"}
            </p>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
              {form.robotsIndex
                ? "Search engines can index this site — production mode"
                : "noindex, nofollow — use during development only"}
            </p>
          </div>
          {/* Toggle */}
          <div
            style={{
              width: "44px",
              height: "24px",
              borderRadius: "12px",
              background: form.robotsIndex ? "#16a34a" : "#e2e8f0",
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "3px",
                left: form.robotsIndex ? "23px" : "3px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                transition: "left 0.2s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Error / Success */}
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
          ✓ SEO settings saved successfully.
        </div>
      )}

      {/* Save */}
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
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 2px 6px rgba(29,78,216,0.25)",
          }}
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
