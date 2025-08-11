"use server";

import {apiFetch} from "@/lib/api/client";
import {tokenStore} from "@/lib/api/token";
import {LoginSchema, LoginResponseSchema} from "@/lib/schema/auth";
import {actionClient} from "@/lib/action/client";
import {Effect} from "effect";

export const loginAction = actionClient
    .inputSchema(LoginSchema)
    .action(async ({ parsedInput }) =>
        Effect.gen(function* () {
            const res = yield* apiFetch("/auth/login", {
                method: "POST",
                body: parsedInput,
                schema: LoginResponseSchema,
                auth: false,
            });

            yield* Effect.sync(() => {
                tokenStore.set(res.accessToken);
            });

            return { success: true };
        }).pipe(Effect.runPromise)
    );