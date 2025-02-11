import { z } from 'zod';

export const positionSchema = z.object({
  id: z.string(),
  positionType: z.string(),
  name: z.string(),
  countryCode: z.string(),
  cityName: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  ticketVendingMachine: z.boolean().optional(),
});

export type Position = z.infer<typeof positionSchema>;
