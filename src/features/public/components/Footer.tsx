// import Link from "next/link";
// import Image from "next/image";
// import type { ReactElement } from "react";
// import styles from "./footer.module.css";

// interface QuickLink {
//   label: string;
//   href: string;
// }

// interface NavLink {
//   label: string;
//   href: string;
// }

// interface NavColumn {
//   title: string;
//   links: NavLink[];
// }

// interface Social {
//   label: string;
//   href: string;
//   icon: ReactElement;
// }

// const QUICK_LINKS: QuickLink[] = [
//   {
//     label: "Photo gallery and press news",
//     href: "https://mdsuajmer.ac.in/photos.php",
//   },
//   {
//     label: "Academic Bank of Credits (ABC)",
//     href: "https://mdsuajmer.ac.in/nad-abc-scheme",
//   },
//   { label: "UGC Notices", href: "https://www.ugc.gov.in/Notices" },
//   { label: "Guest House", href: "https://mdsuajmer.ac.in/guest-house" },
//   {
//     label: "Research - Development",
//     href: "https://mdsuajmer.ac.in/Research-Development",
//   },
//   { label: "Video gallery", href: "https://mdsuajmer.ac.in/videos.php" },
//   { label: "CSR Certificate", href: "https://mdsuajmer.ac.in/CSR-Certificate" },
//   { label: "Documentary", href: "https://mdsuajmer.ac.in/MDSU-documentary" },
//   { label: "Alumni", href: "https://mdsuajmer.ac.in/Alumni" },
//   { label: "RTI", href: "https://mdsuajmer.ac.in/rti-acts" },
//   {
//     label: "Academic Integrity",
//     href: "https://mdsuajmer.ac.in/Academic-Integrity",
//   },
//   {
//     label: "Forms and Formats",
//     href: "https://mdsuajmer.ac.in/forms-and-formats",
//   },
//   {
//     label: "Foreign Admission",
//     href: "https://mdsuajmer.ac.in/Foriegn-Student",
//   },
//   { label: "NIRF", href: "https://mdsuajmer.ac.in/NIRF" },
//   { label: "SC/ST/OBC Cell", href: "https://mdsuajmer.ac.in/sc-st-cell" },
//   {
//     label: "University Bulletin and Reports",
//     href: "https://mdsuajmer.ac.in/annual-report",
//   },
//   { label: "AICTE", href: "https://www.aicte.gov.in/" },
//   { label: "Grievance", href: "https://mdsuajmer.ac.in/Grievance" },
//   {
//     label: "NSS Cell",
//     href: "https://mdsuajmer.ac.in/national-service-scheme",
//   },
//   {
//     label: "Equal opportunity",
//     href: "https://mdsuajmer.ac.in/equal-opportunity-cell",
//   },
//   { label: "Anti Ragging", href: "https://mdsuajmer.ac.in/anti-ragging" },
//   {
//     label: "Internal Quality Assurance Cell (IQAC)",
//     href: "https://mdsuajmer.ac.in/iqac",
//   },
//   {
//     label: "Internal Complaint Committee",
//     href: "https://mdsuajmer.ac.in/internal-complaint-committee",
//   },
//   {
//     label: "Service rules and Roster",
//     href: "https://mdsuajmer.ac.in/service-rules-and-ordinance",
//   },
//   {
//     label: "Centre of Excellence/ Shodhpeeth",
//     href: "https://mdsuajmer.ac.in/centres-and-peeth",
//   },
//   {
//     label: "Anti Sexual Harassment Cell",
//     href: "https://mdsuajmer.ac.in/Anti-Sexual-Harassment-Cell",
//   },
//   { label: "AISHE", href: "https://aishe.gov.in/" },
//   {
//     label: "Mental health and well-being",
//     href: "https://mdsuajmer.ac.in/Mental-health-and-well-being",
//   },
//   {
//     label: "Public Self-Disclosure",
//     href: "https://mdsuajmer.ac.in/Public-Self-Declaration",
//   },
//   {
//     label: "National Archives of India",
//     href: "https://www.abhilekh-patal.in/",
//   },
//   { label: "Bhavya Bhavans", href: "https://mdsuajmer.ac.in/Bhavya-Bhavans" },
//   { label: "UGC-INFLIBNET Centre", href: "https://inflibnet.ac.in/" },
//   { label: "IPR Guidelines", href: "https://mdsuajmer.ac.in/ipr-cell" },
//   { label: "CUG", href: "https://mdsuajmer.ac.in/cug-portal" },
// ];

