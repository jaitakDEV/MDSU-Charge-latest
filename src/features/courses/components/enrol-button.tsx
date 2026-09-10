"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";
import Link from "next/link";

export function EnrolButton({
  courseId,
  courseSlug,
  isLoggedIn,
  isFree,
}: {
  courseId: string;
  courseSlug: string;
  isLoggedIn: boolean;
  isFree: boolean;
}) {
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <Link
        href={`${ROUTES.login}?callbackUrl=${encodeURIComponent(ROUTES.courseDetail(courseSlug))}`}
        style={{
          display: "block",
          width: "100%",
          height: "46px",
          lineHeight: "46px",
          textAlign: "center",
          borderRadius: "12px",
          background: "#f57a22 ",
          color: "#fff",
          fontWeight: 700,
          fontSize: "14px",
          textDecoration: "none",
          boxShadow: "0 4px 12px rgba(29,78,216,0.3)",
        }}
      >
        Login to Enrol
      </Link>
    );
  }

  if (isFree) {
    return (
      <button
        onClick={() => router.push(ROUTES.coursePlayer(courseSlug))}
        style={{
          width: "100%",
          height: "46px",
          border: "none",
          borderRadius: "12px",
          background: "#f57a22",
          color: "#fff",
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Start Learning — Free
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push(ROUTES.courseCheckout(courseSlug))}
      style={{
        width: "100%",
        height: "46px",
        border: "none",
        borderRadius: "12px",
        background: "#f57a22",
        color: "#fff",
        fontWeight: 700,
        fontSize: "14px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(29,78,216,0.3)",
      }}
    >
      Enrol Now →
    </button>
  );
}
