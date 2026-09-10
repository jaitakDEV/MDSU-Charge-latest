"use client";

import type { WizardData } from "./course-wizard";
import { Field, textareaStyle, inputStyle } from "./step1-basic-info";

export function Step2Description({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  function updateList(
    key: "learningOutcomes" | "requirements",
    i: number,
    val: string,
  ) {
    const arr = [...data[key]];
    arr[i] = val;
    update({ [key]: arr });
  }

  function addItem(key: "learningOutcomes" | "requirements") {
    update({ [key]: [...data[key], ""] });
  }

  function removeItem(key: "learningOutcomes" | "requirements", i: number) {
    update({ [key]: data[key].filter((_, idx) => idx !== i) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <h2
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#0f172a",
          margin: 0,
          letterSpacing: "-0.3px",
        }}
      >
        Description & Outcomes
      </h2>

      <Field
        label="Short Description"
        hint="Shown on course card — max 160 characters"
        required
      >
        <input
          value={data.description}
          onChange={(e) =>
            update({ description: e.target.value.slice(0, 160) })
          }
          placeholder="A brief summary of what this course covers"
          maxLength={160}
          style={inputStyle}
        />
        <span
          style={{
            fontSize: "11px",
            color: data.description.length > 140 ? "#ef4444" : "#94a3b8",
          }}
        >
          {data.description.length}/160
        </span>
      </Field>

      <Field
        label="Full Description"
        hint="Shown on course detail page — supports plain text"
      >
        <textarea
          value={data.about}
          onChange={(e) => update({ about: e.target.value })}
          placeholder="Describe what students will learn, who this course is for, and what makes it unique…"
          style={{ ...textareaStyle, minHeight: "140px" }}
        />
      </Field>

      <Field label="What students will learn" hint="Add key learning outcomes">
        {data.learningOutcomes.map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: "8px", marginBottom: "6px" }}
          >
            <input
              value={item}
              onChange={(e) =>
                updateList("learningOutcomes", i, e.target.value)
              }
              placeholder={`Outcome ${i + 1}`}
              style={{ ...inputStyle, flex: 1 }}
            />
            {data.learningOutcomes.length > 1 && (
              <button
                onClick={() => removeItem("learningOutcomes", i)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  background: "#fef2f2",
                  color: "#ef4444",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addItem("learningOutcomes")}
          style={{
            height: "36px",
            padding: "0 14px",
            border: "1px dashed #bfdbfe",
            borderRadius: "10px",
            background: "#f8fbff",
            color: "#1d4ed8",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add outcome
        </button>
      </Field>

      <Field label="Requirements" hint="Prerequisites students should have">
        {data.requirements.map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: "8px", marginBottom: "6px" }}
          >
            <input
              value={item}
              onChange={(e) => updateList("requirements", i, e.target.value)}
              placeholder={`Requirement ${i + 1}`}
              style={{ ...inputStyle, flex: 1 }}
            />
            {data.requirements.length > 1 && (
              <button
                onClick={() => removeItem("requirements", i)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  background: "#fef2f2",
                  color: "#ef4444",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addItem("requirements")}
          style={{
            height: "36px",
            padding: "0 14px",
            border: "1px dashed #bfdbfe",
            borderRadius: "10px",
            background: "#f8fbff",
            color: "#1d4ed8",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add requirement
        </button>
      </Field>
    </div>
  );
}
