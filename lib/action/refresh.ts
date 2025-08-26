import { Effect, Data } from "effect";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080/api/v1";

interface AuthTokens {
	data: {
		access_token: string;
		refresh_token?: string;
	};
}

export class RefreshError extends Data.TaggedError("RefreshError")<{ cause: unknown }> {}

export function refreshToken(refreshToken: string): Effect.Effect<AuthTokens, RefreshError> {
	return Effect.tryPromise({
		try: async () => {
			const headers = new Headers();
			headers.set("Cookie", `refresh_token=${refreshToken}`);

			const response = await fetch(`${BASE_URL}/auth/refresh`, {
				method: "POST",
				headers,
			});

			if (!response.ok) {
				throw new Error("Refresh API call failed");
			}
			return await response.json();
		},
		catch: (cause) => new RefreshError({ cause }),
	});
}
