// "use client";

// import { useState } from "react";
// import { UploadField } from "@/features/cms/components/upload-field";

// type Banner = {
//   id: string;
//   imageUrl: string;
//   altText: string;
//   title: string | null;
//   buttonText: string | null;
//   buttonLink: string | null;
//   displayOrder: number;
//   isActive: boolean;
// };

// export function BannerManager({
//   initialBanners,
// }: {
//   initialBanners: Banner[];
// }) {
//   const [banners, setBanners] = useState(initialBanners);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     imageUrl: "",
//     altText: "",
//     title: "",
//     buttonText: "",
//     buttonLink: "",
//   });
//   const [saving, setSaving] = useState(false);

//   async function addBanner() {
//     if (!form.imageUrl || !form.altText) return;
//     setSaving(true);
//     const res = await fetch("/api/cms/banners", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...form, displayOrder: banners.length }),
//     });
//     const json = await res.json();
//     setSaving(false);
//     if (json.success) {
//       setBanners([...banners, json.data]);
//       setForm({
//         imageUrl: "",
//         altText: "",
//         title: "",
//         buttonText: "",
//         buttonLink: "",
//       });
//       setShowForm(false);
//     }
//   }

//   async function toggleActive(id: string, isActive: boolean) {
//     await fetch(`/api/cms/banners/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ isActive }),
//     });
//     setBanners(banners.map((b) => (b.id === id ? { ...b, isActive } : b)));
//   }

//   async function deleteBanner(id: string) {
//     await fetch(`/api/cms/banners/${id}`, { method: "DELETE" });
//     setBanners(banners.filter((b) => b.id !== id));
//   }

//   const inputStyle: React.CSSProperties = {
//     height: "38px",
//     padding: "0 12px",
//     border: "1px solid #e2e8f0",
//     borderRadius: "9px",
//     fontSize: "13px",
//     outline: "none",
//     width: "100%",
//   };

//   return (
//     <div>
//       {banners.map((banner) => (
//         <div
//           key={banner.id}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             background: "#fff",
//             border: "1px solid #e8edf2",
//             borderRadius: "12px",
//             padding: "12px",
//             marginBottom: "8px",
//           }}
//         >
//           {banner.imageUrl && (
//             <img
//               src={banner.imageUrl}
//               alt={banner.altText}
//               style={{
//                 width: "80px",
//                 height: "44px",
//                 objectFit: "cover",
//                 borderRadius: "7px",
//                 flexShrink: 0,
//               }}
//             />
//           )}
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <p
//               style={{
//                 fontSize: "13px",
//                 fontWeight: 600,
//                 color: "#0f172a",
//                 margin: "0 0 2px",
//               }}
//             >
//               {banner.title || banner.altText}
//             </p>
//             <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
//               {banner.buttonLink || "No link"}
//             </p>
//           </div>
//           <button
//             onClick={() => toggleActive(banner.id, !banner.isActive)}
//             style={{
//               fontSize: "11px",
//               padding: "4px 10px",
//               borderRadius: "20px",
//               border: "none",
//               background: banner.isActive ? "#f0fdf4" : "#f1f5f9",
//               color: banner.isActive ? "#16a34a" : "#94a3b8",
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             {banner.isActive ? "Active" : "Inactive"}
//           </button>
//           <button
//             onClick={() => deleteBanner(banner.id)}
//             style={{
//               fontSize: "11px",
//               padding: "4px 10px",
//               borderRadius: "8px",
//               border: "1px solid #fecaca",
//               background: "#fef2f2",
//               color: "#ef4444",
//               cursor: "pointer",
//             }}
//           >
//             Delete
//           </button>
//         </div>
//       ))}

//       {showForm ? (
//         <div
//           style={{
//             background: "#f8fbff",
//             border: "1.5px solid #bfdbfe",
//             borderRadius: "14px",
//             padding: "1.25rem",
//             display: "flex",
//             flexDirection: "column",
//             gap: "10px",
//           }}
//         >
//           <input
//             placeholder="Image URL (UploadThing)"
//             value={form.imageUrl}
//             onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
//             style={inputStyle}
//           />
//           <input
//             placeholder="Alt text"
//             value={form.altText}
//             onChange={(e) => setForm({ ...form, altText: e.target.value })}
//             style={inputStyle}
//           />
//           <input
//             placeholder="Title (optional)"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             style={inputStyle}
//           />
//           <div style={{ display: "flex", gap: "8px" }}>
//             <input
//               placeholder="Button text"
//               value={form.buttonText}
//               onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
//               style={inputStyle}
//             />
//             <input
//               placeholder="Button link"
//               value={form.buttonLink}
//               onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
//               style={inputStyle}
//             />
//           </div>
//           <div
//             style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
//           >
//             <button
//               onClick={() => setShowForm(false)}
//               style={{
//                 height: "36px",
//                 padding: "0 16px",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "9px",
//                 background: "#fff",
//                 fontSize: "12.5px",
//                 cursor: "pointer",
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={addBanner}
//               disabled={saving}
//               style={{
//                 height: "36px",
//                 padding: "0 18px",
//                 border: "none",
//                 borderRadius: "9px",
//                 background: "#1d4ed8",
//                 color: "#fff",
//                 fontSize: "12.5px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//               }}
//             >
//               {saving ? "Saving…" : "Add Banner"}
//             </button>
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={() => setShowForm(true)}
//           style={{
//             width: "100%",
//             height: "44px",
//             border: "1.5px dashed #bfdbfe",
//             borderRadius: "12px",
//             background: "#f8fbff",
//             color: "#1d4ed8",
//             fontSize: "13px",
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           + Add Banner
//         </button>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { UploadField } from "@/features/cms/components/upload-field";

