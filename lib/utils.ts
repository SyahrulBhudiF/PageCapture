import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {Effect} from "effect";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
