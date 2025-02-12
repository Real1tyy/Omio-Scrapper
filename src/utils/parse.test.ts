import fs from 'fs';
import path from 'path';
import { Response } from '../models/response.js';
import { prettifyResults } from '../models/result.js';
import { extractResults, parseResults } from './parse.js';

/**
 * Verifies that an object has a property with the expected length as an array.
 *
 * @param obj - The object to check.
 * @param propName - The property name.
 * @param expectedLength - Expected length of the array at that property.
 */
function expectArrayProperty(obj: Response, propName: string, expectedLength: number) {
	expect(obj).toHaveProperty(propName);
	const value = obj[propName as keyof Response];
	expect(Array.isArray(value)).toBe(true);
	expect(value.length).toBe(expectedLength);
}

describe('parseResults', () => {
	it('should parse the example response without throwing an error and return valid arrays for the given properties', () => {
		const filePath = path.join(__dirname, '../../data/example_response.json');
		const jsonData = fs.readFileSync(filePath, 'utf-8');
		const results = parseResults(jsonData);

		expect(results).toBeDefined();
		expectArrayProperty(results, 'outbounds', 71);
		expectArrayProperty(results, 'companies', 3);
		expectArrayProperty(results, 'positions', 13);
		expectArrayProperty(results, 'providers', 3);
		expectArrayProperty(results, 'segmentDetails', 71);
	});
});

describe('Extract Results', () => {
	it('should extract 71 Result objects from the parsed response', () => {
		const filePath = path.join(__dirname, '../../data/example_response.json');
		const jsonData = fs.readFileSync(filePath, 'utf-8');
		const parsedResponse: Response = parseResults(jsonData);
		const results = extractResults(parsedResponse);
		console.log(prettifyResults(results));

		expect(Array.isArray(results)).toBe(true);
		expect(results.length).toBe(71);
	});
});
