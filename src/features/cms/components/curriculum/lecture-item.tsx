// "use client";

// import { useState } from "react";
// import { Draggable } from "@hello-pangea/dnd";
// import type { Lecture } from "./curriculum-builder";

// const TYPE_CONFIG = {
//   VIDEO: { label: "Video", color: "#1d4ed8", bg: "#eff6ff" },
//   DOCUMENT: { label: "Doc", color: "#7c3aed", bg: "#f5f3ff" },
//   TEXT: { label: "Article", color: "#0f766e", bg: "#f0fdfa" },
// };

// export function LectureItem({
//   lecture,
//   index,
//   sectionId,
//   isLocked,
//   totalPreview,
//   onUpdate,
//   onRemove,
// }: {
//   lecture: Lecture;
//   index: number;
//   sectionId: string;
//   isLocked: boolean;
//   totalPreview: number;
//   onUpdate: (d: Partial<Lecture>) => void;
//   onRemove: () => void;
// }) {
//   const [editing, setEditing] = useState(false);
//   const [title, setTitle] = useState(lecture.title);
//   const [saving, setSaving] = useState<string | null>(null);
//   const [confirmDel, setConfirmDel] = useState(false);

//   const typeCfg = TYPE_CONFIG[lecture.type];

//   async function patchLecture(data: Partial<Lecture>) {
//     await fetch(`/api/cms/lectures/${lecture.id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//   }

//   async function saveTitle() {
//     if (!title.trim() || title === lecture.title) {
//       setEditing(false);
//       return;
//     }
//     setSaving("title");
//     await patchLecture({ title });
//     onUpdate({ title });
//     setSaving(null);
//     setEditing(false);
//   }

//   async function togglePublished() {
//     setSaving("publish");
//     const val = !lecture.isPublished;
//     await patchLecture({ isPublished: val });
//     onUpdate({ isPublished: val });
//     setSaving(null);
//   }

//   async function togglePreview() {
//     if (!lecture.isPreview && totalPreview >= 3) {
//       alert("Maximum 3 preview lectures allowed per course.");
//       return;
//     }
//     setSaving("preview");
//     const val = !lecture.isPreview;
//     await patchLecture({ isPreview: val });
//     onUpdate({ isPreview: val });
//     setSaving(null);
//   }

//   async function deleteLecture() {
//     setSaving("delete");
//     await fetch(`/api/cms/lectures/${lecture.id}`, { method: "DELETE" });
//     onRemove();
//   }

//   return (
//     <Draggable draggableId={lecture.id} index={index} isDragDisabled={isLocked}>
//       {(provided, snapshot) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           style={{
//             ...provided.draggableProps.style,
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             padding: "9px 10px",
//             borderRadius: "10px",
//             background: snapshot.isDragging ? "#f0f9ff" : "#fafbfc",
//             border: `1px solid ${snapshot.isDragging ? "#bfdbfe" : "#f1f5f9"}`,
//             marginBottom: "6px",
//           }}
//         >
//           {/* Drag handle */}
//           {!isLocked && (
//             <div
//               {...provided.dragHandleProps}
//               style={{ cursor: "grab", color: "#cbd5e1", flexShrink: 0 }}
//             >
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <circle cx="9" cy="5" r="1" />
//                 <circle cx="9" cy="12" r="1" />
//                 <circle cx="9" cy="19" r="1" />
//                 <circle cx="15" cy="5" r="1" />
//                 <circle cx="15" cy="12" r="1" />
//                 <circle cx="15" cy="19" r="1" />
//               </svg>
//             </div>
//           )}

//           {/* Type badge */}
//           <span
//             style={{
//               fontSize: "10px",
//               fontWeight: 700,
//               padding: "2px 7px",
//               borderRadius: "6px",
//               background: typeCfg.bg,
//               color: typeCfg.color,
//               flexShrink: 0,
//             }}
//           >
//             {typeCfg.label}
//           </span>

