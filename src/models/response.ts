import { z } from 'zod';
import { companySchema } from './company.js';
import { outboundSchema } from './outbound.js';
import { positionSchema } from './positions.js';
import { providerSchema } from './provider.js';
import { segmentSchema } from './segment.js';

// Helper function to convert an object to an array of values
const objectValuesToArray = (val: unknown) => {
	return val && typeof val === 'object' ? Object.values(val) : val;
};

// Helper function to convert an object to an array of objects with an 'id' field
const objectEntriesWithIdToArray = (val: unknown) => {
	return val && typeof val === 'object'
		? Object.entries(val).map(([key, item]) => ({ ...item, id: key }))
		: val;
};

export const responseSchema = z
	.object({
		serviceVersion: z.string(),
		outbounds: z.preprocess(objectValuesToArray, z.array(outboundSchema)),
		companies: z.preprocess(objectValuesToArray, z.array(companySchema)),
		positions: z.preprocess(objectEntriesWithIdToArray, z.array(positionSchema)),
		providers: z.preprocess(objectEntriesWithIdToArray, z.array(providerSchema)),
		segmentDetails: z.preprocess(objectEntriesWithIdToArray, z.array(segmentSchema)),
	})
	.strip();

export type Response = z.infer<typeof responseSchema>;
