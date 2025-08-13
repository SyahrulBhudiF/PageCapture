'use client';

import Form from "next/form";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useActionState} from "react";
import {login, LoginState} from "@/app/(auth)/login/actions";

export default function Login() {
    const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <p className="font-semibold text-5xl">Welcome Back!</p>
            <Form action={formAction} formMethod="POST" className="flex flex-col gap-16 w-[80%]">
                <div className="space-y-6">
                    <Label htmlFor="email" className="text-md flex flex-col gap-2">
                        <p className="text-start w-full">Email</p>
                        <Input id="email" name="email" type="email" placeholder="Fill in your email"
                               className="shadow-xl py-6" required/>
                    </Label>
                    <Label htmlFor="password" className="text-md flex flex-col gap-2">
                        <p className="text-start w-full">Password</p>
                        <Input id="password" name="password" type="password" placeholder="Fill in your password"
                               className="shadow-xl py-6" required/>
                    </Label>
                </div>
                {state?.error && <p className="text-red-600">{JSON.stringify(state.error)}</p>}
                {state?.success && <p className="text-green-600">Logged in!</p>}
                <button
                    type="submit"
                    disabled={pending}
                    className="bg-primary text-white font-semibold py-3 rounded-lg shadow-lg hover:brightness-95 cursor-pointer transition duration-300 ease-in-out">
                    Login
                </button>
            </Form>
        </div>
    );
}
