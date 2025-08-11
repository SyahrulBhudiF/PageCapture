import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
	handleServerError(error) {
		console.error("SafeAction Server Error:", error);
		return { formErrors: ["Server error occurred"], fieldErrors: {} };
	},
});
