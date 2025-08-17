"use server";

import type { ResponseState } from "@/lib/action/client";
import { apiFetch } from "@/lib/api/client";
import { TokenStore } from "@/lib/api/token";
import {
	LoginResponseSchema,
	LoginSchema,
	RegisterSchema,
	VerifyOtpSchema,
} from "@/lib/schema/auth";
import { zodFieldErrors } from "@/lib/utils";
import type { User } from "@/lib/model/user";
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
			ApiError: (error) =>
				Effect.succeed({
					success: false,
					error: error.message,
					code: error.status,
				}),
			UnauthorizedError: () =>
				Effect.succeed({
					success: false,
					error: "Email or Password is incorrect",
				}),
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
			ApiError: (error) =>
				Effect.succeed({
					success: false,
					error: error.message,
					code: error.status,
				}),
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

export async function register(_prevState: ResponseState<User>, formData: FormData) {
	return Effect.gen(function* () {
		const parsedInput = RegisterSchema.safeParse({
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			password: formData.get("password") as string,
			confirm: formData.get("confirm") as string,
		});

		if (!parsedInput.success) {
			return {
				success: false,
				fieldErrors: zodFieldErrors(parsedInput.error),
			};
		}

		const response = yield* apiFetch<User>("auth/register", {
			method: "POST",
			body: parsedInput.data,
			auth: false,
		});

		return { success: true, error: undefined, data: response };
	}).pipe(
		Effect.withSpan("register"),
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
					error: error.message || "Registration failed",
				}),
			ParseError: (error) => Effect.succeed({ success: false, error: error.message }),
			NetworkError: () => Effect.succeed({ success: false, error: "Network error occurred" }),
		}),
		Effect.runPromise,
	);
}

export async function sendOtp(_prevState: ResponseState, formData: FormData) {
	return Effect.gen(function* () {
		yield* apiFetch("auth/send-otp", {
			method: "POST",
			body: { email: formData.get("email") as string },
			auth: false,
		});

		return { success: true, error: undefined };
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
					error: error.message || "Verification failed",
				}),
			ParseError: (error) => Effect.succeed({ success: false, error: error.message }),
			NetworkError: () => Effect.succeed({ success: false, error: "Network error occurred" }),
		}),
		Effect.runPromise,
	);
}

export async function verifyEmail(_prevState: ResponseState, formData: FormData) {
	return Effect.gen(function* () {
		const parsedInput = VerifyOtpSchema.safeParse({
			email: formData.get("email") as string,
			otp: formData.get("otp") as string,
		});

		if (!parsedInput.success) {
			return {
				success: false,
				fieldErrors: zodFieldErrors(parsedInput.error),
			};
		}

		yield* apiFetch("auth/verify-email", {
			method: "POST",
			body: parsedInput.data,
			auth: false,
		});

		return { success: true, error: undefined };
	}).pipe(
		Effect.withSpan("verifyOtp"),
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
					error: error.message || "Verification failed",
				}),
			ParseError: (error) => Effect.succeed({ success: false, error: error.message }),
			NetworkError: () => Effect.succeed({ success: false, error: "Network error occurred" }),
		}),
		Effect.runPromise,
	);
}
