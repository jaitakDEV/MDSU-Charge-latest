// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { UploadField } from "@/features/cms/components/upload-field";

// type FormData = {
//   companyName: string;
//   companyType: string;
//   industry: string;
//   website: string;
//   companySize: string;
//   description: string;
//   headquarters: string;
//   city: string;
//   state: string;
//   contactPerson: string;
//   designation: string;
//   email: string;
//   password: string;
//   contactPhone: string;
//   logoUrl: string;
//   panNumber: string;
//   udyamCertificateUrl: string;
//   termsAccepted: boolean;
// };

// const INITIAL: FormData = {
//   companyName: "",
//   companyType: "COMPANY",
//   industry: "",
//   website: "",
//   companySize: "STARTUP_1_10",
//   description: "",
//   headquarters: "",
//   city: "",
//   state: "",
//   contactPerson: "",
//   designation: "",
//   email: "",
//   password: "",
//   contactPhone: "",
//   logoUrl: "",
//   panNumber: "",
//   udyamCertificateUrl: "",
//   termsAccepted: false,
// };

// const COMPANY_TYPES = [
//   { value: "COMPANY", label: "Company" },
//   { value: "STARTUP", label: "Startup" },
//   { value: "NGO", label: "NGO" },
//   { value: "INSTITUTE", label: "Institute" },
//   { value: "FREELANCER", label: "Freelancer" },
//   { value: "RECRUITER", label: "Recruiter / Agency" },
// ];

// const COMPANY_SIZES = [
//   { value: "STARTUP_1_10", label: "1-10 employees" },
//   { value: "SMALL_11_50", label: "11-50 employees" },
//   { value: "MEDIUM_51_200", label: "51-200 employees" },
//   { value: "LARGE_201_500", label: "201-500 employees" },
//   { value: "ENTERPRISE_500_PLUS", label: "500+ employees" },
// ];

// const inp: React.CSSProperties = {
//   width: "100%",
//   height: "42px",
//   padding: "0 12px",
//   border: "1px solid #e2e8f0",
//   borderRadius: "10px",
//   fontSize: "13.5px",
//   outline: "none",
//   background: "#fff",
// };

// function Field({
//   label,
//   children,
//   required,
//   hint,
// }: {
//   label: string;
//   children: React.ReactNode;
//   required?: boolean;
//   hint?: string;
// }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
//       <label
//         style={{
//           fontSize: "12.5px",
//           fontWeight: 600,
//           color: "#374151",
//           display: "flex",
//           gap: "4px",
//         }}
//       >
//         {label}
//         {required && <span style={{ color: "#ef4444" }}>*</span>}
//       </label>
//       {hint && (
//         <span
//           style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "-2px" }}
//         >
//           {hint}
//         </span>
//       )}
//       {children}
//     </div>
//   );
// }

// export function ProviderRegisterForm() {
//   const router = useRouter();
//   const [form, setForm] = useState<FormData>(INITIAL);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   function update(key: keyof FormData, value: string | boolean) {
//     setForm((p) => ({ ...p, [key]: value }));
//     setError("");
//   }

//   function validateStep(): string | null {
//     if (step === 0) {
//       if (!form.companyName.trim()) return "Company name is required.";
//       if (!form.industry.trim()) return "Industry is required.";
//       if (!form.headquarters.trim()) return "Headquarters is required.";
//       if (!form.city.trim()) return "City is required.";
//       if (!form.state.trim()) return "State is required.";
//     }
//     if (step === 1) {
//       if (!form.contactPerson.trim()) return "Contact person name is required.";
//       if (!form.designation.trim()) return "Designation is required.";
//       if (!form.email.trim()) return "Email is required.";
//       if (form.password.length < 8)
//         return "Password must be at least 8 characters.";
//       if (form.contactPhone.length < 10) return "Enter a valid phone number.";
//     }
//     if (step === 2) {
//       if (
//         !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber.trim().toUpperCase())
//       )
//         return "Enter a valid PAN number (e.g. ABCDE1234F).";
//       if (!form.udyamCertificateUrl)
//         return "Please upload your Udyam Certificate.";
//       if (!form.termsAccepted)
//         return "You must accept the Terms & Conditions to continue.";
//     }
//     return null;
//   }

