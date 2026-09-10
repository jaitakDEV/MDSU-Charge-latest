// "use client";

// import { useState, useCallback } from "react";
// import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
// import { useRouter } from "next/navigation";
// import { SectionItem } from "./section-item";
// import { AddSectionForm } from "./add-section-form";

// export type Lecture = {
//   id: string;
//   title: string;
//   type: "VIDEO" | "DOCUMENT" | "TEXT";
//   isPreview: boolean;
//   isPublished: boolean;
//   duration: number;
//   videoUrl: string | null;
//   documentUrl: string | null;
//   displayOrder: number;
// };

// export type Section = {
//   id: string;
//   title: string;
//   displayOrder: number;
//   lectures: Lecture[];
// };

// export function CurriculumBuilder({
//   courseId,
//   initialSections,
//   isLocked,
// }: {
//   courseId: string;
//   initialSections: Section[];
//   isLocked: boolean;
// }) {
//   const router = useRouter();
//   const [sections, setSections] = useState<Section[]>(initialSections);
//   const [saving, setSaving] = useState(false);

//   // ── Drag end ────────────────────────────────────────────────
//   async function onDragEnd(result: DropResult) {
//     if (!result.destination || isLocked) return;
//     const { source, destination, type } = result;
//     if (
//       source.index === destination.index &&
//       source.droppableId === destination.droppableId
//     )
//       return;

//     if (type === "SECTION") {
//       const reordered = [...sections];
//       const [moved] = reordered.splice(source.index, 1);
//       reordered.splice(destination.index, 0, moved);
//       const updated = reordered.map((s, i) => ({ ...s, displayOrder: i }));
//       setSections(updated);
//       await saveOrder(
//         "/api/cms/sections/reorder",
//         updated.map((s) => s.id),
//       );
//     }

//     if (type === "LECTURE") {
//       const sectionId = source.droppableId;
//       const updated = sections.map((s) => {
//         if (s.id !== sectionId) return s;
//         const lecs = [...s.lectures];
//         const [moved] = lecs.splice(source.index, 1);
//         lecs.splice(destination.index, 0, moved);
//         return {
//           ...s,
//           lectures: lecs.map((l, i) => ({ ...l, displayOrder: i })),
//         };
//       });
//       setSections(updated);
//       const section = updated.find((s) => s.id === sectionId);
//       if (section) {
//         await saveOrder(
//           "/api/cms/lectures/reorder",
//           section.lectures.map((l) => l.id),
//         );
//       }
//     }
//   }

//   async function saveOrder(url: string, ids: string[]) {
//     setSaving(true);
//     await fetch(url, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ids }),
//     });
//     setSaving(false);
//   }

//   // ── Section CRUD ─────────────────────────────────────────────
//   function addSection(section: Section) {
//     setSections((prev) => [...prev, section]);
//   }

//   function updateSection(id: string, title: string) {
//     setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
//   }

//   function removeSection(id: string) {
//     setSections((prev) => prev.filter((s) => s.id !== id));
//   }

//   // ── Lecture CRUD ─────────────────────────────────────────────
//   function addLecture(sectionId: string, lecture: Lecture) {
//     setSections((prev) =>
//       prev.map((s) =>
//         s.id === sectionId ? { ...s, lectures: [...s.lectures, lecture] } : s,
//       ),
//     );
//   }

//   function updateLecture(
//     sectionId: string,
//     lectureId: string,
//     data: Partial<Lecture>,
//   ) {
//     setSections((prev) =>
//       prev.map((s) =>
//         s.id === sectionId
//           ? {
//               ...s,
//               lectures: s.lectures.map((l) =>
//                 l.id === lectureId ? { ...l, ...data } : l,
//               ),
//             }
//           : s,
//       ),
//     );
//   }

//   function removeLecture(sectionId: string, lectureId: string) {
//     setSections((prev) =>
//       prev.map((s) =>
//         s.id === sectionId
//           ? { ...s, lectures: s.lectures.filter((l) => l.id !== lectureId) }
//           : s,
//       ),
//     );
//   }

//   const totalLectures = sections.reduce((a, s) => a + s.lectures.length, 0);
//   const totalDuration = sections.reduce(
//     (a, s) => a + s.lectures.reduce((b, l) => b + l.duration, 0),
//     0,
//   );