// const NAV_COLUMNS: NavColumn[] = [
//   {
//     title: "About",
//     links: [
//       { label: "About Us", href: "/about-us" },
//       { label: "Vision & Mission", href: "/vision-mission" },
//       { label: "Governance", href: "/our-team" },
//       { label: "Accreditations", href: "#" },
//       { label: "Campus Life", href: "#" },
//     ],
//   },
//   {
//     title: "Academics",
//     links: [
//       { label: "Programmes", href: "#" },
//       { label: "Admissions", href: "#" },
//       { label: "Academics", href: "#" },
//       { label: "Faculty & Research", href: "#" },
//       { label: "Examinations", href: "#" },
//     ],
//   },
//   {
//     title: "Services",
//     links: [
//       { label: "Membership Plans", href: "/pricing" },
//       { label: "Consultancy", href: "#" },
//       { label: "Registration Help", href: "#" },
//       { label: "Courses", href: "/courses" },
//       { label: "Contact Us", href: "#" },
//     ],
//   },
// ];

// const SOCIALS: Social[] = [
//   {
//     label: "Facebook",
//     href: "https://www.facebook.com/mysba.co.in",
//     icon: (
//       <svg
//         width="15"
//         height="15"
//         viewBox="0 0 24 24"
//         fill="currentColor"
//         aria-hidden="true"
//       >
//         <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
//       </svg>
//     ),
//   },
//   {
//     label: "Instagram",
//     href: "https://www.instagram.com/mysba.co.in/",
//     icon: (
//       <svg
//         width="15"
//         height="15"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         aria-hidden="true"
//       >
//         <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
//         <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//         <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
//       </svg>
//     ),
//   },
//   {
//     label: "X (Twitter)",
//     href: "https://twitter.com",
//     icon: (
//       <svg
//         width="14"
//         height="14"
//         viewBox="0 0 24 24"
//         fill="currentColor"
//         aria-hidden="true"
//       >
//         <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//       </svg>
//     ),
//   },
//   {
//     label: "YouTube",
//     href: "https://www.youtube.com/@mysba-swavalambibharatabhi565",
//     icon: (
//       <svg
//         width="15"
//         height="15"
//         viewBox="0 0 24 24"
//         fill="currentColor"
//         aria-hidden="true"
//       >
//         <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
//         <polygon
//           points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
//           fill="white"
//         />
//       </svg>
//     ),
//   },
//   {
//     label: "LinkedIn",
//     href: "https://linkedin.com",
//     icon: (
//       <svg
//         width="15"
//         height="15"
//         viewBox="0 0 24 24"
//         fill="currentColor"
//         aria-hidden="true"
//       >
//         <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
//         <rect x="2" y="9" width="4" height="12" />
//         <circle cx="4" cy="4" r="2" />
//       </svg>
//     ),
//   },
//   {
//     label: "Mail",
//     href: "https://mail.google.com/mail/?view=cm&fs=1&to=info@mysba.co.in",
//     icon: (
//       <svg
//         width="15"
//         height="15"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         aria-hidden="true"
//       >
//         <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//         <polyline points="22,6 12,13 2,6" />
//       </svg>
//     ),
//   },
// ];

// export function Footer(): ReactElement {
//   return (
//     <footer className={styles.footer}>
//       <div className={styles.topStrip}>
//         <div className={styles.linksGrid}>
//           {QUICK_LINKS.map((link) => (
//             <Link key={link.label} href={link.href} className={styles.linkItem}>
//               {link.label}
//             </Link>
//           ))}
//         </div>
//       </div>

