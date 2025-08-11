import { Effect } from "effect";

export class TokenStore extends Effect.Service<TokenStore>()("TokenStore", {
	effect: Effect.gen(function* () {
		let accessToken: string | null = null;

		return {
			get: () => accessToken,
			set: (token: string) => {
				accessToken = token;
			},
			clear: () => {
				accessToken = null;
			},
		} as const;
	}),
}) {}
