// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ROUTES } from "@/config/app";
// import { Step1BasicInfo } from "./step1-basic-info";
// import { Step2Description } from "./step2-description";
// import { Step3Pricing } from "./step3-pricing";
// import { Step4Media } from "./step4-media";

// export type WizardData = {
//   // Step 1
//   title: string;
//   slug: string;
//   level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
//   language: string;
//   categoryId: string;
//   // Step 2
//   description: string;
//   about: string;
//   learningOutcomes: string[];
//   requirements: string[];
//   // Step 3
//   price: number; // paise
//   mrp: number; // paise
//   accessDuration:
//     | "FIFTEEN_DAYS"
//     | "ONE_MONTH"
//     | "THREE_MONTHS"
//     | "SIX_MONTHS"
//     | "ONE_YEAR"
//     | "LIFETIME";
//   // Step 4
//   thumbnail: string;
//   previewVideoUrl: string;
// };

// const INITIAL: WizardData = {
//   title: "",
//   slug: "",
//   level: "BEGINNER",
//   language: "Hindi",
//   categoryId: "",
//   description: "",
//   about: "",
//   learningOutcomes: [""],
//   requirements: [""],
//   price: 0,
//   mrp: 0,
//   accessDuration: "THREE_MONTHS",
//   thumbnail: "",
//   previewVideoUrl: "",
// };

// const STEPS = [
//   "Basic Info",
//   "Description",
//   "Pricing & Access",
//   "Media & Submit",
// ];

// export function CourseWizard({
//   categories,
//   authorId,
// }: {
//   categories: { id: string; name: string }[];
//   authorId: string;
// }) {
//   const router = useRouter();
//   const [step, setStep] = useState(0);
//   const [data, setData] = useState<WizardData>(INITIAL);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   function update(partial: Partial<WizardData>) {
//     setData((prev) => ({ ...prev, ...partial }));
//   }

//   async function saveDraft() {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("/api/cms/courses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, status: "DRAFT" }),
//       });
//       const json = await res.json();
//       if (!json.success) throw new Error(json.error);
//       router.push(ROUTES.cmsCourses);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to save draft.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function submitForReview() {
//     setLoading(true);
//     setError(null);
//     try {
//       // Validate accessDuration set hai
//       if (!data.accessDuration) {
//         throw new Error(
//           "Access duration is required before submitting for review.",
//         );
//       }
//       const res = await fetch("/api/cms/courses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, status: "REVIEW" }),
//       });
//       const json = await res.json();
//       if (!json.success) throw new Error(json.error);
//       router.push(ROUTES.cmsCourses + "?submitted=1");
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to submit.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const stepProps = { data, update };

//   return (
//     <div>
//       {/* Progress steps */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           marginBottom: "2rem",
//           gap: "0",
//         }}
//       >
//         {STEPS.map((label, i) => {
//           const isDone = i < step;
//           const isActive = i === step;
//           const isLast = i === STEPS.length - 1;
//           return (
//             <div
//               key={i}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 flex: isLast ? "0 0 auto" : 1,
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   gap: "6px",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "30px",
//                     height: "30px",
//                     borderRadius: "50%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: "12px",
//                     fontWeight: 700,
//                     background: isDone
//                       ? "#1d4ed8"
//                       : isActive
//                         ? "#eff6ff"
//                         : "#f1f5f9",
//                     color: isDone ? "#fff" : isActive ? "#1d4ed8" : "#94a3b8",
//                     border: isActive
//                       ? "2px solid #1d4ed8"
//                       : isDone
//                         ? "2px solid #1d4ed8"
//                         : "2px solid #e2e8f0",
//                     transition: "all 0.2s",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {isDone ? (
//                     <svg
//                       width="13"
//                       height="13"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <polyline points="20 6 9 17 4 12" />
//                     </svg>
//                   ) : (
//                     i + 1
//                   )}
//                 </div>
//                 <span
//                   style={{
//                     fontSize: "11px",
//                     fontWeight: isActive ? 600 : 400,
//                     color: isActive
//                       ? "#1d4ed8"
//                       : isDone
//                         ? "#475569"
//                         : "#94a3b8",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {label}
//                 </span>
//               </div>
//               {!isLast && (
//                 <div
//                   style={{
//                     flex: 1,
//                     height: "2px",
//                     background: isDone ? "#1d4ed8" : "#e2e8f0",
//                     margin: "0 8px",
//                     marginBottom: "18px",
//                     transition: "background 0.2s",
//                   }}
//                 />
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Step content */}
//       <div
//         style={{
//           background: "#fff",
//           border: "1px solid #e8edf2",
//           borderRadius: "16px",
//           padding: "1.75rem",
//           marginBottom: "1.25rem",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
//         }}
//       >
//         {step === 0 && (
//           <Step1BasicInfo {...stepProps} categories={categories} />
//         )}
//         {step === 1 && <Step2Description {...stepProps} />}
//         {step === 2 && <Step3Pricing {...stepProps} />}
//         {step === 3 && <Step4Media {...stepProps} />}
//       </div>

