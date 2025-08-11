import {Effect} from "effect";
import {tokenStore} from "@/lib/api/token";
import {z} from "zod";

const ErrorSchema = z.object({
    message: z.string(),
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type FetchOptions<T> = {
    method?: string;
    body?: any;
    schema?: z.ZodType<T>;
    isRefreshAttempt?: boolean;
    auth?: boolean;
};

export function apiFetch<T = unknown>(
    path: string,
    opts: FetchOptions<T> = {}
): Effect.Effect<T, Error> {
    return Effect.tryPromise<T, Error>({
        try: async () => {
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };

            if (opts.auth && tokenStore.get()) {
                headers.Authorization = `Bearer ${tokenStore.get()}`;
            }

            const res = await fetch(`${API_BASE}${path}`, {
                method: opts.method || "GET",
                headers,
                body: opts.body ? JSON.stringify(opts.body) : undefined,
                credentials: opts.auth || path === "/auth/login" ? "include" : "same-origin"
            });

            // refresh token logic
            if (opts.auth && res.status === 401 && !opts.isRefreshAttempt && path !== "/auth/refresh") {
                const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
                    method: "POST",
                    credentials: "include"
                });

                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    tokenStore.set(refreshData.accessToken);

                    return await Effect.runPromise(apiFetch<T>(path, {...opts, isRefreshAttempt: true}));
                } else {
                    tokenStore.clear();
                    throw new Error("Unauthorized");
                }
            }

            const json = await res.json();

            if (!res.ok) {
                const parsedError = ErrorSchema.safeParse(json);
                throw new Error(parsedError.success ? parsedError.data.message : "Unknown error");
            }

            if (opts.schema) {
                const parsed = opts.schema.safeParse(json);
                if (!parsed.success) throw new Error("Invalid API response");
                return parsed.data;
            }

            return json as T;
        },
        catch: (err: unknown) =>
            err instanceof Error ? err : new Error(String(err)),
    });
}
