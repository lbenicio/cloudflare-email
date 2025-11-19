import { z } from 'zod';

const iContactSchema = z.union([
	z.string(),
	z.object({
		email: z.string(),
		name: z.union([z.string(), z.undefined()]),
	}),
]);

const iEmailSchema = z
	.object({
		from: iContactSchema,
		subject: z.string().min(1),
		text: z.string().optional(),
		html: z.string().optional(),
	})
	.refine((data) => data.text || data.html, {
		message: 'Either "text" or "html" must be provided.',
		path: ['text'],
	});

export type IContact = z.infer<typeof iContactSchema>;
export type IEmail = z.infer<typeof iEmailSchema>;
export default iEmailSchema;
