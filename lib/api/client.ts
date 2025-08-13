import {Config, Data, Effect} from "effect";
import {TokenStore} from "@/lib/api/token";
import {z} from "zod";
import type {UnknownException} from "effect/Cause";
import type {ConfigError} from "effect/ConfigError";

type HttpMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

class UnauthorizedError extends Data.TaggedError("UnauthorizedError") {
}

class ParseError extends Data.TaggedError("ParseError")<{
    message: string;
}> {
}

class ApiError extends Data.TaggedError("ApiError")<{
    message: string;
}> {
}

const ErrorSchema = z.object({
    message: z.string(),
});

type FetchOptions<TSchema, TBody> = {
    method?: HttpMethods;
    body?: TBody;
    schema: z.ZodType<TSchema>;
    isRefreshAttempt?: boolean;
    auth?: boolean;
};

export function apiFetch<TSchema = unknown, TBody = Record<string, unknown>>(
    path: string,
    opts: FetchOptions<TSchema, TBody>,
): Effect.Effect<
    TSchema,
    ApiError | ConfigError | UnauthorizedError | ParseError | UnknownException,
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

        const response = yield* Effect.tryPromise(() =>
            fetch(`${baseUrl}/${path}`, {
                method: opts.method || "GET",
                headers,
                body: opts.body ? JSON.stringify(opts.body) : undefined,
                credentials:
                    opts.auth || path === "/auth/login" ? "include" : "same-origin",
            }),
        );

        if (
            opts.auth &&
            response.status === 401 &&
            !opts.isRefreshAttempt &&
            path !== "/auth/refresh"
        ) {
            const refreshRes = yield* Effect.tryPromise(() =>
                fetch(`${baseUrl}/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                }),
            );

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

        const json = yield* Effect.tryPromise({
            try: () => response.json(),
            catch: () => new ParseError({message: "Failed to parse JSON response"}),
        });

        if (!response.ok) {
            const parsedError = ErrorSchema.safeParse(json);
            if (!parsedError.success) {
                Effect.logError(parsedError.error.message);
                return yield* new ParseError({message: "Invalid API response"});
            }
            return yield* new ApiError({message: parsedError.data.message});
        }

        const parsed = opts.schema.safeParse(json);
        if (!parsed.success) {
            Effect.logError(parsed.error.message);
            return yield* new ParseError({message: "Invalid API response"});
        }

        return parsed.data as TSchema;
    }).pipe(Effect.withSpan("apiFetch"), Effect.provide(TokenStore.Default));
}
