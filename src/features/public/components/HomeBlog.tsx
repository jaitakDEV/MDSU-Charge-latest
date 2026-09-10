// import { db } from "@/server/db";
// import Link from "next/link";

// export async function HomeBlog() {
//   const posts = await db.blogPost.findMany({
//     where: { status: "PUBLISHED" },
//     orderBy: { publishedAt: "desc" },
//     take: 3,
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       excerpt: true,
//       coverImage: true,
//       tags: true,
//       publishedAt: true,
//       author: { select: { name: true } },
//     },
//   });

//   if (posts.length === 0) return null;

//   const GRADIENT_BG = ["#eff6ff", "#faf5ff", "#f0fdf4"];

//   return (
//     <section style={{ background: "#eef4fc", padding: "4rem 0" }}>
//       <div
//         style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 1.5rem" }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "flex-end",
//             justifyContent: "space-between",
//             marginBottom: "2.5rem",
//             flexWrap: "wrap",
//             gap: "12px",
//           }}
//         >
//           <div>
//             <p
//               style={{
//                 fontSize: "11px",
//                 fontWeight: 700,
//                 color: "#1d4ed8",
//                 textTransform: "uppercase",
//                 letterSpacing: "0.1em",
//                 margin: "0 0 8px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//               }}
//             >
//               <span
//                 style={{
//                   display: "inline-block",
//                   width: "24px",
//                   height: "2px",
//                   background: "#1d4ed8",
//                   borderRadius: "2px",
//                 }}
//               />
//               Latest Articles
//             </p>
//             <h2
//               style={{
//                 fontSize: "clamp(22px, 3.5vw, 32px)",
//                 fontWeight: 800,
//                 color: "#0f172a",
//                 margin: 0,
//                 letterSpacing: "-0.6px",
//                 lineHeight: 1.2,
//               }}
//             >
//               Blogs & Insights
//             </h2>
//             <p
//               style={{
//                 fontSize: "15px",
//                 color: "#64748b",
//                 margin: "8px 0 0",
//                 lineHeight: 1.6,
//               }}
//             >
//               Stay updated with latest happenings at MDSSC
//             </p>
//           </div>
//           <Link
//             href="/blog"
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "6px",
//               height: "40px",
//               padding: "0 20px",
//               border: "1.5px solid #1d4ed8",
//               borderRadius: "10px",
//               background: "#fff",
//               color: "#1d4ed8",
//               fontSize: "13.5px",
//               fontWeight: 700,
//               textDecoration: "none",
//             }}
//           >
//             View All Articles
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <line x1="5" y1="12" x2="19" y2="12" />
//               <polyline points="12 5 19 12 12 19" />
//             </svg>
//           </Link>
//         </div>

//         {/* Posts grid */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//             gap: "20px",
//           }}
//         >
//           {posts.map((post, i) => (
//             <Link
//               key={post.id}
//               href={`/blog/${post.slug}`}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 background: "#fff",
//                 border: "1px solid #e8edf2",
//                 borderRadius: "16px",
//                 overflow: "hidden",
//                 textDecoration: "none",
//                 boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//               }}
//             >
//               {/* Cover */}
//               <div
//                 style={{
//                   height: "190px",
//                   background: "#f1f5f9",
//                   overflow: "hidden",
//                   position: "relative",
//                 }}
//               >
//                 {post.coverImage ? (
//                   <img
//                     src={post.coverImage}
//                     alt={post.title}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                     }}
//                   />
//                 ) : (
//                   <div
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       background: `linear-gradient(135deg, ${GRADIENT_BG[i % 3]} 0%, #f8fafc 100%)`,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <svg
//                       width="36"
//                       height="36"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="#bfdbfe"
//                       strokeWidth="1.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M12 20h9" />
//                       <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//                     </svg>
//                   </div>
//                 )}
//               </div>