//   function handleNext() {
//     const err = validateStep();
//     if (err) {
//       setError(err);
//       return;
//     }
//     setStep((s) => s + 1);
//   }

//   async function handleSubmit() {
//     const err = validateStep();
//     if (err) {
//       setError(err);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const res = await fetch("/api/provider/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     const json = await res.json();
//     setLoading(false);

//     if (!json.success) {
//       setError(json.error ?? "Registration failed.");
//       return;
//     }
//     setSuccess(true);
//   }

//   if (success) {
//     return (
//       <div style={{ textAlign: "center", padding: "2rem 0" }}>
//         <div
//           style={{
//             width: "60px",
//             height: "60px",
//             borderRadius: "50%",
//             background: "#f0fdf4",
//             border: "2px solid #86efac",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             margin: "0 auto 16px",
//             fontSize: "26px",
//           }}
//         >
//           ✓
//         </div>
//         <h2
//           style={{
//             fontSize: "20px",
//             fontWeight: 800,
//             color: "#0f172a",
//             margin: "0 0 8px",
//           }}
//         >
//           Registration submitted!
//         </h2>
//         <p
//           style={{
//             fontSize: "14px",
//             color: "#64748b",
//             lineHeight: 1.6,
//             maxWidth: "380px",
//             margin: "0 auto",
//           }}
//         >
//           Check your email to verify your account. Your company profile is now
//           pending review — we'll notify you once approved.
//         </p>
//         <Link
//           href="/login"
//           style={{
//             display: "inline-block",
//             marginTop: "20px",
//             height: "42px",
//             lineHeight: "42px",
//             padding: "0 24px",
//             borderRadius: "10px",
//             background: "#1d4ed8",
//             color: "#fff",
//             fontSize: "13.5px",
//             fontWeight: 700,
//             textDecoration: "none",
//           }}
//         >
//           Go to Login
//         </Link>
//       </div>
//     );
//   }

//   const steps = [
//     "Company Details",
//     "Contact & Account",
//     "Compliance & Consent",
//   ];
//   return (
//     <div>
//       {/* Step indicator */}
//       <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
//         {steps.map((label, i) => (
//           <div key={label} style={{ flex: 1 }}>
//             <div
//               style={{
//                 height: "3px",
//                 borderRadius: "2px",
//                 background: i <= step ? "#1d4ed8" : "#e2e8f0",
//                 marginBottom: "6px",
//               }}
//             />
//             <p
//               style={{
//                 fontSize: "11.5px",
//                 fontWeight: i === step ? 700 : 500,
//                 color: i === step ? "#1d4ed8" : "#94a3b8",
//               }}
//             >
//               {label}
//             </p>
//           </div>
//         ))}
//       </div>

//       {step === 0 && (
//         <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
//           <Field label="Company Name" required>
//             <input
//               value={form.companyName}
//               onChange={(e) => update("companyName", e.target.value)}
//               placeholder="Mavian IT Pvt. Ltd."
//               style={inp}
//             />
//           </Field>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "12px",
//             }}
//           >
//             <Field label="Company Type" required>
//               <select
//                 value={form.companyType}
//                 onChange={(e) => update("companyType", e.target.value)}
//                 style={inp}
//               >
//                 {COMPANY_TYPES.map((t) => (
//                   <option key={t.value} value={t.value}>
//                     {t.label}
//                   </option>
//                 ))}
//               </select>
//             </Field>
//             <Field label="Company Size" required>
//               <select
//                 value={form.companySize}
//                 onChange={(e) => update("companySize", e.target.value)}
//                 style={inp}
//               >
//                 {COMPANY_SIZES.map((s) => (
//                   <option key={s.value} value={s.value}>
//                     {s.label}
//                   </option>
//                 ))}
//               </select>
//             </Field>
//           </div>

