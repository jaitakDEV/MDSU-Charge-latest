"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/app";
import { useState } from "react";

type Lecture = {
  id: string;
  title: string;
  type: string;
  duration: number;
};
type Section = {
  id: string;
  title: string;
  lectures: Lecture[];
};

const TYPE_ICON: Record<string, string> = {
  VIDEO: "▶",
  DOCUMENT: "📄",
  TEXT: "📝",
};

export function LectureSidebar({
  sections,
  activeLectureId,
  courseSlug,
  completedIds,
}: {
  sections: Section[];
  activeLectureId: string;
  courseSlug: string;
  completedIds: string[];
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggleSection(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const completedSet = new Set(completedIds);

  return (
    <aside
      style={{
        width: "300px",
        flexShrink: 0,
        background: "#fff",
        borderRight: "1px solid #e8edf2",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid #f1f5f9",
          background: "#fafafa",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          Course Content
        </p>
      </div>

      {sections.map((section) => {
        const isCollapsed = collapsed.has(section.id);
        const sectionDone = section.lectures.every((l) =>
          completedSet.has(l.id),
        );

        return (
          <div key={section.id} style={{ borderBottom: "1px solid #f8fafc" }}>
            {/* Section header */}
            <button
              onClick={() => toggleSection(section.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                background: "#f8fafc",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {sectionDone && (
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
              <p
                style={{
                  flex: 1,
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#334155",
                  margin: 0,
                }}
              >
                {section.title}
              </p>
              <span style={{ fontSize: "10.5px", color: "#94a3b8" }}>
                {section.lectures.filter((l) => completedSet.has(l.id)).length}/
                {section.lectures.length}
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isCollapsed ? "rotate(-90deg)" : "none",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Lectures */}
            {!isCollapsed &&
              section.lectures.map((lecture) => {
                const isActive = lecture.id === activeLectureId;
                const isCompleted = completedSet.has(lecture.id);

                return (
                  <Link
                    key={lecture.id}
                    href={`${ROUTES.coursePlayer(courseSlug)}?lecture=${lecture.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "9px 14px 9px 24px",
                      background: isActive ? "#eff6ff" : "transparent",
                      borderLeft: isActive
                        ? "3px solid #1d4ed8"
                        : "3px solid transparent",
                      textDecoration: "none",
                    }}
                  >
                    {/* Completion indicator */}
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isCompleted
                          ? "#16a34a"
                          : isActive
                            ? "#dbeafe"
                            : "#f1f5f9",
                        border: isCompleted
                          ? "none"
                          : `1.5px solid ${isActive ? "#bfdbfe" : "#e2e8f0"}`,
                      }}
                    >
                      {isCompleted && (
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {!isCompleted && (
                        <span
                          style={{
                            fontSize: "8px",
                            color: isActive ? "#1d4ed8" : "#94a3b8",
                          }}
                        >
                          {TYPE_ICON[lecture.type] ?? "▶"}
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        flex: 1,
                        fontSize: "12.5px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#1d4ed8" : "#475569",
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {lecture.title}
                    </p>

                    {lecture.duration > 0 && (
                      <span
                        style={{
                          fontSize: "10.5px",
                          color: "#94a3b8",
                          flexShrink: 0,
                        }}
                      >
                        {lecture.duration}m
                      </span>
                    )}
                  </Link>
                );
              })}
          </div>
        );
      })}
    </aside>
  );
}
