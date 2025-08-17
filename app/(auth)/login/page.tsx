"use client";

import Form from "next/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect } from "react";
import { login, verifyGoogleToken } from "@/app/(auth)/login/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import type { ResponseState } from "@/lib/action/client";
import Link from "next/link";

export default function Login() {
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

	async function handleGoogleLogin(credentialResponse: CredentialResponse) {
		if (typeof window === "undefined") return;

		if (!credentialResponse.credential) {
			toast.error("Login Failed", { description: "Could not get credential from Google." });
			return;
		}

		const result = await verifyGoogleToken(credentialResponse.credential);

		if (result.success) {
			toast.success("Login Successful!", {
				description: "Redirecting to your dashboard...",
			});
			router.push("/dashboard");
		} else {
			toast.error("Login Failed", {
				description: result.error || "An unknown error occurred.",
			});
		}
	}

	return (
		<div className="flex flex-col items-center justify-center h-full gap-6">
			<p className="font-semibold text-5xl">Welcome Back!</p>
			<Form action={formAction} formMethod="POST" className="flex flex-col gap-14 w-[80%]">
				<div className="space-y-6">
					<Label htmlFor="email" className="text-md flex flex-col gap-2">
						<p className="text-start w-full">Email</p>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="Fill in your email"
							className="shadow-xl py-6"
							required
						/>
						{state?.fieldErrors?.email?.[0] && (
							<p className="text-red-500 text-sm">{state.fieldErrors.email[0]}</p>
						)}
					</Label>
					<Label htmlFor="password" className="text-md flex flex-col gap-2">
						<p className="text-start w-full">Password</p>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Fill in your password"
							className="shadow-xl py-6"
							required
						/>
						{state?.fieldErrors?.password?.[0] && (
							<p className="text-red-500 text-sm">{state.fieldErrors.password[0]}</p>
						)}
					</Label>
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
						<GoogleLogin
							shape="pill"
							width="150"
							locale="en_US"
							onSuccess={(res) => void handleGoogleLogin(res)}
							onError={() => {
								toast.error("Login Failed", {
									description: "Google authentication process failed. Please try again.",
								});
							}}
							useOneTap
						/>
					</div>
					<Link href="/register" className="text-sm underline flex justify-center">
						I don't have an account
					</Link>
				</div>
			</Form>
		</div>
	);
}
