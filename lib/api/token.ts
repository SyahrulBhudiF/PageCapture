import { cookies } from "next/headers";
import { Effect } from "effect";

export class TokenStore extends Effect.Service<TokenStore>()("TokenStore", {
	effect: Effect.gen(function* () {
		return {
			getAccessToken: async () => {
				const c = await cookies();
				return c.get("access_token")?.value ?? null;
			},
			setAccessToken: async (token: string) => {
				const c = await cookies();
				c.set("access_token", token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					path: "/",
					maxAge: 60 * 60,
				});
			},
			clearAccessToken: async () => {
				const c = await cookies();
				c.delete("access_token");
			},

			getRefreshToken: async () => {
				const c = await cookies();
				return c.get("refresh_token")?.value ?? null;
			},
			setRefreshToken: async (token: string) => {
				const c = await cookies();
				c.set("refresh_token", token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					path: "/",
					maxAge: 60 * 60 * 24 * 7,
				});
			},
			clearRefreshToken: async () => {
				const c = await cookies();
				c.delete("refresh_token");
			},

			clearAll: async () => {
				const c = await cookies();
				c.delete("access_token");
				c.delete("refresh_token");
			},
		} as const;
	}),
}) {}
