// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";

// export const metadata = { title: "Blog — CMS" };

// export default async function CmsBlogPage() {
//   const session = await auth();
//   if (
//     !session?.user ||
//     (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
//   )
//     redirect(ROUTES.login);

//   const posts = await db.blogPost.findMany({
//     where: { authorId: session.user.id },
//     orderBy: { updatedAt: "desc" },
//   });

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, sans-serif",
//         maxWidth: "800px",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//           marginBottom: "1.5rem",
//         }}
//       >
//         <div>
//           <h1
//             style={{
//               fontSize: "20px",
//               fontWeight: 700,
//               color: "#0f172a",
//               margin: "0 0 4px",
//             }}
//           >
//             Blog Posts
//           </h1>
//           <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
//             Write and publish articles
//           </p>
//         </div>
//         <Link
//           href="/cms/blog/new"
//           style={{
//             height: "38px",
//             padding: "0 18px",
//             display: "flex",
//             alignItems: "center",
//             borderRadius: "10px",
//             background: "#1d4ed8",
//             color: "#fff",
//             fontSize: "13px",
//             fontWeight: 600,
//             textDecoration: "none",
//           }}
//         >
//           + New Post
//         </Link>
//       </div>
//       {posts.map((post) => (
//         <Link
//           key={post.id}
//           href={`/cms/blog/${post.id}`}
//           style={{
//             display: "block",
//             background: "#fff",
//             border: "1px solid #e8edf2",
//             borderRadius: "12px",
//             padding: "14px",
//             marginBottom: "8px",
//             textDecoration: "none",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <span
//               style={{
//                 fontSize: "10px",
//                 fontWeight: 700,
//                 padding: "2px 8px",
//                 borderRadius: "20px",
//                 background: post.status === "PUBLISHED" ? "#f0fdf4" : "#f1f5f9",
//                 color: post.status === "PUBLISHED" ? "#16a34a" : "#64748b",
//               }}
//             >
//               {post.status}
//             </span>
//             <p
//               style={{
//                 fontSize: "13.5px",
//                 fontWeight: 600,
//                 color: "#0f172a",
//                 margin: 0,
//               }}
//             >
//               {post.title}
//             </p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }

// src/app/(cms)/cms/blog/page.tsx
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";

export const metadata = { title: "Blog — CMS" };

const STATUS_CONFIG = {
  DRAFT: { label: "Draft", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  PUBLISHED: {
    label: "Published",
    bg: "#f0fdf4",
    color: "#166534",
    dot: "#16a34a",
  },
} as const;

export default async function CmsBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const { q, status } = await searchParams;
  const query = q?.trim() ?? "";
  const filter = status ?? "ALL";

  const posts = await db.blogPost.findMany({
    where: {
      authorId: session.user.id,
      ...(filter !== "ALL" ? { status: filter as "DRAFT" | "PUBLISHED" } : {}),
      ...(query
        ? { title: { contains: query, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      excerpt: true,
      publishedAt: true,
      updatedAt: true,
      coverImage: true,
      tags: true,
    },
  });

  const [totalDraft, totalPublished] = await Promise.all([
    db.blogPost.count({
      where: { authorId: session.user.id, status: "DRAFT" },
    }),
    db.blogPost.count({
      where: { authorId: session.user.id, status: "PUBLISHED" },
    }),
  ]);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "860px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
            }}
          >
            Blog Posts
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            Write and publish articles for the public website
          </p>
        </div>
        <Link
          href="/cms/blog/new"
          style={{
            height: "38px",
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderRadius: "10px",
            background: "#1d4ed8",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.25rem",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        {[
          { key: "ALL", label: "All", count: totalDraft + totalPublished },
          { key: "PUBLISHED", label: "Published", count: totalPublished },
          { key: "DRAFT", label: "Drafts", count: totalDraft },
        ].map((tab) => {
          const isActive = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={`/cms/blog?status=${tab.key}${query ? `&q=${query}` : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9px",
                fontSize: "12.5px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1d4ed8" : "#64748b",
                background: isActive ? "#fff" : "transparent",
                textDecoration: "none",
                border: isActive
                  ? "1px solid #bfdbfe"
                  : "1px solid transparent",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background: isActive ? "#dbeafe" : "#e2e8f0",
                  color: isActive ? "#1d4ed8" : "#64748b",
                }}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form method="GET" style={{ marginBottom: "1.25rem" }}>
        {filter !== "ALL" && (
          <input type="hidden" name="status" value={filter} />
        )}
        <input
          name="q"
          defaultValue={query}
          placeholder="Search posts…"
          style={{
            height: "38px",
            padding: "0 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            width: "260px",
          }}
        />
      </form>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "#fff",
            border: "1px dashed #bfdbfe",
            borderRadius: "14px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            No posts yet
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 1rem" }}>
            Start writing your first article
          </p>
          <Link
            href="/cms/blog/new"
            style={{
              fontSize: "13px",
              color: "#1d4ed8",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + New Post
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {posts.map((post) => {
            const cfg =
              STATUS_CONFIG[post.status as keyof typeof STATUS_CONFIG];
            return (
              <div
                key={post.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e8edf2",
                  borderRadius: "14px",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                {/* Cover image */}
                {post.coverImage ? (
                  <div style={{ width: "100px", flexShrink: 0 }}>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100px",
                      flexShrink: 0,
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                )}

                <div
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: cfg?.bg,
                          color: cfg?.color,
                        }}
                      >
                        {cfg?.label}
                      </span>
                      {post.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "10.5px",
                            padding: "1px 7px",
                            borderRadius: "6px",
                            background: "#f8fafc",
                            color: "#64748b",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: "0 0 3px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.title}
                    </p>
                    {post.excerpt && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: "11.5px",
                        color: "#94a3b8",
                        margin: "0 0 8px",
                      }}
                    >
                      {post.updatedAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <Link
                      href={`/cms/blog/${post.id}`}
                      style={{
                        height: "30px",
                        padding: "0 12px",
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid #bfdbfe",
                        borderRadius: "8px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