//       <div className={styles.mainFooter}>
//         <div className={styles.brandCol}>
//           <div className={styles.logoRow}>
//             <div className={styles.logoPlaceholder}>
//               <Image
//                 src="/mdssc-logo.svg"
//                 alt="MDSSC"
//                 width={180}
//                 height={56}
//                 style={{ objectFit: "contain" }}
//               />
//             </div>

//             <span className={styles.logoDivider} aria-hidden="true" />

//             <div className={styles.logoPlaceholder}>
//               <Image
//                 src="/charge-logo.svg"
//                 alt="MDSU-CHARGE"
//                 width={160}
//                 height={56}
//                 style={{ objectFit: "contain" }}
//               />
//             </div>
//           </div>

//           <p className={styles.brandDesc}>
//             MDSU-CHARGE is a knowledge-driven platform committed to empowering
//             India's MSME ecosystem through education, consultancy, and
//             institutional support.
//           </p>

//           <div className={styles.socials}>
//             {SOCIALS.map((s) => (
//               <a
//                 key={s.label}
//                 href={s.href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={styles.socialBtn}
//                 aria-label={s.label}
//               >
//                 {s.icon}
//               </a>
//             ))}
//           </div>
//         </div>

//         {NAV_COLUMNS.map((col) => (
//           <div key={col.title} className={styles.navCol}>
//             <p className={styles.navColTitle}>{col.title}</p>
//             <ul className={styles.navList}>
//               {col.links.map((link) => (
//                 <li key={link.label}>
//                   <Link href={link.href} className={styles.navLink}>
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>

//       <div className={styles.contactRow}>
//         <a href="tel:18001231104" className={styles.contactItem}>
//           <span className={styles.contactIcon}>
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               aria-hidden="true"
//             >
//               <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
//             </svg>
//           </span>
//           1800-123-0000
//         </a>
//         <a
//           href="mailto:admissions@mdsucharge.in"
//           className={styles.contactItem}
//         >
//           <span className={styles.contactIcon}>
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               aria-hidden="true"
//             >
//               <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//               <polyline points="22,6 12,13 2,6" />
//             </svg>
//           </span>
//           admissions@mdsucharge.in
//         </a>
//         <a
//           href="https://maps.google.com"
//           target="_blank"
//           rel="noopener noreferrer"
//           className={styles.contactItem}
//         >
//           <span className={styles.contactIcon}>
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               aria-hidden="true"
//             >
//               <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
//               <circle cx="12" cy="10" r="3" />
//             </svg>
//           </span>
//           MDS University, Ajmer, Rajasthan
//         </a>
//       </div>

//       <div className={styles.bottomBar}>
//         <div className={styles.bottomBarInner}>
//           <span className={styles.copyright}>
//             © {new Date().getFullYear()} MDSU-CHARGE. All rights reserved.
//           </span>

//           <div className={styles.bottomLinks}>
//             <Link href="#" className={styles.bottomLink}>
//               Privacy Policy
//             </Link>
//             <Link href="#" className={styles.bottomLink}>
//               Terms of Use
//             </Link>
//             <Link href="#" className={styles.bottomLink}>
//               Disclaimer
//             </Link>
//             <Link href="#" className={styles.bottomLink}>
//               Sitemap
//             </Link>
//           </div>

//           <a
//             href="https://maviait.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.designedBy}
//           >
//             <span className={styles.maviaLogoBox}>
//               <Image
//                 src="/mavian-it-logo.svg"
//                 alt="Designed & Maintained by MaviaIT"
//                 width={205}
//                 height={60}
//                 className={styles.maviaLogo}
//                 style={{ objectFit: "contain" }}
//               />
//             </span>
//           </a>
//         </div>
//       </div>
//     </footer>
//   );
// }

import Link from "next/link";
import Image from "next/image";
import type { ReactElement } from "react";
import styles from "./footer.module.css";

interface QuickLink {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
}

interface NavColumn {
  title: string;
  links: NavLink[];
}

interface Social {
  label: string;
  href: string;
  icon: ReactElement;
}

