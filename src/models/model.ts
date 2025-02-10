import { z } from 'zod';

export const TravelModel = z.object({
  from: z.string(),
  to: z.string(),
  date: z.date(),
});

// TypeScript type derived from Zod schema
export type TravelModelType = z.infer<typeof TravelModel>;

// TypeScript interface
export interface Travel extends Document, TravelModelType {}
