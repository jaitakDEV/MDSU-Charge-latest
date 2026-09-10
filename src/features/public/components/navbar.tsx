"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Mail, Info } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import styles from "./Navbar.module.css";
import { UserMenu, MobileUserMenu } from "./UserMenu";

type SubItem = { name: string; path: string; external?: boolean };
type MenuItem = {
  name: string;
  path?: string;
  external?: boolean;
  dropdown?: SubItem[];
};

const menuItems: MenuItem[] = [
  {
    name: "About Us",
    dropdown: [
      { name: "About Us", path: "/about-us" },
      { name: "Vision & Mission", path: "/vision-mission" },
    ],
  },
  { name: "Our Team", dropdown: [{ name: "Governance", path: "/our-team" }] },
  { name: "Programmes", dropdown: [{ name: "Programmes", path: "" }] },
  { name: "Courses", dropdown: [{ name: "Courses", path: "/courses" }] },
  { name: "Gallery", dropdown: [{ name: "Gallary", path: "" }] },
  {
    name: "Students",
    dropdown: [
      // { name: "Addmission", path: "" },
      {
        name: "Addmission",
        path: "https://mdsuajmer.ac.in/admission_portal",
        external: true,
      },
      {
        name: "Hostel",
        path: "https://mdsuajmer.ac.in/hostel",
        external: true,
      },
      {
        name: "Scholarship/Fellowship",
        path: "https://mdsuajmer.ac.in/Scholarships",
        external: true,
      },
      {
        name: "Downlaods",
        path: "https://mdsuajmer.ac.in/Downloads",
        external: true,
      },
      {
        name: "Online Fees",
        path: "https://mdsuajmer.ac.in/Online-Services",
        external: true,
      },
    ],
  },

  {
    name: "Events",
    dropdown: [
      { name: "Upcoming Events", path: "/events" },
      { name: "Past Events", path: "/events/past" },
    ],
  },
  {
    name: "Jobs & Career",
    dropdown: [
      { name: "Browse Jobs", path: "/jobs" },
      { name: "Internships", path: "/jobs/internships" },
      { name: "Walk-in Drives", path: "/jobs/walk-in" },
      { name: "Campus Hiring", path: "/jobs/campus" },
      { name: "Companies", path: "/companies" },
    ],
  },
  {
    name: "Facilities",
    dropdown: [
      {
        name: "Central Library",
        path: "https://mdsuajmer.ac.in/about-the-central-library",
        external: true,
      },
      {
        name: "Health Care",
        path: "https://mdsuajmer.ac.in/Primary-Health-Centre",
        external: true,
      },
      {
        name: "Sports",
        path: "https://mdsuajmer.ac.in/sports-board",
        external: true,
      },
      {
        name: "Placement Cell",
        path: "https://mdsuajmer.ac.in/placement-cell",
        external: true,
      },
      {
        name: "Cultural Committe",
        path: "https://mdsuajmer.ac.in/Cultural-Committee",
        external: true,
      },
      {
        name: "Cafeteria",
        path: "https://mdsuajmer.ac.in/cafeteria",
        external: true,
      },
      {
        name: "Bank",
        path: "https://mdsuajmer.ac.in/bank",
        external: true,
      },
      {
        name: "E-mitra",
        path: "https://mdsuajmer.ac.in/E-Mitra",
        external: true,
      },
      {
        name: "Post Office",
        path: "https://mdsuajmer.ac.in/post-office",
        external: true,
      },
    ],
  },
  {
    name: "Resources",
    dropdown: [
      {
        name: "Swarnim Bharatvarsh Foundation",
        path: "https://mysba.co.in/",
        external: true,
      },
      {
        name: "Jila Swavalamban Kendra",
        path: "https://mysba.co.in/Jila-Swavalamban-Kendra.php",
        external: true,
      },
    ],
  },
];

const socials = [
  {
    icon: Mail,
    link: "",
    isLucide: true,
  },
  {
    icon: FaFacebookF,
    link: "",
    isLucide: false,
  },
  {
    icon: FaInstagram,
    link: "",
    isLucide: false,
  },
  { icon: FaTwitter, link: "", isLucide: false },
  {
    icon: FaYoutube,
    link: "",
    isLucide: false,
  },
  { icon: FaLinkedinIn, link: "", isLucide: false },
];

