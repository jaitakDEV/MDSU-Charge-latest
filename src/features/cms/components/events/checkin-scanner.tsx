"use client";

import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

type CheckinResult = {
  success: boolean;
  alreadyCheckedIn?: boolean;
  attendeeName?: string;
  eventTitle?: string;
  error?: string;
};

export function CheckinScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<CheckinResult | null>(null);
  const [manualCode, setManualCode] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  async function startScanning() {
    setScanning(true);
    setResult(null);

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          // URL se ticketCode extract karo
          const match = decodedText.match(/\/events\/verify\/([a-zA-Z0-9]+)/);
          const ticketCode = match ? match[1] : decodedText;
          await handleCheckin(ticketCode);
          await stopScanning();
        },
        () => {}, // scan error — ignore, retry automatically
      );
    } catch (err) {
      setResult({
        success: false,
        error: "Camera access denied or not available.",
      });
      setScanning(false);
    }
  }

  async function stopScanning() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  }

  async function handleCheckin(ticketCode: string) {
    const res = await fetch(`/api/events/checkin/${ticketCode}`);
    const json = await res.json();

    if (!json.success) {
      setResult({ success: false, error: json.error });
      return;
    }

    setResult({
      success: true,
      alreadyCheckedIn: json.data.alreadyCheckedIn,
      attendeeName: json.data.attendeeName,
      eventTitle: json.data.eventTitle,
    });
  }

  async function handleManualSubmit() {
    if (!manualCode.trim()) return;
    await handleCheckin(manualCode.trim());
    setManualCode("");
  }

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div>
      {/* Scanner viewport */}
      <div
        style={{
          background: "#0f172a",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "1.25rem",
          aspectRatio: "1/1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {scanning ? (
          <div id="qr-reader" style={{ width: "100%", height: "100%" }} />
        ) : (
          <div style={{ textAlign: "center", color: "#94a3b8" }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ margin: "0 auto 12px" }}
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <p style={{ fontSize: "13px", margin: 0 }}>
              Camera preview will appear here
            </p>
          </div>
        )}
      </div>

      {/* Start/Stop button */}
      <button
        onClick={scanning ? stopScanning : startScanning}
        style={{
          width: "100%",
          height: "48px",
          border: "none",
          borderRadius: "12px",
          background: scanning ? "#ef4444" : "#1d4ed8",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: "1.25rem",
        }}
      >
        {scanning ? "Stop Scanning" : "📷 Start Scanner"}
      </button>

      {/* Manual entry */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#64748b",
            marginBottom: "8px",
          }}
        >
          Or enter ticket code manually
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
            placeholder="Ticket code"
            style={{
              flex: 1,
              height: "40px",
              padding: "0 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "13px",
              fontFamily: "monospace",
            }}
          />
          <button
            onClick={handleManualSubmit}
            style={{
              height: "40px",
              padding: "0 16px",
              border: "none",
              borderRadius: "10px",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Check In
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            background: result.success
              ? result.alreadyCheckedIn
                ? "#fefce8"
                : "#f0fdf4"
              : "#fef2f2",
            border: `1.5px solid ${result.success ? (result.alreadyCheckedIn ? "#fde68a" : "#86efac") : "#fecaca"}`,
            textAlign: "center",
          }}
        >
          {result.success ? (
            <>
              <p style={{ fontSize: "28px", margin: "0 0 8px" }}>
                {result.alreadyCheckedIn ? "⚠️" : "✅"}
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: result.alreadyCheckedIn ? "#92400e" : "#166534",
                  margin: "0 0 4px",
                }}
              >
                {result.alreadyCheckedIn
                  ? "Already Checked In"
                  : "Checked In Successfully"}
              </p>
              <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>
                {result.attendeeName}
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: "28px", margin: "0 0 8px" }}>❌</p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#991b1b",
                  margin: 0,
                }}
              >
                {result.error}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
