// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { ChevronDown } from "lucide-react";
// import { getDashboardRoute } from "@/lib/role-routes";
// import { ROUTES } from "@/config/app";
// import styles from "./Navbar.module.css";

// export function UserMenu() {
//   const { data: session, status } = useSession();
//   const [open, setOpen] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const closeMenu = useCallback(() => {
//     setOpen(false);
//     setShowLogoutConfirm(false);
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         closeMenu();
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [closeMenu]);

//   if (status === "loading") {
//     return (
//       <div
//         style={{
//           width: "120px",
//           height: "38px",
//           borderRadius: "10px",
//           background: "#f1f5f9",
//           flexShrink: 0,
//         }}
//       />
//     );
//   }

//   // ── Logged out — existing Login / Get Started ──
//   if (status === "unauthenticated" || !session?.user) {
//     return (
//       <div className={styles.navAuthBtns}>
//         <Link href="/login" className={styles.btnLogin}>
//           Login
//         </Link>
//         <Link href="/register" className={styles.btnGetStarted}>
//           Get Started
//         </Link>
//       </div>
//     );
//   }

//   // ── Logged in ──
//   const user = session.user;
//   const firstName = user.name?.split(" ")[0] ?? "Account";
//   const initials = user.name
//     ? user.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//         .slice(0, 2)
//     : "U";
//   const dashboardHref = getDashboardRoute(user.role);

//   return (
//     <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
//       <button
//         type="button"
//         onClick={() => setOpen((p) => !p)}
//         aria-haspopup="true"
//         aria-expanded={open}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "8px",
//           height: "40px",
//           padding: "4px 12px 4px 4px",
//           border: "1px solid #e2e8f0",
//           borderRadius: "50px",
//           background: "#f8fafc",
//           cursor: "pointer",
//         }}
//       >
//         <div
//           style={{
//             width: "30px",
//             height: "30px",
//             borderRadius: "50%",
//             background: "linear-gradient(135deg, #0951a5 0%, #1d6fd6 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#fff",
//             fontSize: "12px",
//             fontWeight: 700,
//             flexShrink: 0,
//           }}
//         >
//           {initials}
//         </div>
//         <span
//           style={{
//             fontSize: "13px",
//             fontWeight: 600,
//             color: "#0f172a",
//             maxWidth: "120px",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             whiteSpace: "nowrap",
//           }}
//         >
//           {firstName}
//         </span>
//         <ChevronDown
//           size={14}
//           color="#64748b"
//           style={{
//             transform: open ? "rotate(180deg)" : "none",
//             transition: "transform 0.15s",
//           }}
//         />
//       </button>

//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             top: "calc(100% + 8px)",
//             right: 0,
//             width: "220px",
//             background: "#fff",
//             borderRadius: "14px",
//             border: "1px solid #e2e8f0",
//             boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
//             overflow: "hidden",
//             zIndex: 100,
//           }}
//         >
//           {/* User info header */}
//           <div
//             style={{
//               padding: "14px 16px",
//               borderBottom: "1px solid #f1f5f9",
//               background: "#fafbfc",
//             }}
//           >
//             <p
//               style={{
//                 fontSize: "13.5px",
//                 fontWeight: 700,
//                 color: "#0f172a",
//                 margin: "0 0 2px",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {user.name ?? "Account"}
//             </p>
//             <p
//               style={{
//                 fontSize: "11.5px",
//                 color: "#94a3b8",
//                 margin: 0,
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {user.email}
//             </p>
//             <span
//               style={{
//                 display: "inline-block",
//                 marginTop: "6px",
//                 fontSize: "10px",
//                 fontWeight: 700,
//                 padding: "2px 8px",
//                 borderRadius: "20px",
//                 background: "#eff6ff",
//                 color: "#0951a5",
//                 textTransform: "uppercase",
//                 letterSpacing: "0.04em",
//               }}
//             >
//               {user.role?.replace("_", " ")}
//             </span>
//           </div>

//           {/* Menu items */}
//           <div style={{ padding: "6px" }}>
//             <Link
//               href={dashboardHref}
//               onClick={closeMenu}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 padding: "9px 10px",
//                 borderRadius: "9px",
//                 fontSize: "13px",
//                 fontWeight: 500,
//                 color: "#334155",
//                 textDecoration: "none",
//               }}
//             >
//               <svg
//                 width="15"
//                 height="15"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <rect x="3" y="3" width="7" height="7" />
//                 <rect x="14" y="3" width="7" height="7" />
//                 <rect x="14" y="14" width="7" height="7" />
//                 <rect x="3" y="14" width="7" height="7" />
//               </svg>
//               Dashboard
//             </Link>
//           </div>

