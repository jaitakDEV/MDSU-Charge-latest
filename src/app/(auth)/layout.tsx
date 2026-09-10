// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { ROUTES } from "@/config/app";
// import Image from "next/image";
// import Link from "next/link";

// export default async function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await auth();

//   if (session?.user) {
//     if (session.user.role === "ADMIN") redirect(ROUTES.admin);
//     else redirect(ROUTES.dashboard);
//   }

//   return (
//     <div className="page">
//       <Link href={ROUTES.home} className="back-btn" aria-label="Back to home">
//         <svg
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M15 18L9 12L15 6"
//             stroke="currentColor"
//             strokeWidth="2.2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//         <span>Home</span>
//       </Link>

//       <div className="container">
//         <div className="left">
//           <h1 className="title">Welcome to</h1>

//           <div className="logo">
//             <Image
//               src="/mdssc-logo.svg"
//               alt="logo"
//               width={600}
//               height={600}
//               priority
//               style={{ width: "100%", height: "auto" }}
//             />
//           </div>

//           <p className="text">
//             One Platform. Endless Opportunities.
//             <br />
//             <span>Transform Ideas Into Success.</span>
//           </p>
//         </div>

//         <div className="right">
//           <div className="card">{children}</div>
//         </div>
//       </div>

//       <style>{`

//         .page {
//           position: relative;
//           min-height: 100svh;
//           display: flex;
//           align-items: center;
//           justify-content: center;

//           background:
//             radial-gradient(circle at 10% 20%, rgba(26,111,212,0.85), transparent 45%),
//             radial-gradient(circle at 20% 40%, rgba(26,111,212,0.45), transparent 60%),
//             radial-gradient(circle at 50% 50%, rgba(255,255,255,1), rgba(255,255,255,0.8), transparent 70%),
//             radial-gradient(circle at 10% 80%, rgba(6,48,128,0.65), transparent 50%),
//             radial-gradient(circle at 30% 70%, rgba(6,48,128,0.35), transparent 65%),
//             linear-gradient(90deg, #ffffff 0%, #ffffff 60%, #ffffff 100%);
//         }

//         .back-btn {
//           position: absolute;
//           top: clamp(16px, 3vw, 28px);
//           left: clamp(16px, 3vw, 28px);
//           z-index: 10;

//           display: inline-flex;
//           align-items: center;
//           gap: 6px;

//           padding: 9px 16px;
//           border-radius: 999px;

//           background: rgba(255,255,255,0.85);
//           backdrop-filter: blur(10px);
//           -webkit-backdrop-filter: blur(10px);

//           border: 1px solid rgba(9,81,165,0.18);
//           box-shadow: 0 4px 14px rgba(9,81,165,0.12);

//           color: #0951a5;
//           font-size: 14px;
//           font-weight: 600;
//           text-decoration: none;

//           transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
//         }

//         .back-btn svg {
//           flex-shrink: 0;
//         }

//         .back-btn:hover {
//           background: #ffffff;
//           box-shadow: 0 6px 18px rgba(9,81,165,0.18);
//           transform: translateX(-2px);
//         }

//         .back-btn:active {
//           transform: translateX(-1px) scale(0.97);
//         }

//         .back-btn:focus-visible {
//           outline: 2px solid #1a6fd4;
//           outline-offset: 2px;
//         }

//         @media (max-width: 480px) {
//           .back-btn span {
//             display: none;
//           }

//           .back-btn {
//             padding: 10px;
//             border-radius: 50%;
//           }
//         }

//         .container {
//           width: 100%;
//           max-width: 1200px;

//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           align-items: center;

//           gap: clamp(30px, 6vw, 90px);

//           padding: clamp(20px, 4vw, 70px);
//         }

//         .left {
//           text-align: center;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           transform: scale(1.08);
//         }

//         .title {
//           font-size: clamp(40px, 4vw, 72px);
//           font-weight: 800;
//           color: #0951a5;
//           margin-bottom: 14px;
//         }

//         .logo {
//           width: clamp(240px, 28vw, 420px);
//           margin-bottom: 18px;
//         }

//         .text {
//           font-size: 15px;
//           line-height: 1.9;
//           color: #063080;
//         }

//         .text span {
//           color: #1a6fd4;
//           font-weight: 600;
//         }

//         .right {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }

//         .card {
//           width: 100%;
//           max-width: 460px;

//           background: rgba(255,255,255,0.78);
//           backdrop-filter: blur(18px);
//           -webkit-backdrop-filter: blur(18px);

//           border: 1px solid rgba(255,255,255,0.65);
//           border-radius: 26px;

//           padding: 28px;

//           box-shadow:
//             0 20px 60px rgba(0,0,0,0.10),
//             0 8px 24px rgba(0,0,0,0.06);
//         }

//         @media (max-width: 1024px) {
//           .container {
//             gap: 40px;
//           }

//           .title {
//             font-size: 42px;
//           }
//         }

