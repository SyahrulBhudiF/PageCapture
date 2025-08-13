import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {StandardSchemaV1Issue} from "@tanstack/form-core";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function errFormat(
    err?: string | StandardSchemaV1Issue[] | null
): string {
    if (!err) return "";
    if (Array.isArray(err)) {
        return err.map(e => e?.message ?? "").filter(Boolean).join(", ");
    }
    return err;
}