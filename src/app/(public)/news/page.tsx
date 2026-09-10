// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";
// import { NewsCard } from "@/features/public/components/NewsCard";

// export const metadata = {
//   title: "News — MDSSC",
//   description: "Latest news and updates from MDSU-CHARGE",
// };

// export default async function PublicNewsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ tag?: string; q?: string }>;
// }) {
//   const { tag, q } = await searchParams;
//   const query = q?.trim() ?? "";

//   const articles = await db.newsArticle.findMany({
//     where: {
//       status: "PUBLISHED",
//       ...(tag ? { tags: { has: tag } } : {}),
//       ...(query
//         ? { title: { contains: query, mode: "insensitive" as const } }
//         : {}),
//     },
//     orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       excerpt: true,
//       coverImage: true,
//       tags: true,
//       publishedAt: true,
//       isFeatured: true,
//       author: { select: { name: true } },
//     },
//   });

//   const allArticlesForTags = await db.newsArticle.findMany({
//     where: { status: "PUBLISHED" },
//     select: { tags: true },
//   });
//   const allTags = [
//     ...new Set(allArticlesForTags.flatMap((a) => a.tags)),
//   ].filter(Boolean);

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, sans-serif",
//         maxWidth: "1100px",
//         margin: "0 auto",
//         padding: "2.5rem 1.5rem",
//       }}
//     >
//       {/* Header */}
//       <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
//         <p
//           style={{
//             fontSize: "11px",
//             fontWeight: 700,
//             color: "#1d4ed8",
//             textTransform: "uppercase",
//             letterSpacing: "0.1em",
//             margin: "0 0 8px",
//           }}
//         >
//           Latest Updates
//         </p>
//         <h1
//           style={{
//             fontSize: "clamp(24px, 4vw, 36px)",
//             fontWeight: 800,
//             color: "#0f172a",
//             margin: "0 0 12px",
//             letterSpacing: "-0.6px",
//           }}
//         >
//           News
//         </h1>
//         <p
//           style={{
//             fontSize: "15px",
//             color: "#64748b",
//             margin: 0,
//             maxWidth: "480px",
//             marginLeft: "auto",
//             marginRight: "auto",
//             lineHeight: 1.6,
//           }}
//         >
//           Stay updated with the latest happenings at MDSU-CHARGE
//         </p>
//       </div>

//       {/* Search + tags */}
//       <div
//         style={{
//           display: "flex",
//           gap: "10px",
//           alignItems: "center",
//           flexWrap: "wrap",
//           justifyContent: "center",
//           marginBottom: "2rem",
//         }}
//       >
//         <form method="GET" style={{ position: "relative" }}>
//           {tag && <input type="hidden" name="tag" value={tag} />}
//           <svg
//             style={{
//               position: "absolute",
//               left: "12px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: "#94a3b8",
//             }}
//             width="14"
//             height="14"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <circle cx="11" cy="11" r="8" />
//             <line x1="21" y1="21" x2="16.65" y2="16.65" />
//           </svg>
//           <input
//             name="q"
//             defaultValue={query}
//             placeholder="Search news…"
//             style={{
//               height: "40px",
//               paddingLeft: "36px",
//               paddingRight: "14px",
//               border: "1px solid #e2e8f0",
//               borderRadius: "20px",
//               fontSize: "13px",
//               width: "240px",
//               background: "#fff",
//             }}
//           />
//         </form>

//         {allTags.map((t) => (
//           <Link
//             key={t}
//             href={`/news?tag=${t}`}
//             style={{
//               height: "36px",
//               padding: "0 14px",
//               display: "flex",
//               alignItems: "center",
//               borderRadius: "20px",
//               fontSize: "12.5px",
//               fontWeight: 600,
//               background: tag === t ? "#1d4ed8" : "#f8fafc",
//               color: tag === t ? "#fff" : "#475569",
//               border: tag === t ? "1px solid #1d4ed8" : "1px solid #e2e8f0",
//               textDecoration: "none",
//             }}
//           >
//             #{t}
//           </Link>
//         ))}

//         {(tag || query) && (
//           <Link
//             href="/news"
//             style={{
//               height: "36px",
//               padding: "0 14px",
//               display: "flex",
//               alignItems: "center",
//               borderRadius: "20px",
//               fontSize: "12.5px",
//               color: "#94a3b8",
//               border: "1px solid #e2e8f0",
//               textDecoration: "none",
//               background: "#fff",
//             }}
//           >
//             Clear
//           </Link>
//         )}
//       </div>

//       {/* Grid */}
//       {articles.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8" }}>
//           <p
//             style={{
//               fontSize: "15px",
//               fontWeight: 600,
//               color: "#0f172a",
//               margin: "0 0 6px",
//             }}
//           >
//             No news found
//           </p>
//           <p style={{ fontSize: "13px" }}>Check back soon for new updates</p>
//         </div>
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//             gap: "20px",
//           }}
//         >
//           {articles.map((article, i) => (
//             <NewsCard key={article.id} article={article} index={i} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { db } from "@/server/db";
import Link from "next/link";
import { NewsCard } from "@/features/public/components/NewsCard";

