"use client";

import { useEffect, useActionState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Form from "next/form";
import type { ResponseState } from "@/lib/action/client";
import { sendOtp, verifyEmail } from "../actions";
import { useVerifyEmail } from "@/lib/store/VerifyEmail";
import { useRouter } from "next/navigation";
import useTimer from "@/lib/hook/useTimer";

export default function Page() {
	const { email, clearEmail } = useVerifyEmail();
	const router = useRouter();
	const [verifyState, verifyAction, verifying] = useActionState<ResponseState, FormData>(
		verifyEmail,
		null,
	);
	const [sendState, sendAction, sending] = useActionState<ResponseState, FormData>(sendOtp, null);
	const [isPending, startTransition] = useTransition();
	const { timer, start } = useTimer(0);
	const hasSentRef = useRef<boolean>(false);

	useEffect(() => {
		if (!email) {
			router.back();
			return;
		}

		const storedEndTime = localStorage.getItem("otp-timer");
		const isTimerActiveOnLoad = storedEndTime ? parseInt(storedEndTime, 10) > Date.now() : false;

		if (isTimerActiveOnLoad) {
			return;
		}

		if (hasSentRef.current) {
			return;
		}
		hasSentRef.current = true;

		const formData = new FormData();
		formData.append("email", email);
		startTransition(() => sendAction(formData));
		start(60);
	}, [email, router, sendAction, start]);

	useEffect(() => {
		if (sendState?.success) {
			toast.success("OTP sent successfully!");
		} else if (sendState?.error) {
			toast.error(sendState.error || "Failed to send OTP");
		}
	}, [sendState]);

	useEffect(() => {
		if (verifyState?.success) {
			toast.success("OTP verified successfully!");
			clearEmail();
			router.push("/dashboard");
		} else if (verifyState?.error) {
			toast.error(verifyState.error || "Failed to verify OTP");
		}
	}, [verifyState, router, clearEmail]);

	const handleResend = () => {
		if (!email || timer > 0) return;

		const formData = new FormData();
		formData.append("email", email);

		startTransition(() => sendAction(formData));
		start(60);
	};

	if (!email) return null;

	return (
		<div className="flex flex-col justify-center items-center h-full w-full">
			<div className="flex flex-col gap-8 w-full max-w-lg">
				<div className="flex flex-col gap-2">
					<h1 className="text-4xl font-bold text-gray-900">Verify your email</h1>
					<p className="text-gray-600">Enter the verification code sent to your email</p>
				</div>
				<div className="flex flex-col gap-6">
					<p className="text-gray-700">We sent a verification code to</p>
					<p className="font-semibold text-gray-900">{email}</p>
					<Form className="flex flex-col gap-4" action={verifyAction}>
						<Input
							type="text"
							name="otp"
							placeholder="Enter 6-digit code"
							required
							maxLength={6}
							pattern="[0-9]{6}"
							className="h-12 text-base text-center tracking-widest font-mono"
							autoComplete="one-time-code"
							autoFocus
						/>
						<Input type="hidden" name="email" value={email} required />
						<Button
							type="submit"
							disabled={verifying}
							className="h-12 text-base font-semibold cursor-pointer"
						>
							{verifying ? "Verifying..." : "Verify Code"}
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
				</div>
			</div>
		</div>
	);
}
