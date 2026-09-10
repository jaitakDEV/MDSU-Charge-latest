"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/config/app";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
};

const AUTOPLAY_DELAY_MS = 5000;

export function NewsSliderClient({ articles }: { articles: NewsItem[] }) {
  const autoplayPlugin = useRef(
    Autoplay({ delay: AUTOPLAY_DELAY_MS, stopOnInteraction: false }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [autoplayPlugin.current],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const slideStartTime = useRef<number>(Date.now());

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    slideStartTime.current = Date.now();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onInit();
    onSelect();
    emblaApi.on("reInit", onInit).on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onInit).off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  useEffect(() => {
    const tick = () => {
      setProgress(
        Math.min(
          ((Date.now() - slideStartTime.current) / AUTOPLAY_DELAY_MS) * 100,
          100,
        ),
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    autoplayPlugin.current.reset();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    autoplayPlugin.current.reset();
  }, [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => {
      emblaApi?.scrollTo(i);
      autoplayPlugin.current.reset();
    },
    [emblaApi],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    },
    [scrollPrev, scrollNext],
  );

  return (
    <section style={{ width: "100%", background: "#fff", padding: "3rem 0" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 24px",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#0951a5",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              margin: "0 0 8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "24px",
                height: "2px",
                background: "#0951a5",
                borderRadius: "2px",
              }}
            />
            Latest News
          </p>
          <h2
            style={{
              fontSize: "clamp(20px, 2.4vw, 32px)",
              fontWeight: 800,
              color: "#1a3a6b",
              margin: 0,
              letterSpacing: "-0.4px",
              lineHeight: 1.2,
            }}
          >
            News & Updates
          </h2>
        </div>
        <Link
          href={ROUTES.news}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13.5px",
            fontWeight: 700,
            color: "#1d4ed8",
            textDecoration: "none",
          }}
        >
          View All
          <ChevronRight size={16} strokeWidth={2.5} />
        </Link>
      </div>

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        <div
          ref={emblaRef}
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            borderRadius: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            aspectRatio: "16/7",
            minHeight: "220px",
            maxHeight: "460px",
            cursor: "grab",
            background: "#0f172a",
          }}
          role="region"
          aria-label="News carousel"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div
            style={{ display: "flex", height: "100%", touchAction: "pan-y" }}
          >
            {articles.map((article, i) => (
              <Link
                key={article.id}
                href={ROUTES.newsDetail(article.slug)}
                style={{
                  position: "relative",
                  height: "100%",
                  minWidth: 0,
                  flex: "0 0 100%",
                  textDecoration: "none",
                  display: "block",
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${articles.length}`}
              >
                {/* Background image */}
                {article.coverImage ? (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
                    }}
                  />
                )}

                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                  }}
                />

                {/* Text content */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "2.5rem 2rem 2rem",
                  }}
                >
                  {article.publishedAt && (
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#7dd3fc",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        margin: "0 0 8px",
                      }}
                    >
                      {article.publishedAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  <h3
                    style={{
                      fontSize: "clamp(16px, 2.5vw, 24px)",
                      fontWeight: 800,
                      color: "#fff",
                      margin: "0 0 6px",
                      letterSpacing: "-0.3px",
                      lineHeight: 1.3,
                      maxWidth: "600px",
                    }}
                  >
                    {article.title}
                  </h3>
                  <div
                    style={{
                      width: "40px",
                      height: "3px",
                      background: "#3b82f6",
                      borderRadius: "2px",
                      marginTop: "10px",
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Progress bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "3px",
              background: "rgba(255,255,255,0.9)",
              width: `${progress}%`,
              zIndex: 10,
            }}
            aria-hidden="true"
          />

          {/* Prev / Next */}
          <button
            onClick={(e) => {
              e.preventDefault();
              scrollPrev();
            }}
            aria-label="Previous slide"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              scrollNext();
            }}
            aria-label="Next slide"
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {/* Dots */}
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            role="tablist"
            aria-label="Slide navigation"
          >
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === selectedIndex}
                aria-label={`Go to slide ${i + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(i);
                }}
                style={{
                  height: "6px",
                  border: "none",
                  borderRadius: "99px",
                  cursor: "pointer",
                  padding: 0,
                  width: i === selectedIndex ? "24px" : "6px",
                  background:
                    i === selectedIndex ? "#fff" : "rgba(255,255,255,0.4)",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