//       {/* Error */}
//       {error && (
//         <div
//           style={{
//             padding: "10px 14px",
//             background: "#fef2f2",
//             border: "1px solid #fecaca",
//             borderRadius: "10px",
//             fontSize: "13px",
//             color: "#dc2626",
//             marginBottom: "1rem",
//           }}
//         >
//           {error}
//         </div>
//       )}

//       {/* Nav buttons */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <button
//           onClick={() => setStep((s) => Math.max(0, s - 1))}
//           disabled={step === 0 || loading}
//           style={{
//             height: "38px",
//             padding: "0 18px",
//             border: "1px solid #e2e8f0",
//             borderRadius: "10px",
//             background: "#fff",
//             fontSize: "13px",
//             fontWeight: 600,
//             color: "#475569",
//             cursor: step === 0 ? "not-allowed" : "pointer",
//             opacity: step === 0 ? 0.4 : 1,
//           }}
//         >
//           ← Back
//         </button>

//         <div style={{ display: "flex", gap: "8px" }}>
//           {/* Save draft — available on all steps */}
//           <button
//             onClick={saveDraft}
//             disabled={loading || !data.title}
//             style={{
//               height: "38px",
//               padding: "0 18px",
//               border: "1px solid #e2e8f0",
//               borderRadius: "10px",
//               background: "#fff",
//               fontSize: "13px",
//               fontWeight: 600,
//               color: "#475569",
//               cursor: "pointer",
//               opacity: !data.title ? 0.4 : 1,
//             }}
//           >
//             {loading ? "Saving…" : "Save Draft"}
//           </button>

//           {step < STEPS.length - 1 ? (
//             <button
//               onClick={() => setStep((s) => s + 1)}
//               disabled={loading}
//               style={{
//                 height: "38px",
//                 padding: "0 18px",
//                 borderRadius: "10px",
//                 border: "none",
//                 background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
//                 color: "#fff",
//                 fontSize: "13px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 boxShadow: "0 2px 6px rgba(29,78,216,0.25)",
//               }}
//             >
//               Next →
//             </button>
//           ) : (
//             <button
//               onClick={submitForReview}
//               disabled={loading || !data.accessDuration}
//               style={{
//                 height: "38px",
//                 padding: "0 20px",
//                 borderRadius: "10px",
//                 border: "none",
//                 background: loading
//                   ? "#93c5fd"
//                   : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
//                 color: "#fff",
//                 fontSize: "13px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 boxShadow: "0 2px 6px rgba(29,78,216,0.25)",
//               }}
//             >
//               {loading ? "Submitting…" : "Submit for Review →"}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState }  from "react";
import { useRouter } from "next/navigation";
import { ROUTES }    from "@/config/app";
import { Step1BasicInfo }   from "./step1-basic-info";
import { Step2Description } from "./step2-description";
import { Step3Pricing }     from "./step3-pricing";
import { Step4Media }       from "./step4-media";

export type WizardData = {
  title: string; slug: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  language: string; categoryId: string;
  description: string; about: string;
  learningOutcomes: string[]; requirements: string[];
  price: number; mrp: number;
  accessDuration: "FIFTEEN_DAYS"|"ONE_MONTH"|"THREE_MONTHS"|"SIX_MONTHS"|"ONE_YEAR"|"LIFETIME";
  thumbnail: string; previewVideoUrl: string;
};

const INITIAL: WizardData = {
  title: "", slug: "", level: "BEGINNER", language: "Hindi", categoryId: "",
  description: "", about: "", learningOutcomes: [""], requirements: [""],
  price: 0, mrp: 0, accessDuration: "THREE_MONTHS",
  thumbnail: "", previewVideoUrl: "",
};

const STEPS = ["Basic Info", "Description", "Pricing & Access", "Media"];

