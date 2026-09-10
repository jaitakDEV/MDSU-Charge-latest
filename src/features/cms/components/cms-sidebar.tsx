// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ROUTES } from "@/config/app";
// import Image from "next/image";

// const navItems = [
//   {
//     label: "Overview",
//     href: ROUTES.cms,
//     icon: (
//       <svg
//         width="14"
//         height="14"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <rect x="3" y="3" width="7" height="7" />
//         <rect x="14" y="3" width="7" height="7" />
//         <rect x="14" y="14" width="7" height="7" />
//         <rect x="3" y="14" width="7" height="7" />
//       </svg>
//     ),
//   },
//   {
//     label: "Profile",
//     href: ROUTES.cmsProfile,
//     icon: (
//       <svg
//         width="14"
//         height="14"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//         <circle cx="12" cy="7" r="4" />
//       </svg>
//     ),
//   },
//   {
//     label: "Settings",
//     href: ROUTES.cmsSettings,
//     icon: (
//       <svg
//         width="14"
//         height="14"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="12" cy="12" r="3" />
//         <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
//       </svg>
//     ),
//   },
// ];

// export function CmsSidebar() {
//   const pathname = usePathname();

//   return (
//     <aside
//       style={{
//         width: "232px",
//         flexShrink: 0,
//         background: "#fff",
//         borderRight: "1px solid #e8edf2",
//         display: "flex",
//         flexDirection: "column",
//         minHeight: "100vh",
//         position: "sticky",
//         top: 0,
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//         boxShadow: "1px 0 0 0 #f1f5f9",
//       }}
//     >
//       <div
//         style={{
//           padding: "0 1.25rem",
//           borderBottom: "1px solid #f1f5f9",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexShrink: 0,
//           background: "#fafbfc",
//         }}
//       >
//         <Image src="/mdssc-logo.svg" alt="MDSSC" width={148} height={148} />
//       </div>

//       <nav
//         style={{
//           flex: 1,
//           padding: "1.25rem 0.875rem",
//           display: "flex",
//           flexDirection: "column",
//           gap: "1px",
//           overflowY: "auto",
//         }}
//         aria-label="CMS navigation"
//       >
//         <p
//           style={{
//             fontSize: "10px",
//             fontWeight: 700,
//             color: "#b0bec5",
//             textTransform: "uppercase",
//             letterSpacing: "0.1em",
//             padding: "0 0.625rem",
//             margin: "0 0 8px",
//           }}
//         >
//           Navigation
//         </p>

//         {navItems.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 padding: "9px 12px",
//                 borderRadius: "9px",
//                 fontSize: "13.5px",
//                 fontWeight: isActive ? 600 : 450,
//                 color: isActive ? "#1d4ed8" : "#64748b",
//                 background: isActive
//                   ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
//                   : "transparent",
//                 textDecoration: "none",
//                 transition: "all 0.14s ease",
//                 border: isActive
//                   ? "1px solid #bfdbfe"
//                   : "1px solid transparent",
//                 position: "relative",
//                 letterSpacing: isActive ? "-0.1px" : "0",
//               }}
//             >
//               {isActive && (
//                 <span
//                   style={{
//                     position: "absolute",
//                     left: 0,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     width: "3px",
//                     height: "18px",
//                     borderRadius: "0 3px 3px 0",
//                     background: "#1d4ed8",
//                   }}
//                 />
//               )}

//               <span
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   width: "28px",
//                   height: "28px",
//                   borderRadius: "7px",
//                   background: isActive ? "#dbeafe" : "#f8fafc",
//                   flexShrink: 0,
//                   transition: "background 0.14s",
//                   color: isActive ? "#1d4ed8" : "#94a3b8",
//                 }}
//               >
//                 {item.icon}
//               </span>

//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>

//       <div style={{ padding: "0 1.25rem", marginBottom: "12px" }}>
//         <div
//           style={{
//             height: "1px",
//             background: "linear-gradient(to right, #f1f5f9, #e2e8f0, #f1f5f9)",
//           }}
//         />
//       </div>

