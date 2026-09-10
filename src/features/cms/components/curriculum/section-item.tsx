"use client";

import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { LectureItem } from "./lecture-item";
import { AddLectureForm } from "./add-lecture-form";
import type { Section, Lecture } from "./curriculum-builder";

export function SectionItem({
  section,
  index,
  courseId,
  isLocked,
  onUpdateSection,
  onRemoveSection,
  onAddLecture,
  onUpdateLecture,
  onRemoveLecture,
}: {
  section: Section;
  index: number;
  courseId: string;
  isLocked: boolean;
  onUpdateSection: (id: string, title: string) => void;
  onRemoveSection: (id: string) => void;
  onAddLecture: (sectionId: string, l: Lecture) => void;
  onUpdateLecture: (
    sectionId: string,
    lectureId: string,
    d: Partial<Lecture>,
  ) => void;
  onRemoveLecture: (sectionId: string, lectureId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  async function saveTitle() {
    if (!title.trim() || title === section.title) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await fetch(`/api/cms/sections/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setSaving(false);
    setEditing(false);
    onUpdateSection(section.id, title);
  }

  async function deleteSection() {
    setDeleting(true);
    await fetch(`/api/cms/sections/${section.id}`, { method: "DELETE" });
    onRemoveSection(section.id);
  }

  return (
    <Draggable draggableId={section.id} index={index} isDragDisabled={isLocked}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            background: "#fff",
            border: `1px solid ${snapshot.isDragging ? "#bfdbfe" : "#e8edf2"}`,
            borderRadius: "14px",
            marginBottom: "10px",
            boxShadow: snapshot.isDragging
              ? "0 8px 24px rgba(29,78,216,0.12)"
              : "0 1px 3px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              background: "#f8fafc",
              borderBottom: expanded ? "1px solid #e8edf2" : "none",
            }}
          >
            {/* Drag handle */}
            {!isLocked && (
              <div
                {...provided.dragHandleProps}
                style={{
                  cursor: "grab",
                  color: "#cbd5e1",
                  display: "flex",
                  flexShrink: 0,
                }}
              >
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
                  <circle cx="9" cy="5" r="1" />
                  <circle cx="9" cy="12" r="1" />
                  <circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="5" r="1" />
                  <circle cx="15" cy="12" r="1" />
                  <circle cx="15" cy="19" r="1" />
                </svg>
              </div>
            )}

            {/* Section number */}
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#94a3b8",
                flexShrink: 0,
              }}
            >
              S{index + 1}
            </span>

            {/* Title or edit input */}
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
                  height: "32px",
                  padding: "0 10px",
                  border: "1.5px solid #bfdbfe",
                  borderRadius: "8px",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            ) : (
              <p
                style={{
                  flex: 1,
                  margin: 0,
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#0f172a",
                  letterSpacing: "-0.2px",
                }}
              >
                {section.title}
              </p>
            )}

            <span
              style={{ fontSize: "11.5px", color: "#94a3b8", flexShrink: 0 }}
            >
              {section.lectures.length} lecture
              {section.lectures.length !== 1 ? "s" : ""}
            </span>

            {!isLocked && (
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                {editing ? (
                  <>
                    <ActionBtn
                      onClick={saveTitle}
                      color="#1d4ed8"
                      label={saving ? "…" : "Save"}
                    />
                    <ActionBtn
                      onClick={() => setEditing(false)}
                      color="#64748b"
                      label="Cancel"
                    />
                  </>
                ) : (
                  <>
                    <ActionBtn
                      onClick={() => setEditing(true)}
                      color="#64748b"
                      label="Edit"
                    />
                    {confirmDel ? (
                      <>
                        <ActionBtn
                          onClick={deleteSection}
                          color="#dc2626"
                          label={deleting ? "…" : "Confirm"}
                        />
                        <ActionBtn
                          onClick={() => setConfirmDel(false)}
                          color="#64748b"
                          label="Cancel"
                        />
                      </>
                    ) : (
                      <ActionBtn
                        onClick={() => setConfirmDel(true)}
                        color="#ef4444"
                        label="Delete"
                      />
                    )}
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                display: "flex",
                padding: "4px",
              }}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: expanded ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* Lectures */}
          {expanded && (
            <div style={{ padding: "8px 14px 12px" }}>
              <Droppable droppableId={section.id} type="LECTURE">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ minHeight: "4px" }}
                  >
                    {section.lectures.map((lecture, li) => (
                      <LectureItem
                        key={lecture.id}
                        lecture={lecture}
                        index={li}
                        sectionId={section.id}
                        isLocked={isLocked}
                        totalPreview={
                          section.lectures.filter((l) => l.isPreview).length
                        }
                        onUpdate={(d) =>
                          onUpdateLecture(section.id, lecture.id, d)
                        }
                        onRemove={() => onRemoveLecture(section.id, lecture.id)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {!isLocked && (
                <AddLectureForm
                  sectionId={section.id}
                  courseId={courseId}
                  order={section.lectures.length}
                  onAdd={(l) => onAddLecture(section.id, l)}
                />
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

function ActionBtn({
  onClick,
  color,
  label,
}: {
  onClick: () => void;
  color: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: "28px",
        padding: "0 10px",
        border: `1px solid ${color}20`,
        borderRadius: "7px",
        background: `${color}10`,
        color,
        fontSize: "11.5px",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
