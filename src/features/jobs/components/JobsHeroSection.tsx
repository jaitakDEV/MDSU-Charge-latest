import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/config/app";
import styles from "./JobsHeroSection.module.css";
import { ArrowRight } from "lucide-react";

export function JobsHeroSection() {
  return (
    <div className={styles.container}>
      <div className={styles.circleOne} />
      <div className={styles.circleTwo} />
      <div className={styles.circleThree} />

      {/* Desktop */}
      <div className={styles.desktopWrap}>
        <div className={styles.leftContent}>
          <h1 className={styles.heading}>
            India&apos;s{" "}
            <span className={styles.highlightText}>#1 platform</span>
          </h1>
          <p className={styles.subHeading}>
            <span style={{ position: "relative", zIndex: 1 }}>
              For fresher jobs, internships and courses
            </span>
            <span className={styles.highlightBar} />
          </p>

          <div className={styles.signupCard}>
            <span className={styles.signupLabel}>Candidate sign up</span>
            <div className={styles.signupButtons}>
              <Link
                href={ROUTES.login}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Login
              </Link>
              <Link
                href={ROUTES.register}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                Register
              </Link>
            </div>
            <p className={styles.tnc}>
              By continuing <span>as a candidate</span>, you agree to our{" "}
              <a
                href="https://mdssc.org/terms"
                target="_blank"
                rel="noreferrer"
              >
                T&amp;C.
              </a>
            </p>
          </div>

          <Link
            href="/jobs/employer/register"
            className={styles.employerSignup}
          >
            Employer sign up
            <span className={styles.employerSignupIcon}>
              <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </Link>
        </div>

        <div className={styles.imageSide}>
          <img
            src="/Images/jobs-career-mobile.png"
            alt="Students exploring job opportunities"
            className={styles.imageTag}
          />
        </div>
      </div>

      <div className={styles.mobileWrap}>
        <h1 className={styles.heading}>
          India&apos;s <span className={styles.highlightText}>#1 platform</span>
        </h1>
        <p className={styles.subHeading}>
          <span style={{ position: "relative", zIndex: 1 }}>
            For fresher jobs, internships and courses
          </span>
          <span className={styles.highlightBar} />
        </p>

        <div className={styles.mobileImageSide}>
          <img
            src="/Images/jobs-career-mobile.png"
            alt="Students exploring job opportunities"
            className={styles.imageTag}
          />
        </div>

        <div className={styles.signupCard}>
          <span className={styles.signupLabel}>Candidate sign up</span>
          <div className={styles.signupButtons}>
            <Link
              href={ROUTES.login}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Login
            </Link>
            <Link
              href={ROUTES.register}
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Register
            </Link>
          </div>
          <p className={styles.tnc}>
            By continuing, you agree to our{" "}
            <a href="https://mdssc.org/terms" target="_blank" rel="noreferrer">
              T&amp;C.
            </a>
          </p>
        </div>

        <Link href={ROUTES.register} className={styles.employerSignup}>
          Employer sign up
          <ChevronRight size={15} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