type Banner = {
  id: string;
  imageUrl: string;
  altText: string;
  title: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  displayOrder: number;
  isActive: boolean;
};

export function BannerManager({
  initialBanners,
}: {
  initialBanners: Banner[];
}) {
  const [banners, setBanners] = useState(initialBanners);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    imageUrl: "",
    altText: "",
    title: "",
    buttonText: "",
    buttonLink: "",
  });
  const [saving, setSaving] = useState(false);

  async function addBanner() {
    if (!form.imageUrl || !form.altText) return;
    setSaving(true);
    const res = await fetch("/api/cms/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, displayOrder: banners.length }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setBanners([...banners, json.data]);
      setForm({
        imageUrl: "",
        altText: "",
        title: "",
        buttonText: "",
        buttonLink: "",
      });
      setShowForm(false);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/cms/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setBanners(banners.map((b) => (b.id === id ? { ...b, isActive } : b)));
  }

  async function deleteBanner(id: string) {
    await fetch(`/api/cms/banners/${id}`, { method: "DELETE" });
    setBanners(banners.filter((b) => b.id !== id));
  }

  const inputStyle: React.CSSProperties = {
    height: "38px",
    padding: "0 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
    fontSize: "13px",
    outline: "none",
    width: "100%",
  };

  return (
    <div>
      {/* ── Banner list ── */}
      {banners.map((banner) => (
        <div
          key={banner.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "12px",
            padding: "12px",
            marginBottom: "8px",
          }}
        >
          {banner.imageUrl && (
            <img
              src={banner.imageUrl}
              alt={banner.altText}
              style={{
                width: "80px",
                height: "44px",
                objectFit: "cover",
                borderRadius: "7px",
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#0f172a",
                margin: "0 0 2px",
              }}
            >
              {banner.title || banner.altText}
            </p>
            <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
              {banner.buttonLink || "No link"}
            </p>
          </div>
          <button
            onClick={() => toggleActive(banner.id, !banner.isActive)}
            style={{
              fontSize: "11px",
              padding: "4px 10px",
              borderRadius: "20px",
              border: "none",
              background: banner.isActive ? "#f0fdf4" : "#f1f5f9",
              color: banner.isActive ? "#16a34a" : "#94a3b8",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {banner.isActive ? "Active" : "Inactive"}
          </button>
          <button
            onClick={() => deleteBanner(banner.id)}
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
        </div>
      ))}

      {/* ── Add form ── */}
      {showForm ? (
        <div
          style={{
            background: "#f8fbff",
            border: "1.5px solid #bfdbfe",
            borderRadius: "14px",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* ✅ Direct upload — imageUrl input replace */}
          <UploadField
            label="Banner Image"
            endpoint="bannerImageUploader"
            fileType="image"
            currentUrl={form.imageUrl}
            onUploadComplete={(url) => setForm({ ...form, imageUrl: url })}
          />

          {/* Alt text */}
          <input
            placeholder="Alt text *"
            value={form.altText}
            onChange={(e) => setForm({ ...form, altText: e.target.value })}
            style={inputStyle}
          />

          {/* Title */}
          <input
            placeholder="Title (optional)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={inputStyle}
          />

          {/* Button text + link */}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              placeholder="Button text"
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Button link"
              value={form.buttonLink}
              onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
              style={inputStyle}
            />
          </div>

          {!form.imageUrl && (
            <p style={{ fontSize: "11.5px", color: "#ef4444", margin: 0 }}>
              A banner image is required ⚠
            </p>
          )}

          <div
            style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
          >
            <button
              onClick={() => setShowForm(false)}
              style={{
                height: "36px",
                padding: "0 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                background: "#fff",
                fontSize: "12.5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={addBanner}
              disabled={saving || !form.imageUrl || !form.altText}
              style={{
                height: "36px",
                padding: "0 18px",
                border: "none",
                borderRadius: "9px",
                background: saving || !form.imageUrl ? "#93c5fd" : "#1d4ed8",
                color: "#fff",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: saving || !form.imageUrl ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Add Banner"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: "100%",
            height: "44px",
            border: "1.5px dashed #bfdbfe",
            borderRadius: "12px",
            background: "#f8fbff",
            color: "#1d4ed8",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Banner
        </button>
      )}
    </div>
  );
}
