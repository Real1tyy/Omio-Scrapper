import { z } from 'zod';
import { companySchema } from './company.js';
import { outboundSchema } from './outbound.js';
import { positionSchema } from './positions.js';
import { providerSchema } from './provider.js';
import { segmentSchema } from './segment.js';

export const responseSchema = z
	.object({
		serviceVersion: z.string(),
		outbounds: z.preprocess(
			(val) => (val && typeof val === 'object' ? Object.values(val) : val),
			z.array(outboundSchema),
		),
		companies: z.preprocess(
			(val) => (val && typeof val === 'object' ? Object.values(val) : val),
			z.array(companySchema),
		),
		positions: z.preprocess(
			(val) =>
				val && typeof val === 'object'
					? Object.entries(val).map(([key, pos]) => ({ ...pos, id: key }))
					: val,
			z.array(positionSchema),
		),
		providers: z.preprocess(
			(val) =>
				val && typeof val === 'object'
					? Object.entries(val).map(([key, pos]) => ({ ...pos, id: key }))
					: val,
			z.array(providerSchema),
		),
		segmentDetails: z.preprocess(
			(val) =>
				val && typeof val === 'object'
					? Object.entries(val).map(([key, pos]) => ({ ...pos, id: key }))
					: val,
			z.array(segmentSchema),
		),
	})
	.strip();

export type Response = z.infer<typeof responseSchema>;