//           {/* Title */}
//           {editing ? (
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") saveTitle();
//                 if (e.key === "Escape") setEditing(false);
//               }}
//               autoFocus
//               style={{
//                 flex: 1,
//                 height: "28px",
//                 padding: "0 8px",
//                 border: "1.5px solid #bfdbfe",
//                 borderRadius: "7px",
//                 fontSize: "12.5px",
//                 outline: "none",
//               }}
//             />
//           ) : (
//             <p
//               style={{
//                 flex: 1,
//                 margin: 0,
//                 fontSize: "12.5px",
//                 fontWeight: 500,
//                 color: "#334155",
//                 letterSpacing: "-0.1px",
//               }}
//             >
//               {lecture.title}
//             </p>
//           )}

//           {/* Duration */}
//           {lecture.duration > 0 && (
//             <span style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0 }}>
//               {lecture.duration}m
//             </span>
//           )}

//           {/* Preview badge */}
//           {lecture.isPreview && (
//             <span
//               style={{
//                 fontSize: "10px",
//                 fontWeight: 700,
//                 padding: "2px 7px",
//                 borderRadius: "6px",
//                 background: "#f0fdf4",
//                 color: "#16a34a",
//                 border: "1px solid #bbf7d0",
//                 flexShrink: 0,
//               }}
//             >
//               Free preview
//             </span>
//           )}

//           {!isLocked && (
//             <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
//               {editing ? (
//                 <>
//                   <SmBtn onClick={saveTitle} color="#1d4ed8">
//                     {saving === "title" ? "…" : "Save"}
//                   </SmBtn>
//                   <SmBtn onClick={() => setEditing(false)} color="#64748b">
//                     Cancel
//                   </SmBtn>
//                 </>
//               ) : (
//                 <>
//                   <SmBtn onClick={() => setEditing(true)} color="#64748b">
//                     Rename
//                   </SmBtn>
//                   <SmBtn
//                     onClick={togglePreview}
//                     color={lecture.isPreview ? "#92400e" : "#0f766e"}
//                   >
//                     {saving === "preview"
//                       ? "…"
//                       : lecture.isPreview
//                         ? "Remove preview"
//                         : "Set preview"}
//                   </SmBtn>
//                   <SmBtn
//                     onClick={togglePublished}
//                     color={lecture.isPublished ? "#854d0e" : "#1d4ed8"}
//                   >
//                     {saving === "publish"
//                       ? "…"
//                       : lecture.isPublished
//                         ? "Unpublish"
//                         : "Publish"}
//                   </SmBtn>
//                   {confirmDel ? (
//                     <>
//                       <SmBtn onClick={deleteLecture} color="#dc2626">
//                         {saving === "delete" ? "…" : "Confirm"}
//                       </SmBtn>
//                       <SmBtn
//                         onClick={() => setConfirmDel(false)}
//                         color="#64748b"
//                       >
//                         Cancel
//                       </SmBtn>
//                     </>
//                   ) : (
//                     <SmBtn onClick={() => setConfirmDel(true)} color="#ef4444">
//                       Delete
//                     </SmBtn>
//                   )}
//                 </>
//               )}
//             </div>
//           )}

//           {/* Published dot */}
//           <div
//             style={{
//               width: "7px",
//               height: "7px",
//               borderRadius: "50%",
//               background: lecture.isPublished ? "#16a34a" : "#e2e8f0",
//               flexShrink: 0,
//             }}
//             title={lecture.isPublished ? "Published" : "Draft"}
//           />
//         </div>
//       )}
//     </Draggable>
//   );
// }

// function SmBtn({
//   onClick,
//   color,
//   children,
// }: {
//   onClick: () => void;
//   color: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         height: "26px",
//         padding: "0 9px",
//         border: `1px solid ${color}25`,
//         borderRadius: "7px",
//         background: `${color}10`,
//         color,
//         fontSize: "11px",
//         fontWeight: 600,
//         cursor: "pointer",
//         whiteSpace: "nowrap",
//       }}
//     >
//       {children}
//     </button>
//   );
// }