//           <Field
//             label="Industry"
//             required
//             hint="e.g. Information Technology, Finance, Healthcare"
//           >
//             <input
//               value={form.industry}
//               onChange={(e) => update("industry", e.target.value)}
//               placeholder="Information Technology"
//               style={inp}
//             />
//           </Field>

//           <Field label="Website">
//             <input
//               value={form.website}
//               onChange={(e) => update("website", e.target.value)}
//               placeholder="https://mavianit.com"
//               style={inp}
//             />
//           </Field>

//           <Field label="Company Logo">
//             <UploadField
//               label="Company Logo"
//               endpoint="companyLogoUploader"
//               fileType="image"
//               currentUrl={form.logoUrl}
//               onUploadComplete={(url) => update("logoUrl", url)}
//             />
//           </Field>

//           <Field label="Company Description">
//             <textarea
//               value={form.description}
//               onChange={(e) => update("description", e.target.value)}
//               placeholder="Brief description of your company"
//               style={{
//                 ...inp,
//                 height: "90px",
//                 padding: "10px 12px",
//                 resize: "vertical",
//               }}
//             />
//           </Field>

//           <Field label="Headquarters Address" required>
//             <input
//               value={form.headquarters}
//               onChange={(e) => update("headquarters", e.target.value)}
//               placeholder="Full headquarters address"
//               style={inp}
//             />
//           </Field>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "12px",
//             }}
//           >
//             <Field label="City" required>
//               <input
//                 value={form.city}
//                 onChange={(e) => update("city", e.target.value)}
//                 placeholder="Ajmer"
//                 style={inp}
//               />
//             </Field>
//             <Field label="State" required>
//               <input
//                 value={form.state}
//                 onChange={(e) => update("state", e.target.value)}
//                 placeholder="Rajasthan"
//                 style={inp}
//               />
//             </Field>
//           </div>
//         </div>
//       )}

//       {step === 1 && (
//         <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "12px",
//             }}
//           >
//             <Field label="Contact Person Name" required>
//               <input
//                 value={form.contactPerson}
//                 onChange={(e) => update("contactPerson", e.target.value)}
//                 placeholder="Full name"
//                 style={inp}
//               />
//             </Field>
//             <Field label="Designation" required>
//               <input
//                 value={form.designation}
//                 onChange={(e) => update("designation", e.target.value)}
//                 placeholder="HR Manager"
//                 style={inp}
//               />
//             </Field>
//           </div>

//           <Field
//             label="Work Email"
//             required
//             hint="Used for login and all notifications"
//           >
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => update("email", e.target.value)}
//               placeholder="hr@acme.com"
//               style={inp}
//             />
//           </Field>

//           <Field label="Password" required hint="Minimum 8 characters">
//             <input
//               type="password"
//               value={form.password}
//               onChange={(e) => update("password", e.target.value)}
//               placeholder="••••••••"
//               style={inp}
//             />
//           </Field>

//           <Field label="Contact Phone" required>
//             <input
//               type="tel"
//               value={form.contactPhone}
//               onChange={(e) => update("contactPhone", e.target.value)}
//               placeholder="+91 98765 43210"
//               style={inp}
//             />
//           </Field>

//           <div
//             style={{
//               padding: "12px 14px",
//               background: "#fefce8",
//               border: "1px solid #fde68a",
//               borderRadius: "10px",
//             }}
//           >
//             <p
//               style={{
//                 fontSize: "12.5px",
//                 color: "#854d0e",
//                 margin: 0,
//                 lineHeight: 1.6,
//               }}
//             >
//               ⚠ Your account requires approval before you can post jobs. This
//               usually takes 1-2 business days after email verification.
//             </p>
//           </div>
//         </div>
//       )}

//       {step === 2 && (
//         <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
//           <Field
//             label="PAN Number"
//             required
//             hint="10-character PAN as per Income Tax records"
//           >
//             <input
//               value={form.panNumber}
//               onChange={(e) =>
//                 update("panNumber", e.target.value.toUpperCase())
//               }
//               placeholder="ABCDE1234F"
//               maxLength={10}
//               style={{
//                 ...inp,
//                 textTransform: "uppercase",
//                 letterSpacing: "0.05em",
//               }}
//             />
//           </Field>

