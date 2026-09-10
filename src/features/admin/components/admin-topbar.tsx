// "use client";

// import { signOut } from "next-auth/react";
// import { usePathname } from "next/navigation";
// import { ROUTES } from "@/config/app";
// import type { Session } from "next-auth";
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
// import Image from "next/image";

// const pageTitles: Record<string, string> = {
//   [ROUTES.admin]: "Overview",
//   [ROUTES.adminUsers]: "Users",
//   [ROUTES.adminProfile]: "Profile",
//   [ROUTES.adminSettings]: "Settings",
// };

// export function AdminTopbar({ user }: { user: Session["user"] }) {
//   const pathname = usePathname();
//   const base = "/" + pathname.split("/").slice(1, 3).join("/");
//   const title = pageTitles[pathname] ?? pageTitles[base] ?? "Admin";

//   const firstLetter = (user?.name ?? "A")[0].toUpperCase();
//   const firstName = user?.name?.split(" ")[0] ?? "Admin";

//   return (
//     <header
//       style={{
//         height: "58px",
//         borderBottom: "1px solid #e8edf2",
//         background: "#fff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "0 1.75rem",
//         flexShrink: 0,
//         position: "sticky",
//         top: 0,
//         zIndex: 10,
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//         boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           flexShrink: 0,
//         }}
//       >
//         <Image src="/charge-logo.svg" alt="MDSSC" width={120} height={32} />
//       </div>
//       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <h1
//             style={{
//               fontSize: "15px",
//               fontWeight: 700,
//               color: "#0f172a",
//               margin: 0,
//               letterSpacing: "-0.3px",
//             }}
//           >
//             {title}
//           </h1>

//           <span
//             style={{
//               fontSize: "10px",
//               padding: "2px 9px",
//               borderRadius: "6px",
//               background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
//               color: "#dc2626",
//               fontWeight: 700,
//               textTransform: "uppercase",
//               letterSpacing: "0.07em",
//               border: "1px solid #fecaca",
//             }}
//           >
//             Admin
//           </span>
//         </div>
//       </div>
//       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             padding: "5px 12px 5px 5px",
//             border: "1px solid #e2e8f0",
//             borderRadius: "50px",
//             background: "#f8fafc",
//             boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
//           }}
//         >
//           <div
//             style={{
//               width: "26px",
//               height: "26px",
//               borderRadius: "50%",
//               background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "11px",
//               fontWeight: 700,
//               color: "#fff",
//               flexShrink: 0,
//               letterSpacing: "-0.3px",
//             }}
//           >
//             {firstLetter}
//           </div>
//           <span
//             style={{ fontSize: "12.5px", fontWeight: 600, color: "#334155" }}
//           >
//             {firstName}
//           </span>
//         </div>

//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <button
//               style={{
//                 height: "34px",
//                 padding: "0 14px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 background: "#fff",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "9px",
//                 cursor: "pointer",
//                 fontSize: "12.5px",
//                 color: "#64748b",
//                 fontWeight: 600,
//                 boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
//                 transition: "all 0.14s ease",
//                 letterSpacing: "-0.1px",
//               }}
//             >
//               <svg
//                 width="13"
//                 height="13"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#94a3b8"
//                 strokeWidth="2.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                 <polyline points="16 17 21 12 16 7" />
//                 <line x1="21" y1="12" x2="9" y2="12" />
//               </svg>
//               Sign out
//             </button>
//           </AlertDialogTrigger>

//           <AlertDialogContent
//             style={{
//               borderRadius: "16px",
//               border: "1px solid #e2e8f0",
//               boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
//               padding: "0",
//               overflow: "hidden",
//               maxWidth: "400px",
//               fontFamily:
//                 "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//             }}
//           >
//             <div
//               style={{
//                 height: "4px",
//                 background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
//               }}
//             />

//             <div style={{ padding: "1.5rem 1.5rem 1.25rem" }}>
//               <AlertDialogHeader>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "10px",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: "38px",
//                       height: "38px",
//                       borderRadius: "10px",
//                       background: "#fef2f2",
//                       border: "1px solid #fecaca",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexShrink: 0,
//                     }}
//                   >
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="#dc2626"
//                       strokeWidth="2.2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                       <polyline points="16 17 21 12 16 7" />
//                       <line x1="21" y1="12" x2="9" y2="12" />
//                     </svg>
//                   </div>
//                   <AlertDialogTitle
//                     style={{
//                       fontSize: "15px",
//                       fontWeight: 700,
//                       color: "#0f172a",
//                       margin: 0,
//                       letterSpacing: "-0.3px",
//                     }}
//                   >
//                     Sign out of MDSSC?
//                   </AlertDialogTitle>
//                 </div>
//                 <AlertDialogDescription
//                   style={{
//                     fontSize: "13px",
//                     color: "#64748b",
//                     margin: 0,
//                     lineHeight: 1.6,
//                     paddingLeft: "48px",
//                   }}
//                 >
//                   You will be redirected to the login page. Any unsaved changes
//                   will be lost.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//             </div>

//             <AlertDialogFooter
//               style={{
//                 padding: "1rem 1.5rem 1.5rem",
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: "8px",
//                 borderTop: "1px solid #f1f5f9",
//                 background: "#fafafa",
//               }}
//             >
//               <AlertDialogCancel
//                 style={{
//                   height: "36px",
//                   padding: "0 16px",
//                   borderRadius: "9px",
//                   border: "1px solid #e2e8f0",
//                   background: "#fff",
//                   fontSize: "13px",
//                   fontWeight: 600,
//                   color: "#64748b",
//                   cursor: "pointer",
//                   letterSpacing: "-0.1px",
//                 }}
//               >
//                 Cancel
//               </AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={() => signOut({ callbackUrl: ROUTES.login })}
//                 style={{
//                   height: "36px",
//                   padding: "0 18px",
//                   borderRadius: "9px",
//                   border: "none",
//                   background:
//                     "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
//                   fontSize: "13px",
//                   fontWeight: 600,
//                   color: "#fff",
//                   cursor: "pointer",
//                   letterSpacing: "-0.1px",
//                   boxShadow: "0 2px 6px rgba(29,78,216,0.3)",
//                 }}
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

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/app";
import type { Session } from "next-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

export function AdminTopbar({ user }: { user: Session["user"] }) {
  const pathname = usePathname();
  const base = "/" + pathname.split("/").slice(1, 3).join("/");

  const firstLetter = (user?.name ?? "A")[0].toUpperCase();
  const firstName = user?.name?.split(" ")[0] ?? "Admin";

  return (
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
            Admin
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
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#334155",
            }}
          >
            {firstName}
          </span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
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
          </AlertDialogTrigger>

          <AlertDialogContent
            style={{
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              padding: "0",
              overflow: "hidden",
              maxWidth: "400px",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            <div
              style={{
                height: "4px",
                background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
              }}
            />

            <div style={{ padding: "1.5rem 1.5rem 1.25rem" }}>
              <AlertDialogHeader>
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
                  <AlertDialogTitle
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: 0,
                      letterSpacing: "-0.3px",
                    }}
                  >
                    Sign out of MDSSC?
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    margin: 0,
                    lineHeight: 1.6,
                    paddingLeft: "48px",
                  }}
                >
                  You will be redirected to the login page. Any unsaved changes
                  will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>

            <AlertDialogFooter
              style={{
                padding: "1rem 1.5rem 1.5rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <AlertDialogCancel
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
              </AlertDialogCancel>
              <AlertDialogAction
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
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
