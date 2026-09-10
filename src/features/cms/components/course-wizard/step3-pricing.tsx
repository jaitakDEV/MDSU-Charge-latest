"use client";

import type { WizardData } from "./course-wizard";
import { Field, inputStyle } from "./step1-basic-info";
import { ACCESS_DURATION_LABELS } from "@/lib/access-utils";
import { getCheckoutExpiryPreview } from "@/lib/access-utils";
import type { AccessDuration } from "@prisma/client";

const DURATION_OPTIONS: {
  value: AccessDuration;
  label: string;
  desc: string;
}[] = [
  { value: "FIFTEEN_DAYS", label: "15 Days", desc: "Trial / crash courses" },
  { value: "ONE_MONTH", label: "1 Month", desc: "Short topic sprints" },
  { value: "THREE_MONTHS", label: "3 Months", desc: "Standard — most common" },
  { value: "SIX_MONTHS", label: "6 Months", desc: "Medium-length courses" },
  { value: "ONE_YEAR", label: "1 Year", desc: "Comprehensive courses" },
  { value: "LIFETIME", label: "Lifetime", desc: "No expiry — premium" },
];

export function Step3Pricing({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const priceRupees = data.price / 100;
  const mrpRupees = data.mrp / 100;

  const expiryPreview = data.accessDuration
    ? getCheckoutExpiryPreview(data.accessDuration as AccessDuration)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h2
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#0f172a",
          margin: 0,
          letterSpacing: "-0.3px",
        }}
      >
        Pricing & Access Duration
      </h2>

      {/* Price */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <Field label="Course Price (₹)" hint="Set 0 for a free course">
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "13.5px",
                color: "#64748b",
                fontWeight: 600,
              }}
            >
              ₹
            </span>
            <input
              type="number"
              min={0}
              value={priceRupees || ""}
              onChange={(e) =>
                update({ price: Math.round(Number(e.target.value) * 100) })
              }
              placeholder="499"
              style={{ ...inputStyle, paddingLeft: "28px" }}
            />
          </div>
        </Field>

        <Field
          label="Original Price / MRP (₹)"
          hint="Shown as strikethrough — leave 0 if no discount"
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "13.5px",
                color: "#64748b",
                fontWeight: 600,
              }}
            >
              ₹
            </span>
            <input
              type="number"
              min={0}
              value={mrpRupees || ""}
              onChange={(e) =>
                update({ mrp: Math.round(Number(e.target.value) * 100) })
              }
              placeholder="999"
              style={{ ...inputStyle, paddingLeft: "28px" }}
            />
          </div>
        </Field>
      </div>

      {/* Price preview */}
      {data.price > 0 && (
        <div
          style={{
            padding: "10px 14px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#475569",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "16px", color: "#0f172a" }}>
            ₹{(data.price / 100).toLocaleString("en-IN")}
          </span>
          {data.mrp > data.price && (
            <>
              <span
                style={{ textDecoration: "line-through", color: "#94a3b8" }}
              >
                ₹{(data.mrp / 100).toLocaleString("en-IN")}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  background: "#dcfce7",
                  color: "#16a34a",
                  borderRadius: "20px",
                }}
              >
                {Math.round(((data.mrp - data.price) / data.mrp) * 100)}% OFF
              </span>
            </>
          )}
          {data.price === 0 && (
            <span style={{ color: "#16a34a", fontWeight: 700 }}>FREE</span>
          )}
        </div>
      )}

      {/* Access Duration — V3 key field */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <label
            style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151" }}
          >
            Course Access Duration <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <span
            style={{
              fontSize: "10.5px",
              padding: "2px 8px",
              background: "#fef3c7",
              color: "#92400e",
              borderRadius: "20px",
              fontWeight: 600,
              border: "1px solid #fde68a",
            }}
          >
            Required
          </span>
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "#64748b",
            marginBottom: "12px",
            lineHeight: 1.6,
          }}
        >
          Students will have access from their purchase date for the selected
          duration.
          <strong style={{ color: "#0f172a" }}> Lifetime = no expiry.</strong>
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          {DURATION_OPTIONS.map((opt) => {
            const isSelected = data.accessDuration === opt.value;
            const isLifetime = opt.value === "LIFETIME";
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ accessDuration: opt.value })}
                style={{
                  padding: "12px 14px",
                  border: isSelected
                    ? isLifetime
                      ? "2px solid #f59e0b"
                      : "2px solid #1d4ed8"
                    : "1.5px solid #e2e8f0",
                  borderRadius: "12px",
                  background: isSelected
                    ? isLifetime
                      ? "#fffbeb"
                      : "#eff6ff"
                    : "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.14s ease",
                  position: "relative",
                  boxShadow: isSelected
                    ? "0 2px 8px rgba(29,78,216,0.1)"
                    : "none",
                }}
              >
                {/* Selected checkmark */}
                {isSelected && (
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "10px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: isLifetime ? "#f59e0b" : "#1d4ed8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
                <p
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: isSelected
                      ? isLifetime
                        ? "#92400e"
                        : "#1d4ed8"
                      : "#0f172a",
                    margin: "0 0 3px",
                    letterSpacing: "-0.2px",
                  }}
                >
                  {isLifetime ? "∞ " : ""}
                  {opt.label}
                </p>
                <p
                  style={{
                    fontSize: "11.5px",
                    color: isSelected
                      ? isLifetime
                        ? "#b45309"
                        : "#3b82f6"
                      : "#94a3b8",
                    margin: 0,
                  }}
                >
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Expiry preview */}
        {data.accessDuration && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              background:
                data.accessDuration === "LIFETIME" ? "#fffbeb" : "#f0fdf4",
              border: `1px solid ${data.accessDuration === "LIFETIME" ? "#fde68a" : "#bbf7d0"}`,
              borderRadius: "10px",
              fontSize: "12.5px",
              color: data.accessDuration === "LIFETIME" ? "#92400e" : "#166534",
            }}
          >
            <strong>Example:</strong> If a student purchases today access{" "}
            {data.accessDuration === "LIFETIME"
              ? "never expires (Lifetime Access)"
              : `valid until ${expiryPreview}`}
          </div>
        )}
      </div>
    </div>
  );
}
