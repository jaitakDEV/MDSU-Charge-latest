import Link from "next/link";
import { Lightbulb, Rocket, Leaf, ArrowRight } from "lucide-react";
import styles from "./Aboutmdssc.module.css";

const stats = [
  { value: "9+", label: "Core verticals" },
  { value: "1st", label: "In the state" },
  { value: "100%", label: "Atmanirbhar focus" },
  { value: "IPR", label: "Dedicated cell" },
];

const features = [
  {
    icon: Lightbulb,
    title: "Innovation hub",
    desc: "Bharatiya solutions to real-world challenges",
  },
  {
    icon: Rocket,
    title: "Startup ecosystem",
    desc: "Incubation, mentorship & funding support",
  },
  {
    icon: Leaf,
    title: "Swadeshi knowledge",
    desc: "Reviving indigenous wisdom & sciences",
  },
];

const visionTags = ["Atmanirbhar Bharat", "NEP 2020", "Make in India"];

export default function Aboutmdssc() {
  return (
    <section className={styles.section} aria-label="About MDSSC">
      <div className={styles.hero}>
        <div className={styles.heroCircle1} aria-hidden="true" />
        <div className={styles.heroCircle2} aria-hidden="true" />

        <div className={styles.heroContent}>
          <h2 className={styles.title}>About MDSSC </h2>
          <span className={styles.titleUnderline} aria-hidden="true" />

          <h2 className={styles.heroTitle}>
            Maharshi Dayanand Saraswati Swadeshi Consortium
          </h2>

          <p className={styles.heroDesc}>
            A multidisciplinary, self-reliant ecosystem at MDS University,
            Ajmer, integrating innovation, incubation, indigenous research,
            entrepreneurship and Bharatiya knowledge under one institutional
            roof, in line with Atmanirbhar Bharat and NEP 2020.
          </p>
        </div>
      </div>

      <div className={styles.statsWrap}>
        <div className={styles.statsCard}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.visionCard}>
          <h3 className={styles.visionTitle}>Our vision</h3>
          <p className={styles.visionText}>
            To establish a globally relevant yet culturally rooted ecosystem for
            indigenous innovation, self-reliance, entrepreneurship and
            sustainable national development - inspired by Bharatiya knowledge
            traditions and modern technology.
          </p>
          <div className={styles.visionTags}>
            {visionTags.map((tag) => (
              <span key={tag} className={styles.visionTag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.featureCol}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureIcon} aria-hidden="true">
                <Icon size={20} />
              </div>
              <div>
                <h4 className={styles.featureTitle}>{title}</h4>
                <p className={styles.featureDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.ctaWrap}>
        <Link href="" className={styles.ctaBtn}>
          Discover full consortium
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
