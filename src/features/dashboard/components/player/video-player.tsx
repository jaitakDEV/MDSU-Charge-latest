// "use client";

// import { useState, useRef, useCallback, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";

// type Lecture = {
//   id: string;
//   title: string;
//   type: string;
//   videoUrl: string | null;
//   documentUrl: string | null;
//   textContent: string | null;
//   duration: number;
//   isPreview: boolean;
// };

// export function VideoPlayer({
//   lecture,
//   courseId,
//   userId,
//   courseSlug,
//   isCompleted,
//   allLectures,
// }: {
//   lecture: Lecture;
//   courseId: string;
//   userId: string;
//   courseSlug: string;
//   isCompleted: boolean;
//   allLectures: Lecture[];
// }) {
//   const router = useRouter();
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [marking, setMarking] = useState(false);
//   const [markedDone, setMarkedDone] = useState(isCompleted);

//   // Lecture badalne pe state ko sync karo — key na hone ki safety
//   useEffect(() => {
//     setMarkedDone(isCompleted);
//     setMarking(false);
//   }, [lecture.id, isCompleted]);

//   const currentIndex = allLectures.findIndex((l) => l.id === lecture.id);
//   const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
//   const nextLecture =
//     currentIndex < allLectures.length - 1
//       ? allLectures[currentIndex + 1]
//       : null;

//   const markComplete = useCallback(async () => {
//     if (markedDone || marking) return;
//     setMarking(true);
//     await fetch("/api/progress/update", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         lectureId: lecture.id,
//         courseId,
//         isCompleted: true,
//       }),
//     });
//     setMarking(false);
//     setMarkedDone(true);
//     router.refresh();
//   }, [lecture.id, courseId, markedDone, marking, router]);

//   // Sirf video poora khatam hone pe complete mark hota hai
//   function handleVideoEnded() {
//     markComplete();
//   }

//   return (
//     <div style={{ padding: "1.5rem", maxWidth: "900px" }}>
//       {/* Lecture title */}
//       <div style={{ marginBottom: "1.25rem" }}>
//         <p
//           style={{
//             fontSize: "11px",
//             fontWeight: 600,
//             color: "#94a3b8",
//             textTransform: "uppercase",
//             letterSpacing: "0.07em",
//             margin: "0 0 4px",
//           }}
//         >
//           {lecture.type === "VIDEO"
//             ? "Video Lecture"
//             : lecture.type === "DOCUMENT"
//               ? "Document"
//               : "Article"}
//         </p>
//         <h2
//           style={{
//             fontSize: "20px",
//             fontWeight: 700,
//             color: "#0f172a",
//             margin: 0,
//             letterSpacing: "-0.4px",
//           }}
//         >
//           {lecture.title}
//         </h2>
//       </div>

//       {/* ── VIDEO ── */}
//       {lecture.type === "VIDEO" && lecture.videoUrl && (
//         <div
//           style={{
//             background: "#000",
//             borderRadius: "14px",
//             overflow: "hidden",
//             marginBottom: "1.25rem",
//             aspectRatio: "16/9",
//           }}
//         >
//           <video
//             key={lecture.id}
//             ref={videoRef}
//             src={lecture.videoUrl}
//             controls
//             controlsList="nodownload noremoteplayback"
//             disablePictureInPicture
//             onContextMenu={(e) => e.preventDefault()}
//             onEnded={handleVideoEnded}
//             style={{ width: "100%", height: "100%", display: "block" }}
//           />
//         </div>
//       )}

//       {/* ── DOCUMENT ── */}
//       {lecture.type === "DOCUMENT" && lecture.documentUrl && (
//         <div
//           style={{
//             background: "#fff",
//             border: "1px solid #e8edf2",
//             borderRadius: "14px",
//             padding: "2rem",
//             textAlign: "center",
//             marginBottom: "1.25rem",
//           }}
//         >
//           <div
//             style={{
//               width: "56px",
//               height: "56px",
//               borderRadius: "14px",
//               background: "#eff6ff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               margin: "0 auto 14px",
//             }}
//           >
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#1d4ed8"
//               strokeWidth="1.8"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//               <polyline points="14 2 14 8 20 8" />
//             </svg>
//           </div>

