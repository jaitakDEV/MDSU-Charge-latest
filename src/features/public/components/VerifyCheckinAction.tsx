"use client";

import { useState } from "react";

export function VerifyCheckinAction({ ticketCode }: { ticketCode: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleCheckin() {
    setStatus("loading");
    const res = await fetch(`/api/events/checkin/${ticketCode}`);
    const json = await res.json();

    if (!json.success) {
      setStatus("error");
      setMessage(json.error ?? "Check-in failed.");
      return;
    }

    setStatus("done");
    setMessage(
      json.data.alreadyCheckedIn
        ? "Already checked in."
        : "Checked in successfully.",
    );
  }

  if (status === "done") {
    return (
      <div
        style={{
          padding: "12px 14px",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#166534",
            margin: 0,
          }}
        >
          ✓ {message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleCheckin}
        disabled={status === "loading"}
        style={{
          width: "100%",
          height: "46px",
          border: "none",
          borderRadius: "12px",
          background:
            status === "loading"
              ? "#93c5fd"
              : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "14px",
          cursor: status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading" ? "Checking in…" : "✓ Check In Attendee"}
      </button>
      {status === "error" && (
        <p
          style={{
            fontSize: "12px",
            color: "#dc2626",
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
