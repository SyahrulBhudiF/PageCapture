import { z } from "zod";

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const RegisterSchema = z
	.object({
		email: z.email(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number",
			),
		confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const LoginResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
});

export const RefreshResponseSchema = z.object({
	accessToken: z.string(),
});
