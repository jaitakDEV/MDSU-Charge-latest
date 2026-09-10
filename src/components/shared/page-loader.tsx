"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setWidth(0);

    const t1 = setTimeout(() => setWidth(80), 50);
    const t2 = setTimeout(() => setWidth(100), 400);
    const t3 = setTimeout(() => setVisible(false), 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: "3px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background:
            "linear-gradient(90deg, #1d4ed8 0%, #3b82f6 60%, #60a5fa 100%)",
          borderRadius: "0 2px 2px 0",
          transition: width === 0 ? "none" : "width 0.4s ease",
          boxShadow:
            "0 0 10px rgba(59,130,246,0.7), 0 0 4px rgba(59,130,246,0.4)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "-1px",
          left: `${width}%`,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#3b82f6",
          boxShadow: "0 0 8px 2px rgba(59,130,246,0.8)",
          transform: "translateX(-50%)",
          transition: width === 0 ? "none" : "left 0.4s ease",
          opacity: width === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
