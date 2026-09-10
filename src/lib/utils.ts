// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//shadcn/ui ka cn() helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//date formatting
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

//api response helpers

export function apiSuccess<T>(data: T) {
  return { success: true as const, data };
}

export function apiError(error: string) {
  return { success: false as const, error };
}

//tring helpers

export function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
