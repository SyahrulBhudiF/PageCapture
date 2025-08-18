import { cookies } from "next/headers";
import { Effect } from "effect";

export class TokenStore extends Effect.Service<TokenStore>()("TokenStore", {
	effect: Effect.gen(function* () {
		return {
			get: async () => {
				const c = await cookies();
				return c.get("token")?.value ?? null;
			},
			set: async (token: string) => {
				const c = await cookies();
				c.set("token", token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					path: "/",
					maxAge: 60 * 60,
				});
			},
			clear: async () => {
				const c = await cookies();
				c.delete("token");
			},
		} as const;
	}),
}) {}
