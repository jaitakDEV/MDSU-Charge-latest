// import { ProviderRegisterForm } from "@/features/public/components/provider/ProviderRegisterForm";
// import Link from "next/link";

// export const metadata = {
//   title: "Register as Employer — MDSSC",
//   description: "Post jobs and internships for MDSU students",
// };

// export default function EmployerRegisterPage() {
//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, sans-serif",
//         minHeight: "100vh",
//         background: "#f8fafc",
//         padding: "2.5rem 1.5rem",
//       }}
//     >
//       <div style={{ maxWidth: "600px", margin: "0 auto" }}>
//         <div style={{ textAlign: "center", marginBottom: "2rem" }}>
//           <p
//             style={{
//               fontSize: "11px",
//               fontWeight: 700,
//               color: "#1d4ed8",
//               textTransform: "uppercase",
//               letterSpacing: "0.1em",
//               margin: "0 0 8px",
//             }}
//           >
//             For Employers
//           </p>
//           <h1
//             style={{
//               fontSize: "clamp(22px, 3.5vw, 30px)",
//               fontWeight: 800,
//               color: "#0f172a",
//               margin: "0 0 10px",
//               letterSpacing: "-0.5px",
//             }}
//           >
//             Register Your Company
//           </h1>
//           <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
//             Post job opportunities and connect with MDSU students
//           </p>
//         </div>

//         <div
//           style={{
//             background: "#fff",
//             border: "1px solid #e8edf2",
//             borderRadius: "18px",
//             padding: "2rem",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
//           }}
//         >
//           <ProviderRegisterForm />
//         </div>

//         <p
//           style={{
//             textAlign: "center",
//             fontSize: "13px",
//             color: "#94a3b8",
//             marginTop: "1.5rem",
//           }}
//         >
//           Are you a student?{" "}
//           <Link href="/register" style={{ color: "#1d4ed8", fontWeight: 600 }}>
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import { ProviderRegisterForm } from "@/features/public/components/provider/ProviderRegisterForm";
import Link from "next/link";
import { Check } from "lucide-react";
import styles from "./EmployerRegister.module.css";

export const metadata = {
  title: "Register as Employer — MDSSC",
  description: "Post jobs and internships for MDSU students",
};

const STEPS = [
  {
    num: "1",
    title: "Register",
    desc: "Tell us about your company in a couple of minutes",
  },
  {
    num: "2",
    title: "Get verified",
    desc: "Our team reviews and approves your employer profile",
  },
  {
    num: "3",
    title: "Post & hire",
    desc: "List jobs and internships, and connect with students directly",
  },
];

const BENEFITS = [
  "Direct access to MDSU's student and alumni talent pool",
  "Free job and internship postings, no listing fees",
  "A verified employer badge on your company profile",
  "Dedicated placement-cell support for campus hiring",
];

export default function EmployerRegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* ── Info panel ── */}
        <div className={styles.infoPanel}>
          <div className={styles.infoCircle1} aria-hidden="true" />
          <div className={styles.infoCircle2} aria-hidden="true" />

          <div className={styles.infoContent}>
            <p className={styles.infoEyebrow}>For Employers</p>
            <h1 className={styles.infoTitle}>
              Hire from MDSU&apos;s next generation of talent
            </h1>
            <p className={styles.infoDesc}>
              Register your company to post jobs and internships, and connect
              directly with students and alumni of MDS University.
            </p>

            <ol className={styles.stepsList}>
              {STEPS.map((step) => (
                <li key={step.num} className={styles.stepItem}>
                  <span className={styles.stepNum}>{step.num}</span>
                  <span className={styles.stepText}>
                    <span className={styles.stepTitle}>{step.title}</span>
                    <span className={styles.stepDesc}>{step.desc}</span>
                  </span>
                </li>
              ))}
            </ol>

            <ul className={styles.benefitsList}>
              {BENEFITS.map((b) => (
                <li key={b} className={styles.benefitItem}>
                  <Check
                    size={14}
                    className={styles.benefitIcon}
                    aria-hidden="true"
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Form panel ── */}
        <div className={styles.formPanel}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Create your employer account</h2>
            <p className={styles.formSubtitle}>
              It only takes a couple of minutes — you can complete your company
              profile afterwards.
            </p>
          </div>

          <ProviderRegisterForm />

          <p className={styles.studentLink}>
            Are you a student?{" "}
            <Link href="/register" className={styles.studentLinkAnchor}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
