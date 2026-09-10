import type { User } from "@prisma/client";

export type SafeUser = Omit<User, "hashedPassword">;

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  emailVerified: Date | null;
};

export type ApiResponse<T = null> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

export type UserRole = "STUDENT" | "FACULTY" | "CMS_EDITOR" | "ADMIN";
