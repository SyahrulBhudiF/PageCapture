import { createSafeActionClient } from "next-safe-action";

export type ResponseState = {
	error?: string;
	success?: boolean;
	fieldErrors?: Record<string, string[]>;
} | null;

export const actionClient = createSafeActionClient({
	handleServerError(error) {
		console.error("SafeAction Server Error:", error);
		return { formErrors: ["Server error occurred"], fieldErrors: {} };
	},
});