const QUICK_LINKS: QuickLink[] = [
  {
    label: "Photo gallery and press news",
    href: "https://mdsuajmer.ac.in/photos.php",
  },
  {
    label: "Academic Bank of Credits (ABC)",
    href: "https://mdsuajmer.ac.in/nad-abc-scheme",
  },
  { label: "UGC Notices", href: "https://www.ugc.gov.in/Notices" },
  { label: "Guest House", href: "https://mdsuajmer.ac.in/guest-house" },
  {
    label: "Research - Development",
    href: "https://mdsuajmer.ac.in/Research-Development",
  },
  { label: "Video gallery", href: "https://mdsuajmer.ac.in/videos.php" },
  { label: "CSR Certificate", href: "https://mdsuajmer.ac.in/CSR-Certificate" },
  { label: "Documentary", href: "https://mdsuajmer.ac.in/MDSU-documentary" },
  { label: "Alumni", href: "https://mdsuajmer.ac.in/Alumni" },
  { label: "RTI", href: "https://mdsuajmer.ac.in/rti-acts" },
  {
    label: "Academic Integrity",
    href: "https://mdsuajmer.ac.in/Academic-Integrity",
  },
  {
    label: "Forms and Formats",
    href: "https://mdsuajmer.ac.in/forms-and-formats",
  },
  {
    label: "Foreign Admission",
    href: "https://mdsuajmer.ac.in/Foriegn-Student",
  },
  { label: "NIRF", href: "https://mdsuajmer.ac.in/NIRF" },
  { label: "SC/ST/OBC Cell", href: "https://mdsuajmer.ac.in/sc-st-cell" },
  {
    label: "University Bulletin and Reports",
    href: "https://mdsuajmer.ac.in/annual-report",
  },
  { label: "AICTE", href: "https://www.aicte.gov.in/" },
  { label: "Grievance", href: "https://mdsuajmer.ac.in/Grievance" },
  {
    label: "NSS Cell",
    href: "https://mdsuajmer.ac.in/national-service-scheme",
  },
  {
    label: "Equal opportunity",
    href: "https://mdsuajmer.ac.in/equal-opportunity-cell",
  },
  { label: "Anti Ragging", href: "https://mdsuajmer.ac.in/anti-ragging" },
  {
    label: "Internal Quality Assurance Cell (IQAC)",
    href: "https://mdsuajmer.ac.in/iqac",
  },
  {
    label: "Internal Complaint Committee",
    href: "https://mdsuajmer.ac.in/internal-complaint-committee",
  },
  {
    label: "Service rules and Roster",
    href: "https://mdsuajmer.ac.in/service-rules-and-ordinance",
  },
  {
    label: "Centre of Excellence/ Shodhpeeth",
    href: "https://mdsuajmer.ac.in/centres-and-peeth",
  },
  {
    label: "Anti Sexual Harassment Cell",
    href: "https://mdsuajmer.ac.in/Anti-Sexual-Harassment-Cell",
  },
  { label: "AISHE", href: "https://aishe.gov.in/" },
  {
    label: "Mental health and well-being",
    href: "https://mdsuajmer.ac.in/Mental-health-and-well-being",
  },
  {
    label: "Public Self-Disclosure",
    href: "https://mdsuajmer.ac.in/Public-Self-Declaration",
  },
  {
    label: "National Archives of India",
    href: "https://www.abhilekh-patal.in/",
  },
  { label: "Bhavya Bhavans", href: "https://mdsuajmer.ac.in/Bhavya-Bhavans" },
  { label: "UGC-INFLIBNET Centre", href: "https://inflibnet.ac.in/" },
  { label: "IPR Guidelines", href: "https://mdsuajmer.ac.in/ipr-cell" },
  { label: "CUG", href: "https://mdsuajmer.ac.in/cug-portal" },
];

