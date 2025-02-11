import { z } from 'zod';

export const resultSchema = z
  .object({
    companyId: z.string(),
    duration: z.string(),
    departureTime: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
    arrivalTime: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
    stops: z.string(),
    mode: z.string(),
    price: z.number(),
    originalPrice: z.number(),
    ticketsLeft: z.number(),
    journeyId: z.string(),
    outboundId: z.string(),
    ticketsSellingCompanies: z.array(z.string()),
    segments: z.array(z.number()),
    status: z.string(),
  })
  .strip();

export type Result = z.infer<typeof resultSchema>;
