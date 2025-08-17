"use server";

import type { ResponseState } from "@/lib/action/client";
import { apiFetch } from "@/lib/api/client";
import { TokenStore } from "@/lib/api/token";
import { LoginResponseSchema, LoginSchema } from "@/lib/schema/auth";
import { zodFieldErrors } from "@/lib/utils";
import { Effect } from "effect";

export async function login(_prevState: ResponseState, formData: FormData) {
	return Effect.gen(function* () {
		const tokenStore = yield* TokenStore;

		const parsedInput = LoginSchema.safeParse({
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		});

		if (!parsedInput.success) {
			return {
				success: false,
				fieldErrors: zodFieldErrors(parsedInput.error),
			};
		}

		const response = yield* apiFetch("auth/login", {
			method: "POST",
			body: parsedInput.data,
			schema: LoginResponseSchema,
			auth: false,
		});

		tokenStore.set(response.access_token);

		return { success: true, error: undefined };
	}).pipe(
		Effect.withSpan("login"),
		Effect.catchTags({
			ApiError: (error) => Effect.succeed({ success: false, error: error.message }),
			UnauthorizedError: () =>
				Effect.succeed({ success: false, error: "Email or Password is incorrect" }),
			ParseError: (error) => Effect.succeed({ success: false, error: error.message }),
			NetworkError: () => Effect.succeed({ success: false, error: "Network error occurred" }),
		}),
		Effect.provide(TokenStore.Default),
		Effect.runPromise,
	);
}

export async function verifyGoogleToken(googleToken: string) {
	return Effect.gen(function* () {
		const tokenStore = yield* TokenStore;

		const requestBody = {
			token: googleToken,
		};

		const response = yield* apiFetch("auth/google/verify", {
			method: "POST",
			body: requestBody,
			schema: LoginResponseSchema,
			auth: false,
		});

		tokenStore.set(response.access_token);

		return { success: true, error: undefined };
	}).pipe(
		Effect.withSpan("verifyGoogleToken"),
		Effect.catchTags({
			ApiError: (error) => Effect.succeed({ success: false, error: error.message }),
			UnauthorizedError: () =>
				Effect.succeed({
					success: false,
					error: "Google login failed. The token might be invalid or expired.",
				}),
			ParseError: (error) => Effect.succeed({ success: false, error: error.message }),
			NetworkError: () => Effect.succeed({ success: false, error: "Network error occurred" }),
		}),
		Effect.provide(TokenStore.Default),
		Effect.runPromise,
	);
}