//       <div
//         style={{
//           margin: "0 0.875rem 1.25rem",
//           borderRadius: "11px",
//           overflow: "hidden",
//           border: "1px solid #bfdbfe",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             padding: "10px 12px",
//             background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
//             borderBottom: "1px solid #bfdbfe",
//           }}
//         >
//           <div
//             style={{
//               width: "30px",
//               height: "30px",
//               borderRadius: "8px",
//               background: "#fff",
//               border: "1px solid #bfdbfe",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0,
//             }}
//           >
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#1d4ed8"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M12 20h9" />
//               <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//             </svg>
//           </div>
//           <div>
//             <p
//               style={{
//                 margin: 0,
//                 fontSize: "12px",
//                 fontWeight: 700,
//                 color: "#1e3a8a",
//               }}
//             >
//               CMS Editor
//             </p>
//             <p
//               style={{
//                 margin: 0,
//                 fontSize: "10.5px",
//                 color: "#3b82f6",
//                 fontWeight: 500,
//               }}
//             >
//               Limited access
//             </p>
//           </div>

//           <div style={{ marginLeft: "auto" }}>
//             <span
//               style={{
//                 display: "block",
//                 width: "7px",
//                 height: "7px",
//                 borderRadius: "50%",
//                 background: "#16a34a",
//                 boxShadow: "0 0 0 2px #dcfce7",
//               }}
//             />
//           </div>
//         </div>

//         <div style={{ padding: "10px 12px", background: "#f0f9ff" }}>
//           <p
//             style={{
//               fontSize: "11.5px",
//               color: "#3b82f6",
//               margin: 0,
//               lineHeight: 1.6,
//               fontWeight: 400,
//             }}
//           >
//             Content management features arriving in a future update.
//           </p>
//         </div>
//       </div>
//     </aside>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/app";
import Image from "next/image";

const icons = {
  overview: (
    <svg
      width="14"
      height="14"
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
  ),
  courses: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  banners: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
    </svg>
  ),
  announcements: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  blog: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  events: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  news: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  ),

  seo: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  profile: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  settings: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  ),

  jobs: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  companiesIcon: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

const navGroups = [
  {
    label: "Navigation",
    items: [{ label: "Overview", href: ROUTES.cms, icon: icons.overview }],
  },
  {
    label: "Courses",
    items: [
      { label: "My Courses", href: ROUTES.cmsCourses, icon: icons.courses },
    ],
  },
  {
    label: "Jobs & Companies",
    items: [
      { label: "Jobs", href: ROUTES.cmsJobs, icon: icons.jobs },
      {
        label: "Companies",
        href: ROUTES.cmsCompanies,
        icon: icons.companiesIcon,
      },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Banners", href: ROUTES.cmsBanners, icon: icons.banners },
      {
        label: "Announcements",
        href: ROUTES.cmsAnnouncements,
        icon: icons.announcements,
      },
      { label: "Blog", href: ROUTES.cmsBlog, icon: icons.blog },
      { label: "Events", href: ROUTES.cmsEvents, icon: icons.events },
      { label: "News", href: ROUTES.cmsNews, icon: icons.news },
      { label: "SEO", href: ROUTES.cmsSeo, icon: icons.seo },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: ROUTES.cmsProfile, icon: icons.profile },
      { label: "Settings", href: ROUTES.cmsSettings, icon: icons.settings },
    ],
  },
];

function NavLink({
  label,
  href,
  icon,
  isActive,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
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
        border: isActive ? "1px solid #bfdbfe" : "1px solid transparent",
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
          color: isActive ? "#1d4ed8" : "#94a3b8",
        }}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}

export function CmsSidebar() {
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
          gap: "0",
          overflowY: "auto",
        }}
        aria-label="CMS navigation"
      >
        {navGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: "4px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#b0bec5",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "0 0.625rem",
                margin: gi === 0 ? "0 0 8px" : "12px 0 8px",
              }}
            >
              {group.label}
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== ROUTES.cms && pathname.startsWith(item.href));
                return (
                  <NavLink
                    key={item.href}
                    label={item.label}
                    href={item.href}
                    icon={item.icon}
                    isActive={isActive}
                  />
                );
              })}
            </div>

            {gi < navGroups.length - 1 && (
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right, #f1f5f9, #e2e8f0, #f1f5f9)",
                  margin: "10px 0.625rem 0",
                }}
              />
            )}
          </div>
        ))}
      </nav>

      <div style={{ padding: "0 1.25rem", marginBottom: "12px" }}>
        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, #f1f5f9, #e2e8f0, #f1f5f9)",
          }}
        />
      </div>

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
            {icons.blog}
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
              CMS Editor
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "10.5px",
                color: "#3b82f6",
                fontWeight: 500,
              }}
            >
              Content Manager
            </p>
          </div>
          <div style={{ marginLeft: "auto" }}>
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