//           <Field
//             label="Udyam Certificate"
//             required
//             hint="Upload your Udyam Registration Certificate — PDF or image, max 4MB"
//           >
//             <UploadField
//               label="Udyam Certificate"
//               endpoint="udyamCertificateUploader"
//               fileType="document"
//               currentUrl={form.udyamCertificateUrl}
//               onUploadComplete={(url) => update("udyamCertificateUrl", url)}
//             />
//           </Field>

//           <div
//             style={{
//               padding: "14px",
//               background: "#f8fafc",
//               border: "1px solid #e2e8f0",
//               borderRadius: "10px",
//               marginTop: "6px",
//             }}
//           >
//             <label
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: "10px",
//                 cursor: "pointer",
//               }}
//             >
//               <input
//                 type="checkbox"
//                 checked={form.termsAccepted}
//                 onChange={(e) =>
//                   setForm((p) => ({ ...p, termsAccepted: e.target.checked }))
//                 }
//                 style={{ marginTop: "3px", flexShrink: 0 }}
//               />
//               <span
//                 style={{
//                   fontSize: "12.5px",
//                   color: "#374151",
//                   lineHeight: 1.6,
//                 }}
//               >
//                 I confirm that the information provided is accurate and I agree
//                 to the{" "}
//                 <a
//                   href="/terms"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{ color: "#1d4ed8", fontWeight: 600 }}
//                 >
//                   Terms & Conditions
//                 </a>{" "}
//                 and{" "}
//                 <a
//                   href="/privacy-policy"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{ color: "#1d4ed8", fontWeight: 600 }}
//                 >
//                   Privacy Policy
//                 </a>{" "}
//                 of MDSU-Charge.
//               </span>
//             </label>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div
//           style={{
//             padding: "10px 14px",
//             background: "#fef2f2",
//             border: "1px solid #fecaca",
//             borderRadius: "10px",
//             fontSize: "13px",
//             color: "#dc2626",
//             marginTop: "1rem",
//           }}
//         >
//           {error}
//         </div>
//       )}

//       <div
//         style={{
//           display: "flex",
//           gap: "8px",
//           justifyContent: "space-between",
//           marginTop: "1.5rem",
//         }}
//       >
//         {step > 0 ? (
//           <button
//             onClick={() => setStep((s) => s - 1)}
//             style={{
//               height: "42px",
//               padding: "0 20px",
//               border: "1px solid #e2e8f0",
//               borderRadius: "10px",
//               background: "#fff",
//               fontSize: "13.5px",
//               fontWeight: 600,
//               color: "#64748b",
//               cursor: "pointer",
//             }}
//           >
//             ← Back
//           </button>
//         ) : (
//           <span />
//         )}

