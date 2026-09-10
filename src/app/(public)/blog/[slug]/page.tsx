// import { db } from "@/server/db";
// import { notFound } from "next/navigation";
// import Link from "next/link";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
//   const post = await db.blogPost.findUnique({
//     where: { slug, status: "PUBLISHED" },
//     select: {
//       title: true,
//       metaTitle: true,
//       metaDescription: true,
//       excerpt: true,
//       coverImage: true,
//     },
//   });
//   if (!post) return { title: "Not Found" };
//   return {
//     title: post.metaTitle ?? `${post.title} — MDSSC`,
//     description: post.metaDescription ?? post.excerpt ?? "",
//     openGraph: {
//       title: post.metaTitle ?? post.title,
//       images: post.coverImage ? [post.coverImage] : [],
//     },
//   };
// }

// export default async function BlogDetailPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;

//   const post = await db.blogPost.findUnique({
//     where: { slug, status: "PUBLISHED" },
//     select: {
//       id: true,
//       title: true,
//       content: true,
//       excerpt: true,
//       coverImage: true,
//       tags: true,
//       publishedAt: true,
//       author: { select: { name: true } },
//     },
//   });

//   if (!post) notFound();

//   // Related posts — same tags
//   const related = await db.blogPost.findMany({
//     where: {
//       status: "PUBLISHED",
//       slug: { not: slug },
//       tags: { hasSome: post.tags ?? [] },
//     },
//     take: 3,
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       coverImage: true,
//       publishedAt: true,
//     },
//   });

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, sans-serif",
//         maxWidth: "760px",
//         margin: "0 auto",
//         padding: "2.5rem 1.5rem",
//       }}
//     >
//       {/* Back */}
//       <Link
//         href="/blog"
//         style={{
//           display: "inline-flex",
//           alignItems: "center",
//           gap: "4px",
//           fontSize: "13px",
//           color: "#64748b",
//           textDecoration: "none",
//           marginBottom: "1.5rem",
//           fontWeight: 500,
//         }}
//       >
//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <polyline points="15 18 9 12 15 6" />
//         </svg>
//         All Articles
//       </Link>

//       {/* Cover */}
//       {post.coverImage && (
//         <div
//           style={{
//             borderRadius: "16px",
//             overflow: "hidden",
//             marginBottom: "2rem",
//             aspectRatio: "16/7",
//           }}
//         >
//           <img
//             src={post.coverImage}
//             alt={post.title}
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         </div>
//       )}

//       {/* Header */}
//       <div style={{ marginBottom: "2rem" }}>
//         {post.tags?.length > 0 && (
//           <div
//             style={{
//               display: "flex",
//               gap: "6px",
//               marginBottom: "12px",
//               flexWrap: "wrap",
//             }}
//           >
//             {post.tags.map((t) => (
//               <Link
//                 key={t}
//                 href={`/blog?tag=${t}`}
//                 style={{
//                   fontSize: "11px",
//                   fontWeight: 700,
//                   padding: "3px 10px",
//                   borderRadius: "20px",
//                   background: "#eff6ff",
//                   color: "#1d4ed8",
//                   border: "1px solid #bfdbfe",
//                   textDecoration: "none",
//                 }}
//               >
//                 #{t}
//               </Link>
//             ))}
//           </div>
//         )}
//         <h1
//           style={{
//             fontSize: "clamp(22px, 4vw, 32px)",
//             fontWeight: 800,
//             color: "#0f172a",
//             margin: "0 0 12px",
//             letterSpacing: "-0.6px",
//             lineHeight: 1.25,
//           }}
//         >
//           {post.title}
//         </h1>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             fontSize: "13px",
//             color: "#64748b",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//             <div
//               style={{
//                 width: "28px",
//                 height: "28px",
//                 borderRadius: "50%",
//                 background: "#eff6ff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "11px",
//                 fontWeight: 700,
//                 color: "#1d4ed8",
//               }}
//             >
//               {post.author.name?.[0]?.toUpperCase() ?? "A"}
//             </div>
//             <span style={{ fontWeight: 600 }}>
//               {post.author.name ?? "MDSSC"}
//             </span>
//           </div>
//           {post.publishedAt && (
//             <>
//               <span style={{ color: "#e2e8f0" }}>·</span>
//               <span>
//                 {post.publishedAt.toLocaleDateString("en-IN", {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </span>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Article content */}
//       <div
//         style={{ fontSize: "15.5px", color: "#334155", lineHeight: 1.8 }}
//         dangerouslySetInnerHTML={{ __html: post.content }}
//       />