//           <div style={{ height: "1px", background: "#f1f5f9" }} />

//           {/* Logout */}
//           <div style={{ padding: "6px" }}>
//             {!showLogoutConfirm ? (
//               <button
//                 type="button"
//                 onClick={() => setShowLogoutConfirm(true)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "10px",
//                   width: "100%",
//                   padding: "9px 10px",
//                   borderRadius: "9px",
//                   fontSize: "13px",
//                   fontWeight: 500,
//                   color: "#dc2626",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   textAlign: "left",
//                 }}
//               >
//                 <svg
//                   width="15"
//                   height="15"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                   <polyline points="16 17 21 12 16 7" />
//                   <line x1="21" y1="12" x2="9" y2="12" />
//                 </svg>
//                 Sign out
//               </button>
//             ) : (
//               <div style={{ padding: "6px 4px" }}>
//                 <p
//                   style={{
//                     fontSize: "12px",
//                     color: "#64748b",
//                     margin: "0 0 8px",
//                     padding: "0 6px",
//                   }}
//                 >
//                   Sign out of your account?
//                 </p>
//                 <div style={{ display: "flex", gap: "6px" }}>
//                   <button
//                     onClick={() => signOut({ callbackUrl: ROUTES.login })}
//                     style={{
//                       flex: 1,
//                       height: "32px",
//                       border: "none",
//                       borderRadius: "8px",
//                       background: "#dc2626",
//                       color: "#fff",
//                       fontSize: "12px",
//                       fontWeight: 600,
//                       cursor: "pointer",
//                     }}
//                   >
//                     Yes, sign out
//                   </button>
//                   <button
//                     onClick={() => setShowLogoutConfirm(false)}
//                     style={{
//                       flex: 1,
//                       height: "32px",
//                       border: "1px solid #e2e8f0",
//                       borderRadius: "8px",
//                       background: "#fff",
//                       color: "#64748b",
//                       fontSize: "12px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export function MobileUserMenu({ onClose }: { onClose: () => void }) {
//   const { data: session, status } = useSession();

//   if (status === "loading") return null;

//   if (status === "unauthenticated" || !session?.user) {
//     return (
//       <div
//         className="drawerAuthGrid"
//         style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}
//       >
//         <Link
//           href="/login"
//           onClick={onClose}
//           style={{
//             height: "42px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             borderRadius: "10px",
//             border: "1.5px solid #0951a5",
//             color: "#0951a5",
//             fontSize: "13.5px",
//             fontWeight: 700,
//             textDecoration: "none",
//           }}
//         >
//           Login
//         </Link>
//         <Link
//           href="/register"
//           onClick={onClose}
//           style={{
//             height: "42px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             borderRadius: "10px",
//             background: "#0951a5",
//             color: "#fff",
//             fontSize: "13.5px",
//             fontWeight: 700,
//             textDecoration: "none",
//           }}
//         >
//           Get Started
//         </Link>
//       </div>
//     );
//   }

//   const user = session.user;
//   const dashboardHref = getDashboardRoute(user.role);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "10px",
//           padding: "10px 12px",
//           background: "#f8fafc",
//           borderRadius: "12px",
//           border: "1px solid #e2e8f0",
//         }}
//       >
//         <div
//           style={{
//             width: "34px",
//             height: "34px",
//             borderRadius: "50%",
//             background: "linear-gradient(135deg, #0951a5 0%, #1d6fd6 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#fff",
//             fontSize: "13px",
//             fontWeight: 700,
//             flexShrink: 0,
//           }}
//         >
//           {user.name
//             ?.split(" ")
//             .map((n) => n[0])
//             .join("")
//             .toUpperCase()
//             .slice(0, 2) ?? "U"}
//         </div>
//         <div style={{ minWidth: 0 }}>
//           <p
//             style={{
//               fontSize: "13px",
//               fontWeight: 700,
//               color: "#0f172a",
//               margin: 0,
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {user.name}
//           </p>
//           <p
//             style={{
//               fontSize: "11px",
//               color: "#94a3b8",
//               margin: 0,
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {user.email}
//           </p>
//         </div>
//       </div>

//       <Link
//         href={dashboardHref}
//         onClick={onClose}
//         style={{
//           height: "42px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           borderRadius: "10px",
//           border: "1.5px solid #0951a5",
//           color: "#0951a5",
//           fontSize: "13.5px",
//           fontWeight: 700,
//           textDecoration: "none",
//         }}
//       >
//         Go to Dashboard
//       </Link>

