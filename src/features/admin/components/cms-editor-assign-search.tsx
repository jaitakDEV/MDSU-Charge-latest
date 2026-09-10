"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  searchEligibleUsersAction,
  assignCmsEditorAction,
} from "@/features/admin/actions/cms-editor-actions";

type EligibleUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

const avatarPalette = [
  { bg: "#eff6ff", color: "#1d4ed8" },
  { bg: "#f0fdf4", color: "#16a34a" },
  { bg: "#fdf4ff", color: "#9333ea" },
  { bg: "#fff7ed", color: "#ea580c" },
  { bg: "#fef2f2", color: "#dc2626" },
  { bg: "#f0f9ff", color: "#0284c7" },
];
function avatarColor(seed: string) {
  return avatarPalette[seed.charCodeAt(0) % avatarPalette.length];
}

const ROLE_STYLE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  FACULTY: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  STUDENT: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
};

export function CmsEditorAssignSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EligibleUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<string | null>(null);

  async function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const res = await searchEligibleUsersAction(value);
    setSearching(false);
    if (res.success) setResults(res.data);
  }

  async function handleAssign(userId: string) {
    setAssigning(userId);
    const res = await assignCmsEditorAction(userId);
    setAssigning(null);
    if (res.success) {
      setAssigned(userId);
      setTimeout(() => {
        setQuery("");
        setResults([]);
        setAssigned(null);
        router.refresh();
      }, 800);
    }
  }

  function handleClear() {
    setQuery("");
    setResults([]);
  }

  const showDropdown = query.length >= 2;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          marginBottom: showDropdown ? "0" : undefined,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or email…"
          style={{
            width: "100%",
            height: "40px",
            padding: "0 36px 0 36px",
            border: showDropdown ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
            borderRadius: showDropdown ? "9px 9px 0 0" : "9px",
            fontSize: "13px",
            background: "#fff",
            color: "#0f172a",
            outline: "none",
            boxSizing: "border-box",
            boxShadow: showDropdown
              ? "0 0 0 3px rgba(59,130,246,0.08)"
              : "0 1px 2px rgba(0,0,0,0.04)",
            transition: "all 0.14s",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {searching && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: "cms-spin 0.7s linear infinite" }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              <style>{`@keyframes cms-spin { to { transform: rotate(360deg); } }`}</style>
            </svg>
          )}
          {query.length > 0 && !searching && (
            <button
              onClick={handleClear}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#f1f5f9",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                padding: 0,
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {showDropdown && (
        <div
          style={{
            border: "1px solid #bfdbfe",
            borderTop: "1px solid #e2e8f0",
            borderRadius: "0 0 9px 9px",
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {searching && (
            <div
              style={{
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  animation: "cms-spin 0.7s linear infinite",
                  flexShrink: 0,
                }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>
                Searching…
              </span>
            </div>
          )}

          {!searching && results.length > 0 && (
            <>
              <div
                style={{
                  padding: "6px 14px",
                  background: "#f8fafc",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 600,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </span>
              </div>
              {results.map((u, i) => {
                const palette = avatarColor(u.email);
                const roleS = ROLE_STYLE[u.role] ?? {
                  bg: "#f1f5f9",
                  color: "#475569",
                  border: "#e2e8f0",
                };
                const initials = u.name
                  ? u.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?";
                const isDone = assigned === u.id;

                return (
                  <div
                    key={u.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "11px 16px",
                      borderBottom:
                        i < results.length - 1 ? "1px solid #f8fafc" : "none",
                      background: isDone ? "#f0fdf4" : "#fff",
                      transition: "background 0.15s",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "9px",
                          background: palette.bg,
                          color: palette.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              color: "#0f172a",
                              fontSize: "13px",
                              lineHeight: 1.3,
                            }}
                          >
                            {u.name ?? (
                              <span
                                style={{ color: "#cbd5e1", fontWeight: 400 }}
                              >
                                No name
                              </span>
                            )}
                          </p>
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "1px 7px",
                              borderRadius: "5px",
                              background: roleS.bg,
                              color: roleS.color,
                              border: `1px solid ${roleS.border}`,
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {u.role.toLowerCase()}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "11.5px",
                            color: "#94a3b8",
                            lineHeight: 1.3,
                          }}
                        >
                          {u.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAssign(u.id)}
                      disabled={assigning === u.id || !!assigned}
                      style={{
                        fontSize: "12px",
                        padding: "6px 14px",
                        border: isDone
                          ? "1px solid #bbf7d0"
                          : "1px solid #bfdbfe",
                        borderRadius: "7px",
                        background: isDone ? "#f0fdf4" : "#eff6ff",
                        cursor:
                          assigning === u.id || !!assigned
                            ? "not-allowed"
                            : "pointer",
                        color: isDone ? "#16a34a" : "#1d4ed8",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        flexShrink: 0,
                        opacity:
                          assigning !== null && assigning !== u.id ? 0.5 : 1,
                        transition: "all 0.14s",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isDone ? (
                        <>
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Assigned!
                        </>
                      ) : assigning === u.id ? (
                        <>
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              animation: "cms-spin 0.7s linear infinite",
                            }}
                          >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Assigning…
                        </>
                      ) : (
                        <>
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          Assign as Editor
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </>
          )}

          {!searching && results.length === 0 && (
            <div style={{ padding: "20px 18px", textAlign: "center" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <p
                style={{
                  margin: "0 0 2px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                No eligible users found
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                Only Students and Faculty can be promoted to CMS Editor.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
