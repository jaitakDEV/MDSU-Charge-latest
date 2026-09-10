"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";
import { ACCESS_DURATION_LABELS } from "@/lib/access-utils";
import type { AccessDuration } from "@prisma/client";

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
};

type RazorpayInstance = { open: () => void };
type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type CouponResult = {
  couponId: string;
  code: string;
  discountAmount: number;
  finalPrice: number;
  discountAmountFormatted: string;
  finalPriceFormatted: string;
};

export function CheckoutClient({
  courseId,
  courseSlug,
  originalPrice,
  mrp,
  discountPct,
  accessDuration,
  expiryPreview,
  studentName,
  studentEmail,
}: {
  courseId: string;
  courseSlug: string;
  originalPrice: number;
  mrp: number;
  discountPct: number;
  accessDuration: string;
  expiryPreview: string;
  studentName: string;
  studentEmail: string;
}) {
  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState("");
  const [validating, setValidating] = useState(false);

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const finalPrice = coupon ? coupon.finalPrice : originalPrice;

  // ── Load Razorpay script ──────────────────────────────────
  function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // ── Apply coupon ──────────────────────────────────────────
  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setValidating(true);
    setCouponError("");
    setCoupon(null);

    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode.trim(), courseId }),
    });
    const json = await res.json();
    setValidating(false);

    if (!json.success) {
      setCouponError(json.error ?? "Invalid coupon.");
      return;
    }
    setCoupon(json.data);
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

  // ── Initiate payment ──────────────────────────────────────
  const handlePay = useCallback(async () => {
    setPaying(true);
    setPayError("");

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setPayError(
        "Failed to load payment gateway. Check your internet connection.",
      );
      setPaying(false);
      return;
    }

    // Create Razorpay order server-side
    const orderRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, couponCode: coupon?.code }),
    });
    const orderJson = await orderRes.json();

    if (!orderJson.success) {
      setPayError(orderJson.error ?? "Could not create order.");
      setPaying(false);
      return;
    }

    const { razorpayOrderId, amount } = orderJson.data;

    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      amount,
      currency: "INR",
      order_id: razorpayOrderId,
      name: "MDSSU Charge",
      description: `Enrolment — ${courseId}`,
      prefill: { name: studentName, email: studentEmail },
      theme: { color: "#1d4ed8" },

      handler: async (response: RazorpayResponse) => {
        // Verify payment server-side
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });
        const verifyJson = await verifyRes.json();

        if (!verifyJson.success) {
          setPayError("Payment verification failed. Contact support.");
          setPaying(false);
          return;
        }

        // Redirect to success page
        router.push(ROUTES.courseSuccess(courseSlug));
      },

      modal: {
        ondismiss: () => {
          setPaying(false);
          setPayError("Payment was cancelled.");
        },
      },
    });

    rzp.open();
  }, [courseId, courseSlug, coupon, studentName, studentEmail, router]);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8edf2",
        borderRadius: "18px",
        padding: "1.5rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
      }}
    >
      <p
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 1.25rem",
        }}
      >
        Payment Summary
      </p>

      {/* Price breakdown */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
          }}
        >
          <span style={{ color: "#64748b" }}>Course price</span>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>
              ₹{(originalPrice / 100).toLocaleString("en-IN")}
            </span>
            {mrp > originalPrice && (
              <span
                style={{
                  fontSize: "11.5px",
                  color: "#94a3b8",
                  textDecoration: "line-through",
                  marginLeft: "6px",
                }}
              >
                ₹{(mrp / 100).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {discountPct > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12.5px",
            }}
          >
            <span style={{ color: "#16a34a" }}>Course discount</span>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>
              -{discountPct}%
            </span>
          </div>
        )}

        {coupon && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12.5px",
            }}
          >
            <span style={{ color: "#16a34a" }}>Coupon ({coupon.code})</span>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>
              -{coupon.discountAmountFormatted}
            </span>
          </div>
        )}

        <div style={{ height: "1px", background: "#f1f5f9" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "16px",
            fontWeight: 800,
          }}
        >
          <span style={{ color: "#0f172a" }}>Total</span>
          <span style={{ color: "#0f172a" }}>
            ₹{(finalPrice / 100).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Access expiry reminder */}
      <div
        style={{
          padding: "9px 12px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          marginBottom: "1.25rem",
        }}
      >
        <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>
          <strong>Access:</strong>{" "}
          {accessDuration === "LIFETIME"
            ? "Lifetime — never expires"
            : `Valid until ${expiryPreview}`}
        </p>
      </div>

      {/* Coupon input */}
      {!coupon ? (
        <div style={{ marginBottom: "1.25rem" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              margin: "0 0 6px",
            }}
          >
            Have a coupon?
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setCouponError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
              placeholder="Enter code"
              disabled={validating}
              style={{
                flex: 1,
                height: "36px",
                padding: "0 10px",
                border: `1px solid ${couponError ? "#fecaca" : "#e2e8f0"}`,
                borderRadius: "9px",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            />
            <button
              onClick={applyCoupon}
              disabled={validating || !couponCode.trim()}
              style={{
                height: "36px",
                padding: "0 14px",
                border: "none",
                borderRadius: "9px",
                background: validating ? "#93c5fd" : "#1d4ed8",
                color: "#fff",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {validating ? "…" : "Apply"}
            </button>
          </div>
          {couponError && (
            <p
              style={{
                fontSize: "11.5px",
                color: "#dc2626",
                margin: "5px 0 0",
              }}
            >
              {couponError}
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            marginBottom: "1.25rem",
            padding: "10px 12px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#166534",
                margin: "0 0 2px",
              }}
            >
              Coupon applied: {coupon.code}
            </p>
            <p style={{ fontSize: "11.5px", color: "#16a34a", margin: 0 }}>
              You save {coupon.discountAmountFormatted}
            </p>
          </div>
          <button
            onClick={removeCoupon}
            style={{
              fontSize: "11px",
              color: "#dc2626",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Pay button */}
      {payError && (
        <div
          style={{
            padding: "9px 12px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            fontSize: "12.5px",
            color: "#dc2626",
            marginBottom: "10px",
          }}
        >
          {payError}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={paying}
        style={{
          width: "100%",
          height: "48px",
          border: "none",
          borderRadius: "12px",
          background: paying
            ? "#93c5fd"
            : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "15px",
          cursor: paying ? "not-allowed" : "pointer",
          boxShadow: paying ? "none" : "0 4px 14px rgba(29,78,216,0.35)",
          letterSpacing: "-0.2px",
        }}
      >
        {paying
          ? "Processing…"
          : `Pay ₹${(finalPrice / 100).toLocaleString("en-IN")}`}
      </button>

      <p
        style={{
          fontSize: "11.5px",
          color: "#94a3b8",
          textAlign: "center",
          margin: "10px 0 0",
        }}
      >
        Secured by Razorpay · UPI, Cards, Net Banking
      </p>
    </div>
  );
}
