import { z } from "zod";

export const positionSchema = z.object({
	id: z.string(),
	positionType: z.string(),
	name: z.string(),
	countryCode: z.string().optional(),
	cityName: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	ticketVendingMachine: z.boolean().optional(),
});

export type Position = z.infer<typeof positionSchema>;
