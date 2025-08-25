"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { verifyGoogleToken } from "@/app/(auth)/actions";

interface GoogleLoginButtonProps {
	redirectTo?: string;
	context: "Login" | "Register";
}

export function GoogleLoginButton({ redirectTo = "/capture", context }: GoogleLoginButtonProps) {
	const router = useRouter();

	async function handleGoogleLogin(credentialResponse: CredentialResponse) {
		if (!credentialResponse.credential) {
			toast.error(`${context} Failed`, {
				description: `Could not get credential from Google.`,
			});
			return;
		}

		const result = await verifyGoogleToken(credentialResponse.credential);

		if (result.success) {
			toast.success(`${context} Successful!`, {
				description: `Redirecting to your ${context === "Login" ? "Capture" : "Welcome"}...`,
			});
			router.push(redirectTo);
		} else {
			toast.error(`${context} Failed`, {
				description: result.error || `An unknown error occurred during ${context.toLowerCase()}.`,
			});
		}
	}

	return (
		<GoogleLogin
			shape="pill"
			width="150"
			locale="en_US"
			onSuccess={(res) => void handleGoogleLogin(res)}
			onError={() => {
				toast.error(`${context} Failed`, {
					description: `Google authentication process failed. Please try again.`,
				});
			}}
			useOneTap
		/>
	);
}
