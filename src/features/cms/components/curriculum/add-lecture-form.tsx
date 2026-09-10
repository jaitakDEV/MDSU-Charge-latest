// "use client";

// import { useState } from "react";
// import type { Lecture } from "./curriculum-builder";

// const TYPES = [
//   { value: "VIDEO", label: "Video" },
//   { value: "DOCUMENT", label: "Document" },
//   { value: "TEXT", label: "Article" },
// ] as const;

// export function AddLectureForm({
//   sectionId,
//   courseId,
//   order,
//   onAdd,
// }: {
//   sectionId: string;
//   courseId: string;
//   order: number;
//   onAdd: (l: Lecture) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState<"VIDEO" | "DOCUMENT" | "TEXT">("VIDEO");
//   const [duration, setDuration] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   async function handleAdd() {
//     if (!title.trim()) {
//       setError("Lecture title is required.");
//       return;
//     }
//     setSaving(true);
//     setError("");
//     const res = await fetch("/api/cms/lectures", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         sectionId,
//         courseId,
//         title,
//         type,
//         duration: duration ? Number(duration) : 0,
//         displayOrder: order,
//       }),
//     });
//     const json = await res.json();
//     setSaving(false);
//     if (!json.success) {
//       setError(json.error ?? "Failed.");
//       return;
//     }
//     onAdd({
//       id: json.data.id,
//       title,
//       type,
//       isPreview: false,
//       isPublished: false,
//       duration: duration ? Number(duration) : 0,
//       videoUrl: null,
//       documentUrl: null,
//       displayOrder: order,
//     });
//     setTitle("");
//     setDuration("");
//     setOpen(false);
//   }

//   if (!open) {
//     return (
//       <button
//         onClick={() => setOpen(true)}
//         style={{
//           width: "100%",
//           height: "36px",
//           border: "1px dashed #e2e8f0",
//           borderRadius: "9px",
//           background: "transparent",
//           color: "#94a3b8",
//           fontSize: "12.5px",
//           fontWeight: 600,
//           cursor: "pointer",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "5px",
//           marginTop: "6px",
//         }}
//       >
//         <svg
//           width="12"
//           height="12"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <line x1="12" y1="5" x2="12" y2="19" />
//           <line x1="5" y1="12" x2="19" y2="12" />
//         </svg>
//         Add Lecture
//       </button>
//     );
//   }

//   return (
//     <div
//       style={{
//         border: "1px solid #e2e8f0",
//         borderRadius: "10px",
//         padding: "12px",
//         background: "#fff",
//         marginTop: "6px",
//       }}
//     >
//       <p
//         style={{
//           fontSize: "12px",
//           fontWeight: 600,
//           color: "#374151",
//           margin: "0 0 10px",
//         }}
//       >
//         New Lecture
//       </p>

//       {/* Type selector */}
//       <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
//         {TYPES.map((t) => (
//           <button
//             key={t.value}
//             type="button"
//             onClick={() => setType(t.value)}
//             style={{
//               height: "30px",
//               padding: "0 12px",
//               border: `1.5px solid ${type === t.value ? "#1d4ed8" : "#e2e8f0"}`,
//               borderRadius: "8px",
//               background: type === t.value ? "#eff6ff" : "#fff",
//               color: type === t.value ? "#1d4ed8" : "#64748b",
//               fontSize: "12px",
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       <div style={{ display: "flex", gap: "8px" }}>
//         <input
//           value={title}
//           onChange={(e) => {
//             setTitle(e.target.value);
//             setError("");
//           }}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleAdd();
//             if (e.key === "Escape") setOpen(false);
//           }}
//           placeholder="Lecture title"
//           autoFocus
//           style={{
//             flex: 1,
//             height: "36px",
//             padding: "0 10px",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             fontSize: "13px",
//             outline: "none",
//           }}
//         />
//         {type === "VIDEO" && (
//           <input
//             value={duration}
//             onChange={(e) => setDuration(e.target.value)}
//             placeholder="min"
//             type="number"
//             min={0}
//             style={{
//               width: "70px",
//               height: "36px",
//               padding: "0 10px",
//               border: "1px solid #e2e8f0",
//               borderRadius: "8px",
//               fontSize: "13px",
//               outline: "none",
//               textAlign: "center",
//             }}
//           />
//         )}
//         <button
//           onClick={handleAdd}
//           disabled={saving}
//           style={{
//             height: "36px",
//             padding: "0 14px",
//             border: "none",
//             borderRadius: "8px",
//             background: "#1d4ed8",
//             color: "#fff",
//             fontSize: "12.5px",
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           {saving ? "…" : "Add"}
//         </button>
//         <button
//           onClick={() => setOpen(false)}
//           style={{
//             height: "36px",
//             padding: "0 12px",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             background: "#fff",
//             fontSize: "12.5px",
//             color: "#64748b",
//             cursor: "pointer",
//           }}
//         >
//           ✕
//         </button>
//       </div>
//       {error && (
//         <p style={{ fontSize: "11.5px", color: "#ef4444", margin: "6px 0 0" }}>
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import type { Lecture } from "./curriculum-builder";
import { UploadField } from "../upload-field";

const TYPES = [
  { value: "VIDEO", label: "Video" },
  { value: "DOCUMENT", label: "Document" },
  { value: "TEXT", label: "Article" },
] as const;

