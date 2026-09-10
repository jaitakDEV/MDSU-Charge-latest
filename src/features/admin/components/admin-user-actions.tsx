"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminToggleActiveAction,
  adminSetRoleAction,
  adminDeleteUserAction,
} from "@/features/admin/actions/admin-user-actions";
import type { Role } from "@prisma/client";

type Props = { user: { id: string; role: string; isActive: boolean } };

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "STUDENT", label: "Student" },
  { value: "FACULTY", label: "Faculty" },
  { value: "CMS_EDITOR", label: "CMS Editor" },
  { value: "ADMIN", label: "Admin" },
];

export function AdminUserActions({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(user.role as Role);

  async function run(
    action: () => Promise<{ success: boolean; error?: string }>,
    key: string,
  ) {
    setLoading(key);
    const res = await action();
    setLoading(null);
    if (res.success) router.refresh();
  }

  const roleChanged = selectedRole !== user.role;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "13px 18px",
          borderBottom: "1px solid #f1f5f9",
          background: "#f8fafc",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: 600,
            color: "#0f172a",
            letterSpacing: "0.01em",
          }}
        >
          Actions
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "#94a3b8" }}>
          Manage account, role, and access.
        </p>
      </div>

      <div
        style={{
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "10.5px",
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Account status
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: user.isActive ? "#16a34a" : "#94a3b8",
                }}
              />
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 500,
                  color: user.isActive ? "#0f172a" : "#64748b",
                }}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <button
              onClick={() =>
                run(
                  () => adminToggleActiveAction(user.id, !user.isActive),
                  "active",
                )
              }
              disabled={loading === "active"}
              style={{
                fontSize: "12px",
                fontWeight: 500,
                padding: "5px 12px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: user.isActive ? "#dc2626" : "#16a34a",
                cursor: loading === "active" ? "not-allowed" : "pointer",
                opacity: loading === "active" ? 0.5 : 1,
                fontFamily: "inherit",
              }}
            >
              {loading === "active"
                ? "Saving…"
                : user.isActive
                  ? "Deactivate"
                  : "Activate"}
            </button>
          </div>
        </div>

        <div>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "10.5px",
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Role
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              style={{
                flex: 1,
                fontSize: "12.5px",
                fontWeight: 500,
                padding: "6px 8px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                background: "#fff",
                color: "#0f172a",
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                run(() => adminSetRoleAction(user.id, selectedRole), "role")
              }
              disabled={loading === "role" || !roleChanged}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: "6px",
                border: "none",
                background: roleChanged ? "#0f172a" : "#e2e8f0",
                color: roleChanged ? "#fff" : "#94a3b8",
                cursor:
                  !roleChanged || loading === "role"
                    ? "not-allowed"
                    : "pointer",
                opacity: loading === "role" ? 0.5 : 1,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {loading === "role" ? "Saving…" : "Update role"}
            </button>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "10.5px",
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Danger zone
          </p>

          {!confirm ? (
            <button
              onClick={() => setConfirm(true)}
              style={{
                fontSize: "12.5px",
                fontWeight: 500,
                color: "#dc2626",
                background: "#fff",
                border: "1px solid #fecaca",
                borderRadius: "7px",
                padding: "7px 14px",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              Delete user
            </button>
          ) : (
            <div
              style={{
                padding: "13px 14px",
                background: "#fff5f5",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#7f1d1d",
                    }}
                  >
                    This action is permanent
                  </p>
                  <p
                    style={{ margin: 0, fontSize: "11.5px", color: "#991b1b" }}
                  >
                    All data for this user will be removed and cannot be
                    recovered.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() =>
                    run(() => adminDeleteUserAction(user.id), "delete")
                  }
                  disabled={loading === "delete"}
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#fff",
                    background: "#dc2626",
                    border: "none",
                    borderRadius: "6px",
                    padding: "7px 14px",
                    cursor: loading === "delete" ? "not-allowed" : "pointer",
                    opacity: loading === "delete" ? 0.6 : 1,
                    fontFamily: "inherit",
                  }}
                >
                  {loading === "delete" ? "Deleting…" : "Yes, delete user"}
                </button>
                <button
                  onClick={() => setConfirm(false)}
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#64748b",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "7px 14px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
