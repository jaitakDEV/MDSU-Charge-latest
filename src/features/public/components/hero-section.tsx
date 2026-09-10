"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
    return () => clearTimeout(t);
  }, []);

  const toggleAudio = () => {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  return (
    <section className={styles.hs} aria-label="Hero">
      <video
        ref={videoRef}
        className={styles.hs__video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      <div className={styles.hs__overlay} aria-hidden="true" />

      <div
        className={`${styles.hs__body}${visible ? ` ${styles["hs__body--visible"]}` : ""}`}
      >
        <div className={styles.hs__inner}>
          <h1 className={styles.hs__h1}>
            Excellence through
            <br />
            <span className={styles.hs__accent}>Education</span>
          </h1>

          <p className={styles.hs__desc}>
            A modern learning environment that develops knowledge, practical
            skills, and industry readiness to build a strong foundation for your
            career success.
          </p>

          <div className={styles.hs__trust}>
            {[
              "Apply Now",
              "Industry-focused courses",
              "Experienced faculty and mentors",
            ].map((item, i, arr) => (
              <span key={item} style={{ display: "contents" }}>
                <span className={styles.hs__ti}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="6.5"
                      cy="6.5"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <path
                      d="M4 6.5l1.7 1.7 3-3.4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span className={styles.hs__sep} aria-hidden="true" />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`${styles["hs__audio-btn"]}${!muted ? ` ${styles["hs__audio-btn--on"]}` : ""}`}
        onClick={toggleAudio}
        aria-label={muted ? "Unmute video audio" : "Mute video audio"}
      >
        {muted ? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.92)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      <div className={styles.hs__statsbar} aria-label="College highlights">
        {[
          { value: "100%", label: "Career Opportunities" },
          { value: "Expert", label: "Faculty Team" },
          { value: "Modern", label: "Learning Environment" },
          { value: "Career", label: "Focused Programs" },
        ].map(({ value, label }) => (
          <div key={label} className={styles.hs__stat}>
            <span className={styles.hs__sv}>{value}</span>
            <span className={styles.hs__sl}>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.hs__scroll} aria-hidden="true">
        <div className={styles.hs__mouse}>
          <div className={styles.hs__wheel} />
        </div>
      </div>
    </section>
  );
}