//           <p
//             style={{
//               fontSize: "14px",
//               fontWeight: 600,
//               color: "#0f172a",
//               margin: "0 0 14px",
//             }}
//           >
//             {lecture.title}
//           </p>

//           <Link
//             href={lecture.documentUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={() => setTimeout(markComplete, 500)}
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "6px",
//               height: "40px",
//               padding: "0 20px",
//               border: "none",
//               borderRadius: "10px",
//               background: "#1d4ed8",
//               color: "#fff",
//               fontSize: "13px",
//               fontWeight: 600,
//               textDecoration: "none",
//             }}
//           >
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//               <polyline points="7 10 12 15 17 10" />
//               <line x1="12" y1="15" x2="12" y2="3" />
//             </svg>
//             Download Document
//           </Link>
//         </div>
//       )}

//       {/* ── TEXT / ARTICLE ── */}
//       {lecture.type === "TEXT" && lecture.textContent && (
//         <div
//           style={{
//             background: "#fff",
//             border: "1px solid #e8edf2",
//             borderRadius: "14px",
//             padding: "1.75rem",
//             marginBottom: "1.25rem",
//             lineHeight: 1.75,
//             fontSize: "14px",
//             color: "#334155",
//           }}
//           dangerouslySetInnerHTML={{ __html: lecture.textContent }}
//         />
//       )}

//       {/* ── Controls — sirf Prev/Next, Mark Complete button hata diya ── */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: "10px",
//           flexWrap: "wrap",
//         }}
//       >
//         <div style={{ display: "flex", gap: "8px" }}>
//           {prevLecture ? (
//             <Link
//               href={`${ROUTES.coursePlayer(courseSlug)}?lecture=${prevLecture.id}`}
//               style={{
//                 height: "36px",
//                 padding: "0 14px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "5px",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "9px",
//                 background: "#fff",
//                 color: "#475569",
//                 fontSize: "12.5px",
//                 fontWeight: 600,
//                 textDecoration: "none",
//               }}
//             >
//               ← Previous
//             </Link>
//           ) : (
//             <span />
//           )}
//           {nextLecture && (
//             <Link
//               href={`${ROUTES.coursePlayer(courseSlug)}?lecture=${nextLecture.id}`}
//               style={{
//                 height: "36px",
//                 padding: "0 14px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "5px",
//                 border: "1px solid #bfdbfe",
//                 borderRadius: "9px",
//                 background: "#eff6ff",
//                 color: "#1d4ed8",
//                 fontSize: "12.5px",
//                 fontWeight: 600,
//                 textDecoration: "none",
//               }}
//             >
//               Next →
//             </Link>
//           )}
//         </div>

//         {/* Completion status — read-only, koi button nahi */}
//         <div
//           style={{
//             height: "36px",
//             padding: "0 16px",
//             borderRadius: "9px",
//             background: markedDone ? "#f0fdf4" : "#f8fafc",
//             color: markedDone ? "#16a34a" : "#94a3b8",
//             fontSize: "12.5px",
//             fontWeight: 600,
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//             border: `1px solid ${markedDone ? "#bbf7d0" : "#e2e8f0"}`,
//           }}
//         >
//           {markedDone ? (
//             <>
//               <svg
//                 width="13"
//                 height="13"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//               Completed
//             </>
//           ) : marking ? (
//             "Saving…"
//           ) : (
//             "Watch to complete"
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { DocumentViewer } from "./document-viewer";

type Lecture = {
  id: string;
  title: string;
  type: string;
  videoUrl: string | null;
  documentUrl: string | null;
  textContent: string | null;
  duration: number;
  isPreview: boolean;
};

