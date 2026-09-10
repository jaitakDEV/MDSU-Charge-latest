"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/app";
import {
  LayoutDashboard,
  Users,
  User,
  Settings,
  Shield,
  GraduationCap,
  Building2,
  FileEdit,
  BookOpen,
  ClipboardList,
  FolderKanban,
  ShoppingCart,
  TrendingUp,
  RotateCcw,
  Ticket,
} from "lucide-react";
import Image from "next/image";

const navGroups = [
  {
    title: null,
    items: [{ label: "Overview", href: ROUTES.admin, icon: LayoutDashboard }],
  },
  {
    title: "Management",
    items: [
      { label: "Users", href: ROUTES.adminUsers, icon: Users },
      { label: "Students", href: ROUTES.adminStudents, icon: GraduationCap },
      { label: "Faculty", href: ROUTES.adminFaculty, icon: GraduationCap },
      { label: "CMS Editors", href: ROUTES.adminCmsEditors, icon: FileEdit },
    ],
  },
  {
    title: "Institutions",
    items: [{ label: "Colleges", href: ROUTES.adminColleges, icon: Building2 }],
  },
  {
    title: "Events & Registrations",
    items: [
      { label: "Events", href: ROUTES.adminEvents, icon: Users },
      { label: "Registrations", href: ROUTES.adminEventRegs, icon: Users },
    ],
  },
  {
    title: "Courses",
    items: [
      { label: "Courses", href: ROUTES.adminCourses, icon: BookOpen },
      {
        label: "Enrolments",
        href: ROUTES.adminEnrolments,
        icon: ClipboardList,
      },
      { label: "Categories", href: ROUTES.adminCategories, icon: FolderKanban },
    ],
  },
  {
    title: "Jobs & Career",
    items: [
      { label: "Providers", href: ROUTES.adminProviders, icon: Building2 },
      { label: "All Listings", href: ROUTES.adminJobs, icon: BookOpen },
      { label: "Applications", href: ROUTES.adminApplications, icon: BookOpen },
      {
        label: "Job Analytics",
        href: ROUTES.adminJobAnalytics,
        icon: TrendingUp,
      },
    ],
  },

  {
    title: "Commerce",
    items: [
      { label: "Orders", href: ROUTES.adminOrders, icon: ShoppingCart },
      { label: "Revenue", href: ROUTES.adminRevenue, icon: TrendingUp },
      { label: "Refunds", href: ROUTES.adminRefunds, icon: RotateCcw },
      { label: "Coupons", href: ROUTES.adminCoupons, icon: Ticket },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: ROUTES.adminProfile, icon: User },
      { label: "Settings", href: ROUTES.adminSettings, icon: Settings },
    ],
  },
];

export function AdminSidebar() {
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
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 40,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxShadow: "1px 0 4px 0 rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          padding: "0 1.25rem",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "#fafbfc",
        }}
      >
        <Image src="/mdssc-logo.svg" alt="MDSSC" width={148} height={148} />
      </div>

      <nav
        style={{
          flex: 1,
          padding: "1.25rem 0.875rem",
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#b0bec5",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "0 0.625rem",
            margin: "0 0 8px",
          }}
        >
          Navigation
        </p>

        {navGroups.map((group, gi) => (
          <div key={`group-${gi}`}>
            {gi > 0 && (
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right, #f1f5f9, #e2e8f0, #f1f5f9)",
                  margin: "8px 0",
                }}
              />
            )}

            {group.title && (
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#b0bec5",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "0 0.625rem",
                  margin: "0 0 6px",
                }}
              >
                {group.title}
              </p>
            )}

            {group.items.map((item) => {
              const isActive =
                item.href === ROUTES.admin
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");

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
                    }}
                  >
                    <item.icon
                      size={14}
                      color={isActive ? "#1d4ed8" : "#94a3b8"}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                  </span>

                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div
        style={{
          flexShrink: 0,
          padding: "0 0.875rem",
          paddingBottom: "1.25rem",
        }}
      >
        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, #f1f5f9, #e2e8f0, #f1f5f9)",
            marginBottom: "12px",
          }}
        />

        <div
          style={{
            padding: "10px 12px",
            borderRadius: "11px",
            background: "linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%)",
            border: "1px solid #fecaca",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#fff",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 1px 3px rgba(220,38,38,0.1)",
            }}
          >
            <Shield size={16} color="#dc2626" strokeWidth={2} />
          </div>

          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: "#991b1b",
                margin: "0 0 1px",
                letterSpacing: "-0.1px",
              }}
            >
              Administrator
            </p>
            <p
              style={{
                fontSize: "10.5px",
                color: "#f87171",
                margin: 0,
                fontWeight: 500,
              }}
            >
              Full access
            </p>
          </div>

          <div style={{ marginLeft: "auto", flexShrink: 0 }}>
            <span
              style={{
                display: "block",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#16a34a",
                boxShadow: "0 0 0 2px #dcfce7",
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
