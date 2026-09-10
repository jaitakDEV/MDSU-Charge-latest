import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { AccessDurationBadge } from "@/features/courses/components/access-duration-badge";
import type { AccessDuration, CourseLevel } from "@prisma/client";
import { SortSelect } from "@/features/public/components/SortSelect";
import styles from "./courses.module.css";

export const metadata = {
  title: "Courses — MDSSU Charge",
  description: "Browse all courses on the MDSSU Charge platform",
};

const PAGE_SIZE = 12;

const LEVEL_LABELS: Record<CourseLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const DURATION_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "Any Duration" },
  { value: "FIFTEEN_DAYS", label: "15 Days" },
  { value: "ONE_MONTH", label: "1 Month" },
  { value: "THREE_MONTHS", label: "3 Months" },
  { value: "SIX_MONTHS", label: "6 Months" },
  { value: "ONE_YEAR", label: "1 Year" },
  { value: "LIFETIME", label: "Lifetime" },
];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    level?: string;
    duration?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const session = await auth();

  const {
    q,
    category,
    level,
    duration,
    sort,
    page: pageParam,
  } = await searchParams;

  const query = q?.trim() ?? "";
  const catSlug = category ?? "ALL";
  const lvl = level ?? "ALL";
  const dur = duration ?? "ALL";
  const sortBy = sort ?? "newest";
  const page = Math.max(1, Number(pageParam ?? 1));

  // Categories for filter
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const where = {
    status: "PUBLISHED" as const,
    ...(query
      ? { title: { contains: query, mode: "insensitive" as const } }
      : {}),
    ...(catSlug !== "ALL" ? { category: { slug: catSlug } } : {}),
    ...(lvl !== "ALL" ? { level: lvl as CourseLevel } : {}),
    ...(dur !== "ALL" ? { accessDuration: dur as AccessDuration } : {}),
  };

  const orderBy =
    sortBy === "price-asc"
      ? { price: "asc" as const }
      : sortBy === "price-desc"
        ? { price: "desc" as const }
        : sortBy === "oldest"
          ? { createdAt: "asc" as const }
          : { createdAt: "desc" as const };

  const [courses, total] = await Promise.all([
    db.course.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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
        totalDuration: true,
        isFeatured: true,
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
    }),
    db.course.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      ...(query ? { q: query } : {}),
      ...(catSlug !== "ALL" ? { category: catSlug } : {}),
      ...(lvl !== "ALL" ? { level: lvl } : {}),
      ...(dur !== "ALL" ? { duration: dur } : {}),
      ...(sortBy !== "newest" ? { sort: sortBy } : {}),
      ...overrides,
    });
    const str = params.toString();
    return `${ROUTES.courses}${str ? `?${str}` : ""}`;
  }

  const hasActiveFilters =
    query !== "" || catSlug !== "ALL" || lvl !== "ALL" || dur !== "ALL";

  return (
    <div className={styles.coursesPage}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={styles.heroEyebrow}>Course Library</p>
            <h1 className={styles.heroTitle}>All Courses</h1>
            <p className={styles.heroSubtitle}>
              {total} course{total !== 1 ? "s" : ""} available
              {query ? ` for "${query}"` : ""}
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatIcon}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
              <span className={styles.heroStatText}>
                <span className={styles.heroStatValue}>{total}</span>
                <span className={styles.heroStatLabel}>Courses</span>
              </span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatIcon}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                </svg>
              </span>
              <span className={styles.heroStatText}>
                <span className={styles.heroStatValue}>
                  {categories.length}
                </span>
                <span className={styles.heroStatLabel}>Categories</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.coursesShell}>
        <div className={styles.coursesLayout}>
          {/* ── Sidebar Filters ── */}
          <details className={styles.filtersPanel} open>
            <summary className={styles.filtersSummary}>
              <span className={styles.filtersSummaryLabel}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="10" y1="18" x2="14" y2="18" />
                </svg>
                Filters
                {hasActiveFilters && <span className={styles.filtersDot} />}
              </span>
              <svg
                className={styles.filtersChevron}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>

            <div className={styles.filtersBody}>
              {/* Search */}
              <form method="GET" className={styles.searchForm}>
                {catSlug !== "ALL" && (
                  <input type="hidden" name="category" value={catSlug} />
                )}
                {lvl !== "ALL" && (
                  <input type="hidden" name="level" value={lvl} />
                )}
                {dur !== "ALL" && (
                  <input type="hidden" name="duration" value={dur} />
                )}
                {sortBy !== "newest" && (
                  <input type="hidden" name="sort" value={sortBy} />
                )}
                <svg
                  className={styles.searchIcon}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Search courses…"
                  className={styles.searchInput}
                />
              </form>

              {/* Category filter */}
              <FilterGroup label="Category">
                <FilterLink
                  href={buildHref({ category: "ALL", page: "1" })}
                  isActive={catSlug === "ALL"}
                >
                  All Categories
                </FilterLink>
                {categories.map((c) => (
                  <FilterLink
                    key={c.slug}
                    href={buildHref({ category: c.slug, page: "1" })}
                    isActive={catSlug === c.slug}
                  >
                    {c.name}
                  </FilterLink>
                ))}
              </FilterGroup>

              {/* Level filter */}
              <FilterGroup label="Level">
                <FilterLink
                  href={buildHref({ level: "ALL", page: "1" })}
                  isActive={lvl === "ALL"}
                >
                  All Levels
                </FilterLink>
                {(Object.entries(LEVEL_LABELS) as [CourseLevel, string][]).map(
                  ([val, label]) => (
                    <FilterLink
                      key={val}
                      href={buildHref({ level: val, page: "1" })}
                      isActive={lvl === val}
                    >
                      {label}
                    </FilterLink>
                  ),
                )}
              </FilterGroup>

              {/* Access Duration filter */}
              <FilterGroup label="Access Duration">
                {DURATION_FILTER_OPTIONS.map((opt) => (
                  <FilterLink
                    key={opt.value}
                    href={buildHref({ duration: opt.value, page: "1" })}
                    isActive={dur === opt.value}
                  >
                    {opt.label}
                  </FilterLink>
                ))}
              </FilterGroup>

              {hasActiveFilters && (
                <Link href={ROUTES.courses} className={styles.clearFiltersLink}>
                  Clear all filters
                </Link>
              )}
            </div>
          </details>

          {/* ── Course Grid ── */}
          <div>
            {/* Sort + result count */}
            <div className={styles.toolbar}>
              <p className={styles.toolbarCount}>
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <SortSelect
                defaultValue={sortBy}
                currentParams={{
                  query,
                  catSlug,
                  lvl,
                  dur,
                  coursesPath: ROUTES.courses,
                }}
              />
            </div>

            {courses.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <p className={styles.emptyTitle}>No courses found</p>
                <p className={styles.emptyDesc}>
                  Try different filters or search terms
                </p>
                <Link href={ROUTES.courses} className={styles.clearFiltersBtn}>
                  Clear all filters
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.courseGrid}>
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isLoggedIn={!!session?.user}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className={styles.pagination} aria-label="Pagination">
                    {page > 1 && (
                      <Link
                        href={buildHref({ page: String(page - 1) })}
                        className={`${styles.pageBtn} ${styles.pageBtnNav}`}
                      >
                        ← Prev
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Link
                          key={p}
                          href={buildHref({ page: String(p) })}
                          className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                        >
                          {p}
                        </Link>
                      ),
                    )}
                    {page < totalPages && (
                      <Link
                        href={buildHref({ page: String(page + 1) })}
                        className={`${styles.pageBtn} ${styles.pageBtnNav}`}
                      >
                        Next →
                      </Link>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Course Card ───────────────────────────────────────────────
function CourseCard({
  course,
  isLoggedIn,
}: {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    price: number;
    mrp: number;
    accessDuration: AccessDuration;
    level: CourseLevel;
    totalLectures: number;
    totalDuration: number;
    isFeatured: boolean;
    category: { name: string } | null;
    author: { name: string | null } | null;
  };
  isLoggedIn: boolean;
}) {
  const discountPct =
    course.mrp > course.price
      ? Math.round(((course.mrp - course.price) / course.mrp) * 100)
      : 0;

  return (
    <Link href={ROUTES.courseDetail(course.slug)} className={styles.courseCard}>
      {/* Thumbnail */}
      <div className={styles.cardThumb}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} loading="lazy" />
        ) : (
          <div className={styles.cardThumbFallback}>
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
        )}
        {course.isFeatured && (
          <span className={`${styles.badge} ${styles.badgeFeatured}`}>
            ★ Featured
          </span>
        )}
        {discountPct > 0 && (
          <span className={`${styles.badge} ${styles.badgeDiscount}`}>
            {discountPct}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className={styles.cardBody}>
        <div className={styles.cardTags}>
          {course.category && (
            <span className={styles.tag}>{course.category.name}</span>
          )}
          <span className={styles.tag}>{LEVEL_LABELS[course.level]}</span>
        </div>

        <p className={styles.cardTitle}>{course.title}</p>

        {course.description && (
          <p className={styles.cardDesc}>{course.description}</p>
        )}

        {course.author?.name && (
          <p className={styles.cardAuthor}>By {course.author.name}</p>
        )}

        <div className={styles.cardMeta}>
          <span>{course.totalLectures} lectures</span>
          {course.totalDuration > 0 && <span>{course.totalDuration} min</span>}
        </div>

        <div className={styles.cardFooter}>
          <AccessDurationBadge
            duration={course.accessDuration}
            variant="card"
          />

          <div className={styles.cardPrice}>
            <span
              className={
                course.price === 0
                  ? `${styles.priceNow} ${styles.priceFree}`
                  : styles.priceNow
              }
            >
              {course.price === 0
                ? "Free"
                : `₹${(course.price / 100).toLocaleString("en-IN")}`}
            </span>
            {course.mrp > course.price && (
              <span className={styles.priceMrp}>
                ₹{(course.mrp / 100).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Filter helpers ─────────────────────────────────────────────
function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className={styles.filterGroupLabel}>{label}</p>
      <div className={styles.filterGroupItems}>{children}</div>
    </div>
  );
}

function FilterLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${styles.filterLink} ${isActive ? styles.filterLinkActive : ""}`}
    >
      {children}
    </Link>
  );
}
