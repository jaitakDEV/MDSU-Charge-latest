import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";

type GuardSuccess = { ok: true; userId: string; role: Role };
type GuardFailure = { ok: false; response: NextResponse };
type GuardResult = GuardSuccess | GuardFailure;

export async function requireAuth(): Promise<GuardResult> {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  if (session.user.isActive === false) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Account deactivated" },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    userId: session.user.id,
    role: session.user.role as Role,
  };
}

export async function requireAdminApi(): Promise<GuardResult> {
  const result = await requireAuth();
  if (!result.ok) return result;

  if (result.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Forbidden — admin only" },
        { status: 403 },
      ),
    };
  }

  return result;
}

export async function requireRole(allowedRoles: Role[]): Promise<GuardResult> {
  const result = await requireAuth();
  if (!result.ok) return result;

  if (!allowedRoles.includes(result.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      ),
    };
  }

  return result;
}
