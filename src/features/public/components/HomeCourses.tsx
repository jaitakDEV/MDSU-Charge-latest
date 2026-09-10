// import { db } from "@/server/db";
// import Link from "next/link";
// import { AccessDurationBadge } from "@/features/courses/components/access-duration-badge";
// import type { AccessDuration } from "@prisma/client";
// import styles from "./HomeCourses.module.css";

// export async function HomeCourses() {
//   const courses = await db.course.findMany({
//     where: { status: "PUBLISHED", isFeatured: true },
//     orderBy: { createdAt: "desc" },
//     take: 6,
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       description: true,
//       thumbnail: true,
//       price: true,
//       mrp: true,
//       accessDuration: true,
//       level: true,
//       totalLectures: true,
//       category: { select: { name: true } },
//     },
//   });

//   const displayCourses =
//     courses.length > 0
//       ? courses
//       : await db.course.findMany({
//           where: { status: "PUBLISHED" },
//           orderBy: { createdAt: "desc" },
//           take: 6,
//           select: {
//             id: true,
//             title: true,
//             slug: true,
//             description: true,
//             thumbnail: true,
//             price: true,
//             mrp: true,
//             accessDuration: true,
//             level: true,
//             totalLectures: true,
//             category: { select: { name: true } },
//           },
//         });

//   if (displayCourses.length === 0) return null;

//   const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
//     BEGINNER: { bg: "#f0fdf4", color: "#166534" },
//     INTERMEDIATE: { bg: "#fffbeb", color: "#92400e" },
//     ADVANCED: { bg: "#fef2f2", color: "#991b1b" },
//   };

//   return (
//     <section className={styles.section}>
//       <div className={styles.inner}>
//         {/* ── Header ── */}
//         <div className={styles.header}>
//           <div className={styles.headerLeft}>
//             <p className={styles.eyebrow}>Our Courses</p>
//             <h2 className={styles.title}>Learn from Expert Faculty</h2>
//             <p className={styles.subtitle}>
//               Structured courses designed for academic excellence
//             </p>
//           </div>
//           <Link href="/courses" className={styles.browseBtn}>
//             Browse All Courses
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               aria-hidden="true"
//             >
//               <line x1="5" y1="12" x2="19" y2="12" />
//               <polyline points="12 5 19 12 12 19" />
//             </svg>
//           </Link>
//         </div>

//         {/* ── Grid ── */}
//         <div className={styles.grid}>
//           {displayCourses.map((course) => {
//             const levelCfg =
//               LEVEL_COLORS[course.level] ?? LEVEL_COLORS.BEGINNER;
//             const discountPct =
//               course.mrp > course.price
//                 ? Math.round(((course.mrp - course.price) / course.mrp) * 100)
//                 : 0;

//             return (
//               <Link
//                 key={course.id}
//                 href={`/courses/${course.slug}`}
//                 className={styles.card}
//               >
//                 {/* Thumbnail */}
//                 <div className={styles.thumb}>
//                   {course.thumbnail ? (
//                     <img
//                       src={course.thumbnail}
//                       alt={course.title}
//                       className={styles.thumbImg}
//                     />
//                   ) : (
//                     <div className={styles.thumbPlaceholder}>
//                       <svg
//                         width="32"
//                         height="32"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="#93c5fd"
//                         strokeWidth="1.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         aria-hidden="true"
//                       >
//                         <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
//                         <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
//                       </svg>
//                     </div>
//                   )}
//                   {discountPct > 0 && (
//                     <span className={styles.discountBadge}>
//                       {discountPct}% OFF
//                     </span>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className={styles.content}>
//                   <div className={styles.tags}>
//                     {course.category && (
//                       <span className={styles.tagCategory}>
//                         {course.category.name}
//                       </span>
//                     )}
//                     <span
//                       className={styles.tagLevel}
//                       style={{ background: levelCfg.bg, color: levelCfg.color }}
//                     >
//                       {course.level[0] + course.level.slice(1).toLowerCase()}
//                     </span>
//                   </div>

//                   <h3 className={styles.cardTitle}>{course.title}</h3>

