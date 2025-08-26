import { apiFetch } from "@/lib/api/client";
import { Effect } from "effect";
import { userResponseSchema } from "@/lib/schema/user";
import type { ResponseState } from "@/lib/action/client";
import type z from "zod";

export async function getUser(): Promise<ResponseState<z.infer<typeof userResponseSchema>>> {
	return Effect.gen(function* () {
		const response = yield* apiFetch("user/profile", {
			method: "GET",
			schema: userResponseSchema,
			auth: true,
		});

		return { success: true, data: response };
	}).pipe(
		Effect.withSpan("verifyEmail"),
		Effect.catchTags({
			ApiError: (error) =>
				Effect.succeed({
					success: false,
					error: error.message,
					code: error.status,
				}),
			UnauthorizedError: (error) =>
				Effect.succeed({
					success: false,
					error: error.message || "Unauthorized access",
				}),
			ParseError: (error) => Effect.succeed({ success: false, error: error.message }),
			NetworkError: () => Effect.succeed({ success: false, error: "Network error occurred" }),
		}),
		Effect.runPromise,
	);
}

export async function logout(): Promise<ResponseState<null>> {
	return Effect.gen(function* () {
		yield* apiFetch("auth/logout", {
			method: "POST",
			auth: true,
		});

		return { success: true };
	}).pipe(
		Effect.withSpan("logout"),
		Effect.catchTags({
			ApiError: (error) =>
				Effect.succeed({
					success: false,
					error: error.message,
					code: error.status,
				}),
			UnauthorizedError: (error) =>
				Effect.succeed({
					success: false,
					error: error.message || "Unauthorized access",
				}),
			ParseError: (error) => Effect.succeed({ success: false, error: error.message }),
			NetworkError: () => Effect.succeed({ success: false, error: "Network error occurred" }),
		}),
		Effect.runPromise,
	);
}
