"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

const LEADERS = [
  {
    role: "Patron & Chief Mentor",
    name: "Prof. Suresh Kumar Agrawal",
    designation: "Hon. Vice Chancellor, MDSU Ajmer",
    quote:
      "Building a knowledge-driven society is not merely an academic pursuit — it is a national commitment. MDS University strives to foster excellence, innovation, and ethical leadership while preserving India's rich intellectual traditions.",
    boldPhrase: "national commitment.",
    image: "/images/teams/Prof_Suresh_Kumar_Agarwal.png",
    imagePosition: "left" as const,
    socials: {
      linkedin: "https://linkedin.com/in/example-suresh",
      instagram: "https://instagram.com/example-suresh",
      x: "https://x.com/example-suresh",
    },
    tags: [
      { icon: "education" as const, label: "Vice Chancellor, MDSU Ajmer" },
      { icon: "clock" as const, label: "30+ Years in Academia" },
      { icon: "cloud" as const, label: "Academic Leader" },
    ],
  },
  {
    role: "Director — MDSSC",
    name: "Prof. R.S. Choyal",
    designation: "CMD, RS Choyal Group",
    quote:
      "True leadership in education means creating pathways where none existed before — empowering every student, every entrepreneur, and every institution to contribute meaningfully to a stronger India.",
    boldPhrase: "contribute meaningfully to a stronger India.",
    image: "/images/teams/Prof_RS_Choyal.png",
    imagePosition: "left" as const,
    socials: {
      linkedin: "https://linkedin.com/in/example-choyal",
      instagram: "https://instagram.com/example-choyal",
      x: "https://x.com/example-choyal",
    },
    tags: [
      { icon: "education" as const, label: "Director, MDSSC" },
      { icon: "clock" as const, label: "CMD, RS Choyal Group" },
      { icon: "cloud" as const, label: "Industry & Academia" },
    ],
  },
];

interface AdvisoryMember {
  name: string;
  designation: string;
  image: string | null;
  initials: string;
  socials: {
    linkedin: string;
    instagram: string;
    x: string;
  };
}

const ADVISORY_BOARD: AdvisoryMember[] = [
  {
    name: "Prof. [Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P1",
    socials: {
      linkedin: "https://linkedin.com/in/example1",
      instagram: "https://instagram.com/example1",
      x: "https://x.com/example1",
    },
  },
  {
    name: "Prof. [Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P2",
    socials: {
      linkedin: "https://linkedin.com/in/example2",
      instagram: "https://instagram.com/example2",
      x: "https://x.com/example2",
    },
  },
  {
    name: "Prof. [Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P3",
    socials: {
      linkedin: "https://linkedin.com/in/example3",
      instagram: "https://instagram.com/example3",
      x: "https://x.com/example3",
    },
  },
];

const ACADEMIC_INDUSTRY_EXPERTS: AdvisoryMember[] = [
  {
    name: "Vibhuti Choyal",
    designation: "Director, CHARGE & Mavian Solutions Pvt. Ltd.",
    image: "/images/teams/vibhuti_maam.png",
    initials: "VC",
    socials: {
      linkedin: "https://linkedin.com/in/example-vibhuti",
      instagram: "https://instagram.com/example-vibhuti",
      x: "https://x.com/example-vibhuti",
    },
  },
  {
    name: "[Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P2",
    socials: {
      linkedin: "https://linkedin.com/in/example2",
      instagram: "https://instagram.com/example2",
      x: "https://x.com/example2",
    },
  },
  {
    name: "[Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P3",
    socials: {
      linkedin: "https://linkedin.com/in/example3",
      instagram: "https://instagram.com/example3",
      x: "https://x.com/example3",
    },
  },
];

const INDUSTRY_STARTUP_REPS: AdvisoryMember[] = [
  {
    name: "Rajesh Bansal",
    designation: "President, Laghu Udyog Bharti, Pallara, Ajmer",
    image: "/images/teams/rajesh_bansal.png",
    initials: "RB",
    socials: {
      linkedin: "https://linkedin.com/in/example-rajesh",
      instagram: "https://instagram.com/example-rajesh",
      x: "https://x.com/example-rajesh",
    },
  },
  {
    name: "[Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P2",
    socials: {
      linkedin: "https://linkedin.com/in/example2",
      instagram: "https://instagram.com/example2",
      x: "https://x.com/example2",
    },
  },
  {
    name: "[Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P3",
    socials: {
      linkedin: "https://linkedin.com/in/example3",
      instagram: "https://instagram.com/example3",
      x: "https://x.com/example3",
    },
  },
];