//                   {course.description && (
//                     <p className={styles.cardDesc}>{course.description}</p>
//                   )}

//                   <p className={styles.lectures}>
//                     {course.totalLectures} lectures
//                   </p>

//                   <div className={styles.footer}>
//                     <AccessDurationBadge
//                       duration={course.accessDuration as AccessDuration}
//                       variant="card"
//                     />
//                     <div className={styles.priceWrap}>
//                       <span
//                         className={styles.price}
//                         style={{
//                           color: course.price === 0 ? "#16a34a" : "#1a3a6b",
//                         }}
//                       >
//                         {course.price === 0
//                           ? "Free"
//                           : `₹${(course.price / 100).toLocaleString("en-IN")}`}
//                       </span>
//                       {course.mrp > course.price && (
//                         <span className={styles.mrp}>
//                           ₹{(course.mrp / 100).toLocaleString("en-IN")}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

import { db } from "@/server/db";
import Link from "next/link";
import { AccessDurationBadge } from "@/features/courses/components/access-duration-badge";
import type { AccessDuration } from "@prisma/client";
import styles from "./HomeCourses.module.css";

export async function HomeCourses() {
  const courses = await db.course.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnail: true,
      price: true,
      mrp: true,
      accessDuration: true,
      level: true,
      totalLectures: true,
      category: { select: { name: true } },
    },
  });

  const displayCourses =
    courses.length > 0
      ? courses
      : await db.course.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            thumbnail: true,
            price: true,
            mrp: true,
            accessDuration: true,
            level: true,
            totalLectures: true,
            category: { select: { name: true } },
          },
        });

  if (displayCourses.length === 0) return null;

  const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
    BEGINNER: { bg: "#f0fdf4", color: "#166534" },
    INTERMEDIATE: { bg: "#fffbeb", color: "#92400e" },
    ADVANCED: { bg: "#fef2f2", color: "#991b1b" },
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.eyebrow}>Our Courses</p>
            <h2 className={styles.title}>Learn from Expert Faculty</h2>
            <p className={styles.subtitle}>
              Structured courses designed for academic excellence
            </p>
          </div>
          <Link href="/courses" className={styles.browseBtn}>
            Browse All Courses
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

        {/* ── Grid ── */}
        <div className={styles.grid}>
          {displayCourses.map((course) => {
            const levelCfg =
              LEVEL_COLORS[course.level] ?? LEVEL_COLORS.BEGINNER;
            const discountPct =
              course.mrp > course.price
                ? Math.round(((course.mrp - course.price) / course.mrp) * 100)
                : 0;

            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className={styles.card}
              >
                {/* Thumbnail */}
                <div className={styles.thumb}>
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className={styles.thumbImg}
                    />
                  ) : (
                    <div className={styles.thumbPlaceholder}>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffd9b3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                  )}
                  {discountPct > 0 && (
                    <span className={styles.discountBadge}>
                      {discountPct}% OFF
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className={styles.content}>
                  <div className={styles.tags}>
                    {course.category && (
                      <span className={styles.tagCategory}>
                        {course.category.name}
                      </span>
                    )}
                    <span
                      className={styles.tagLevel}
                      style={{ background: levelCfg.bg, color: levelCfg.color }}
                    >
                      {course.level[0] + course.level.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{course.title}</h3>

                  {course.description && (
                    <p className={styles.cardDesc}>{course.description}</p>
                  )}

                  <p className={styles.lectures}>
                    {course.totalLectures} lectures
                  </p>

                  <div className={styles.footer}>
                    <AccessDurationBadge
                      duration={course.accessDuration as AccessDuration}
                      variant="card"
                    />
                    <div className={styles.priceWrap}>
                      <span
                        className={styles.price}
                        style={{
                          color: course.price === 0 ? "#16a34a" : "#6b3410",
                        }}
                      >
                        {course.price === 0
                          ? "Free"
                          : `₹${(course.price / 100).toLocaleString("en-IN")}`}
                      </span>
                      {course.mrp > course.price && (
                        <span className={styles.mrp}>
                          ₹{(course.mrp / 100).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
