import { z } from "zod";

export const UserMetaSchema = z.object({
	name: z.string().min(3).max(20),
	imageUrl: z
		.url({ message: "Must be a valid URL" })
		.optional()
		.or(z.literal("").transform(() => undefined)),
});

export type UserMeta = z.infer<typeof UserMetaSchema>;

// TODO: Refine password === confirmPassword
export const SignUpSchema = z.object({
	name: UserMetaSchema.shape.name,
	email: z.email(),
	password: z.string().min(8),
	confirmPassword: z.string(),
});

export type SignUpSchema = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
	email: z.email(),
	password: z.string(),
});

export type SignInSchema = z.infer<typeof SignInSchema>;
