// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// type FieldDef = {
//   key: string;
//   label: string;
//   type: "text" | "textarea" | "number" | "date" | "checkbox";
//   placeholder?: string;
// };

// export function RepeatableSection({
//   title,
//   endpoint,
//   fields,
//   items,
//   renderSummary,
// }: {
//   title: string;
//   endpoint: string;
//   fields: FieldDef[];
//   items: any[];
//   renderSummary: (item: any) => { primary: string; secondary: string };
// }) {
//   const router = useRouter();
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState<Record<string, any>>({});
//   const [saving, setSaving] = useState(false);

//   function initEmpty() {
//     const empty: Record<string, any> = {};
//     fields.forEach((f) => {
//       empty[f.key] = f.type === "checkbox" ? false : "";
//     });
//     setForm(empty);
//     setShowForm(true);
//   }

//   async function handleAdd() {
//     setSaving(true);
//     const payload: Record<string, any> = {};
//     fields.forEach((f) => {
//       let v = form[f.key];
//       if (f.type === "number" && v) v = Number(v);
//       if (f.key === "technologies" || f.key === "skills")
//         v = String(v)
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean);
//       if (f.type === "date" && v) v = new Date(v).toISOString();
//       payload[f.key] = v;
//     });
//     const res = await fetch(`/api/career/${endpoint}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     const json = await res.json();
//     setSaving(false);
//     if (json.success) {
//       setShowForm(false);
//       router.refresh();
//     }
//   }

//   async function handleDelete(id: string) {
//     if (!confirm("Remove this entry?")) return;
//     await fetch(`/api/career/${endpoint}/${id}`, { method: "DELETE" });
//     router.refresh();
//   }

//   return (
//     <div
//       style={{
//         background: "#fff",
//         border: "1px solid #e8edf2",
//         borderRadius: "16px",
//         padding: "1.5rem",
//         marginBottom: "1rem",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "1rem",
//         }}
//       >
//         <p
//           style={{
//             fontSize: "14px",
//             fontWeight: 700,
//             color: "#0f172a",
//             margin: 0,
//           }}
//         >
//           {title}
//         </p>
//         {!showForm && (
//           <button
//             onClick={initEmpty}
//             style={{
//               fontSize: "12px",
//               color: "#1d4ed8",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               fontWeight: 600,
//             }}
//           >
//             + Add
//           </button>
//         )}
//       </div>

//       {items.map((item) => {
//         const { primary, secondary } = renderSummary(item);
//         return (
//           <div
//             key={item.id}
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               padding: "10px 0",
//               borderBottom: "1px solid #f1f5f9",
//             }}
//           >
//             <div>
//               <p
//                 style={{
//                   fontSize: "13px",
//                   fontWeight: 600,
//                   color: "#0f172a",
//                   margin: "0 0 2px",
//                 }}
//               >
//                 {primary}
//               </p>
//               <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
//                 {secondary}
//               </p>
//             </div>
//             <button
//               onClick={() => handleDelete(item.id)}
//               style={{
//                 fontSize: "11px",
//                 color: "#ef4444",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               Remove
//             </button>
//           </div>
//         );
//       })}

//       {items.length === 0 && !showForm && (
//         <p style={{ fontSize: "12.5px", color: "#94a3b8" }}>None added yet.</p>
//       )}

//       {showForm && (
//         <div
//           style={{
//             marginTop: "10px",
//             padding: "12px",
//             background: "#f8fbff",
//             border: "1px solid #bfdbfe",
//             borderRadius: "10px",
//           }}
//         >
//           {fields.map((f) => (
//             <div key={f.key} style={{ marginBottom: "8px" }}>
//               <label
//                 style={{
//                   fontSize: "11.5px",
//                   fontWeight: 600,
//                   color: "#374151",
//                   display: "block",
//                   marginBottom: "4px",
//                 }}
//               >
//                 {f.label}
//               </label>
//               {f.type === "textarea" ? (
//                 <textarea
//                   value={form[f.key] ?? ""}
//                   onChange={(e) =>
//                     setForm({ ...form, [f.key]: e.target.value })
//                   }
//                   placeholder={f.placeholder}
//                   style={{
//                     width: "100%",
//                     minHeight: "60px",
//                     padding: "8px 10px",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: "8px",
//                     fontSize: "13px",
//                   }}
//                 />
//               ) : f.type === "checkbox" ? (
//                 <input
//                   type="checkbox"
//                   checked={!!form[f.key]}
//                   onChange={(e) =>
//                     setForm({ ...form, [f.key]: e.target.checked })
//                   }
//                 />
//               ) : (
//                 <input
//                   type={f.type}
//                   value={form[f.key] ?? ""}
//                   onChange={(e) =>
//                     setForm({ ...form, [f.key]: e.target.value })
//                   }
//                   placeholder={f.placeholder}
//                   style={{
//                     width: "100%",
//                     height: "36px",
//                     padding: "0 10px",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: "8px",
//                     fontSize: "13px",
//                   }}
//                 />
//               )}
//             </div>
//           ))}
//           <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
//             <button
//               onClick={handleAdd}
//               disabled={saving}
//               style={{
//                 height: "32px",
//                 padding: "0 14px",
//                 border: "none",
//                 borderRadius: "8px",
//                 background: "#1d4ed8",
//                 color: "#fff",
//                 fontSize: "12px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//               }}
//             >
//               {saving ? "…" : "Add"}
//             </button>
//             <button
//               onClick={() => setShowForm(false)}
//               style={{
//                 height: "32px",
//                 padding: "0 12px",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "8px",
//                 background: "#fff",
//                 fontSize: "12px",
//                 cursor: "pointer",
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "checkbox";
  placeholder?: string;
};
type SectionType = "education" | "experience" | "projects" | "certifications";

