import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { PasswordChangeForm } from "@/features/profile/components/password-change-form";

export const metadata = { title: "CMS Profile" };

export default async function CmsProfilePage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true },
  });

  if (!user) redirect(ROUTES.login);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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
          CMS Panel
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
          Profile
        </h1>
        <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: 0 }}>
          Update your personal information and account settings.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "1rem 1.25rem",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
            letterSpacing: "-0.5px",
            boxShadow: "0 2px 8px rgba(29,78,216,0.25)",
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: "14.5px",
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.2px",
            }}
          >
            {user.name ?? "No name set"}
          </p>
          <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8" }}>
            {user.email}
          </p>
        </div>
        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
          <span
            style={{
              fontSize: "10px",
              padding: "3px 9px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
              color: "#1d4ed8",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              border: "1px solid #bfdbfe",
            }}
          >
            CMS Editor
          </span>
        </div>
      </div>

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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
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
              Personal Info
            </p>
            <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
              Update your name and profile picture
            </p>
          </div>
        </div>
        <div style={{ padding: "1.5rem" }}>
          <ProfileForm user={user} />
        </div>
      </div>

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
              background: "#fff7ed",
              border: "1px solid #fed7aa",
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
              stroke="#ea580c"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
              Change Password
            </p>
            <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
              Choose a strong password with at least 8 characters
            </p>
          </div>
        </div>
        <div style={{ padding: "1.5rem" }}>
          <PasswordChangeForm userId={user.id} />
        </div>
      </div>
    </div>
  );
}