//       {/* Related posts */}
//       {related.length > 0 && (
//         <div
//           style={{
//             marginTop: "3rem",
//             paddingTop: "2rem",
//             borderTop: "1px solid #f1f5f9",
//           }}
//         >
//           <h3
//             style={{
//               fontSize: "16px",
//               fontWeight: 700,
//               color: "#0f172a",
//               margin: "0 0 1rem",
//             }}
//           >
//             Related Articles
//           </h3>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//               gap: "12px",
//             }}
//           >
//             {related.map((r) => (
//               <Link
//                 key={r.id}
//                 href={`/blog/${r.slug}`}
//                 style={{
//                   textDecoration: "none",
//                   display: "block",
//                   background: "#fff",
//                   border: "1px solid #e8edf2",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                 }}
//               >
//                 {r.coverImage && (
//                   <div style={{ height: "100px", overflow: "hidden" }}>
//                     <img
//                       src={r.coverImage}
//                       alt={r.title}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                   </div>
//                 )}
//                 <div style={{ padding: "10px 12px" }}>
//                   <p
//                     style={{
//                       fontSize: "13px",
//                       fontWeight: 600,
//                       color: "#0f172a",
//                       margin: 0,
//                       lineHeight: 1.4,
//                       display: "-webkit-box",
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: "vertical",
//                       overflow: "hidden",
//                     }}
//                   >
//                     {r.title}
//                   </p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { db } from "@/server/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./blog-detail.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      excerpt: true,
      coverImage: true,
    },
  });
  if (!post) return { title: "Not Found" };
  return {
    title: post.metaTitle ?? `${post.title} — MDSSC`,
    description: post.metaDescription ?? post.excerpt ?? "",
    openGraph: {
      title: post.metaTitle ?? post.title,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await db.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      coverImage: true,
      tags: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });

  if (!post) notFound();

  // Related posts — same tags
  const related = await db.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: slug },
      tags: { hasSome: post.tags ?? [] },
    },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back */}
        <Link href="/blog" className={styles.backLink}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All Articles
        </Link>

        {/* Cover */}
        {post.coverImage && (
          <div className={styles.coverWrap}>
            <img
              src={post.coverImage}
              alt={post.title}
              className={styles.coverImg}
            />
          </div>
        )}

        {/* Header */}
        <div className={styles.header}>
          {post.tags?.length > 0 && (
            <div className={styles.tagsRow}>
              {post.tags.map((t) => (
                <Link key={t} href={`/blog?tag=${t}`} className={styles.tag}>
                  #{t}
                </Link>
              ))}
            </div>
          )}

          <h1 className={styles.title}>{post.title}</h1>

          <div className={styles.metaRow}>
            <div className={styles.authorGroup}>
              <div className={styles.avatar}>
                {post.author.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <span className={styles.authorName}>
                {post.author.name ?? "MDSSC"}
              </span>
            </div>
            {post.publishedAt && (
              <>
                <span className={styles.metaDot} aria-hidden="true">
                  ·
                </span>
                <span className={styles.metaDate}>
                  {post.publishedAt.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Article content */}
        <div
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related posts */}
        {related.length > 0 && (
          <div className={styles.relatedWrap}>
            <h3 className={styles.relatedHeading}>Related Articles</h3>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className={styles.relatedCard}
                >
                  {r.coverImage && (
                    <div className={styles.relatedThumb}>
                      <img
                        src={r.coverImage}
                        alt={r.title}
                        className={styles.relatedThumbImg}
                      />
                    </div>
                  )}
                  <div className={styles.relatedBody}>
                    <p className={styles.relatedTitle}>{r.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
