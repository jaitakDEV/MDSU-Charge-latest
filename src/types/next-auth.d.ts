// import type { DefaultSession, DefaultUser } from "next-auth";
// import type { JWT } from "next-auth/jwt";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       role: string;
//       emailVerified: Date | null;
//     } & DefaultSession["user"];
//   }

//   interface User extends DefaultUser {
//     role: string;
//     emailVerified: Date | null;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id?: string;
//     role: string;
//     emailVerified: Date | null;
//   }
// }

import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      emailVerified: Date | null;
      isActive: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    emailVerified: Date | null;
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    emailVerified: Date | null;
    isActive: boolean;
  }
}
