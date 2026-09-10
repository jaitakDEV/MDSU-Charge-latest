"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addCollegeAction } from "@/features/admin/actions/college-actions";
import { toast } from "sonner";

export function AddCollegeModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", city: "", state: "" });
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      firstInputRef.current?.focus();
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function onBackdropClick(e: React.MouseEvent) {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  }

  function handleClose() {
    if (loading) return;
    setOpen(false);
    setError("");
    setForm({ name: "", city: "", state: "" });
  }

  async function handleSubmit() {
    setError("");
    if (!form.name.trim() || !form.city.trim() || !form.state.trim()) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    const result = await addCollegeAction(form);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }

    toast.success("College added successfully.");
    handleClose();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          fontSize: "13px",
          padding: "8px 18px",
          border: "none",
          borderRadius: "9px",
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 600,
          boxShadow: "0 1px 3px rgba(29,78,216,0.3)",
          letterSpacing: "-0.1px",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add College
      </button>

      {open && (
        <div
          onClick={onBackdropClick}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15,23,42,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            ref={modalRef}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "460px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
              overflow: "hidden",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "9px",
                    background:
                      "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                    border: "1px solid #bfdbfe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1d4ed8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#0f172a",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Add College
                  </p>
                  <p
                    style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}
                  >
                    Add a new college to the platform
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
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
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              {/* Error */}
              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "9px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    marginBottom: "1.25rem",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12.5px",
                      color: "#dc2626",
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </p>
                </div>
              )}

              {[
                {
                  key: "name",
                  label: "College Name",
                  placeholder: "e.g. Government College Ajmer",
                  ref: firstInputRef,
                },
                {
                  key: "city",
                  label: "City",
                  placeholder: "e.g. Ajmer",
                  ref: undefined,
                },
                {
                  key: "state",
                  label: "State",
                  placeholder: "e.g. Rajasthan",
                  ref: undefined,
                },
              ].map((field) => (
                <div key={field.key} style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#475569",
                      marginBottom: "6px",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {field.label} <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    ref={field.ref}
                    type="text"
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    style={{
                      width: "100%",
                      fontSize: "13.5px",
                      padding: "9px 12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "9px",
                      outline: "none",
                      color: "#0f172a",
                      background: loading ? "#f8fafc" : "#fff",
                      boxSizing: "border-box",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                padding: "1rem 1.5rem",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <button
                onClick={handleClose}
                disabled={loading}
                style={{
                  fontSize: "13px",
                  padding: "8px 18px",
                  borderRadius: "9px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "#64748b",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  fontSize: "13px",
                  padding: "8px 20px",
                  borderRadius: "9px",
                  border: "none",
                  background: loading
                    ? "#93c5fd"
                    : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                  color: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  boxShadow: "0 1px 3px rgba(29,78,216,0.3)",
                }}
              >
                {loading && (
                  <div
                    style={{
                      width: "13px",
                      height: "13px",
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTop: "2px solid #fff",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                )}
                {loading ? "Adding..." : "Add College"}
              </button>
            </div>
          </div>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </>
  );
}
