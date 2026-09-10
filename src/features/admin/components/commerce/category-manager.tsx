// "use client";

// import { useState } from "react";

// type Category = {
//   id: string;
//   name: string;
//   slug: string;
//   isActive: boolean;
//   displayOrder: number;
//   _count: { courses: number };
// };

// function slugify(s: string) {
//   return s
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");
// }

// export function CategoryManager({
//   initialCategories,
// }: {
//   initialCategories: Category[];
// }) {
//   const [cats, setCats] = useState(initialCategories);
//   const [name, setName] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   async function add() {
//     if (!name.trim()) {
//       setError("Name is required.");
//       return;
//     }
//     setSaving(true);
//     setError("");
//     const res = await fetch("/api/admin/categories", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: name.trim(),
//         slug: slugify(name),
//         displayOrder: cats.length,
//       }),
//     });
//     const json = await res.json();
//     setSaving(false);
//     if (!json.success) {
//       setError(json.error);
//       return;
//     }
//     setCats([...cats, json.data]);
//     setName("");
//   }

//   async function toggle(id: string, isActive: boolean) {
//     await fetch(`/api/admin/categories/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ isActive }),
//     });
//     setCats(cats.map((c) => (c.id === id ? { ...c, isActive } : c)));
//   }

//   async function remove(id: string) {
//     await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
//     setCats(cats.filter((c) => c.id !== id));
//   }

//   return (
//     <div>
//       {/* Add form */}
//       <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem" }}>
//         <input
//           value={name}
//           onChange={(e) => {
//             setName(e.target.value);
//             setError("");
//           }}
//           placeholder="Category name"
//           onKeyDown={(e) => e.key === "Enter" && add()}
//           style={{
//             flex: 1,
//             height: "40px",
//             padding: "0 12px",
//             border: "1px solid #e2e8f0",
//             borderRadius: "10px",
//             fontSize: "13px",
//           }}
//         />
//         <button
//           onClick={add}
//           disabled={saving}
//           style={{
//             height: "40px",
//             padding: "0 18px",
//             border: "none",
//             borderRadius: "10px",
//             background: "#1d4ed8",
//             color: "#fff",
//             fontSize: "13px",
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           {saving ? "Adding…" : "Add"}
//         </button>
//       </div>
//       {error && (
//         <p style={{ fontSize: "12px", color: "#dc2626", marginBottom: "8px" }}>
//           {error}
//         </p>
//       )}

//       {/* List */}
//       {cats.map((c, i) => (
//         <div
//           key={c.id}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//             background: "#fff",
//             border: "1px solid #e8edf2",
//             borderRadius: "12px",
//             padding: "12px 14px",
//             marginBottom: "8px",
//           }}
//         >
//           <span
//             style={{
//               fontSize: "11px",
//               fontWeight: 700,
//               color: "#94a3b8",
//               width: "20px",
//               textAlign: "center",
//             }}
//           >
//             {i + 1}
//           </span>
//           <div style={{ flex: 1 }}>
//             <p
//               style={{
//                 fontSize: "13.5px",
//                 fontWeight: 600,
//                 color: "#0f172a",
//                 margin: "0 0 2px",
//               }}
//             >
//               {c.name}
//             </p>
//             <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
//               /{c.slug} · {c._count.courses} courses
//             </p>
//           </div>
//           <button
//             onClick={() => toggle(c.id, !c.isActive)}
//             style={{
//               fontSize: "11px",
//               padding: "4px 10px",
//               borderRadius: "20px",
//               border: "none",
//               background: c.isActive ? "#f0fdf4" : "#f1f5f9",
//               color: c.isActive ? "#16a34a" : "#94a3b8",
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             {c.isActive ? "Active" : "Inactive"}
//           </button>
//           {c._count.courses === 0 && (
//             <button
//               onClick={() => remove(c.id)}
//               style={{
//                 fontSize: "11px",
//                 padding: "4px 10px",
//                 borderRadius: "8px",
//                 border: "1px solid #fecaca",
//                 background: "#fef2f2",
//                 color: "#ef4444",
//                 cursor: "pointer",
//               }}
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
  _count: { courses: number };
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [cats, setCats] = useState(initialCategories);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function add() {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        slug: slugify(name),
        displayOrder: cats.length,
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.success) {
      setError(json.error);
      return;
    }
    // Fix: the API response for a freshly created category doesn't include
    // the `_count.courses` relation (a brand-new category has no courses
    // linked to it yet), so `c._count` was `undefined` and crashed the render
    // below. Default it to `{ courses: 0 }` when appending to state.
    setCats([
      ...cats,
      { ...json.data, _count: json.data._count ?? { courses: 0 } },
    ]);
    setName("");
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setCats(cats.map((c) => (c.id === id ? { ...c, isActive } : c)));
  }

  async function remove(id: string) {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setCats(cats.filter((c) => c.id !== id));
  }

  return (
    <div>
      {/* Add form */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem" }}>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="Category name"
          onKeyDown={(e) => e.key === "Enter" && add()}
          style={{
            flex: 1,
            height: "40px",
            padding: "0 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
          }}
        />
        <button
          onClick={add}
          disabled={saving}
          style={{
            height: "40px",
            padding: "0 18px",
            border: "none",
            borderRadius: "10px",
            background: "#1d4ed8",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {saving ? "Adding…" : "Add"}
        </button>
      </div>
      {error && (
        <p style={{ fontSize: "12px", color: "#dc2626", marginBottom: "8px" }}>
          {error}
        </p>
      )}

      {/* List */}
      {cats.map((c, i) => (
        <div
          key={c.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "12px",
            padding: "12px 14px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#94a3b8",
              width: "20px",
              textAlign: "center",
            }}
          >
            {i + 1}
          </span>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "13.5px",
                fontWeight: 600,
                color: "#0f172a",
                margin: "0 0 2px",
              }}
            >
              {c.name}
            </p>
            <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
              {/* Fix: defensive optional chaining as a second safety net,
                  in case any future code path adds a category without _count */}
              /{c.slug} · {c._count?.courses ?? 0} courses
            </p>
          </div>
          <button
            onClick={() => toggle(c.id, !c.isActive)}
            style={{
              fontSize: "11px",
              padding: "4px 10px",
              borderRadius: "20px",
              border: "none",
              background: c.isActive ? "#f0fdf4" : "#f1f5f9",
              color: c.isActive ? "#16a34a" : "#94a3b8",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {c.isActive ? "Active" : "Inactive"}
          </button>
          {(c._count?.courses ?? 0) === 0 && (
            <button
              onClick={() => remove(c.id)}
              style={{
                fontSize: "11px",
                padding: "4px 10px",
                borderRadius: "8px",
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
