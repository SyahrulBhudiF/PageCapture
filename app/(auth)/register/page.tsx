"use client";

import { FormField } from "@/components/custom/FormField";
import { Button } from "@/components/ui/button";
import type { ResponseState } from "@/lib/action/client";
import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { register } from "../actions";
import { GoogleLoginButton } from "@/components/custom/GoogleButton";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { toast } from "sonner";
import { useVerifyEmail } from "@/lib/store/VerifyEmail";
import type { User } from "@/lib/model/user";

export default function Page() {
	const [state, formAction, pending] = useActionState<ResponseState<User>, FormData>(
		register,
		null,
	);
	const router = useRouter();
	const { setEmail } = useVerifyEmail();

	useEffect(() => {
		if (state?.error) {
			toast.warning("Registration failed", {
				description: `${state.error}`,
			});
			return;
		}

		if (state?.success) {
			toast.success("Registration successful", {
				description: "Please check your email to verify your account.",
			});

			if (state.data?.email) {
				setEmail(state.data.email);
			}
			router.push("/verify-email");
		}
	}, [state, router.push, setEmail]);

	return (
		<section className="flex flex-col items-center justify-center h-full gap-4">
			<h1 className="font-semibold text-5xl">Welcome!</h1>
			<Form action={formAction} formMethod="POST" className="flex flex-col gap-12 w-[80%]">
				<div className="space-y-4">
					<FormField
						id="name"
						name="name"
						type="text"
						label="Name"
						placeholder="Fill in your name"
						required
						error={state?.fieldErrors?.name?.[0]}
					/>
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
					<PasswordInput
						id="confirm"
						name="confirm"
						label="Confirm Password"
						placeholder="Confirm your password"
						required
						error={state?.fieldErrors?.confirm?.[0]}
					/>
				</div>
				<div className="space-y-6">
					<Button
						type="submit"
						variant="default"
						disabled={pending}
						className="bg-primary w-full text-white font-semibold py-6 rounded-lg shadow-lg hover:brightness-90 cursor-pointer transition duration-300 ease-in-out active:scale-95"
					>
						{pending ? "Registering..." : "Register"}
					</Button>
					<div className="flex justify-center">
						<GoogleLoginButton context="Register" />
					</div>
					<Link href="/login" className="text-sm underline flex justify-center">
						I have an account
					</Link>
				</div>
			</Form>
		</section>
	);
}
