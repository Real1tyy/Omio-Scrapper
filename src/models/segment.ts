import { z } from 'zod';

export const segmentSchema = z.object({
	id: z.string(),
	type: z.string(),
	departureTime: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
	departureZoneId: z.string(),
	arrivalTime: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
	arrivalZoneId: z.string(),
	departurePosition: z.string(),
	arrivalPosition: z.string(),
	duration: z.string(),
	company: z.string(),
	marketingCompany: z.string(),
	transportId: z.string().optional(),
	direction: z.string(),
});

export type Segment = z.infer<typeof segmentSchema>;