export function AddLectureForm({
  sectionId,
  courseId,
  order,
  onAdd,
}: {
  sectionId: string;
  courseId: string;
  order: number;
  onAdd: (l: Lecture) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"VIDEO" | "DOCUMENT" | "TEXT">("VIDEO");
  const [duration, setDuration] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // After lecture created — show upload
  const [createdLecture, setCreatedLecture] = useState<Lecture | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadedKey, setUploadedKey] = useState("");
  const [savingUpload, setSavingUpload] = useState(false);

  async function handleAdd() {
    if (!title.trim()) {
      setError("Lecture title is required.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/cms/lectures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionId,
        courseId,
        title,
        type,
        duration: duration ? Number(duration) : 0,
        displayOrder: order,
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.success) {
      setError(json.error ?? "Failed.");
      return;
    }

    const newLecture: Lecture = {
      id: json.data.id,
      title,
      type,
      isPreview: false,
      isPublished: false,
      duration: duration ? Number(duration) : 0,
      videoUrl: null,
      documentUrl: null,
      displayOrder: order,
    };

    // TEXT type — no upload needed, directly add
    if (type === "TEXT") {
      onAdd(newLecture);
      reset();
      return;
    }

    // VIDEO/DOCUMENT — show upload step
    setCreatedLecture(newLecture);
  }

  // After upload complete — save URL to lecture
  async function handleSaveUpload() {
    if (!createdLecture || !uploadedUrl) {
      // Skip upload — add without file
      onAdd(createdLecture!);
      reset();
      return;
    }

    setSavingUpload(true);
    const patchData =
      createdLecture.type === "VIDEO"
        ? { videoUrl: uploadedUrl }
        : { documentUrl: uploadedUrl };

    await fetch(`/api/cms/lectures/${createdLecture.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchData),
    });
    setSavingUpload(false);

    onAdd({
      ...createdLecture,
      videoUrl: createdLecture.type === "VIDEO" ? uploadedUrl : null,
      documentUrl: createdLecture.type === "DOCUMENT" ? uploadedUrl : null,
    });
    reset();
  }

  function reset() {
    setTitle("");
    setDuration("");
    setOpen(false);
    setCreatedLecture(null);
    setUploadedUrl("");
    setUploadedKey("");
  }

  // ── Upload step (shown after lecture created) ─────────────
  if (createdLecture) {
    return (
      <div
        style={{
          border: "1.5px solid #bfdbfe",
          borderRadius: "12px",
          padding: "14px",
          background: "#f8fbff",
          marginTop: "6px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: "#1d4ed8",
                margin: "0 0 2px",
              }}
            >
              Upload {createdLecture.type === "VIDEO" ? "Video" : "Document"}
            </p>
            <p style={{ fontSize: "11.5px", color: "#64748b", margin: 0 }}>
              "{createdLecture.title}" — you can skip and upload later
            </p>
          </div>
        </div>

        <UploadField
          label={
            createdLecture.type === "VIDEO"
              ? "Lecture Video"
              : "Lecture Document"
          }
          endpoint={
            createdLecture.type === "VIDEO"
              ? "lectureVideoUploader"
              : "lectureDocumentUploader"
          }
          fileType={createdLecture.type === "VIDEO" ? "video" : "document"}
          currentUrl={uploadedUrl}
          onUploadComplete={(url, key) => {
            setUploadedUrl(url);
            setUploadedKey(key ?? "");
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={reset}
            style={{
              height: "34px",
              padding: "0 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "12px",
              color: "#64748b",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveUpload}
            disabled={savingUpload}
            style={{
              height: "34px",
              padding: "0 16px",
              border: "none",
              borderRadius: "8px",
              background: uploadedUrl ? "#1d4ed8" : "#94a3b8",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {savingUpload
              ? "Saving…"
              : uploadedUrl
                ? "Save & Add Lecture"
                : "Skip — Add Without File"}
          </button>
        </div>
      </div>
    );
  }

  // ── Create step ───────────────────────────────────────────
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          height: "36px",
          border: "1px dashed #e2e8f0",
          borderRadius: "9px",
          background: "transparent",
          color: "#94a3b8",
          fontSize: "12.5px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          marginTop: "6px",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Lecture
      </button>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "12px",
        background: "#fff",
        marginTop: "6px",
      }}
    >
      <p
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#374151",
          margin: "0 0 10px",
        }}
      >
        New Lecture
      </p>

      {/* Type selector */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            style={{
              height: "30px",
              padding: "0 12px",
              border: `1.5px solid ${type === t.value ? "#1d4ed8" : "#e2e8f0"}`,
              borderRadius: "8px",
              background: type === t.value ? "#eff6ff" : "#fff",
              color: type === t.value ? "#1d4ed8" : "#64748b",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Lecture title"
          autoFocus
          style={{
            flex: 1,
            height: "36px",
            padding: "0 10px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "13px",
            outline: "none",
          }}
        />
        {type === "VIDEO" && (
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="min"
            type="number"
            min={0}
            style={{
              width: "70px",
              height: "36px",
              padding: "0 10px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "13px",
              outline: "none",
              textAlign: "center",
            }}
          />
        )}
        <button
          onClick={handleAdd}
          disabled={saving}
          style={{
            height: "36px",
            padding: "0 14px",
            border: "none",
            borderRadius: "8px",
            background: "#1d4ed8",
            color: "#fff",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {saving ? "…" : "Add"}
        </button>
        <button
          onClick={() => setOpen(false)}
          style={{
            height: "36px",
            padding: "0 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            background: "#fff",
            fontSize: "12.5px",
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
      {error && (
        <p style={{ fontSize: "11.5px", color: "#ef4444", margin: "6px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}