//   return (
//     <div>
//       {/* Stats bar */}
//       <div
//         style={{
//           display: "flex",
//           gap: "16px",
//           marginBottom: "1.25rem",
//           padding: "10px 14px",
//           background: "#f8fafc",
//           border: "1px solid #e2e8f0",
//           borderRadius: "10px",
//           fontSize: "12.5px",
//           color: "#64748b",
//         }}
//       >
//         <span>
//           <strong style={{ color: "#0f172a" }}>{sections.length}</strong>{" "}
//           sections
//         </span>
//         <span>
//           <strong style={{ color: "#0f172a" }}>{totalLectures}</strong> lectures
//         </span>
//         <span>
//           <strong style={{ color: "#0f172a" }}>{totalDuration}</strong> min
//           total
//         </span>
//         {saving && (
//           <span style={{ marginLeft: "auto", color: "#3b82f6" }}>
//             Saving order…
//           </span>
//         )}
//       </div>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="sections" type="SECTION">
//           {(provided) => (
//             <div ref={provided.innerRef} {...provided.droppableProps}>
//               {sections.map((section, index) => (
//                 <SectionItem
//                   key={section.id}
//                   section={section}
//                   index={index}
//                   courseId={courseId}
//                   isLocked={isLocked}
//                   onUpdateSection={updateSection}
//                   onRemoveSection={removeSection}
//                   onAddLecture={addLecture}
//                   onUpdateLecture={updateLecture}
//                   onRemoveLecture={removeLecture}
//                 />
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>

//       {!isLocked && (
//         <AddSectionForm
//           courseId={courseId}
//           order={sections.length}
//           onAdd={addSection}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useCallback } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";
import { SectionItem } from "./section-item";
import { AddSectionForm } from "./add-section-form";
import { ROUTES } from "@/config/app";
import Link from "next/link";

export type Lecture = {
  id: string;
  title: string;
  type: "VIDEO" | "DOCUMENT" | "TEXT";
  isPreview: boolean;
  isPublished: boolean;
  duration: number;
  videoUrl: string | null;
  documentUrl: string | null;
  displayOrder: number;
};

export type Section = {
  id: string;
  title: string;
  displayOrder: number;
  lectures: Lecture[];
};

