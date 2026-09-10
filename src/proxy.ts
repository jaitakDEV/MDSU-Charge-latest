// import { auth } from "@/server/auth";
// import { NextResponse } from "next/server";
// import { ROUTES } from "@/config/app";

// // export const proxy = auth((req) => {
// export default auth((req) => {
//   const { pathname } = req.nextUrl;
//   const session = req.auth;
//   const role = session?.user?.role;

//   if (!session) {
//     if (
//       pathname.startsWith("/dashboard") ||
//       pathname.startsWith("/faculty") ||
//       pathname.startsWith("/cms") ||
//       pathname.startsWith("/admin")
//     ) {
//       return NextResponse.redirect(new URL(ROUTES.login, req.url));
//     }
//     return NextResponse.next();
//   }

//   if (session.user.isActive === false) {
//     return NextResponse.redirect(
//       new URL(ROUTES.login + "?error=deactivated", req.url),
//     );
//   }

//   if (!session.user.emailVerified) {
//     return NextResponse.redirect(
//       new URL(ROUTES.login + "?error=unverified", req.url),
//     );
//   }

//   if (role === "ADMIN") return NextResponse.next();

//   if (role === "STUDENT") {
//     if (
//       pathname.startsWith("/faculty") ||
//       pathname.startsWith("/cms") ||
//       pathname.startsWith("/admin")
//     ) {
//       return NextResponse.redirect(new URL(ROUTES.dashboard, req.url));
//     }
//     return NextResponse.next();
//   }

//   if (role === "FACULTY") {
//     if (
//       pathname.startsWith("/dashboard") ||
//       pathname.startsWith("/cms") ||
//       pathname.startsWith("/admin")
//     ) {
//       return NextResponse.redirect(new URL(ROUTES.faculty, req.url));
//     }
//     return NextResponse.next();
//   }

//   if (role === "CMS_EDITOR") {
//     if (
//       pathname.startsWith("/dashboard") ||
//       pathname.startsWith("/faculty") ||
//       pathname.startsWith("/admin")
//     ) {
//       return NextResponse.redirect(new URL(ROUTES.cms, req.url));
//     }
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/faculty/:path*",
//     "/cms/:path*",
//     "/admin/:path*",
//   ],
// };

// import { auth } from "@/server/auth";
// import { NextResponse } from "next/server";
// import { ROUTES } from "@/config/app";

// const ROLE_HOME: Record<string, string> = {
//   ADMIN: ROUTES.admin,
//   CMS_EDITOR: ROUTES.cms,
//   FACULTY: ROUTES.faculty,
//   STUDENT: ROUTES.dashboard,
// };

// const ROLE_ALLOWED_PATHS: Record<string, string[]> = {
//   ADMIN: ["/admin"],
//   CMS_EDITOR: ["/cms"],
//   FACULTY: ["/faculty"],
//   STUDENT: ["/dashboard"],
// };

// export default auth((req) => {
//   const { pathname } = req.nextUrl;
//   const session = req.auth;
//   const role = session?.user?.role;

//   if (!session) {
//     return NextResponse.redirect(new URL(ROUTES.login, req.url));
//   }

//   if (session.user.isActive === false) {
//     return NextResponse.redirect(
//       new URL(ROUTES.login + "?error=deactivated", req.url),
//     );
//   }

//   if (!session.user.emailVerified) {
//     return NextResponse.redirect(
//       new URL(ROUTES.login + "?error=unverified", req.url),
//     );
//   }

//   if (!role) return NextResponse.next();

//   const allowedPaths = ROLE_ALLOWED_PATHS[role] ?? [];
//   const isAllowed = allowedPaths.some((p) => pathname.startsWith(p));

//   if (!isAllowed) {
//     return NextResponse.redirect(
//       new URL(ROLE_HOME[role] ?? ROUTES.login, req.url),
//     );
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/faculty/:path*",
//     "/cms/:path*",
//     "/admin/:path*",
//   ],
// };

import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import { ROUTES } from "@/config/app";

const ROLE_HOME: Record<string, string> = {
  ADMIN: ROUTES.admin,
  CMS_EDITOR: ROUTES.cms,
  FACULTY: ROUTES.faculty,
  STUDENT: ROUTES.dashboard,
  JOB_PROVIDER: ROUTES.provider,
};

const ROLE_ALLOWED_PATHS: Record<string, string[]> = {
  ADMIN: ["/admin"],
  CMS_EDITOR: ["/cms"],
  FACULTY: ["/faculty"],
  STUDENT: ["/dashboard"],
  JOB_PROVIDER: ["/provider"],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  if (!session) {
    return NextResponse.redirect(new URL(ROUTES.login, req.url));
  }

  if (role === "JOB_PROVIDER" && session.user.isActive === false) {
    if (pathname.startsWith("/provider/pending")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(ROUTES.providerPending, req.url));
  }

  if (session.user.isActive === false) {
    return NextResponse.redirect(
      new URL(ROUTES.login + "?error=deactivated", req.url),
    );
  }

  if (!session.user.emailVerified) {
    return NextResponse.redirect(
      new URL(ROUTES.login + "?error=unverified", req.url),
    );
  }

  if (!role) return NextResponse.next();

  const allowedPaths = ROLE_ALLOWED_PATHS[role] ?? [];
  const isAllowed = allowedPaths.some((p) => pathname.startsWith(p));

  if (!isAllowed) {
    return NextResponse.redirect(
      new URL(ROLE_HOME[role] ?? ROUTES.login, req.url),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/faculty/:path*",
    "/cms/:path*",
    "/admin/:path*",
    "/provider/:path*",
  ],
};