//         @media (max-width: 768px) {
//           .container {
//             grid-template-columns: 1fr;
//             gap: 24px;
//             padding: 24px;
//           }

//           .left {
//             transform: none;
//           }

//           .title,
//           .text {
//             display: none;
//           }

//           .logo {
//             width: clamp(240px, 65vw, 360px);
//           }

//           .card {
//             max-width: 100%;
//             padding: 18px;
//             border-radius: 18px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/app";
import Image from "next/image";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user) {
    if (session.user.role === "ADMIN") redirect(ROUTES.admin);
    else redirect(ROUTES.dashboard);
  }

  return (
    <div className="page">
      <Link href={ROUTES.home} className="back-btn" aria-label="Back to home">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Home</span>
      </Link>

      <div className="container">
        <div className="left">
          <h1 className="title">Welcome to</h1>

          <div className="logoRow">
            <div className="logoBox logoBoxMain">
              <Image
                src="/mdssc-logo.svg"
                alt="MDSSC"
                fill
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
            <span className="logoDivider" aria-hidden="true">
              ×
            </span>
            <div className="logoBox logoBoxSecondary">
              <Image
                src="/charge-logo.png"
                alt="CHARGE"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          <p className="text">
            One Platform. Endless Opportunities.
            <br />
            <span>Transform Ideas Into Success.</span>
          </p>
        </div>

        <div className="right">
          <div className="card">{children}</div>
        </div>
      </div>

      <style>{`

        .page {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(circle at 10% 20%, rgba(245,122,34,0.85), transparent 45%),
            radial-gradient(circle at 20% 40%, rgba(245,122,34,0.45), transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,1), rgba(255,255,255,0.8), transparent 70%),
            radial-gradient(circle at 10% 80%, rgba(193,87,13,0.65), transparent 50%),
            radial-gradient(circle at 30% 70%, rgba(193,87,13,0.35), transparent 65%),
            linear-gradient(90deg, #ffffff 0%, #ffffff 60%, #ffffff 100%);
        }

        .back-btn {
          position: absolute;
          top: clamp(16px, 3vw, 28px);
          left: clamp(16px, 3vw, 28px);
          z-index: 10;

          display: inline-flex;
          align-items: center;
          gap: 6px;

          padding: 9px 16px;
          border-radius: 999px;

          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);

          border: 1px solid rgba(245,122,34,0.18);
          box-shadow: 0 4px 14px rgba(245,122,34,0.12);

          color: #f57a22;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;

          transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        }

        .back-btn svg {
          flex-shrink: 0;
        }

        .back-btn:hover {
          background: #ffffff;
          box-shadow: 0 6px 18px rgba(245,122,34,0.18);
          transform: translateX(-2px);
        }

        .back-btn:active {
          transform: translateX(-1px) scale(0.97);
        }

        .back-btn:focus-visible {
          outline: 2px solid #f57a22;
          outline-offset: 2px;
        }

        @media (max-width: 480px) {
          .back-btn span {
            display: none;
          }

          .back-btn {
            padding: 10px;
            border-radius: 50%;
          }
        }


        .container {
          width: 100%;
          max-width: 1200px;

          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;

          gap: clamp(30px, 6vw, 90px);

          padding: clamp(20px, 4vw, 70px);
        }


        .left {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transform: scale(1.08);
        }

        .title {
          font-size: clamp(40px, 4vw, 72px);
          font-weight: 800;
          color: #6b3410;
          margin-bottom: 14px;
        }

        .logoRow {
          width: clamp(260px, 32vw, 460px);
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .logoBox {
          position: relative;
          height: clamp(64px, 8vw, 100px);
        }

        .logoBoxMain {
          flex: 1 1 60%;
          max-width: 62%;
        }

        .logoBoxSecondary {
          flex: 1 1 30%;
          max-width: 34%;
        }

        .logoDivider {
          font-size: 20px;
          font-weight: 300;
          color: #e0a06a;
          flex-shrink: 0;
          line-height: 1;
        }

        .text {
          font-size: 15px;
          line-height: 1.9;
          color: #6b3410;
        }

        .text span {
          color: #f57a22;
          font-weight: 600;
        }


        .right {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card {
          width: 100%;
          max-width: 460px;

          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          border: 1px solid rgba(255,255,255,0.65);
          border-radius: 26px;

          padding: 28px;

          box-shadow:
            0 20px 60px rgba(0,0,0,0.10),
            0 8px 24px rgba(0,0,0,0.06);
        }

    
        @media (max-width: 1024px) {
          .container {
            gap: 40px;
          }

          .title {
            font-size: 42px;
          }
        }

        @media (max-width: 768px) {
          .container {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 24px;
          }

          .left {
            transform: none;
          }

          .title,
          .text {
            display: none;
          }

          .logoRow {
            width: clamp(220px, 62vw, 340px);
          }

          .card {
            max-width: 100%;
            padding: 18px;
            border-radius: 18px;
          }
        }
      `}</style>
    </div>
  );
}