const RESEARCH_INNOVATION_COMMITTEE: AdvisoryMember[] = [
  {
    name: "[Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P1",
    socials: {
      linkedin: "https://linkedin.com/in/example1",
      instagram: "https://instagram.com/example1",
      x: "https://x.com/example1",
    },
  },
  {
    name: "[Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P2",
    socials: {
      linkedin: "https://linkedin.com/in/example2",
      instagram: "https://instagram.com/example2",
      x: "https://x.com/example2",
    },
  },
  {
    name: "[Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P3",
    socials: {
      linkedin: "https://linkedin.com/in/example3",
      instagram: "https://instagram.com/example3",
      x: "https://x.com/example3",
    },
  },
];

const IPR_INCUBATION_COMMITTEE: AdvisoryMember[] = [
  {
    name: "Bhavpreet Singh Soni",
    designation: "Director, Soni Vision, Ajmer",
    image: "/images/teams/bhavpreet_singh.png",
    initials: "BS",
    socials: {
      linkedin: "https://linkedin.com/in/example-bhavpreet",
      instagram: "https://instagram.com/example-bhavpreet",
      x: "https://x.com/example-bhavpreet",
    },
  },
  {
    name: "[Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P2",
    socials: {
      linkedin: "https://linkedin.com/in/example2",
      instagram: "https://instagram.com/example2",
      x: "https://x.com/example2",
    },
  },
  {
    name: "[Name]",
    designation: "Designation, Institution",
    image: null,
    initials: "P3",
    socials: {
      linkedin: "https://linkedin.com/in/example3",
      instagram: "https://instagram.com/example3",
      x: "https://x.com/example3",
    },
  },
];

type IconType = "education" | "clock" | "cloud";

function TagIcon({ type }: { type: IconType }) {
  if (type === "education")
    return (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    );
  if (type === "clock")
    return (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    );
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

type SocialType = "linkedin" | "instagram" | "x";

function SocialIcon({ type }: { type: SocialType }) {
  if (type === "linkedin")
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    );
  if (type === "instagram")
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-7.39 8.45L23 22h-7.06l-5.52-7.21L4.06 22H1l7.92-9.05L1 2h7.06l4.99 6.59L18.9 2zm-2.48 18h2.06L7.62 4h-2.1l11.9 16z" />
    </svg>
  );
}

type Leader = (typeof LEADERS)[number];

function LeaderCard({ leader }: { leader: Leader }) {
  const isImgLeft = leader.imagePosition === "left";
  const [before, after] = leader.quote.split(leader.boldPhrase);

  const ImageCol = (
    <div className={styles.leaderImgCol}>
      {leader.image ? (
        <Image
          src={leader.image}
          alt={leader.name}
          fill
          className={styles.leaderPhoto}
          priority
        />
      ) : (
        <div className={styles.leaderPlaceholder}>
          <div className={styles.leaderAvatar}>
            <span className={styles.leaderInitials}>
              {leader.name
                .split(" ")
                .slice(1, 3)
                .map((w) => w[0])
                .join("")}
            </span>
          </div>
          <span className={styles.leaderPhotoNote}>Photo coming soon</span>
        </div>
      )}

      <div className={styles.leaderSocialOverlay}>
        {leader.socials?.linkedin && (
          <a
            href={leader.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.leaderSocialLink}
            aria-label={`${leader.name} on LinkedIn`}
          >
            <SocialIcon type="linkedin" />
          </a>
        )}
        {leader.socials?.instagram && (
          <a
            href={leader.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.leaderSocialLink}
            aria-label={`${leader.name} on Instagram`}
          >
            <SocialIcon type="instagram" />
          </a>
        )}
        {leader.socials?.x && (
          <a
            href={leader.socials.x}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.leaderSocialLink}
            aria-label={`${leader.name} on X`}
          >
            <SocialIcon type="x" />
          </a>
        )}
      </div>
    </div>
  );

  const ContentCol = (
    <div className={styles.leaderContent}>
      <span className={styles.leaderBadge}>{leader.role}</span>
      <h2 className={styles.leaderName}>{leader.name}</h2>
      <p className={styles.leaderDesignation}>{leader.designation}</p>

      <div className={styles.leaderQuoteWrap}>
        <div className={styles.leaderQuoteBar} aria-hidden="true" />
        <p className={styles.leaderQuote}>
          {before}
          <strong>{leader.boldPhrase}</strong>
          {after}
        </p>
      </div>

      <div className={styles.leaderDivider} />

      <div className={styles.leaderMeta}>
        {leader.tags.map((tag) => (
          <span key={tag.label} className={styles.leaderTag}>
            <TagIcon type={tag.icon} />
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={`${styles.leaderCard} ${
        isImgLeft ? styles.leaderCardImgLeft : styles.leaderCardImgRight
      }`}
    >
      {isImgLeft ? (
        <>
          {ImageCol}
          {ContentCol}
        </>
      ) : (
        <>
          {ContentCol}
          {ImageCol}
        </>
      )}
    </div>
  );
}

function AdvisoryCard({ member }: { member: AdvisoryMember }) {
  return (
    <div className={styles.advisoryCard}>
      <div className={styles.advisoryImgWrap}>
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            style={{ objectFit: "contain", objectPosition: "center center" }}
            className={styles.advisoryPhoto}
          />
        ) : (
          <div className={styles.advisoryPlaceholder}>
            <span className={styles.advisoryInitials}>{member.initials}</span>
          </div>
        )}

        <div className={styles.advisorySocialOverlay}>
          {member.socials?.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.advisorySocialLink}
              aria-label={`${member.name} on LinkedIn`}
            >
              <SocialIcon type="linkedin" />
            </a>
          )}
          {member.socials?.instagram && (
            <a
              href={member.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.advisorySocialLink}
              aria-label={`${member.name} on Instagram`}
            >
              <SocialIcon type="instagram" />
            </a>
          )}
          {member.socials?.x && (
            <a
              href={member.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.advisorySocialLink}
              aria-label={`${member.name} on X`}
            >
              <SocialIcon type="x" />
            </a>
          )}
        </div>
      </div>
      <div className={styles.advisoryContent}>
        <p className={styles.advisoryName}>{member.name}</p>
        <p className={styles.advisoryDesig}>{member.designation}</p>
      </div>
    </div>
  );
}

