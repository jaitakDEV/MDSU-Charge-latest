import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/app";

export const metadata = { title: "Settings — MDSSC" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  return (
    <div
      style={{
        maxWidth: "580px",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#94a3b8",
            margin: "0 0 6px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Dashboard
        </p>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
            letterSpacing: "-0.6px",
            lineHeight: 1.2,
          }}
        >
          Settings
        </h1>
        <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: 0 }}>
          Manage your account preferences and configurations.
        </p>
      </div>

      {/* Notifications Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #f1f5f9",
            background: "#fafafa",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.2px",
              }}
            >
              Notifications
            </p>
            <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
              Email and alert preferences
            </p>
          </div>
        </div>

        <div style={{ padding: "1.25rem 1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "14px 16px",
              background: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)",
              border: "1px solid #bfdbfe",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "#fff",
                border: "1px solid #bfdbfe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "1px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p
                style={{
                  margin: "0 0 3px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e3a8a",
                }}
              >
                Coming Soon
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "12.5px",
                  color: "#3b82f6",
                  lineHeight: 1.5,
                }}
              >
                Email notification preferences will be available in a future
                update.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Deletion Notice */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "14px 16px",
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: "#fff",
            border: "1px solid #fde68a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: "1px",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d97706"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div>
          <p
            style={{
              margin: "0 0 3px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#92400e",
            }}
          >
            Account deletion not available
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "12.5px",
              color: "#b45309",
              lineHeight: 1.5,
            }}
          >
            You cannot delete your own account. Please contact an administrator
            to request account deletion.
          </p>
        </div>
      </div>
    </div>
  );
}
