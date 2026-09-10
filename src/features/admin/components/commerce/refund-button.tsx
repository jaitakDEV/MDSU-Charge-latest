"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RefundButton({
  orderId,
  paymentId,
  amount,
}: {
  orderId: string;
  paymentId: string;
  amount: number;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function initiate() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/refunds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentId, amount }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) {
      setError(json.error);
      return;
    }
    router.refresh();
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        style={{
          height: "28px",
          padding: "0 10px",
          border: "1px solid #fecaca",
          borderRadius: "7px",
          background: "#fef2f2",
          color: "#dc2626",
          fontSize: "11.5px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Refund
      </button>
    );
  }

  return (
    <div>
      <p
        style={{
          fontSize: "11px",
          color: "#dc2626",
          margin: "0 0 4px",
          fontWeight: 600,
        }}
      >
        Refund ₹{(amount / 100).toLocaleString("en-IN")}?
      </p>
      {error && (
        <p style={{ fontSize: "11px", color: "#dc2626", margin: "0 0 4px" }}>
          {error}
        </p>
      )}
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={initiate}
          disabled={loading}
          style={{
            height: "26px",
            padding: "0 10px",
            border: "none",
            borderRadius: "6px",
            background: "#dc2626",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          style={{
            height: "26px",
            padding: "0 8px",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            background: "#fff",
            fontSize: "11px",
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
