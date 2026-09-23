"use client";

import { useState } from "react";
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
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

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
          background: "#f57a22",
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

  async function handleFreeEnrol() {
    setEnrolling(true);
    setError("");

    const res = await fetch(`/api/courses/${courseId}/enrol-free`, {
      method: "POST",
    });
    const json = await res.json();

    setEnrolling(false);

    if (!json.success) {
      setError(json.error ?? "Failed to enrol. Please try again.");
      return;
    }

    // ── Actual enrolment ho chuki hai — ab safely player pe jaao ──
    router.push(ROUTES.coursePlayer(courseSlug));
    router.refresh();
  }

  if (isFree) {
    return (
      <div>
        {error && (
          <p
            style={{
              fontSize: "12.5px",
              color: "#dc2626",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
        <button
          onClick={handleFreeEnrol}
          disabled={enrolling}
          style={{
            width: "100%",
            height: "46px",
            border: "none",
            borderRadius: "12px",
            background: enrolling ? "#fbb87f" : "#f57a22",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            cursor: enrolling ? "not-allowed" : "pointer",
          }}
        >
          {enrolling ? "Enrolling…" : "Start Learning — Free"}
        </button>
      </div>
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
