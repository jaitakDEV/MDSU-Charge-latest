"use client";

interface SortSelectProps {
  defaultValue: string;
  // URL params pass karo, function nahi
  currentParams: {
    query: string;
    catSlug: string;
    lvl: string;
    dur: string;
    coursesPath: string;
  };
}

export function SortSelect({ defaultValue, currentParams }: SortSelectProps) {
  function buildHref(sort: string) {
    const params = new URLSearchParams({
      ...(currentParams.query ? { q: currentParams.query } : {}),
      ...(currentParams.catSlug !== "ALL"
        ? { category: currentParams.catSlug }
        : {}),
      ...(currentParams.lvl !== "ALL" ? { level: currentParams.lvl } : {}),
      ...(currentParams.dur !== "ALL" ? { duration: currentParams.dur } : {}),
      ...(sort !== "newest" ? { sort } : {}),
      page: "1",
    });
    const str = params.toString();
    return `${currentParams.coursesPath}${str ? `?${str}` : ""}`;
  }

  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => {
        window.location.href = buildHref(e.target.value);
      }}
      style={{
        height: "36px",
        padding: "0 12px",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
        fontSize: "12.5px",
        color: "#475569",
        background: "#fff",
        cursor: "pointer",
      }}
    >
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}