export function RepeatableSection({
  title,
  endpoint,
  fields,
  items,
  type,
}: {
  title: string;
  endpoint: string;
  fields: FieldDef[];
  items: any[];
  type: SectionType; // ← function ki jagah type string
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  function initEmpty() {
    const empty: Record<string, any> = {};
    fields.forEach((f) => {
      empty[f.key] = f.type === "checkbox" ? false : "";
    });
    setForm(empty);
    setShowForm(true);
  }

  async function handleAdd() {
    setSaving(true);
    const payload: Record<string, any> = {};
    fields.forEach((f) => {
      let v = form[f.key];
      if (f.type === "number" && v) v = Number(v);
      if (f.key === "technologies" || f.key === "skills")
        v = String(v)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      if (f.type === "date" && v) v = new Date(v).toISOString();
      payload[f.key] = v;
    });
    const res = await fetch(`/api/career/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setShowForm(false);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this entry?")) return;
    await fetch(`/api/career/${endpoint}/${id}`, { method: "DELETE" });
    router.refresh();
  }

  // ── Summary rendering moved inside client component ──────────
  function renderSummary(item: any): { primary: string; secondary: string } {
    switch (type) {
      case "education":
        return {
          primary: `${item.degree} — ${item.fieldOfStudy}`,
          secondary: `${item.institution} · ${item.startYear}-${item.endYear ?? "Present"}`,
        };
      case "experience":
        return {
          primary: item.title,
          secondary: `${item.company} · ${item.employmentType}`,
        };
      case "projects":
        return {
          primary: item.title,
          secondary: item.technologies?.join(", ") ?? "",
        };
      case "certifications":
        return { primary: item.name, secondary: item.issuingOrg };
      default:
        return { primary: "", secondary: "" };
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8edf2",
        borderRadius: "16px",
        padding: "1.5rem",
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
          }}
        >
          {title}
        </p>
        {!showForm && (
          <button
            onClick={initEmpty}
            style={{
              fontSize: "12px",
              color: "#1d4ed8",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Add
          </button>
        )}
      </div>

      {items.map((item) => {
        const { primary, secondary } = renderSummary(item);
        return (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: "0 0 2px",
                }}
              >
                {primary}
              </p>
              <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
                {secondary}
              </p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              style={{
                fontSize: "11px",
                color: "#ef4444",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        );
      })}

      {items.length === 0 && !showForm && (
        <p style={{ fontSize: "12.5px", color: "#94a3b8" }}>None added yet.</p>
      )}

      {showForm && (
        <div
          style={{
            marginTop: "10px",
            padding: "12px",
            background: "#f8fbff",
            border: "1px solid #bfdbfe",
            borderRadius: "10px",
          }}
        >
          {fields.map((f) => (
            <div key={f.key} style={{ marginBottom: "8px" }}>
              <label
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {f.label}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  value={form[f.key] ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  placeholder={f.placeholder}
                  style={{
                    width: "100%",
                    minHeight: "60px",
                    padding: "8px 10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
              ) : f.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={!!form[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.checked })
                  }
                />
              ) : (
                <input
                  type={f.type}
                  value={form[f.key] ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  placeholder={f.placeholder}
                  style={{
                    width: "100%",
                    height: "36px",
                    padding: "0 10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
              )}
            </div>
          ))}
          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            <button
              onClick={handleAdd}
              disabled={saving}
              style={{
                height: "32px",
                padding: "0 14px",
                border: "none",
                borderRadius: "8px",
                background: "#1d4ed8",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {saving ? "…" : "Add"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                height: "32px",
                padding: "0 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
