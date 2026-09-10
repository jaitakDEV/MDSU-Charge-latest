// "use client";

// import type { WizardData } from "./course-wizard";
// import { Field, inputStyle } from "./step1-basic-info";

// export function Step4Media({
//   data,
//   update,
// }: {
//   data: WizardData;
//   update: (p: Partial<WizardData>) => void;
// }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
//       <h2
//         style={{
//           fontSize: "15px",
//           fontWeight: 700,
//           color: "#0f172a",
//           margin: 0,
//           letterSpacing: "-0.3px",
//         }}
//       >
//         Media & Review
//       </h2>

//       <Field
//         label="Course Thumbnail URL"
//         hint="Upload via UploadThing and paste the URL here"
//       >
//         <input
//           value={data.thumbnail}
//           onChange={(e) => update({ thumbnail: e.target.value })}
//           placeholder="https://utfs.io/f/..."
//           style={inputStyle}
//         />
//         {data.thumbnail && (
//           <img
//             src={data.thumbnail}
//             alt="Thumbnail preview"
//             style={{
//               marginTop: "8px",
//               width: "160px",
//               height: "90px",
//               objectFit: "cover",
//               borderRadius: "8px",
//               border: "1px solid #e2e8f0",
//             }}
//           />
//         )}
//       </Field>

//       <Field
//         label="Preview Video URL"
//         hint="Short free teaser — shown on public course page before purchase"
//       >
//         <input
//           value={data.previewVideoUrl}
//           onChange={(e) => update({ previewVideoUrl: e.target.value })}
//           placeholder="https://utfs.io/f/..."
//           style={inputStyle}
//         />
//       </Field>

//       {/* Summary card */}
//       <div
//         style={{
//           padding: "1.25rem",
//           background: "#f8fafc",
//           border: "1px solid #e2e8f0",
//           borderRadius: "12px",
//         }}
//       >
//         <p
//           style={{
//             fontSize: "12.5px",
//             fontWeight: 700,
//             color: "#374151",
//             margin: "0 0 12px",
//           }}
//         >
//           Course Summary
//         </p>
//         {[
//           { label: "Title", value: data.title || "—" },
//           { label: "Category", value: "—" },
//           { label: "Level", value: data.level },
//           {
//             label: "Price",
//             value:
//               data.price === 0
//                 ? "Free"
//                 : `₹${(data.price / 100).toLocaleString("en-IN")}`,
//           },
//           {
//             label: "Access",
//             value: data.accessDuration
//               ? data.accessDuration.replace(/_/g, " ")
//               : "Not set",
//           },
//         ].map(({ label, value }) => (
//           <div
//             key={label}
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               fontSize: "12.5px",
//               padding: "6px 0",
//               borderBottom: "1px solid #f1f5f9",
//             }}
//           >
//             <span style={{ color: "#64748b" }}>{label}</span>
//             <span
//               style={{
//                 fontWeight: 600,
//                 color:
//                   label === "Access" && !data.accessDuration
//                     ? "#ef4444"
//                     : "#0f172a",
//               }}
//             >
//               {value}
//             </span>
//           </div>
//         ))}

//         {!data.accessDuration && (
//           <p
//             style={{
//               fontSize: "12px",
//               color: "#ef4444",
//               marginTop: "10px",
//               fontWeight: 600,
//             }}
//           >
//             ⚠ Access duration is required — go back to Step 3 to set it.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import type { WizardData } from "./course-wizard";
import { UploadField } from "../upload-field";

export function Step4Media({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h2
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#0f172a",
          margin: 0,
          letterSpacing: "-0.3px",
        }}
      >
        Media & Review
      </h2>

      <UploadField
        label="Course Thumbnail"
        hint="Shown on course card and detail page"
        endpoint="courseThumbnailUploader"
        fileType="image"
        currentUrl={data.thumbnail}
        onUploadComplete={(url) => update({ thumbnail: url })}
      />

      <UploadField
        label="Preview Video"
        hint="Free teaser shown on public course page before purchase"
        endpoint="coursePreviewVideoUploader"
        fileType="video"
        currentUrl={data.previewVideoUrl}
        onUploadComplete={(url) => update({ previewVideoUrl: url })}
      />

      {/* Summary card */}
      <div
        style={{
          padding: "1.25rem",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
        }}
      >
        <p
          style={{
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#374151",
            margin: "0 0 12px",
          }}
        >
          Course Summary
        </p>
        {[
          { label: "Title", value: data.title || "—" },
          { label: "Level", value: data.level },
          {
            label: "Price",
            value:
              data.price === 0
                ? "Free"
                : `₹${(data.price / 100).toLocaleString("en-IN")}`,
          },
          {
            label: "Access",
            value: data.accessDuration
              ? data.accessDuration.replace(/_/g, " ")
              : "Not set",
          },
          {
            label: "Thumbnail",
            value: data.thumbnail ? "✓ Uploaded" : "Not set",
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12.5px",
              padding: "6px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <span style={{ color: "#64748b" }}>{label}</span>
            <span
              style={{
                fontWeight: 600,
                color:
                  label === "Access" && !data.accessDuration
                    ? "#ef4444"
                    : "#0f172a",
              }}
            >
              {value}
            </span>
          </div>
        ))}
        {!data.accessDuration && (
          <p
            style={{
              fontSize: "12px",
              color: "#ef4444",
              marginTop: "10px",
              fontWeight: 600,
            }}
          >
            ⚠ Access duration is required — go back to Step 3 to set it.
          </p>
        )}
      </div>
    </div>
  );
}
