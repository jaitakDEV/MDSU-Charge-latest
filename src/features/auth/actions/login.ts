"use server";

import { signIn, signOut } from "@/server/auth";
import { loginSchema } from "@/validations/auth";
import { apiError, apiSuccess } from "@/lib/utils";
import { AuthError } from "next-auth";
import { ROUTES } from "@/config/app";

export async function loginAction(data: unknown) {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0].message);
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return apiSuccess({ redirectTo: ROUTES.dashboard });
  } catch (error) {
    if (error instanceof AuthError) {
      return apiError("Invalid email or password");
    }
    return apiError("Something went wrong");
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: ROUTES.login });
}
