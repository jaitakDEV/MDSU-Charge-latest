"use client";

import { useState } from "react";

export function GuestRegistrationForm({
  onSubmit,
  onCancel,
  submitLabel,
  loading,
}: {
  onSubmit: (data: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
  }) => void;
  onCancel: () => void;
  submitLabel: string;
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Enter a valid phone number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      guestName: name.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim(),
    });
  }

  const inp = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    height: "42px",
    padding: "0 12px",
    border: `1.5px solid ${hasError ? "#fecaca" : "#e2e8f0"}`,
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(15,23,42,0.55)",
          backdropFilter: "blur(3px)",
        }}
      />

      {/* Modal */}
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
            borderRadius: "18px",
            width: "100%",
            maxWidth: "420px",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            pointerEvents: "auto",
            fontFamily: "'Inter', -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              height: "4px",
              background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
            }}
          />

          <div style={{ padding: "1.5rem" }}>
            <p
              style={{
                fontSize: "17px",
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 4px",
                letterSpacing: "-0.4px",
              }}
            >
              Register for Event
            </p>
            <p
              style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px" }}
            >
              No account needed — just fill in your details
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
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
                  Full Name *
                </label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((p) => ({ ...p, name: "" }));
                  }}
                  placeholder="Your full name"
                  style={inp(!!errors.name)}
                />
                {errors.name && (
                  <p
                    style={{
                      fontSize: "11.5px",
                      color: "#dc2626",
                      margin: "4px 0 0",
                    }}
                  >
                    {errors.name}
                  </p>
                )}
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
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="you@example.com"
                  style={inp(!!errors.email)}
                />
                {errors.email && (
                  <p
                    style={{
                      fontSize: "11.5px",
                      color: "#dc2626",
                      margin: "4px 0 0",
                    }}
                  >
                    {errors.email}
                  </p>
                )}
                <p
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    margin: "4px 0 0",
                  }}
                >
                  Your ticket and confirmation will be sent here
                </p>
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
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((p) => ({ ...p, phone: "" }));
                  }}
                  placeholder="+91 98765 43210"
                  style={inp(!!errors.phone)}
                />
                {errors.phone && (
                  <p
                    style={{
                      fontSize: "11.5px",
                      color: "#dc2626",
                      margin: "4px 0 0",
                    }}
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "1rem 1.5rem 1.5rem",
              display: "flex",
              gap: "8px",
              borderTop: "1px solid #f1f5f9",
              background: "#fafafa",
            }}
          >
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                height: "44px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                background: "#fff",
                fontSize: "13.5px",
                fontWeight: 600,
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 2,
                height: "44px",
                border: "none",
                borderRadius: "10px",
                background: loading
                  ? "#93c5fd"
                  : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                color: "#fff",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(29,78,216,0.3)",
              }}
            >
              {loading ? "Processing…" : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