//               {/* Content */}
//               <div
//                 style={{
//                   padding: "1.1rem",
//                   display: "flex",
//                   flexDirection: "column",
//                   flex: 1,
//                 }}
//               >
//                 {/* Tags */}
//                 {post.tags?.length > 0 && (
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "5px",
//                       marginBottom: "8px",
//                       flexWrap: "wrap",
//                     }}
//                   >
//                     {post.tags.slice(0, 2).map((t) => (
//                       <span
//                         key={t}
//                         style={{
//                           fontSize: "10.5px",
//                           fontWeight: 700,
//                           padding: "2px 8px",
//                           borderRadius: "6px",
//                           background: "#eff6ff",
//                           color: "#1d4ed8",
//                           border: "1px solid #bfdbfe",
//                         }}
//                       >
//                         #{t}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 <h3
//                   style={{
//                     fontSize: "15px",
//                     fontWeight: 700,
//                     color: "#0f172a",
//                     margin: "0 0 6px",
//                     letterSpacing: "-0.2px",
//                     lineHeight: 1.4,
//                     display: "-webkit-box",
//                     WebkitLineClamp: 2,
//                     WebkitBoxOrient: "vertical",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {post.title}
//                 </h3>

//                 {post.excerpt && (
//                   <p
//                     style={{
//                       fontSize: "13px",
//                       color: "#64748b",
//                       margin: "0 0 14px",
//                       lineHeight: 1.6,
//                       display: "-webkit-box",
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: "vertical",
//                       overflow: "hidden",
//                     }}
//                   >
//                     {post.excerpt}
//                   </p>
//                 )}

//                 {/* Footer */}
//                 <div
//                   style={{
//                     marginTop: "auto",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "6px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "26px",
//                         height: "26px",
//                         borderRadius: "50%",
//                         background: "#eff6ff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: "10px",
//                         fontWeight: 700,
//                         color: "#1d4ed8",
//                       }}
//                     >
//                       {post.author.name?.[0]?.toUpperCase() ?? "M"}
//                     </div>
//                     <span
//                       style={{
//                         fontSize: "12px",
//                         color: "#475569",
//                         fontWeight: 500,
//                       }}
//                     >
//                       {post.author.name ?? "MDSSC"}
//                     </span>
//                   </div>
//                   {post.publishedAt && (
//                     <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
//                       {post.publishedAt.toLocaleDateString("en-IN", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
import { db } from "@/server/db";
import Link from "next/link";
import styles from "./HomeBlog.module.css";

const COVER_TINTS = ["tintOrange", "tintPurple", "tintGreen"];

export async function HomeBlog() {
  const posts = await db.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      tags: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });

  if (posts.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.eyebrow}>Latest Articles</p>
            <h2 className={styles.title}>Blogs &amp; Insights</h2>
            <p className={styles.subtitle}>
              Stay updated with latest happenings at MDSSC
            </p>
          </div>
          <Link href="/blog" className={styles.browseBtn}>
            View All Articles
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* Posts grid */}
        <div className={styles.grid}>
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={styles.card}
            >
              {/* Cover */}
              <div className={styles.thumb}>
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className={styles.thumbImg}
                  />
                ) : (
                  <div
                    className={`${styles.thumbFallback} ${styles[COVER_TINTS[i % COVER_TINTS.length]]}`}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={styles.content}>
                {post.tags?.length > 0 && (
                  <div className={styles.tags}>
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t} className={styles.tag}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className={styles.cardTitle}>{post.title}</h3>

                {post.excerpt && (
                  <p className={styles.cardDesc}>{post.excerpt}</p>
                )}

                {/* Footer */}
                <div className={styles.footer}>
                  <div className={styles.authorGroup}>
                    <div className={styles.avatar}>
                      {post.author.name?.[0]?.toUpperCase() ?? "M"}
                    </div>
                    <span className={styles.authorName}>
                      {post.author.name ?? "MDSSC"}
                    </span>
                  </div>
                  {post.publishedAt && (
                    <span className={styles.date}>
                      {post.publishedAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
