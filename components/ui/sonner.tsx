"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group shadow-2xl"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",

					"--success-bg": "var(--primary)",
					"--success-text": "var(--primary-foreground)",
					"--success-border": "var(--primary)",

					"--error-bg": "var(--destructive)",
					"--error-text": "var(--destructive-foreground)",
					"--error-border": "var(--destructive)",

					"--warning-bg": "var(--accent)",
					"--warning-text": "var(--accent-foreground)",
					"--warning-border": "var(--accent)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
