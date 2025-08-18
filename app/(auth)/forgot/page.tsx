"use client";

import { useEffect, useActionState, useTransition, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Form from "next/form";
import type { ResponseState } from "@/lib/action/client";
import { sendOtp, resetPassword } from "../actions";
import { useRouter } from "next/navigation";
import useTimer from "@/lib/hook/useTimer";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { Separator } from "@/components/ui/separator";

interface ResetFormProps {
	resetAction: (formData: FormData) => void;
	resetState: ResponseState | null;
	resetting: boolean;
	email: string;
	handleResend: () => void;
	sending: boolean;
	isPending: boolean;
	timer: number;
}

interface RequestFormProps {
	handleSendOtp: (formData: FormData) => void;
	sending: boolean;
	isPending: boolean;
}

export default function Page() {
	const router = useRouter();
	const [step, setStep] = useState<"request" | "reset">("request");
	const [email, setEmail] = useState<string | null>(null);

	const [resetState, resetAction, resetting] = useActionState<ResponseState, FormData>(
		resetPassword,
		null,
	);
	const [sendState, sendAction, sending] = useActionState<ResponseState, FormData>(sendOtp, null);
	const [isPending, startTransition] = useTransition();
	const { timer, start } = useTimer(0);
	const hasSentRef = useRef<boolean>(false);

	useEffect(() => {
		if (sendState?.success) {
			toast.success("OTP sent successfully!");
			setStep("reset");
		} else if (sendState?.error) {
			toast.error(sendState.error || "Failed to send OTP");
		}
	}, [sendState]);

	useEffect(() => {
		if (resetState?.success) {
			toast.success("Password reset successfully!");
			router.push("/login");
		} else if (resetState?.error) {
			toast.error(resetState.error || "Failed to reset password");
		}
	}, [resetState, router]);

	const handleSendOtp = (formData: FormData) => {
		const emailValue = formData.get("email") as string;
		if (!emailValue) return;

		setEmail(emailValue);
		startTransition(() => sendAction(formData));
		start(60);
		hasSentRef.current = true;
	};

	const handleResend = () => {
		if (!email || timer > 0) return;

		const formData = new FormData();
		formData.append("email", email);

		startTransition(() => sendAction(formData));
		start(60);
	};

	return (
		<section className="flex flex-col justify-center items-center h-full w-full">
			<div className="flex flex-col gap-8 w-full max-w-lg">
				{step === "request" && (
					<RequestForm handleSendOtp={handleSendOtp} sending={sending} isPending={isPending} />
				)}
				{step === "reset" && email && (
					<ResetForm
						resetAction={resetAction}
						resetState={resetState}
						resetting={resetting}
						email={email}
						handleResend={handleResend}
						sending={sending}
						isPending={isPending}
						timer={timer}
					/>
				)}
			</div>
		</section>
	);
}

function RequestForm({ handleSendOtp, sending, isPending }: RequestFormProps) {
	return (
		<>
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold text-gray-900">Forgot Password</h1>
				<p className="text-gray-600">Enter your email to receive a reset code</p>
			</div>
			<Form action={handleSendOtp} className="flex flex-col gap-4">
				<Input
					type="email"
					name="email"
					placeholder="Enter your email"
					required
					className="h-12 text-base"
					autoComplete="email"
				/>
				<Button
					type="submit"
					disabled={sending || isPending}
					className="h-12 text-base font-semibold cursor-pointer transition duration-300 active:scale-95 ease-in-out"
				>
					{sending || isPending ? "Sending..." : "Send OTP"}
				</Button>
			</Form>
		</>
	);
}

function ResetForm({
	resetAction,
	resetState,
	resetting,
	email,
	handleResend,
	sending,
	isPending,
	timer,
}: ResetFormProps) {
	return (
		<>
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold text-gray-900">Reset Password</h1>
				<p className="text-gray-600">Enter the OTP and your new password</p>
			</div>
			<Form action={resetAction} className="flex flex-col gap-4">
				<Input
					type="text"
					name="otp"
					placeholder="Enter 6-digit code"
					required
					maxLength={6}
					pattern="[0-9]{6}"
					className="h-12 text-base text-center tracking-widest font-mono"
					autoComplete="one-time-code"
				/>
				<Input type="hidden" name="email" value={email} required />
				<Separator className="my-4" />

				<PasswordInput
					id="password"
					name="password"
					label="New Password"
					placeholder="Enter your new password"
					required
					error={resetState?.fieldErrors?.password?.[0]}
				/>
				<PasswordInput
					id="confirm"
					name="confirm"
					label="Confirm Password"
					placeholder="Confirm your new password"
					required
					error={resetState?.fieldErrors?.confirm?.[0]}
				/>

				<Button
					type="submit"
					disabled={resetting}
					className="h-12 text-base font-semibold cursor-pointer transition duration-300 active:scale-95 ease-in-out"
				>
					{resetting ? "Resetting..." : "Reset Password"}
				</Button>
			</Form>

			<Button
				variant="ghost"
				disabled={sending || isPending || timer > 0}
				onClick={handleResend}
				className="text-gray-600 hover:text-gray-900 hover:bg-white hover:underline text-center cursor-pointer"
			>
				{timer > 0
					? `Resend code in ${timer}s`
					: sending || isPending
						? "Sending..."
						: "Resend code"}
			</Button>
		</>
	);
}
