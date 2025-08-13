"use server";

import {actionClient} from "@/lib/action/client";
import {apiFetch} from "@/lib/api/client";
import {TokenStore} from "@/lib/api/token";
import {LoginResponseSchema, LoginSchema} from "@/lib/schema/auth";
import {Effect} from "effect";

export const loginAction = actionClient
    .inputSchema(LoginSchema)
    .action(async ({parsedInput}) =>
        Effect.gen(function* () {
            const tokenStore = yield* TokenStore;

            const response = yield* apiFetch("auth/login", {
                method: "POST",
                body: parsedInput,
                schema: LoginResponseSchema,
                auth: false,
            });

            console.log(response);

            tokenStore.set(response.accessToken);

            return {success: true, error: null};
        }).pipe(
            Effect.withSpan("loginAction"),
            Effect.catchTag("ApiError", (error) =>
                Effect.succeed({success: false, error: error.message}),
            ),
            Effect.provide(TokenStore.Default),
            Effect.runPromise,
        ),
    );
