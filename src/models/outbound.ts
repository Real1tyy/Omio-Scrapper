import { z } from 'zod';

export const outboundSchema = z
	.object({
		companyId: z.string(),
		duration: z.string(),
		departureTime: z.preprocess(
			(val) => (typeof val === 'string' ? new Date(val) : val),
			z.date(),
		),
		arrivalTime: z.preprocess(
			(val) => (typeof val === 'string' ? new Date(val) : val),
			z.date(),
		),
		stops: z.string(),
		mode: z.string(),
		price: z.number(),
		originalPrice: z.number(),
		ticketsLeft: z.number(),
		journeyId: z.string(),
		outboundId: z.string(),
		serviceProviderIds: z.array(z.string()),
		ticketsSellingCompanies: z.array(z.string()),
		segments: z.preprocess((val) => {
			if (Array.isArray(val) && val.length === 1 && typeof val[0] === 'number') {
				return val[0].toString();
			}
			throw new Error(
				`Invalid segments format: ${JSON.stringify(val)}. Expected a single number or an array containing a single number.`,
			);
		}, z.string()),
		status: z.string(),
	})
	.strip();

export type Outbound = z.infer<typeof outboundSchema>;
