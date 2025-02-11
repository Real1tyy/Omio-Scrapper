import { Result, resultSchema } from '../models/result.js';

/**
 * Parses the full JSON response, extracts the 'outbounds'
 * object, and returns an array of validated Result objects.
 *
 * @param body - The full response body, either as a string or a Buffer.
 * @returns An array of Result objects.
 * @throws Error if the JSON is invalid or the expected structure is not found.
 */
export function parseResults(body: string): Result[] {
  try {
    const data = JSON.parse(body);
    if (!('outbounds' in data)) {
      throw new Error("Invalid JSON structure: 'outbounds' field is missing or is not an object.");
    }
    const outboundsObject = data.outbounds;
    const results: Result[] = Object.values(outboundsObject).map((item) =>
      resultSchema.parse(item),
    );
    return results;
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error}`);
  }
}
