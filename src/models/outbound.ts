import { z } from 'zod';

export const outboundSchema = z
	.object({
		companyId: z.string(),
		duration: z.string(),
		departureTime: z.string(),
		arrivalTime: z.string(),
		stops: z.string(),
		mode: z.string(),
		price: z.number(),
		originalPrice: z.number().optional(),
		ticketsLeft: z.number(),
		journeyId: z.string(),
		outboundId: z.string(),
		serviceProviderIds: z.array(z.string()),
		ticketsSellingCompanies: z.array(z.string()),
		segments: z.preprocess((val) => {
			if (Array.isArray(val) && val.length > 0) {
				return val.map((segment) => segment.toString());
			}
			throw new Error(
				`Invalid segments format: ${JSON.stringify(val)}. Expected a non-empty array of numbers.`,
			);
		}, z.array(z.string())),
		status: z.string(),
	})
	.strip();

export type Outbound = z.infer<typeof outboundSchema>;