"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Lecture } from "./curriculum-builder";
import { UploadField } from "../upload-field";

const TYPE_CONFIG = {
  VIDEO: { label: "Video", color: "#1d4ed8", bg: "#eff6ff" },
  DOCUMENT: { label: "Doc", color: "#7c3aed", bg: "#f5f3ff" },
  TEXT: { label: "Article", color: "#0f766e", bg: "#f0fdfa" },
};

export function LectureItem({
  lecture,
  index,
  sectionId,
  isLocked,
  totalPreview,
  onUpdate,
  onRemove,
}: {
  lecture: Lecture;
  index: number;
  sectionId: string;
  isLocked: boolean;
  totalPreview: number;
  onUpdate: (d: Partial<Lecture>) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(lecture.title);
  const [saving, setSaving] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const typeCfg = TYPE_CONFIG[lecture.type];

  async function patchLecture(data: Partial<Lecture>) {
    await fetch(`/api/cms/lectures/${lecture.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function handleUploadSave(url: string, key?: string) {
    if (!url) return;
    setSaving("upload");
    const data =
      lecture.type === "VIDEO" ? { videoUrl: url } : { documentUrl: url };
    await patchLecture(data);
    onUpdate(
      lecture.type === "VIDEO" ? { videoUrl: url } : { documentUrl: url },
    );
    setSaving(null);
    setShowUpload(false);
  }

  async function saveTitle() {
    if (!title.trim() || title === lecture.title) {
      setEditing(false);
      return;
    }
    setSaving("title");
    await patchLecture({ title });
    onUpdate({ title });
    setSaving(null);
    setEditing(false);
  }

  async function togglePublished() {
    setSaving("publish");
    const val = !lecture.isPublished;
    await patchLecture({ isPublished: val });
    onUpdate({ isPublished: val });
    setSaving(null);
  }

  async function togglePreview() {
    if (!lecture.isPreview && totalPreview >= 3) {
      alert("Maximum 3 preview lectures allowed per course.");
      return;
    }
    setSaving("preview");
    const val = !lecture.isPreview;
    await patchLecture({ isPreview: val });
    onUpdate({ isPreview: val });
    setSaving(null);
  }

  async function deleteLecture() {
    setSaving("delete");
    await fetch(`/api/cms/lectures/${lecture.id}`, { method: "DELETE" });
    onRemove();
  }

  return (
    <Draggable draggableId={lecture.id} index={index} isDragDisabled={isLocked}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            padding: "9px 10px",
            borderRadius: "10px",
            background: snapshot.isDragging ? "#f0f9ff" : "#fafbfc",
            border: `1px solid ${snapshot.isDragging ? "#bfdbfe" : "#f1f5f9"}`,
            marginBottom: "6px",
          }}
        >
          {/* ── Main row ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Drag handle */}
            {!isLocked && (
              <div
                {...provided.dragHandleProps}
                style={{ cursor: "grab", color: "#cbd5e1", flexShrink: 0 }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="5" r="1" />
                  <circle cx="9" cy="12" r="1" />
                  <circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="5" r="1" />
                  <circle cx="15" cy="12" r="1" />
                  <circle cx="15" cy="19" r="1" />
                </svg>
              </div>
            )}

            {/* Type badge */}
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: "6px",
                background: typeCfg.bg,
                color: typeCfg.color,
                flexShrink: 0,
              }}
            >
              {typeCfg.label}
            </span>

            {/* Title */}
            {editing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle();
                  if (e.key === "Escape") setEditing(false);
                }}
                autoFocus
                style={{
                  flex: 1,
                  height: "28px",
                  padding: "0 8px",
                  border: "1.5px solid #bfdbfe",
                  borderRadius: "7px",
                  fontSize: "12.5px",
                  outline: "none",
                }}
              />
            ) : (
              <p
                style={{
                  flex: 1,
                  margin: 0,
                  fontSize: "12.5px",
                  fontWeight: 500,
                  color: "#334155",
                  letterSpacing: "-0.1px",
                }}
              >
                {lecture.title}
              </p>
            )}

            {/* Duration */}
            {lecture.duration > 0 && (
              <span
                style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0 }}
              >
                {lecture.duration}m
              </span>
            )}

            {/* Preview badge */}
            {lecture.isPreview && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: "6px",
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid #bbf7d0",
                  flexShrink: 0,
                }}
              >
                Free preview
              </span>
            )}

            {/* Action buttons */}
            {!isLocked && (
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                {editing ? (
                  <>
                    <SmBtn onClick={saveTitle} color="#1d4ed8">
                      {saving === "title" ? "…" : "Save"}
                    </SmBtn>
                    <SmBtn onClick={() => setEditing(false)} color="#64748b">
                      Cancel
                    </SmBtn>
                  </>
                ) : (
                  <>
                    <SmBtn onClick={() => setEditing(true)} color="#64748b">
                      Rename
                    </SmBtn>
                    <SmBtn
                      onClick={togglePreview}
                      color={lecture.isPreview ? "#92400e" : "#0f766e"}
                    >
                      {saving === "preview"
                        ? "…"
                        : lecture.isPreview
                          ? "Remove preview"
                          : "Set preview"}
                    </SmBtn>
                    <SmBtn
                      onClick={togglePublished}
                      color={lecture.isPublished ? "#854d0e" : "#1d4ed8"}
                    >
                      {saving === "publish"
                        ? "…"
                        : lecture.isPublished
                          ? "Unpublish"
                          : "Publish"}
                    </SmBtn>

                    {/* Upload button — VIDEO/DOCUMENT only */}
                    {(lecture.type === "VIDEO" ||
                      lecture.type === "DOCUMENT") && (
                      <SmBtn
                        onClick={() => setShowUpload((p) => !p)}
                        color="#475569"
                      >
                        {saving === "upload"
                          ? "…"
                          : showUpload
                            ? "Cancel upload"
                            : lecture.videoUrl || lecture.documentUrl
                              ? "Replace file"
                              : "Upload file"}
                      </SmBtn>
                    )}

                    {confirmDel ? (
                      <>
                        <SmBtn onClick={deleteLecture} color="#dc2626">
                          {saving === "delete" ? "…" : "Confirm"}
                        </SmBtn>
                        <SmBtn
                          onClick={() => setConfirmDel(false)}
                          color="#64748b"
                        >
                          Cancel
                        </SmBtn>
                      </>
                    ) : (
                      <SmBtn
                        onClick={() => setConfirmDel(true)}
                        color="#ef4444"
                      >
                        Delete
                      </SmBtn>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Published dot */}
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: lecture.isPublished ? "#16a34a" : "#e2e8f0",
                flexShrink: 0,
              }}
              title={lecture.isPublished ? "Published" : "Draft"}
            />
          </div>

          {/* ── Upload panel ── */}
          {!isLocked &&
            showUpload &&
            (lecture.type === "VIDEO" || lecture.type === "DOCUMENT") && (
              <div
                style={{
                  marginTop: "10px",
                  paddingTop: "10px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <UploadField
                  label={
                    lecture.type === "VIDEO" ? "Lecture Video" : "Document"
                  }
                  endpoint={
                    lecture.type === "VIDEO"
                      ? "lectureVideoUploader"
                      : "lectureDocumentUploader"
                  }
                  fileType={lecture.type === "VIDEO" ? "video" : "document"}
                  currentUrl={lecture.videoUrl ?? lecture.documentUrl ?? ""}
                  onUploadComplete={handleUploadSave}
                />
              </div>
            )}
        </div>
      )}
    </Draggable>
  );
}

function SmBtn({
  onClick,
  color,
  children,
}: {
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: "26px",
        padding: "0 9px",
        border: `1px solid ${color}25`,
        borderRadius: "7px",
        background: `${color}10`,
        color,
        fontSize: "11px",
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}
