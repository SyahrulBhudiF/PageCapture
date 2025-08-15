import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function zodFieldErrors(error: z.ZodError): Record<string, string[]> {
	const tree = z.treeifyError(error);

	const fieldErrors: Record<string, string[]> = {};
	if ("properties" in tree && tree.properties) {
		for (const [key, value] of Object.entries(tree.properties)) {
			fieldErrors[key] = value.errors ?? [];
		}
	}

	return fieldErrors;
}
