import { z } from "zod";

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const RegisterSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		email: z.email(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
			),
		confirm: z.string().min(8, "Confirm Password must be at least 8 characters long"),
	})
	.refine((data) => data.password === data.confirm, {
		error: "Passwords do not match",
		path: ["confirm"],
	});

export const LoginResponseSchema = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
});

export const RefreshResponseSchema = z.object({
	access_token: z.string(),
});

export const VerifyOtpSchema = z.object({
	email: z.email(),
	otp: z.string().min(6).max(6),
});

export const ForgotPasswordSchema = z
	.object({
		email: z.email(),
		otp: z.string().min(6).max(6),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
			),
		confirm: z.string().min(8, "Confirm Password must be at least 8 characters long"),
	})
	.refine((data) => data.password === data.confirm, {
		error: "Passwords do not match",
		path: ["confirm"],
	});