export default function GovernancePage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <section className={styles.hero} aria-label="Governance Structure">
        <div className={styles.heroBgWord} aria-hidden="true">
          GOVERNANCE
        </div>
        <div
          className={`${styles.heroInner} ${visible ? styles.heroInnerVisible : ""}`}
        >
          <div className={styles.heroEyebrow}>MDSU-CHARGE</div>
          <h1 className={styles.heroTitle}>
            Governance &amp;
            <br />
            <span className={styles.heroTitleAccent}>Leadership</span>
          </h1>
          <p className={styles.heroDesc}>
            Guided by distinguished academics and industry leaders,
            MDSU-CHARGE's governance structure ensures every initiative reflects
            excellence, accountability, and a lasting commitment to India's MSME
            ecosystem.
          </p>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.sectionLabel}>
          <span className={styles.sectionLabelLine} />
          <span className={styles.sectionLabelText}>Leadership</span>
          <span className={styles.sectionLabelLine} />
        </div>

        <div className={styles.leadersList}>
          {LEADERS.map((leader) => (
            <LeaderCard key={leader.name} leader={leader} />
          ))}
        </div>

        <div className={`${styles.sectionLabel} ${styles.mt72}`}>
          <span className={styles.sectionLabelLine} />
          <span className={styles.sectionLabelText}>Advisory Board</span>
          <span className={styles.sectionLabelLine} />
        </div>

        <div className={styles.advisoryGrid}>
          {ADVISORY_BOARD.map((member, i) => (
            <AdvisoryCard key={i} member={member} />
          ))}
        </div>

        <div className={`${styles.sectionLabel} ${styles.mt72}`}>
          <span className={styles.sectionLabelLine} />
          <span className={styles.sectionLabelText}>
            Academic and Industry Experts
          </span>
          <span className={styles.sectionLabelLine} />
        </div>

        <div className={styles.advisoryGrid}>
          {ACADEMIC_INDUSTRY_EXPERTS.map((member, i) => (
            <AdvisoryCard key={i} member={member} />
          ))}
        </div>

        <div className={`${styles.sectionLabel} ${styles.mt72}`}>
          <span className={styles.sectionLabelLine} />
          <span className={styles.sectionLabelText}>
            Representatives from Industry and Startups
          </span>
          <span className={styles.sectionLabelLine} />
        </div>

        <div className={styles.advisoryGrid}>
          {INDUSTRY_STARTUP_REPS.map((member, i) => (
            <AdvisoryCard key={i} member={member} />
          ))}
        </div>

        <div className={`${styles.sectionLabel} ${styles.mt72}`}>
          <span className={styles.sectionLabelLine} />
          <span className={styles.sectionLabelText}>
            Research and Innovation Committee
          </span>
          <span className={styles.sectionLabelLine} />
        </div>

        <div className={styles.advisoryGrid}>
          {RESEARCH_INNOVATION_COMMITTEE.map((member, i) => (
            <AdvisoryCard key={i} member={member} />
          ))}
        </div>

        <div className={`${styles.sectionLabel} ${styles.mt72}`}>
          <span className={styles.sectionLabelLine} />
          <span className={styles.sectionLabelText}>
            IPR and Incubation Committee
          </span>
          <span className={styles.sectionLabelLine} />
        </div>

        <div className={styles.advisoryGrid}>
          {IPR_INCUBATION_COMMITTEE.map((member, i) => (
            <AdvisoryCard key={i} member={member} />
          ))}
        </div>
      </main>
    </>
  );
}
