"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/config/app";
import { formatEventPrice } from "@/lib/event-utils";
import { GuestRegistrationForm } from "./GuestRegistrationForm";
import type { RegistrationCTA } from "@/lib/event-utils";
import type { PricingType } from "@prisma/client";

export function EventRegistrationClient({
  eventId,
  eventSlug,
  cta,
  pricingType,
  price,
  isLoggedIn,
  userName,
  userEmail,
  userId,
}: {
  eventId: string;
  eventSlug: string;
  cta: RegistrationCTA;
  pricingType: PricingType;
  price: number;
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  userId: string;
}) {
  const router = useRouter();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestMode, setGuestMode] = useState<"register" | "waitlist" | "pay">(
    "register",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // ── Free registration — logged in ─────────────────────────
  async function handleFreeRegisterUser() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/events/${eventId}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) {
      setError(json.error);
      return;
    }
    router.refresh();
  }

  // ── Free registration — guest ──────────────────────────────
  async function handleFreeRegisterGuest(guest: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
  }) {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/events/${eventId}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guest),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) {
      setError(json.error);
      setShowGuestForm(false);
      return;
    }
    setShowGuestForm(false);
    router.refresh();
  }

  // ── Waitlist — logged in ──────────────────────────────────
  async function handleWaitlistUser() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/events/${eventId}/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) {
      setError(json.error);
      return;
    }
    router.refresh();
  }

  // ── Waitlist — guest ───────────────────────────────────────
  async function handleWaitlistGuest(guest: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
  }) {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/events/${eventId}/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guest),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) {
      setError(json.error);
      setShowGuestForm(false);
      return;
    }
    setShowGuestForm(false);
    router.refresh();
  }

  // ── Paid — logged in ───────────────────────────────────────
  const handlePayUser = useCallback(async () => {
    setLoading(true);
    setError("");
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load payment gateway.");
      setLoading(false);
      return;
    }

    const orderRes = await fetch("/api/payments/events/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, userId }),
    });
    const orderJson = await orderRes.json();
    if (!orderJson.success) {
      setError(orderJson.error);
      setLoading(false);
      return;
    }

    openRazorpay(orderJson.data, userName, userEmail);
  }, [eventId, userId, userName, userEmail]);

  // ── Paid — guest ───────────────────────────────────────────
  async function handlePayGuest(guest: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
  }) {
    setLoading(true);
    setError("");
    setShowGuestForm(false);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load payment gateway.");
      setLoading(false);
      return;
    }

    const orderRes = await fetch("/api/payments/events/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, ...guest }),
    });
    const orderJson = await orderRes.json();
    if (!orderJson.success) {
      setError(orderJson.error);
      setLoading(false);
      return;
    }

    openRazorpay(orderJson.data, guest.guestName, guest.guestEmail);
  }

  // function openRazorpay(orderData: any, name: string, email: string) {
  //   const rzp = new window.Razorpay({
  //     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  //     amount: orderData.amount,
  //     currency: "INR",
  //     order_id: orderData.razorpayOrderId,
  //     name: "MDSSC Events",
  //     description: orderData.eventTitle,
  //     prefill: { name, email },
  //     theme: { color: "#1d4ed8" },
  //     handler: async (response: any) => {
  //       const verifyRes = await fetch("/api/payments/events/verify", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           razorpayOrderId: response.razorpay_order_id,
  //           razorpayPaymentId: response.razorpay_payment_id,
  //           razorpaySignature: response.razorpay_signature,
  //         }),
  //       });
  //       const verifyJson = await verifyRes.json();
  //       setLoading(false);
  //       if (!verifyJson.success) {
  //         setError("Payment verification failed. Contact support.");
  //         return;
  //       }

  //       router.push(
  //         `${ROUTES.eventDetail(verifyJson.data.eventSlug)}?registered=1`,
  //       );
  //     },
  //     modal: {
  //       ondismiss: () => {
  //         setLoading(false);
  //         setError("Payment was cancelled.");
  //       },
  //     },
  //   });
  //   rzp.open();
  // }
  function openRazorpay(orderData: any, name: string, email: string) {
    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      amount: orderData.amount,
      currency: "INR",
      order_id: orderData.razorpayOrderId,
      name: "MDSSC Events",
      description: orderData.eventTitle,
      prefill: { name, email },
      theme: { color: "#1d4ed8" },
      handler: async (response) => {
        // ← ab type inferred hoga RazorpayResponse se
        const verifyRes = await fetch("/api/payments/events/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });
        const verifyJson = await verifyRes.json();
        setLoading(false);
        if (!verifyJson.success) {
          setError("Payment verification failed. Contact support.");
          return;
        }
        router.push(
          `${ROUTES.eventDetail(verifyJson.data.eventSlug)}?registered=1`,
        );
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          setError("Payment was cancelled.");
        },
      },
    });
    rzp.open();
  }
  // ── Trigger guest flow ─────────────────────────────────────
  function openGuestForm(mode: "register" | "waitlist" | "pay") {
    setGuestMode(mode);
    setShowGuestForm(true);
    setError("");
  }

  function handleGuestSubmit(guest: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
  }) {
    if (guestMode === "register") handleFreeRegisterGuest(guest);
    else if (guestMode === "waitlist") handleWaitlistGuest(guest);
    else handlePayGuest(guest);
  }

  const btnStyle = (bg: string): React.CSSProperties => ({
    width: "100%",
    height: "48px",
    border: "none",
    borderRadius: "12px",
    background: bg,
    color: "#fff",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  });

  return (
    <div>
      {error && (
        <div
          style={{
            padding: "10px 12px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            fontSize: "12.5px",
            color: "#dc2626",
            marginBottom: "10px",
          }}
        >
          {error}
        </div>
      )}

      {/* ── EVENT_PAST ── */}
      {cta === "EVENT_PAST" && (
        <div
          style={{
            padding: "14px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#64748b",
              margin: 0,
            }}
          >
            This event has concluded
          </p>
        </div>
      )}

      {/* ── EVENT_CANCELLED ── */}
      {cta === "EVENT_CANCELLED" && (
        <div
          style={{
            padding: "14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#991b1b",
              margin: 0,
            }}
          >
            ❌ Event Cancelled
          </p>
        </div>
      )}

      {/* ── ALREADY_REGISTERED ── */}
      {cta === "ALREADY_REGISTERED" && (
        <div
          style={{
            padding: "14px",
            background: "#f0fdf4",
            border: "1.5px solid #86efac",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#166534",
              margin: "0 0 4px",
            }}
          >
            ✓ You're Registered!
          </p>
          <p style={{ fontSize: "12px", color: "#16a34a", margin: 0 }}>
            Check your email for the ticket and QR code
          </p>
        </div>
      )}

      {/* ── WAITLISTED ── */}
      {cta === "WAITLISTED" && (
        <div
          style={{
            padding: "14px",
            background: "#fefce8",
            border: "1.5px solid #fde68a",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#854d0e",
              margin: "0 0 4px",
            }}
          >
            ⏳ On Waitlist
          </p>
          <p style={{ fontSize: "12px", color: "#b45309", margin: 0 }}>
            We'll email you if a spot opens up
          </p>
        </div>
      )}

      {/* ── REGISTRATIONS_CLOSED ── */}
      {cta === "REGISTRATIONS_CLOSED" && (
        <div
          style={{
            padding: "14px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#64748b",
              margin: 0,
            }}
          >
            Registrations Closed
          </p>
          <p
            style={{ fontSize: "11.5px", color: "#94a3b8", margin: "4px 0 0" }}
          >
            This event has reached full capacity
          </p>
        </div>
      )}

      {/* ── JOIN_WAITLIST ── */}
      {cta === "JOIN_WAITLIST" &&
        (isLoggedIn ? (
          <button
            onClick={handleWaitlistUser}
            disabled={loading}
            style={btnStyle(
              "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            )}
          >
            {loading ? "Joining…" : "Join Waitlist"}
          </button>
        ) : (
          <button
            onClick={() => openGuestForm("waitlist")}
            style={btnStyle(
              "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            )}
          >
            Join Waitlist
          </button>
        ))}

      {/* ── REGISTER_FREE ── */}
      {cta === "REGISTER_FREE" &&
        (isLoggedIn ? (
          <button
            onClick={handleFreeRegisterUser}
            disabled={loading}
            style={btnStyle(
              "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            )}
          >
            {loading ? "Registering…" : "Register — Free"}
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={() => openGuestForm("register")}
              style={btnStyle(
                "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              )}
            >
              Register — Free
            </button>
            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                textAlign: "center",
                margin: 0,
              }}
            >
              or{" "}
              <Link
                href={`${ROUTES.login}?callbackUrl=${encodeURIComponent(ROUTES.eventDetail(eventSlug))}`}
                style={{ color: "#1d4ed8", fontWeight: 600 }}
              >
                login for faster registration
              </Link>
            </p>
          </div>
        ))}

      {/* ── BUY_TICKET ── */}
      {cta === "BUY_TICKET" &&
        (isLoggedIn ? (
          <button
            onClick={handlePayUser}
            disabled={loading}
            style={btnStyle("#f57a22")}
          >
            {loading
              ? "Processing…"
              : `Buy Ticket — ${formatEventPrice(pricingType, price)}`}
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={() => openGuestForm("pay")}
              style={btnStyle("#f57a22")}
            >
              Buy Ticket — {formatEventPrice(pricingType, price)}
            </button>
            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                textAlign: "center",
                margin: 0,
              }}
            >
              or{" "}
              <Link
                href={`${ROUTES.login}?callbackUrl=${encodeURIComponent(ROUTES.eventDetail(eventSlug))}`}
                style={{ color: "#f57a22", fontWeight: 600 }}
              >
                login first
              </Link>
            </p>
          </div>
        ))}

      {/* Guest form modal */}
      {showGuestForm && (
        <GuestRegistrationForm
          onSubmit={handleGuestSubmit}
          onCancel={() => setShowGuestForm(false)}
          submitLabel={
            guestMode === "register"
              ? "Register — Free"
              : guestMode === "waitlist"
                ? "Join Waitlist"
                : `Pay ${formatEventPrice(pricingType, price)}`
          }
          loading={loading}
        />
      )}
    </div>
  );
}
