"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import styles from "./ProgrammesSection.module.css";

const PROGRAMMES = [
  {
    id: "A",
    badge: "Innovation Hub",
    title: "Fostering Indigenous Innovation",
    tags: ["Design Thinking", "R&D", "Bharatiya Solutions"],
    desc: "Promoting indigenous technologies, interdisciplinary research, and Bharatiya solutions to social and economic challenges.",
    cta: "Explore Hub",
    href: "/programmes/innovation-hub",
    image: "/images/programmes/innovation-hub.webp",
  },
  {
    id: "B",
    badge: "Incubation Centre",
    title: "Nurturing Startups & Innovators",
    tags: ["Startups", "MSMEs", "Mentoring"],
    desc: "Supporting startups, student innovators, and community enterprises through mentoring, training, and institutional guidance.",
    cta: "Join Incubation",
    href: "/programmes/incubation",
    image: "/images/programmes/incubation.webp",
  },
  {
    id: "C",
    badge: "Research Park",
    title: "Applied Research & Tech Transfer",
    tags: ["Research", "Prototypes", "Industry Collab"],
    desc: "Facilitating applied research, technology transfer, and university–industry collaboration for socially beneficial outcomes.",
    cta: "Visit Research Park",
    href: "/programmes/research-park",
    image: "/images/programmes/research-park.webp",
  },
  {
    id: "D",
    badge: "Startup Ecosystem",
    title: "Building Tomorrow's Entrepreneurs",
    tags: ["EDP", "Funding", "Mentorship"],
    desc: "Developing vibrant startup culture through entrepreneurship programmes, funding facilitation, and commercialization support.",
    cta: "Start Your Journey",
    href: "/programmes/startup-ecosystem",
    image: "/images/programmes/startup.webp",
  },
  {
    id: "E",
    badge: "Skill Development",
    title: "Employability & Vocational Training",
    tags: ["Vocational", "Certification", "Apprenticeship"],
    desc: "Enhancing employability through practical training, apprenticeships, and industry-oriented certification programmes.",
    cta: "View Programmes",
    href: "/programmes/skill-development",
    image: "/images/programmes/skill.webp",
  },
  {
    id: "F",
    badge: "Swadeshi Knowledge",
    title: "Indian Knowledge Systems",
    tags: ["IKS", "Traditional Wisdom", "Sustainable"],
    desc: "Dedicated to Indian Knowledge Systems, traditional wisdom, indigenous sciences, and civilizational knowledge traditions.",
    cta: "Discover More",
    href: "/programmes/swadeshi-knowledge",
    image: "/images/programmes/swadeshi.webp",
  },
  {
    id: "G",
    badge: "Industry–Academia",
    title: "Bridging Academia & Industry",
    tags: ["Joint Research", "Internships", "Consultancy"],
    desc: "Strengthening collaboration through joint research, internships, consultancy, and innovation partnerships.",
    cta: "Partner With Us",
    href: "/programmes/industry-academia",
    image: "/images/programmes/industry.webp",
  },
  {
    id: "H",
    badge: "Rural Outreach",
    title: "Empowering Rural Communities",
    tags: ["Artisans", "Women Entrepreneurs", "Villages"],
    desc: "Engaging with villages, artisans, farmers, and women entrepreneurs through innovation support and livelihood promotion.",
    cta: "Learn More",
    href: "/programmes/rural-outreach",
    image: "/images/programmes/rural.webp",
  },
  {
    id: "I",
    badge: "IPR Cell",
    title: "Protecting Indigenous Knowledge",
    tags: ["Patents", "Copyrights", "GI Tags"],
    desc: "Protecting Bharat-centric knowledge through patents, copyrights, trademarks, and Geographical Indications.",
    cta: "Protect Your IP",
    href: "/programmes/ipr-cell",
    image: "/images/programmes/ipr.webp",
  },
];

const CARD_WIDTH = 300;
const CARD_GAP = 24;
const CARDS_VISIBLE = 3;
const STEP = CARD_WIDTH + CARD_GAP;

export function ProgrammesSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const total = PROGRAMMES.length;
  const maxIdx = total - CARDS_VISIBLE;

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / STEP);
    setActiveIdx(Math.min(Math.max(idx, 0), maxIdx));
  }, [maxIdx]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scrollTo = useCallback((idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * STEP, behavior: "smooth" });
    setActiveIdx(idx);
  }, []);

  const prev = () => scrollTo(Math.max(activeIdx - 1, 0));
  const next = () => scrollTo(Math.min(activeIdx + 1, maxIdx));

  return (
    <section className={styles.section} id="programmes">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.eyebrow}>Major Components</div>
          <h2 className={styles.title}>
            Nine Components.{" "}
            <span className={styles.titleAccent}>One Vision.</span>
          </h2>
          <p className={styles.subtitle}>
            An integrated ecosystem for innovation, research, entrepreneurship,
            and indigenous knowledge rooted in Bharatiya ethos.
          </p>
        </div>

        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrowBtn}
            onClick={prev}
            disabled={activeIdx === 0}
            aria-label="Previous"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.arrowBtn}
            onClick={next}
            disabled={activeIdx >= maxIdx}
            aria-label="Next"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.trackWrap} ref={trackRef}>
        <div className={styles.track}>
          {PROGRAMMES.map((prog) => (
            <div key={prog.id} className={styles.card}>
              {prog.image ? (
                <>
                  <div className={styles.cardImgWrap}>
                    <Image
                      src={prog.image}
                      alt={prog.title}
                      fill
                      className={styles.cardImg}
                      sizes="340px"
                    />
                  </div>
                  <div className={styles.cardOverlay} aria-hidden="true" />
                </>
              ) : (
                <div className={styles.cardPlaceholder} aria-hidden="true" />
              )}

              <div className={styles.cardContent}>
                <span className={styles.badge}>{prog.badge}</span>
                <h3 className={styles.cardTitle}>{prog.title}</h3>
                <div className={styles.tags}>
                  {prog.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className={styles.cardDesc}>{prog.desc}</p>
                <Link href={prog.href} className={styles.cardCta}>
                  {prog.cta}
                  <span className={styles.cardCtaArrow}>
                    <svg
                      width="16"
                      height="16"
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
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots}>
        {Array.from({ length: maxIdx + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ""}`}
            onClick={() => scrollTo(i)}
            aria-label={`Go to position ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
