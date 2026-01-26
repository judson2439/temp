import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Defensive helper for safely handling arrays
export const safeArray = <T,>(x: T[] | undefined | null): T[] => 
  Array.isArray(x) ? x : [];
