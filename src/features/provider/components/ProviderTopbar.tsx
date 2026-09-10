"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { ROUTES } from "@/config/app";

type ProviderUser = { name: string | null; email: string };

export function ProviderTopbar({
  user,
  companyName,
}: {
  user: ProviderUser;
  companyName: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const firstLetter = (user?.name ?? "P")[0].toUpperCase();
  const firstName = user?.name?.split(" ")[0] ?? "Employer";

  return (
    <>
      <header
        style={{
          height: "58px",
          borderBottom: "1px solid #e8edf2",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.75rem",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
          fontFamily: "'Inter', -apple-system, sans-serif",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "10px",
              padding: "2px 8px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              color: "#1d4ed8",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              border: "1px solid #bfdbfe",
            }}
          >
            Employer Portal
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px 4px 4px",
              border: "1px solid #e2e8f0",
              borderRadius: "50px",
              background: "#f8fafc",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {firstLetter}
            </div>
            <span
              style={{ fontSize: "12.5px", fontWeight: 600, color: "#334155" }}
            >
              {firstName}
            </span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              height: "34px",
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "9px",
              cursor: "pointer",
              fontSize: "12.5px",
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </header>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(15,23,42,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              width: "100%",
              maxWidth: "400px",
              overflow: "hidden",
              margin: "0 16px",
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
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 8px",
                }}
              >
                Sign out of {companyName}?
              </p>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                You'll be redirected to the login page.
              </p>
            </div>
            <div
              style={{
                padding: "1rem 1.5rem 1.5rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  height: "36px",
                  padding: "0 16px",
                  borderRadius: "9px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: ROUTES.login })}
                style={{
                  height: "36px",
                  padding: "0 18px",
                  borderRadius: "9px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Yes, sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
