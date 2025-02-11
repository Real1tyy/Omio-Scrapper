import { z } from 'zod';
import { companySchema } from './company.js';
import { positionSchema } from './positions.js';
import { resultSchema } from './result.js';

export const responseSchema = z.object({
  serviceVersion: z.string(),
  outbounds: z.record(resultSchema),
  companies: z.record(companySchema),
  positions: z.record(positionSchema),
  //   providers: z.record(providerSchema),
  //   translations: z.record(z.string()),
  //   showRoutedConnectionTip: z.boolean(),
});

export type Response = z.infer<typeof responseSchema>;
