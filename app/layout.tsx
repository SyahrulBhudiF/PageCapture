import type {Metadata} from "next";
import {Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";
import React from "react";

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
    return (
        <html lang="en">
        <body
            className={`${plusJakartaSans.variable} antialiased w-full h-screen`}
        >
        {children}
        </body>
        </html>
    );
}
