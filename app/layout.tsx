import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import type React from "react";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: "--plus-jakarta-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Page Capture",
	description: "Page Capture is a tool for capturing web pages and saving them as images.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

	return (
		<html lang="en">
			<body className={`${plusJakartaSans.variable} antialiased w-full h-screen`}>
				<GoogleOAuthProvider clientId={googleClientId}>
					{children}
					<Toaster richColors />
				</GoogleOAuthProvider>
			</body>
		</html>
	);
}