const NAV_COLUMNS: NavColumn[] = [
  {
    title: "About",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Vision & Mission", href: "/vision-mission" },
      { label: "Governance", href: "/our-team" },
      { label: "Accreditations", href: "#" },
      { label: "Campus Life", href: "#" },
    ],
  },
  {
    title: "Academics",
    links: [
      { label: "Programmes", href: "#" },
      { label: "Admissions", href: "#" },
      { label: "Academics", href: "#" },
      { label: "Faculty & Research", href: "#" },
      { label: "Examinations", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Membership Plans", href: "/pricing" },
      { label: "Consultancy", href: "#" },
      { label: "Registration Help", href: "#" },
      { label: "Courses", href: "/courses" },
      { label: "Contact Us", href: "#" },
    ],
  },
];

const SOCIALS: Social[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/mysba.co.in",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mysba.co.in/",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@mysba-swavalambibharatabhi565",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
          fill="white"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Mail",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=info@mysba.co.in",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export function Footer(): ReactElement {
  return (
    <footer className={styles.footer}>
      <div className={styles.topStrip}>
        {/*
          Pure-CSS collapsible "quick links" panel.
          On mobile this list is very long, so it renders collapsed
          (a few rows + a "Show more" toggle). On desktop/tablet the
          checkbox + label are hidden and the full grid is always shown.
          No client-side JS/state needed — the component stays a
          server component.
        */}
        <input
          type="checkbox"
          id="footer-quick-links-toggle"
          className={styles.linksToggleInput}
          aria-hidden="true"
        />

        <div className={styles.linksGridWrap}>
          <div className={styles.linksGrid}>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={styles.linkItem}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <label
          htmlFor="footer-quick-links-toggle"
          className={styles.linksToggleLabel}
        >
          <span className={styles.showMoreText}>Show more links</span>
          <span className={styles.showLessText}>Show less</span>
          <svg
            className={styles.toggleChevron}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </label>
      </div>

      <div className={styles.mainFooter}>
        <div className={styles.brandCol}>
          <div className={styles.logoRow}>
            <div className={styles.logoPlaceholder}>
              <Image
                src="/mdssc-logo.svg"
                alt="MDSSC"
                width={180}
                height={56}
                style={{ objectFit: "contain" }}
              />
            </div>

            <span className={styles.logoDivider} aria-hidden="true" />

            <div className={styles.logoPlaceholder}>
              <Image
                src="/charge-logo.svg"
                alt="MDSU-CHARGE"
                width={160}
                height={56}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          <p className={styles.brandDesc}>
            MDSU-CHARGE is a knowledge-driven platform committed to empowering
            India's MSME ecosystem through education, consultancy, and
            institutional support.
          </p>

          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {NAV_COLUMNS.map((col) => (
          <div key={col.title} className={styles.navCol}>
            <p className={styles.navColTitle}>{col.title}</p>
            <ul className={styles.navList}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.navLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.contactRow}>
        <a href="tel:18001231104" className={styles.contactItem}>
          <span className={styles.contactIcon}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
            </svg>
          </span>
          1800-123-0000
        </a>
        <a
          href="mailto:admissions@mdsucharge.in"
          className={styles.contactItem}
        >
          <span className={styles.contactIcon}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </span>
          admissions@mdsucharge.in
        </a>
        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactItem}
        >
          <span className={styles.contactIcon}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          MDS University, Ajmer, Rajasthan
        </a>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} MDSU-CHARGE. All rights reserved.
          </span>

          <div className={styles.bottomLinks}>
            <Link href="#" className={styles.bottomLink}>
              Privacy Policy
            </Link>
            <Link href="#" className={styles.bottomLink}>
              Terms of Use
            </Link>
            <Link href="#" className={styles.bottomLink}>
              Disclaimer
            </Link>
            <Link href="#" className={styles.bottomLink}>
              Sitemap
            </Link>
          </div>

          <a
            href="https://maviait.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.designedBy}
          >
            <span className={styles.maviaLogoBox}>
              <Image
                src="/mavian-it-logo.svg"
                alt="Designed & Maintained by MaviaIT"
                width={205}
                height={60}
                className={styles.maviaLogo}
                style={{ objectFit: "contain" }}
              />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
