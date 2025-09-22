import { z } from "zod";

const companyCodeSchema = z.object({
	code: z.string(),
	type: z.string(),
});

export const companySchema = z.object({
	id: z.string(),
	name: z.string(),
	code: z.string(),
	logoUrl: z.string().optional(),
	companyCodes: z.array(companyCodeSchema).optional(),
});

export type Company = z.infer<typeof companySchema>;