//       <button
//         onClick={() => signOut({ callbackUrl: ROUTES.login })}
//         style={{
//           height: "42px",
//           border: "1px solid #fecaca",
//           borderRadius: "10px",
//           background: "#fef2f2",
//           color: "#dc2626",
//           fontSize: "13.5px",
//           fontWeight: 700,
//           cursor: "pointer",
//         }}
//       >
//         Sign out
//       </button>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown } from "lucide-react";
import { getDashboardRoute } from "@/lib/role-routes";
import { ROUTES } from "@/config/app";
import styles from "./Navbar.module.css";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setShowLogoutConfirm(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  if (status === "loading") {
    return (
      <div
        style={{
          width: "120px",
          height: "38px",
          borderRadius: "10px",
          background: "#f1f5f9",
          flexShrink: 0,
        }}
      />
    );
  }

  // ── Logged out — existing Login / Get Started ──
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className={styles.navAuthBtns}>
        <Link href="/login" className={styles.btnLogin}>
          Login
        </Link>
        <Link href="/register" className={styles.btnGetStarted}>
          Get Started
        </Link>
      </div>
    );
  }

  // ── Logged in ──
  const user = session.user;
  const firstName = user.name?.split(" ")[0] ?? "Account";
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
  const dashboardHref = getDashboardRoute(user.role);

  return (
    <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          height: "40px",
          padding: "4px 12px 4px 4px",
          border: "1px solid #e2e8f0",
          borderRadius: "50px",
          background: "#f8fafc",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f57a22 0%, #ff9f52 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#0f172a",
            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {firstName}
        </span>
        <ChevronDown
          size={14}
          color="#64748b"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "220px",
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
            zIndex: 100,
          }}
        >
          {/* User info header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #f1f5f9",
              background: "#fafbfc",
            }}
          >
            <p
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name ?? "Account"}
            </p>
            <p
              style={{
                fontSize: "11.5px",
                color: "#94a3b8",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "6px",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "20px",
                background: "#fff4ea",
                color: "#f57a22",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {user.role?.replace("_", " ")}
            </span>
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px" }}>
            <Link
              href={dashboardHref}
              onClick={closeMenu}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 10px",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#334155",
                textDecoration: "none",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Dashboard
            </Link>
          </div>

          <div style={{ height: "1px", background: "#f1f5f9" }} />

          {/* Logout */}
          <div style={{ padding: "6px" }}>
            {!showLogoutConfirm ? (
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "9px 10px",
                  borderRadius: "9px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#dc2626",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
              </button>
            ) : (
              <div style={{ padding: "6px 4px" }}>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    margin: "0 0 8px",
                    padding: "0 6px",
                  }}
                >
                  Sign out of your account?
                </p>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => signOut({ callbackUrl: ROUTES.login })}
                    style={{
                      flex: 1,
                      height: "32px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#dc2626",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Yes, sign out
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    style={{
                      flex: 1,
                      height: "32px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      background: "#fff",
                      color: "#64748b",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function MobileUserMenu({ onClose }: { onClose: () => void }) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (status === "unauthenticated" || !session?.user) {
    return (
      <div
        className="drawerAuthGrid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}
      >
        <Link
          href="/login"
          onClick={onClose}
          style={{
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            border: "1.5px solid #f57a22",
            color: "#f57a22",
            fontSize: "13.5px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Login
        </Link>
        <Link
          href="/register"
          onClick={onClose}
          style={{
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #f57a22 0%, #ff9f52 100%)",
            color: "#fff",
            fontSize: "13.5px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Get Started
        </Link>
      </div>
    );
  }

  const user = session.user;
  const dashboardHref = getDashboardRoute(user.role);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 12px",
          background: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f57a22 0%, #ff9f52 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) ?? "U"}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.name}
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.email}
          </p>
        </div>
      </div>

      <Link
        href={dashboardHref}
        onClick={onClose}
        style={{
          height: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          border: "1.5px solid #f57a22",
          color: "#f57a22",
          fontSize: "13.5px",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Go to Dashboard
      </Link>

      <button
        onClick={() => signOut({ callbackUrl: ROUTES.login })}
        style={{
          height: "42px",
          border: "1px solid #fecaca",
          borderRadius: "10px",
          background: "#fef2f2",
          color: "#dc2626",
          fontSize: "13.5px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Sign out
      </button>
    </div>
  );
}
