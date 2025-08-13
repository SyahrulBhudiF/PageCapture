'use server';

import {loginAction} from "@/lib/action/auth";

export type LoginState = { error?: string; success?: boolean } | null;

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const {data: result, validationErrors, serverError} = await loginAction(data);

    if (serverError) return {error: serverError} as unknown as LoginState;
    if (validationErrors) return {error: "Invalid email or password."};

    return {success: true};
}