//         {step < steps.length - 1 ? (
//           <button
//             onClick={handleNext}
//             style={{
//               height: "42px",
//               padding: "0 24px",
//               border: "none",
//               borderRadius: "10px",
//               background: "#1d4ed8",
//               color: "#fff",
//               fontSize: "13.5px",
//               fontWeight: 700,
//               cursor: "pointer",
//             }}
//           >
//             Next →
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             style={{
//               height: "42px",
//               padding: "0 24px",
//               border: "none",
//               borderRadius: "10px",
//               background: loading
//                 ? "#93c5fd"
//                 : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
//               color: "#fff",
//               fontSize: "13.5px",
//               fontWeight: 700,
//               cursor: "pointer",
//             }}
//           >
//             {loading ? "Submitting…" : "Submit Registration"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadField } from "@/features/cms/components/upload-field";
import styles from "./ProviderRegisterForm.module.css";

type FormData = {
  companyName: string;
  companyType: string;
  industry: string;
  website: string;
  companySize: string;
  description: string;
  headquarters: string;
  city: string;
  state: string;
  contactPerson: string;
  designation: string;
  email: string;
  password: string;
  contactPhone: string;
  logoUrl: string;
  panNumber: string;
  udyamCertificateUrl: string;
  termsAccepted: boolean;
};

const INITIAL: FormData = {
  companyName: "",
  companyType: "COMPANY",
  industry: "",
  website: "",
  companySize: "STARTUP_1_10",
  description: "",
  headquarters: "",
  city: "",
  state: "",
  contactPerson: "",
  designation: "",
  email: "",
  password: "",
  contactPhone: "",
  logoUrl: "",
  panNumber: "",
  udyamCertificateUrl: "",
  termsAccepted: false,
};

const COMPANY_TYPES = [
  { value: "COMPANY", label: "Company" },
  { value: "STARTUP", label: "Startup" },
  { value: "NGO", label: "NGO" },
  { value: "INSTITUTE", label: "Institute" },
  { value: "FREELANCER", label: "Freelancer" },
  { value: "RECRUITER", label: "Recruiter / Agency" },
];

const COMPANY_SIZES = [
  { value: "STARTUP_1_10", label: "1-10 employees" },
  { value: "SMALL_11_50", label: "11-50 employees" },
  { value: "MEDIUM_51_200", label: "51-200 employees" },
  { value: "LARGE_201_500", label: "201-500 employees" },
  { value: "ENTERPRISE_500_PLUS", label: "500+ employees" },
];

function Field({
  label,
  children,
  required,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.fieldRequired}>*</span>}
      </label>
      {hint && <span className={styles.fieldHint}>{hint}</span>}
      {children}
    </div>
  );
}