export function CurriculumBuilder({
  courseId,
  courseStatus,
  initialSections,
  isLocked,
}: {
  courseId: string;
  courseStatus: string;
  initialSections: Section[];
  isLocked: boolean;
}) {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Drag end ─────────────────────────────────────────────
  async function onDragEnd(result: DropResult) {
    if (!result.destination || isLocked) return;
    const { source, destination, type } = result;
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    )
      return;

    if (type === "SECTION") {
      const reordered = [...sections];
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      const updated = reordered.map((s, i) => ({ ...s, displayOrder: i }));
      setSections(updated);
      await saveOrder(
        "/api/cms/sections/reorder",
        updated.map((s) => s.id),
      );
    }

    if (type === "LECTURE") {
      const sectionId = source.droppableId;
      const updated = sections.map((s) => {
        if (s.id !== sectionId) return s;
        const lecs = [...s.lectures];
        const [moved] = lecs.splice(source.index, 1);
        lecs.splice(destination.index, 0, moved);
        return {
          ...s,
          lectures: lecs.map((l, i) => ({ ...l, displayOrder: i })),
        };
      });
      setSections(updated);
      const section = updated.find((s) => s.id === sectionId);
      if (section)
        await saveOrder(
          "/api/cms/lectures/reorder",
          section.lectures.map((l) => l.id),
        );
    }
  }

  async function saveOrder(url: string, ids: string[]) {
    setSaving(true);
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    setSaving(false);
  }

  // ── Section CRUD ──────────────────────────────────────────
  function addSection(section: Section) {
    setSections((p) => [...p, section]);
  }
  function updateSection(id: string, title: string) {
    setSections((p) => p.map((s) => (s.id === id ? { ...s, title } : s)));
  }
  function removeSection(id: string) {
    setSections((p) => p.filter((s) => s.id !== id));
  }

  // ── Lecture CRUD ──────────────────────────────────────────
  function addLecture(sectionId: string, lecture: Lecture) {
    setSections((p) =>
      p.map((s) =>
        s.id === sectionId ? { ...s, lectures: [...s.lectures, lecture] } : s,
      ),
    );
  }
  function updateLecture(
    sectionId: string,
    lectureId: string,
    data: Partial<Lecture>,
  ) {
    setSections((p) =>
      p.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: s.lectures.map((l) =>
                l.id === lectureId ? { ...l, ...data } : l,
              ),
            }
          : s,
      ),
    );
  }
  function removeLecture(sectionId: string, lectureId: string) {
    setSections((p) =>
      p.map((s) =>
        s.id === sectionId
          ? { ...s, lectures: s.lectures.filter((l) => l.id !== lectureId) }
          : s,
      ),
    );
  }

  // ── Submit for Review ─────────────────────────────────────
  async function handleSubmitForReview() {
    setSubmitError("");
    const publishedCount = sections.flatMap((s) =>
      s.lectures.filter((l) => l.isPublished),
    ).length;

    if (publishedCount === 0) {
      setSubmitError(
        "Publish at least one lecture before submitting for review.",
      );
      return;
    }

    setSubmitting(true);
    const res = await fetch(`/api/cms/courses/${courseId}/submit-review`, {
      method: "PATCH",
    });
    const json = await res.json();
    setSubmitting(false);

    if (!json.success) {
      setSubmitError(json.error ?? "Submission failed.");
      return;
    }

    router.push(ROUTES.cmsCourses + "?submitted=1");
  }

  const totalLectures = sections.reduce((a, s) => a + s.lectures.length, 0);
  const publishedCount = sections.reduce(
    (a, s) => a + s.lectures.filter((l) => l.isPublished).length,
    0,
  );
  const totalDuration = sections.reduce(
    (a, s) => a + s.lectures.reduce((b, l) => b + l.duration, 0),
    0,
  );
  const canSubmit = courseStatus === "DRAFT" && publishedCount > 0;

  return (
    <div>
      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "1.25rem",
          padding: "10px 14px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          fontSize: "12.5px",
          color: "#64748b",
          flexWrap: "wrap",
        }}
      >
        <span>
          <strong style={{ color: "#0f172a" }}>{sections.length}</strong>{" "}
          sections
        </span>
        <span>
          <strong style={{ color: "#0f172a" }}>{totalLectures}</strong> lectures
        </span>
        <span>
          <strong style={{ color: publishedCount > 0 ? "#16a34a" : "#0f172a" }}>
            {publishedCount}
          </strong>{" "}
          published
        </span>
        <span>
          <strong style={{ color: "#0f172a" }}>{totalDuration}</strong> min
          total
        </span>
        {saving && (
          <span style={{ marginLeft: "auto", color: "#3b82f6" }}>
            Saving order…
          </span>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections" type="SECTION">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sections.map((section, index) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  index={index}
                  courseId={courseId}
                  isLocked={isLocked}
                  onUpdateSection={updateSection}
                  onRemoveSection={removeSection}
                  onAddLecture={addLecture}
                  onUpdateLecture={updateLecture}
                  onRemoveLecture={removeLecture}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {!isLocked && (
        <AddSectionForm
          courseId={courseId}
          order={sections.length}
          onAdd={addSection}
        />
      )}

      {/* ── Submit for Review section ── */}
      {courseStatus === "DRAFT" && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1.25rem",
            background: publishedCount > 0 ? "#f0fdf4" : "#f8fafc",
            border: `1.5px solid ${publishedCount > 0 ? "#86efac" : "#e2e8f0"}`,
            borderRadius: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 4px",
                }}
              >
                Ready to submit?
              </p>
              <p style={{ fontSize: "12.5px", color: "#64748b", margin: 0 }}>
                {publishedCount === 0
                  ? "Publish at least one lecture before submitting for review."
                  : `${publishedCount} lecture${publishedCount !== 1 ? "s" : ""} published — good to go!`}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Link
                href={ROUTES.cmsCourseEdit(courseId)}
                style={{
                  height: "38px",
                  padding: "0 16px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  background: "#fff",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Edit Course Details
              </Link>
              <button
                onClick={handleSubmitForReview}
                disabled={!canSubmit || submitting}
                style={{
                  height: "38px",
                  padding: "0 20px",
                  border: "none",
                  borderRadius: "10px",
                  background: canSubmit
                    ? "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)"
                    : "#e2e8f0",
                  color: canSubmit ? "#fff" : "#94a3b8",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  boxShadow: canSubmit
                    ? "0 2px 6px rgba(29,78,216,0.25)"
                    : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                {submitting ? "Submitting…" : "Submit for Review"}
              </button>
            </div>
          </div>

          {submitError && (
            <p
              style={{
                fontSize: "12.5px",
                color: "#dc2626",
                margin: "10px 0 0",
              }}
            >
              {submitError}
            </p>
          )}
        </div>
      )}

      {courseStatus === "REVIEW" && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1.25rem",
            background: "#fefce8",
            border: "1px solid #fde68a",
            borderRadius: "14px",
          }}
        >
          <p
            style={{
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#854d0e",
              margin: "0 0 3px",
            }}
          >
            Under Review
          </p>
          <p style={{ fontSize: "12.5px", color: "#b45309", margin: 0 }}>
            Admin is reviewing this course. Editing is disabled until they
            respond.
          </p>
        </div>
      )}

      {courseStatus === "PUBLISHED" && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1.25rem",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#166534",
                margin: "0 0 3px",
              }}
            >
              ✓ Course is Live
            </p>
            <p style={{ fontSize: "12.5px", color: "#16a34a", margin: 0 }}>
              Published and visible on catalogue. You can still add/edit
              lectures.
            </p>
          </div>
          <Link
            href={ROUTES.cmsCourseEdit(courseId)}
            style={{
              height: "36px",
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              border: "1px solid #bbf7d0",
              borderRadius: "9px",
              background: "#fff",
              color: "#166534",
              fontSize: "12.5px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Edit Details
          </Link>
        </div>
      )}
    </div>
  );
}
