import { Config, Data, Effect } from "effect";
import { TokenStore } from "@/lib/api/token";
import { z } from "zod";
import type { UnknownException } from "effect/Cause";
import type { ConfigError } from "effect/ConfigError";

type HttpMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

class UnauthorizedError extends Data.TaggedError("UnauthorizedError") {}

class NetworkError extends Data.TaggedError("NetworkError")<{ message: string }> {}

class ParseError extends Data.TaggedError("ParseError")<{
	message: string;
}> {}

class ApiError extends Data.TaggedError("ApiError")<{
	message: string;
	status: number;
}> {}

const ErrorSchema = z.object({
	status: z.number(),
	message: z.string(),
	data: z.any().optional(),
});

type FetchOptions<TSchema, TBody> = {
	method?: HttpMethods;
	body?: TBody;
	schema?: z.ZodType<TSchema>;
	isRefreshAttempt?: boolean;
	auth?: boolean;
};

export function apiFetch<TSchema = unknown, TBody = Record<string, unknown>>(
	path: string,
	opts: FetchOptions<TSchema, TBody>,
): Effect.Effect<
	TSchema,
	ApiError | ConfigError | UnauthorizedError | ParseError | UnknownException | NetworkError,
	never
> {
	return Effect.gen(function* () {
		const baseUrl = yield* Config.string("BASE_URL").pipe(
			Config.withDefault("http://localhost:8080/api/v1"),
		);
		const tokenStore = yield* TokenStore;

		const headers = new Headers();
		headers.set("Content-Type", "application/json");

		if (opts.auth && tokenStore.get()) {
			headers.set("Authorization", `Bearer ${tokenStore.get()}`);
		}

		const response = yield* Effect.tryPromise({
			try: () =>
				fetch(`${baseUrl}/${path}`, {
					method: opts.method || "GET",
					headers,
					body: opts.body ? JSON.stringify(opts.body) : undefined,
					credentials: opts.auth || path === "/auth/login" ? "include" : "same-origin",
				}),
			catch: (err) =>
				new NetworkError({
					message: err instanceof Error ? err.message : "Network error occurred",
				}),
		});

		if (
			opts.auth &&
			response.status === 401 &&
			!opts.isRefreshAttempt &&
			path !== "/auth/refresh"
		) {
			const refreshRes = yield* Effect.tryPromise({
				try: () => fetch(`${baseUrl}/auth/refresh`, { method: "POST", credentials: "include" }),
				catch: (err) =>
					new NetworkError({ message: err instanceof Error ? err.message : "Network error" }),
			});

			if (refreshRes.ok) {
				const refreshData = yield* Effect.tryPromise(() => refreshRes.json());
				tokenStore.set(refreshData.accessToken);

				return yield* apiFetch<TSchema, TBody>(path, {
					...opts,
					isRefreshAttempt: true,
				});
			} else {
				tokenStore.clear();
				yield* new UnauthorizedError();
			}
		}

		let json = yield* Effect.tryPromise({
			try: () => response.json(),
			catch: () => new ParseError({ message: "Failed to parse JSON response" }),
		});

		if (!response.ok) {
			const parsedError = ErrorSchema.safeParse(json);
			if (!parsedError.success) {
				Effect.logError(parsedError.error.message);
				return yield* new ParseError({ message: "Invalid API response" });
			}

			if (response.status === 401) {
				return yield* new UnauthorizedError();
			}

			return yield* new ApiError({
				message: parsedError.data.message,
				status: response.status,
			});
		}

		if (opts.schema) {
			json = opts.schema.safeParse(json.data);
			if (!json.success) {
				Effect.logError(json.error.message);
				return yield* new ParseError({ message: "Invalid API response" });
			}
		}

		return json.data as TSchema;
	}).pipe(Effect.withSpan("apiFetch"), Effect.provide(TokenStore.Default));
}
