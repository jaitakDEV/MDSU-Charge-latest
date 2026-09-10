import { ROUTES } from "@/config/app";

export function getDashboardRoute(role?: string): string {
  switch (role) {
    case "ADMIN":
      return ROUTES.admin;
    case "FACULTY":
      return ROUTES.faculty;
    case "CMS_EDITOR":
      return ROUTES.cms;
    case "STUDENT":
    default:
      return ROUTES.dashboard;
  }
}
