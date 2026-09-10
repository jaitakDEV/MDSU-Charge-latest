"use client";

import { useState } from "react";

type Coupon = {
  id: string;
  code: string;
  discountType: "PERCENT" | "FLAT";
  discountValue: number;
  validFrom: Date;
  validUntil: Date | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  minOrderValue: number;
  course: { title: string } | null;
};

export function CouponManager({
  initialCoupons,
}: {
  initialCoupons: Coupon[];
}) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENT" as "PERCENT" | "FLAT",
    discountValue: "",
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: "",
    maxUses: "",
    minOrderValue: "0",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function add() {
    if (!form.code || !form.discountValue) {
      setError("Code and discount value are required.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code.toUpperCase().trim(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        validFrom: new Date(form.validFrom).toISOString(),
        validUntil: form.validUntil
          ? new Date(form.validUntil).toISOString()
          : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        minOrderValue: Math.round(Number(form.minOrderValue) * 100),
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.success) {
      setError(json.error);
      return;
    }
    setCoupons([json.data, ...coupons]);
    setShowForm(false);
    setForm({
      code: "",
      discountType: "PERCENT",
      discountValue: "",
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: "",
      maxUses: "",
      minOrderValue: "0",
    });
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setCoupons(coupons.map((c) => (c.id === id ? { ...c, isActive } : c)));
  }

  const inp: React.CSSProperties = {
    height: "38px",
    padding: "0 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
    fontSize: "13px",
    width: "100%",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => setShowForm(!showForm)}
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
          {showForm ? "Cancel" : "+ New Coupon"}
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "#f8fbff",
            border: "1.5px solid #bfdbfe",
            borderRadius: "14px",
            padding: "1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Code *
              </label>
              <input
                placeholder="SAVE20"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                style={inp}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Type
              </label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discountType: e.target.value as "PERCENT" | "FLAT",
                  })
                }
                style={inp}
              >
                <option value="PERCENT">Percent (%)</option>
                <option value="FLAT">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Value *
              </label>
              <input
                type="number"
                placeholder={form.discountType === "PERCENT" ? "20" : "100"}
                value={form.discountValue}
                onChange={(e) =>
                  setForm({ ...form, discountValue: e.target.value })
                }
                style={inp}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Min Order (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                value={form.minOrderValue}
                onChange={(e) =>
                  setForm({ ...form, minOrderValue: e.target.value })
                }
                style={inp}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Valid From *
              </label>
              <input
                type="date"
                value={form.validFrom}
                onChange={(e) =>
                  setForm({ ...form, validFrom: e.target.value })
                }
                style={inp}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Valid Until
              </label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) =>
                  setForm({ ...form, validUntil: e.target.value })
                }
                style={inp}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Max Uses
              </label>
              <input
                type="number"
                placeholder="Unlimited"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                style={inp}
              />
            </div>
          </div>
          {error && (
            <p style={{ fontSize: "12px", color: "#dc2626", margin: 0 }}>
              {error}
            </p>
          )}
          <button
            onClick={add}
            disabled={saving}
            style={{
              height: "38px",
              border: "none",
              borderRadius: "9px",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              alignSelf: "flex-end",
              padding: "0 20px",
            }}
          >
            {saving ? "Creating…" : "Create Coupon"}
          </button>
        </div>
      )}

      {/* Coupons list */}
      {coupons.map((c) => {
        const isExpired = c.validUntil && new Date(c.validUntil) < new Date();
        const usageStr = c.maxUses
          ? `${c.usedCount}/${c.maxUses}`
          : `${c.usedCount} used`;
        return (
          <div
            key={c.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "#fff",
              border: "1px solid #e8edf2",
              borderRadius: "12px",
              padding: "12px 14px",
              marginBottom: "8px",
              opacity: !c.isActive || isExpired ? 0.6 : 1,
            }}
          >
            <code
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#1d4ed8",
                background: "#eff6ff",
                padding: "3px 10px",
                borderRadius: "7px",
                flexShrink: 0,
              }}
            >
              {c.code}
            </code>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {c.discountType === "PERCENT"
                    ? `${c.discountValue}% off`
                    : `₹${(c.discountValue / 100).toLocaleString("en-IN")} off`}
                </span>
                {c.course && (
                  <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                    · {c.course.title}
                  </span>
                )}
                {isExpired && (
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      color: "#991b1b",
                      background: "#fef2f2",
                      padding: "1px 6px",
                      borderRadius: "6px",
                    }}
                  >
                    Expired
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: "11.5px",
                  color: "#94a3b8",
                  margin: "2px 0 0",
                }}
              >
                {usageStr} · valid until{" "}
                {c.validUntil
                  ? new Date(c.validUntil).toLocaleDateString("en-IN")
                  : "no expiry"}
              </p>
            </div>
            <button
              onClick={() => toggle(c.id, !c.isActive)}
              style={{
                fontSize: "11px",
                padding: "4px 10px",
                borderRadius: "20px",
                border: "none",
                background: c.isActive ? "#f0fdf4" : "#f1f5f9",
                color: c.isActive ? "#16a34a" : "#94a3b8",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {c.isActive ? "Active" : "Inactive"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
