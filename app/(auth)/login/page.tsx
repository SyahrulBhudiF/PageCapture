"use client";

import Form from "next/form";
import { useActionState, useEffect } from "react";
import { login, verifyGoogleToken } from "@/app/(auth)/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import type { ResponseState } from "@/lib/action/client";
import Link from "next/link";
import { FormField } from "@/components/custom/FormField";
import { GoogleLoginButton } from "@/components/custom/GoogleButton";
import { PasswordInput } from "@/components/custom/PasswordInput";

export default function Page() {
	const [state, formAction, pending] = useActionState<ResponseState, FormData>(login, null);
	const router = useRouter();

	useEffect(() => {
		if (state?.error) {
			toast.warning("Login failed", {
				description: `${state.error}`,
			});
			return;
		}

		if (state?.success) {
			toast.success("Login successful", {
				description: "Welcome back!",
			});
			router.push("/dashboard");
		}
	}, [state, router.push]);

	return (
		<div className="flex flex-col items-center justify-center h-full gap-6">
			<p className="font-semibold text-5xl">Welcome Back!</p>
			<Form action={formAction} formMethod="POST" className="flex flex-col gap-14 w-[80%]">
				<div className="space-y-6">
					<FormField
						id="email"
						name="email"
						type="email"
						label="Email"
						placeholder="Fill in your email"
						required
						error={state?.fieldErrors?.email?.[0]}
					/>
					<PasswordInput
						id="password"
						name="password"
						label="Password"
						placeholder="Fill in your password"
						required
						error={state?.fieldErrors?.password?.[0]}
					/>
				</div>
				<div className="space-y-8">
					<Button
						type="submit"
						variant="default"
						disabled={pending}
						className="bg-primary w-full text-white font-semibold py-6 rounded-lg shadow-lg hover:brightness-90 cursor-pointer transition duration-300 ease-in-out"
					>
						Login
					</Button>
					<div className="flex justify-center">
						<GoogleLoginButton context="Login" />
					</div>
					<Link href="/register" className="text-sm underline flex justify-center">
						I don't have an account
					</Link>
				</div>
			</Form>
		</div>
	);
}
