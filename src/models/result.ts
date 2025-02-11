import { z } from 'zod';

export const resultSchema = z
  .object({
    // Preprocess companyId to always be a string (whether it's a number or string in the API response)
    companyId: z.preprocess((val) => {
      if (typeof val === 'number' || typeof val === 'string') return val.toString();
      return val;
    }, z.string()),
    // Preprocess duration: if it's a string, convert to a number.
    duration: z.preprocess((val) => {
      if (typeof val === 'string') return Number(val);
      return val;
    }, z.number()),
    // Transform departureTime from string to Date
    departureTime: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
    // Transform arrivalTime from string to Date
    arrivalTime: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
    // Preprocess stops: if it's a string, convert to a number.
    stops: z.preprocess((val) => {
      if (typeof val === 'string') return Number(val);
      return val;
    }, z.number()),
    mode: z.string(),
    price: z.number(),
    originalPrice: z.number(),
    ticketsLeft: z.number(),
  })
  .strip(); // .strip() will remove any additional unexpected properties.

export type Result = z.infer<typeof resultSchema>;
