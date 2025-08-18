"use client";

import Form from "next/form";
import { useActionState, useEffect } from "react";
import { login } from "@/app/(auth)/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ResponseState } from "@/lib/action/client";
import Link from "next/link";
import { FormField } from "@/components/custom/FormField";
import { GoogleLoginButton } from "@/components/custom/GoogleButton";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { useVerifyEmail } from "@/lib/store/VerifyEmail";

export default function Page() {
	const [state, formAction, pending] = useActionState<ResponseState, FormData>(login, null);
	const { setEmail, clearEmail } = useVerifyEmail();
	const router = useRouter();

	useEffect(() => {
		if (state?.code === 403) {
			toast.warning("Login failed", {
				description:
					"Please verify your email before logging in. Check your inbox for the verification email.",
			});
			router.push("/verify-email");

			return;
		}

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

			clearEmail();
			router.push("/dashboard");
		}
	}, [state, router.push, clearEmail]);

	return (
		<section className="flex flex-col items-center justify-center h-full gap-6">
			<h1 className="font-semibold text-5xl">Welcome Back!</h1>
			<Form action={formAction} formMethod="POST" className="flex flex-col gap-14 w-[80%]">
				<div className="space-y-6">
					<FormField
						id="email"
						name="email"
						type="email"
						label="Email"
						placeholder="Fill in your email"
						onChange={(e) => setEmail(e.target.value)}
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
				<div className="space-y-6">
					<div className="flex flex-col gap-2">
						<Button
							type="submit"
							variant="default"
							disabled={pending}
							className="bg-primary w-full text-white font-semibold py-6 rounded-lg shadow-lg hover:brightness-90 cursor-pointer transition duration-300 ease-in-out active:scale-95"
						>
							{pending ? "Logging in..." : "Login"}
						</Button>
						<Link
							href="/forgot"
							className="text-xs text-end pr-1 text-gray-600 transition duration-300 ease-in-out hover:text-black"
						>
							Forgot your password?
						</Link>
					</div>
					<div className="flex justify-center active:scale-95 transition duration-300 ease-in-out">
						<GoogleLoginButton context="Login" />
					</div>
					<Link href="/register" className="text-sm underline flex justify-center">
						I don't have an account
					</Link>
				</div>
			</Form>
		</section>
	);
}
