"use server";

import { apiFetch } from "@/lib/api/client";
import { TokenStore } from "@/lib/api/token";
import { LoginResponseSchema, LoginSchema } from "@/lib/schema/auth";
import { Effect } from "effect";

export type LoginState = { error?: string; success?: boolean } | null;

export async function login(_prevState: LoginState, formData: FormData) {
	return Effect.gen(function* () {
		const tokenStore = yield* TokenStore;

		const parsedInput = LoginSchema.safeParse({
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		});
		if (!parsedInput.success) return { error: "Invalid email or password." };

		const response = yield* apiFetch("auth/login", {
			method: "POST",
			body: parsedInput.data,
			schema: LoginResponseSchema,
			auth: false,
		});

		tokenStore.set(response.accessToken);

		return { success: true, error: undefined };
	}).pipe(
		Effect.withSpan("login"),
		Effect.catchTag("ApiError", (error) =>
			Effect.succeed({ success: false, error: error.message }),
		),
		Effect.provide(TokenStore.Default),
		Effect.runPromise,
	);
}
