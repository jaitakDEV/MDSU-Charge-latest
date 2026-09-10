"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/app";
import Image from "next/image";
import { LayoutDashboard, GraduationCap, User, Settings } from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Faculty",
    items: [{ label: "Overview", href: ROUTES.faculty, icon: LayoutDashboard }],
  },
  {
    label: "Student Management",
    items: [
      { label: "Students", href: ROUTES.facultyStudents, icon: GraduationCap },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: ROUTES.facultyProfile, icon: User },
      { label: "Settings", href: ROUTES.facultySettings, icon: Settings },
    ],
  },
];

export function FacultySidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "232px",
        flexShrink: 0,
        background: "#fff",
        borderRight: "1px solid #e8edf2",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxShadow: "1px 0 0 0 #f1f5f9",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: "0 1.25rem",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafbfc",
        }}
      >
        <Image src="/mdssc-logo.svg" alt="MDSSC" width={148} height={148} />
      </div>

      {/* ── Nav ── */}
      <nav
        style={{
          flex: 1,
          padding: "1.25rem 0.875rem",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        aria-label="Faculty navigation"
      >
        {NAV_SECTIONS.map((section, si) => (
          <div
            key={section.label}
            style={{ marginBottom: si < NAV_SECTIONS.length - 1 ? "6px" : "0" }}
          >
            {/* Section label */}
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#b0bec5",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "0 0.625rem",
                margin: "0 0 6px",
              }}
            >
              {section.label}
            </p>

            {/* Items */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 12px",
                      borderRadius: "9px",
                      fontSize: "13.5px",
                      fontWeight: isActive ? 600 : 450,
                      color: isActive ? "#1d4ed8" : "#64748b",
                      background: isActive
                        ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
                        : "transparent",
                      textDecoration: "none",
                      transition: "all 0.14s ease",
                      border: isActive
                        ? "1px solid #bfdbfe"
                        : "1px solid transparent",
                      position: "relative",
                      letterSpacing: isActive ? "-0.1px" : "0",
                    }}
                  >
                    {/* Active left accent */}
                    {isActive && (
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "3px",
                          height: "18px",
                          borderRadius: "0 3px 3px 0",
                          background: "#1d4ed8",
                        }}
                      />
                    )}

                    {/* Icon */}
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                        height: "28px",
                        borderRadius: "7px",
                        background: isActive ? "#dbeafe" : "#f8fafc",
                        flexShrink: 0,
                        transition: "background 0.14s",
                        color: isActive ? "#1d4ed8" : "#94a3b8",
                      }}
                    >
                      <item.icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                    </span>

                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Section divider */}
            {si < NAV_SECTIONS.length - 1 && (
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, #e2e8f0, transparent)",
                  margin: "10px 0.625rem",
                }}
              />
            )}
          </div>
        ))}
      </nav>

      {/* ── Bottom divider ── */}
      <div style={{ padding: "0 1.25rem", marginBottom: "12px" }}>
        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, #f1f5f9, #e2e8f0, #f1f5f9)",
          }}
        />
      </div>

      {/* ── Faculty badge card ── */}
      <div
        style={{
          margin: "0 0.875rem 1.25rem",
          borderRadius: "11px",
          overflow: "hidden",
          border: "1px solid #bfdbfe",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 12px",
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            borderBottom: "1px solid #bfdbfe",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "#fff",
              border: "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <GraduationCap size={14} color="#1d4ed8" strokeWidth={2} />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: 700,
                color: "#1e3a8a",
              }}
            >
              Faculty
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "10.5px",
                color: "#1d4ed8",
                fontWeight: 500,
              }}
            >
              Faculty access
            </p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span
              style={{
                display: "block",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#1d4ed8",
                boxShadow: "0 0 0 2px #dbeafe",
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
