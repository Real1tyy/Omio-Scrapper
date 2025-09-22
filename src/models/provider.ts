import { z } from "zod";

export const providerSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
});

export type Provider = z.infer<typeof providerSchema>;