export function VideoPlayer({
  lecture,
  courseId,
  userId,
  courseSlug,
  isCompleted,
  allLectures,
}: {
  lecture: Lecture;
  courseId: string;
  userId: string;
  courseSlug: string;
  isCompleted: boolean;
  allLectures: Lecture[];
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [marking, setMarking] = useState(false);
  const [markedDone, setMarkedDone] = useState(isCompleted);

  useEffect(() => {
    setMarkedDone(isCompleted);
    setMarking(false);
  }, [lecture.id, isCompleted]);

  const currentIndex = allLectures.findIndex((l) => l.id === lecture.id);
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture =
    currentIndex < allLectures.length - 1
      ? allLectures[currentIndex + 1]
      : null;

  const markComplete = useCallback(async () => {
    if (markedDone || marking) return;
    setMarking(true);
    await fetch("/api/progress/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lectureId: lecture.id,
        courseId,
        isCompleted: true,
      }),
    });
    setMarking(false);
    setMarkedDone(true);
    router.refresh();
  }, [lecture.id, courseId, markedDone, marking, router]);

  function handleVideoEnded() {
    markComplete();
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            margin: "0 0 4px",
          }}
        >
          {lecture.type === "VIDEO"
            ? "Video Lecture"
            : lecture.type === "DOCUMENT"
              ? "Document"
              : "Article"}
        </p>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.4px",
          }}
        >
          {lecture.title}
        </h2>
      </div>

      {/* ── VIDEO ── */}
      {lecture.type === "VIDEO" && lecture.videoUrl && (
        <div
          style={{
            background: "#000",
            borderRadius: "14px",
            overflow: "hidden",
            marginBottom: "1.25rem",
            aspectRatio: "16/9",
          }}
        >
          <video
            key={lecture.id}
            ref={videoRef}
            src={lecture.videoUrl}
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            onEnded={handleVideoEnded}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </div>
      )}

      {/* ── DOCUMENT ── */}
      {lecture.type === "DOCUMENT" && lecture.documentUrl && (
        <div style={{ marginBottom: "1.25rem" }}>
          <DocumentViewer
            documentUrl={lecture.documentUrl}
            onFullyRead={markComplete}
          />
        </div>
      )}

      {/* ── TEXT / ARTICLE ── */}
      {lecture.type === "TEXT" && lecture.textContent && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "14px",
            padding: "1.75rem",
            marginBottom: "1.25rem",
            lineHeight: 1.75,
            fontSize: "14px",
            color: "#334155",
          }}
          dangerouslySetInnerHTML={{ __html: lecture.textContent }}
        />
      )}

      {/* ── Controls ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          {prevLecture ? (
            <Link
              href={`${ROUTES.coursePlayer(courseSlug)}?lecture=${prevLecture.id}`}
              style={{
                height: "36px",
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                background: "#fff",
                color: "#475569",
                fontSize: "12.5px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          {nextLecture && (
            <Link
              href={`${ROUTES.coursePlayer(courseSlug)}?lecture=${nextLecture.id}`}
              style={{
                height: "36px",
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                border: "1px solid #bfdbfe",
                borderRadius: "9px",
                background: "#eff6ff",
                color: "#1d4ed8",
                fontSize: "12.5px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Next →
            </Link>
          )}
        </div>

        <div
          style={{
            height: "36px",
            padding: "0 16px",
            borderRadius: "9px",
            background: markedDone ? "#f0fdf4" : "#f8fafc",
            color: markedDone ? "#16a34a" : "#94a3b8",
            fontSize: "12.5px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: `1px solid ${markedDone ? "#bbf7d0" : "#e2e8f0"}`,
          }}
        >
          {markedDone ? (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Completed
            </>
          ) : marking ? (
            "Saving…"
          ) : lecture.type === "VIDEO" ? (
            "Watch to complete"
          ) : lecture.type === "DOCUMENT" ? (
            "Scroll to end to complete"
          ) : (
            "Not completed"
          )}
        </div>
      </div>
    </div>
  );
}
