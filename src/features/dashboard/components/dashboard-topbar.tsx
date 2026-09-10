// "use client";

// import { signOut } from "next-auth/react";
// import { usePathname } from "next/navigation";
// import { ROUTES } from "@/config/app";
// import type { SessionUser } from "@/types";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// const pageTitles: Record<string, string> = {
//   [ROUTES.dashboard]: "Overview",
//   [ROUTES.profile]: "Profile",
//   [ROUTES.settings]: "Settings",
// };

// export function DashboardTopbar({ user }: { user: SessionUser }) {
//   const pathname = usePathname();
//   const title = pageTitles[pathname] ?? "Dashboard";

//   return (
//     <header
//       style={{
//         height: "60px",
//         borderBottom: "1px solid #e2e8f0",
//         background: "#DCE8F8",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "0 2rem",
//         flexShrink: 0,
//         position: "sticky",
//         top: 0,
//         zIndex: 10,
//       }}
//     >
//       {/* Left */}
//       <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//         <h1
//           style={{
//             fontSize: "15px",
//             fontWeight: 700,
//             color: "#0f172a",
//             margin: 0,
//           }}
//         >
//           {title}
//         </h1>
//         <span
//           style={{
//             fontSize: "11px",
//             padding: "2px 8px",
//             borderRadius: "20px",
//             background: "#f1f5f9",
//             color: "#64748b",
//             fontWeight: 500,
//           }}
//         >
//           {user.role === "ADMIN" ? "Admin" : "Free plan"}
//         </span>
//       </div>

//       {/* Right */}
//       <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             padding: "5px 12px 5px 6px",
//             border: "1px solid #e2e8f0",
//             borderRadius: "20px",
//             background: "#f8fafc",
//           }}
//         >
//           <div
//             style={{
//               width: "24px",
//               height: "24px",
//               borderRadius: "50%",
//               background: "#eff6ff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "10px",
//               fontWeight: 700,
//               color: "#1d4ed8",
//             }}
//           >
//             {(user.name ?? "U")[0].toUpperCase()}
//           </div>
//           <span style={{ fontSize: "12px", fontWeight: 500, color: "#475569" }}>
//             {user.name?.split(" ")[0] ?? "User"}
//           </span>
//         </div>

//         {/* Sign out with AlertDialog */}
//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <button
//               style={{
//                 height: "34px",
//                 padding: "0 12px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 background: "none",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "8px",
//                 cursor: "pointer",
//                 fontSize: "12px",
//                 color: "#64748b",
//                 fontWeight: 500,
//               }}
//             >
//               Sign out
//             </button>
//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Sign out of MDSSC?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 You will be redirected to the login page. Any unsaved changes
//                 will be lost.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={() => signOut({ callbackUrl: ROUTES.login })}
//                 style={{ background: "#1d4ed8" }}
//               >
//                 Yes, sign out
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </header>
//   );
// }

"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/app";
import type { SessionUser } from "@/types";
import Image from "next/image";

export function DashboardTopbar({ user }: { user: SessionUser }) {
  const pathname = usePathname();

  const [showModal, setShowModal] = useState(false);

  const firstLetter = (user?.name ?? "U")[0].toUpperCase();
  const firstName = user?.name?.split(" ")[0] ?? "User";

  return (
    <>
      <header
        style={{
          height: "58px",
          borderBottom: "1px solid #e8edf2",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.75rem",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Image src="/charge-logo.svg" alt="MDSSC" width={110} height={28} />

          <div
            style={{
              width: "1px",
              height: "20px",
              background: "#e2e8f0",
              flexShrink: 0,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
              {user.role === "ADMIN" ? "Admin" : "Student"}
            </span>
          </div>
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
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
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
                letterSpacing: "-0.3px",
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
            aria-label="Sign out"
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
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.14s ease",
              letterSpacing: "-0.1px",
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
            animation: "fadeIn 0.15s ease",
          }}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
          `}</style>

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
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              animation: "slideUp 0.18s ease",
            }}
          >
            <div
              style={{
                height: "4px",
                background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
              }}
            />

            <div style={{ padding: "1.5rem 1.5rem 1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                    letterSpacing: "-0.3px",
                  }}
                >
                  Sign out of MDSSC?
                </p>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: "0 0 0 48px",
                  lineHeight: 1.6,
                }}
              >
                You will be redirected to the login page. Any unsaved changes
                will be lost.
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
                  letterSpacing: "-0.1px",
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
                  letterSpacing: "-0.1px",
                  boxShadow: "0 2px 6px rgba(29,78,216,0.3)",
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