function DesktopDropdown({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  return (
    <li
      style={{ position: "relative", listStyle: "none" }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button type="button" className={styles.dropdownTrigger}>
        {item.name}
        <ChevronDown
          size={13}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {open && (
        <div
          className={styles.dropdownWrapper}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <div className={styles.dropdownPanel}>
            {item.dropdown!.map((sub) =>
              sub.external ? (
                <a
                  key={sub.name}
                  href={sub.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.dropdownItem}
                >
                  {sub.name}
                </a>
              ) : (
                <Link
                  key={sub.name}
                  href={sub.path}
                  className={styles.dropdownItem}
                >
                  {sub.name}
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const scrollLockRef = useRef(false);

  const lockScroll = useCallback(() => {
    if (!scrollLockRef.current) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      scrollLockRef.current = true;
    }
  }, []);

  const unlockScroll = useCallback(() => {
    if (scrollLockRef.current) {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
      scrollLockRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [mobileOpen, lockScroll, unlockScroll]);

  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setMobileOpen(false);
      setMobileDropdown(null);
    }
  }, [pathname]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileDropdown(null);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <a href="tel:18001230000" className={styles.topbarContactLink}>
              <Phone
                size={13}
                strokeWidth={2.2}
                className={styles.topbarContactIcon}
              />
              <span>1800-123-0000</span>
            </a>
            <span className={styles.topbarDivider} />
            <a
              href="mailto:admissions@mdsucharge.in"
              className={styles.topbarContactLink}
            >
              <Mail
                size={13}
                strokeWidth={2.2}
                className={styles.topbarContactIcon}
              />
              <span>admissions@mdsucharge.in</span>
            </a>
            <span className={styles.topbarDivider} />
            <a href="tel:18001231104" className={styles.admissionBadge}>
              <Info size={11} strokeWidth={2.5} />
              Admission Info
            </a>
          </div>

          <div className={styles.topbarRight}>
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className={styles.socialIcon}
                aria-label={`Social link ${i + 1}`}
              >
                <s.icon size={13} />
              </a>
            ))}
          </div>
        </div>

        <nav className={styles.mainNav}>
          <div className={styles.navInner}>
            {/* <Link href="/" className={styles.logoLink}>
              <Image
                src="/mdssc-logo.svg"
                alt="MySBA"
                width={120}
                height={44}
                className={styles.logoImg}
                priority
              />
            </Link> */}
            <Link href="/" className={styles.logoLink}>
              <div className={styles.logoBox}>
                <Image
                  src="/mdssc-logo.svg"
                  alt="MDSSC"
                  width={160}
                  height={60}
                  className={styles.logoImg}
                  priority
                />
              </div>
            </Link>

            <ul className={styles.desktopMenu}>
              {menuItems.map((item) =>
                item.dropdown ? (
                  <DesktopDropdown key={item.name} item={item} />
                ) : item.external ? (
                  <li key={item.name} style={{ listStyle: "none" }}>
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.navLinkUnderline}
                    >
                      {item.name}
                    </a>
                  </li>
                ) : (
                  <li key={item.name} style={{ listStyle: "none" }}>
                    <Link
                      href={item.path ?? "/"}
                      className={styles.navLinkUnderline}
                    >
                      {item.name}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            {/* <div className={styles.navAuthBtns}>
              <Link href="/login" className={styles.btnLogin}>
                Login
              </Link>
              <Link href="/register" className={styles.btnGetStarted}>
                Get Started
              </Link>
            </div> */}
            <UserMenu />

            <button
              type="button"
              className={styles.hamburgerBtn}
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={28} color="#f57a22" />
            </button>
          </div>

          <div className={styles.mainNavAccent} />
        </nav>
      </header>

      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayOpen : ""}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      <div
        className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className={styles.drawerHeader}>
          <Image
            src="/mdssc-logo.svg"
            alt="MDSSC"
            width={80}
            height={30}
            style={{ height: "30px", width: "auto" }}
          />
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation menu"
            className={styles.drawerCloseBtn}
          >
            <X size={24} color="#f57a22" />
          </button>
        </div>

        <div className={styles.drawerContactStrip}>
          <a href="tel:18001231104" className={styles.drawerContactLink}>
            <Phone size={13} style={{ color: "#ffd9b3" }} />
            1800-123-1104
          </a>
          <a
            href="mailto:admissions@mdsucharge.in"
            className={styles.drawerContactLink}
          >
            <Mail size={13} style={{ color: "#ffd9b3" }} />
            admissions@mdsucharge.in
          </a>
        </div>

        {/* <div className={styles.drawerAuthGrid}>
          <Link
            href="/login"
            onClick={closeMobile}
            className={styles.drawerBtnLogin}
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={closeMobile}
            className={styles.drawerBtnGetStarted}
          >
            Get Started
          </Link>
        </div> */}
        <MobileUserMenu onClose={closeMobile} />

        <div className={styles.drawerMenuList}>
          {menuItems.map((item) => (
            <div key={item.name} className={styles.drawerMenuItem}>
              {item.dropdown ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileDropdown((prev) =>
                        prev === item.name ? null : item.name,
                      )
                    }
                    className={styles.drawerMenuTrigger}
                  >
                    {item.name}
                    <ChevronDown
                      size={18}
                      style={{
                        transition: "transform 0.2s",
                        transform:
                          mobileDropdown === item.name
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        color: "#f57a22",
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {mobileDropdown === item.name && (
                    <div className={styles.drawerSubList}>
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.path}
                          onClick={closeMobile}
                          className={styles.drawerSubLink}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : item.external ? (
                <a
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className={styles.drawerMenuLink}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  href={item.path ?? "/"}
                  onClick={closeMobile}
                  className={styles.drawerMenuLink}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className={styles.drawerSocials}>
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.link}
              target="_blank"
              rel="noreferrer"
              className={styles.drawerSocialIcon}
              aria-label={`Social link ${i + 1}`}
            >
              <s.icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
