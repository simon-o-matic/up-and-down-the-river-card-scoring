import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toPosition(pos: number) {
    return pos === 1 ? "st" : pos === 2 ? "nd" : pos === 3 ? "rd" : "th";
}