export const metadata = {
  title: "News — MDSSC",
  description: "Latest news and updates from MDSU-CHARGE",
};

const ACTIVE_GRADIENT = "linear-gradient(135deg, #f57a22 0%, #ff9f52 100%)";

export default async function PublicNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; q?: string }>;
}) {
  const { tag, q } = await searchParams;
  const query = q?.trim() ?? "";

  const articles = await db.newsArticle.findMany({
    where: {
      status: "PUBLISHED",
      ...(tag ? { tags: { has: tag } } : {}),
      ...(query
        ? { title: { contains: query, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      tags: true,
      publishedAt: true,
      isFeatured: true,
      author: { select: { name: true } },
    },
  });

  const allArticlesForTags = await db.newsArticle.findMany({
    where: { status: "PUBLISHED" },
    select: { tags: true },
  });
  const allTags = [
    ...new Set(allArticlesForTags.flatMap((a) => a.tags)),
  ].filter(Boolean);

  const hasActiveFilters = Boolean(tag || query);
  const featuredCount = articles.filter((a) => a.isFeatured).length;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #1f1206 0%, #6b3410 55%, #f57a22 130%)",
          padding: "3rem 1.5rem",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,122,34,0.35) 0%, rgba(245,122,34,0) 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "-40px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,122,34,0.22) 0%, rgba(245,122,34,0) 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: "1180px",
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 42px)",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 12px",
                letterSpacing: "-0.6px",
              }}
            >
              News
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "#f3dfcb",
                margin: 0,
                maxWidth: "480px",
                lineHeight: 1.6,
              }}
            >
              Stay updated with the latest happenings at MDSU-CHARGE
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "84px",
                padding: "10px 18px",
                borderRadius: "14px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <span
                style={{
                  fontSize: "19px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                  letterSpacing: "-0.3px",
                }}
              >
                {articles.length}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#ffd9b3",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginTop: "2px",
                }}
              >
                Articles
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "84px",
                padding: "10px 18px",
                borderRadius: "14px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <span
                style={{
                  fontSize: "19px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                  letterSpacing: "-0.3px",
                }}
              >
                {featuredCount}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#ffd9b3",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginTop: "2px",
                }}
              >
                Featured
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "84px",
                padding: "10px 18px",
                borderRadius: "14px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <span
                style={{
                  fontSize: "19px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                  letterSpacing: "-0.3px",
                }}
              >
                {allTags.length}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#ffd9b3",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginTop: "2px",
                }}
              >
                Topics
              </span>
            </div>
          </div>
        </div>
      </section>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.5rem 4rem",
        }}
      >
        {/* Search + tags */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            marginBottom: "2.25rem",
          }}
        >
          <form method="GET" style={{ position: "relative" }}>
            {tag && <input type="hidden" name="tag" value={tag} />}
            <svg
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                pointerEvents: "none",
              }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              name="q"
              defaultValue={query}
              placeholder="Search news…"
              style={{
                height: "40px",
                paddingLeft: "36px",
                paddingRight: "14px",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                fontSize: "13px",
                width: "240px",
                background: "#fff",
              }}
            />
          </form>

          {allTags.map((t) => {
            const isActive = tag === t;
            return (
              <Link
                key={t}
                href={`/news?tag=${t}`}
                style={{
                  height: "36px",
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "20px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  background: isActive ? ACTIVE_GRADIENT : "#f8fafc",
                  color: isActive ? "#fff" : "#475569",
                  border: isActive
                    ? "1px solid transparent"
                    : "1px solid #e2e8f0",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                #{t}
              </Link>
            );
          })}

          {hasActiveFilters && (
            <Link
              href="/news"
              style={{
                height: "36px",
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                borderRadius: "20px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#94a3b8",
                border: "1px solid #e2e8f0",
                textDecoration: "none",
                background: "#fff",
                flexShrink: 0,
              }}
            >
              Clear
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Link>
          )}
        </div>

        {/* Grid */}
        {articles.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e8edf2",
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 14px",
                borderRadius: "50%",
                background: "#fff8f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f0a868"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <line x1="6" y1="8" x2="14" y2="8" />
                <line x1="6" y1="12" x2="18" y2="12" />
                <line x1="6" y1="16" x2="18" y2="16" />
              </svg>
            </div>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#0f172a",
                margin: "0 0 6px",
              }}
            >
              No news found
            </p>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              {hasActiveFilters
                ? "Try a different search term or clear your filters"
                : "Check back soon for new updates"}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {articles.map((article, i) => (
              <NewsCard key={article.id} article={article} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
