import z from "zod";

export const userResponseSchema = z.object({
	uuid: z.uuid(),
	email: z.email(),
	name: z.string(),
	profilePicture: z.string().optional(),
	publicId: z.string().optional(),
	emailVerified: z.coerce.date().nullable().optional(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
});
