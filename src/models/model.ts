import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';
import { WebsiteSource } from '../constants/links.js';

// Zod schema for validation
export const Model = z.object({
  location: z.string(),
  sizeM2: z.number(),
  pricePerMonth: z.number(),
  rooms: z.string(),
  address: z.string().optional(),
  floor: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  source: z.string() as z.ZodType<WebsiteSource>,
  url: z.string().url(),
  availableFrom: z.string().optional(),
  deposit: z.number().optional(),
});

// TypeScript type derived from Zod schema
export type ModelType = z.infer<typeof Model>;

// TypeScript interface for HousePrice
export interface Model extends Document, ModelType {}

// Mongoose schema definition
const ModelSchema: Schema = new Schema<Model>({
  location: { type: String, required: true },
  sizeM2: { type: Number, required: true },
  pricePerMonth: { type: Number, required: true },
  rooms: { type: String, required: true },
  address: { type: String },
  floor: { type: String },
  amenities: { type: [String] },
  source: { type: String, required: true },
  url: { type: String, required: true },
  availableFrom: { type: String }, // New optional date parameter
  deposit: { type: Number }, // New optional deposit parameter
});

// Mongoose model export
export const ModelModel = mongoose.model<Model>('Model', ModelSchema);