export function ProviderRegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update(key: keyof FormData, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    setError("");
  }

  function validateStep(): string | null {
    if (step === 0) {
      if (!form.companyName.trim()) return "Company name is required.";
      if (!form.industry.trim()) return "Industry is required.";
      if (!form.headquarters.trim()) return "Headquarters is required.";
      if (!form.city.trim()) return "City is required.";
      if (!form.state.trim()) return "State is required.";
    }
    if (step === 1) {
      if (!form.contactPerson.trim()) return "Contact person name is required.";
      if (!form.designation.trim()) return "Designation is required.";
      if (!form.email.trim()) return "Email is required.";
      if (form.password.length < 8)
        return "Password must be at least 8 characters.";
      if (form.contactPhone.length < 10) return "Enter a valid phone number.";
    }
    if (step === 2) {
      if (!form.panNumber.trim()) return "PAN number is required.";
      if (!form.udyamCertificateUrl.trim())
        return "Udyam certificate is required.";
      if (!form.termsAccepted)
        return "You must accept the terms and conditions.";
    }
    return null;
  }

  function handleNext() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/provider/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);

    if (!json.success) {
      setError(json.error ?? "Registration failed.");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Registration submitted!</h2>
        <p className={styles.successDesc}>
          Check your email to verify your account. Your company profile is now
          pending review — we&apos;ll notify you once approved.
        </p>
        <Link href="/login" className={styles.successBtn}>
          Go to Login
        </Link>
      </div>
    );
  }

  const steps = [
    "Company Details",
    "Contact & Account",
    "Compliance & Consent",
  ];

  return (
    <div>
      {/* Step indicator */}
      <div className={styles.stepIndicatorWrap}>
        {steps.map((label, i) => (
          <div key={label} className={styles.stepIndicatorItem}>
            <div
              className={`${styles.stepBar} ${i <= step ? styles.stepBarActive : ""}`}
            />
            <p
              className={`${styles.stepLabel} ${i === step ? styles.stepLabelActive : ""}`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className={styles.stepBody}>
          <Field label="Company Name" required>
            <input
              className={styles.input}
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="Mavian IT Pvt. Ltd."
            />
          </Field>

          <div className={styles.twoCol}>
            <Field label="Company Type" required>
              <select
                className={styles.input}
                value={form.companyType}
                onChange={(e) => update("companyType", e.target.value)}
              >
                {COMPANY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Company Size" required>
              <select
                className={styles.input}
                value={form.companySize}
                onChange={(e) => update("companySize", e.target.value)}
              >
                {COMPANY_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Industry"
            required
            hint="e.g. Information Technology, Finance, Healthcare"
          >
            <input
              className={styles.input}
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
              placeholder="Information Technology"
            />
          </Field>

          <Field label="Website">
            <input
              className={styles.input}
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://mavianit.com"
            />
          </Field>

          <Field label="Company Logo">
            <UploadField
              label="Company Logo"
              endpoint="companyLogoUploader"
              fileType="image"
              currentUrl={form.logoUrl}
              onUploadComplete={(url) => update("logoUrl", url)}
            />
          </Field>

          <Field label="Company Description">
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Brief description of your company"
            />
          </Field>

          <Field label="Headquarters Address" required>
            <input
              className={styles.input}
              value={form.headquarters}
              onChange={(e) => update("headquarters", e.target.value)}
              placeholder="Full headquarters address"
            />
          </Field>

          <div className={styles.twoCol}>
            <Field label="City" required>
              <input
                className={styles.input}
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Ajmer"
              />
            </Field>
            <Field label="State" required>
              <input
                className={styles.input}
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                placeholder="Rajasthan"
              />
            </Field>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className={styles.stepBody}>
          <div className={styles.twoCol}>
            <Field label="Contact Person Name" required>
              <input
                className={styles.input}
                value={form.contactPerson}
                onChange={(e) => update("contactPerson", e.target.value)}
                placeholder="Full name"
              />
            </Field>
            <Field label="Designation" required>
              <input
                className={styles.input}
                value={form.designation}
                onChange={(e) => update("designation", e.target.value)}
                placeholder="HR Manager"
              />
            </Field>
          </div>

          <Field
            label="Work Email"
            required
            hint="Used for login and all notifications"
          >
            <input
              className={styles.input}
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="hr@acme.com"
            />
          </Field>

          <Field label="Password" required hint="Minimum 8 characters">
            <input
              className={styles.input}
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          <Field label="Contact Phone" required>
            <input
              className={styles.input}
              type="tel"
              value={form.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              placeholder="+91 98765 43210"
            />
          </Field>

          <div className={styles.warningBox}>
            <p className={styles.warningText}>
              ⚠ Your account requires approval before you can post jobs. This
              usually takes 1-2 business days after email verification.
            </p>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className={styles.stepBody}>
          <Field
            label="PAN Number"
            required
            hint="10-character PAN as per Income Tax records"
          >
            <input
              className={`${styles.input} ${styles.panInput}`}
              value={form.panNumber}
              onChange={(e) =>
                update("panNumber", e.target.value.toUpperCase())
              }
              placeholder="ABCDE1234F"
              maxLength={10}
            />
          </Field>

          <Field
            label="Udyam Certificate"
            required
            hint="Upload your Udyam Registration Certificate — PDF or image, max 4MB"
          >
            <UploadField
              label="Udyam Certificate"
              endpoint="udyamCertificateUploader"
              fileType="document"
              currentUrl={form.udyamCertificateUrl}
              onUploadComplete={(url) => update("udyamCertificateUrl", url)}
            />
          </Field>

          <div className={styles.termsBox}>
            <label className={styles.termsLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={form.termsAccepted}
                onChange={(e) =>
                  setForm((p) => ({ ...p, termsAccepted: e.target.checked }))
                }
              />
              <span className={styles.termsText}>
                I confirm that the information provided is accurate and I agree
                to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.termsLink}
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.termsLink}
                >
                  Privacy Policy
                </a>{" "}
                of MDSU-Charge.
              </span>
            </label>
          </div>
        </div>
      )}

      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.actionsRow}>
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className={styles.btnSecondary}
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        {step < steps.length - 1 ? (
          <button onClick={handleNext} className={styles.btnPrimary}>
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={styles.btnPrimary}
          >
            {loading ? "Submitting…" : "Submit Registration"}
          </button>
        )}
      </div>
    </div>
  );
}