export function CourseWizard({
  categories,
  authorId,
}: {
  categories: { id: string; name: string }[];
  authorId:   string;
}) {
  const router          = useRouter();
  const [step,    setStep]    = useState(0);
  const [data,    setData]    = useState<WizardData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  function update(partial: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  // ── Validate current step before proceeding ─────────────
  function validateStep(): string | null {
    if (step === 0) {
      if (!data.title.trim())     return "Course title is required.";
      if (!data.slug.trim())      return "URL slug is required.";
      if (!data.categoryId)       return "Please select a category.";
    }
    if (step === 1) {
      if (!data.description.trim()) return "Short description is required.";
    }
    if (step === 2) {
      if (!data.accessDuration) return "Access duration is required.";
    }
    return null;
  }

  function handleNext() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setStep((s) => s + 1);
  }

  // ── Save as DRAFT ─────────────────────────────────────────
  async function saveDraft() {
    if (!data.title.trim()) { setError("Course title is required before saving."); return; }
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/api/cms/courses", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...data, status: "DRAFT" }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      router.push(ROUTES.cmsCourses);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save draft.");
    } finally {
      setLoading(false);
    }
  }

  // ── Save DRAFT + go to Curriculum Builder ─────────────────
  async function saveAndContinueToCurriculum() {
    const err = validateStep();
    if (err) { setError(err); return; }
    if (!data.accessDuration) { setError("Access duration is required before continuing."); return; }

    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/api/cms/courses", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...data, status: "DRAFT" }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      // Course bana — ab curriculum pe jaao
      router.push(ROUTES.cmsCurriculum(json.data.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save course.");
    } finally {
      setLoading(false);
    }
  }

  const stepProps = { data, update };
  const isLastStep = step === STEPS.length - 1;

  return (
    <div>
      {/* Progress steps */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
        {STEPS.map((label, i) => {
          const isDone   = i < step;
          const isActive = i === step;
          const isLast   = i === STEPS.length - 1;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, background: isDone ? "#1d4ed8" : isActive ? "#eff6ff" : "#f1f5f9", color: isDone ? "#fff" : isActive ? "#1d4ed8" : "#94a3b8", border: isActive ? "2px solid #1d4ed8" : isDone ? "2px solid #1d4ed8" : "2px solid #e2e8f0", flexShrink: 0 }}>
                  {isDone ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (i + 1)}
                </div>
                <span style={{ fontSize: "11px", fontWeight: isActive ? 600 : 400, color: isActive ? "#1d4ed8" : isDone ? "#475569" : "#94a3b8", whiteSpace: "nowrap" }}>
                  {label}
                </span>
              </div>
              {!isLast && (
                <div style={{ flex: 1, height: "2px", background: isDone ? "#1d4ed8" : "#e2e8f0", margin: "0 8px", marginBottom: "18px" }} />
              )}
            </div>
          );
        })}

        {/* Curriculum step indicator — always shown as next step */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, height: "2px", background: "#e2e8f0", margin: "0 8px", marginBottom: "18px" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, background: "#f1f5f9", color: "#94a3b8", border: "2px dashed #bfdbfe" }}>
              5
            </div>
            <span style={{ fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap" }}>Curriculum</span>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: "16px", padding: "1.75rem", marginBottom: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {step === 0 && <Step1BasicInfo {...stepProps} categories={categories} />}
        {step === 1 && <Step2Description {...stepProps} />}
        {step === 2 && <Step3Pricing {...stepProps} />}
        {step === 3 && <Step4Media {...stepProps} />}
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", fontSize: "13px", color: "#dc2626", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Nav buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => { setError(null); setStep((s) => Math.max(0, s - 1)); }}
          disabled={step === 0 || loading}
          style={{ height: "38px", padding: "0 18px", border: "1px solid #e2e8f0", borderRadius: "10px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#475569", cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.4 : 1 }}
        >
          ← Back
        </button>

        <div style={{ display: "flex", gap: "8px" }}>
          {/* Save draft */}
          <button
            onClick={saveDraft}
            disabled={loading || !data.title}
            style={{ height: "38px", padding: "0 18px", border: "1px solid #e2e8f0", borderRadius: "10px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#475569", cursor: "pointer", opacity: !data.title ? 0.4 : 1 }}
          >
            {loading ? "Saving…" : "Save Draft"}
          </button>

          {/* Next OR Save & go to Curriculum */}
          {!isLastStep ? (
            <button
              onClick={handleNext}
              disabled={loading}
              style={{ height: "38px", padding: "0 18px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 6px rgba(29,78,216,0.25)" }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={saveAndContinueToCurriculum}
              disabled={loading}
              style={{ height: "38px", padding: "0 20px", borderRadius: "10px", border: "none", background: loading ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 6px rgba(29,78,216,0.25)", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 6H21"/><path d="M8 12H21"/><path d="M8 18H21"/>
                <path d="M3 6h.01M3 12h.01M3 18h.01"/>
              </svg>
              {loading ? "Saving…" : "Save & Build Curriculum →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}