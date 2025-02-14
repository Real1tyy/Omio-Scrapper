import fs from 'fs';
import path from 'path';
import { expect } from 'playwright/test';
import { Response } from '../models/response.js';
import { extractResults, parseResults } from './parse.js';

/**
 * Verifies that an object has a property with the expected length as an array.
 *
 * @param obj - The parsed response object.
 * @param propName - The property name.
 * @param expectedLength - Expected length of the array at that property.
 */
function expectArrayProperty(obj: Response, propName: string, expectedLength: number) {
	expect(obj).toHaveProperty(propName);
	const value = obj[propName as keyof Response];
	expect(Array.isArray(value)).toBe(true);
	expect(value.length).toBe(expectedLength);
}

/**
 * Helper function for running tests on a given response file.
 *
 * @param fileName - The name of the file under test.
 * @param expectedCounts - An object containing the expected counts for each property.
 */
function runParseAndExtractTests(
	fileName: string,
	expectedCounts: {
		outbounds: number;
		companies: number;
		positions: number;
		providers: number;
		segmentDetails: number;
		resultsCount: number;
	},
) {
	describe(`Tests for ${fileName}`, () => {
		const filePath = path.join(__dirname, '../../data', fileName);
		let jsonData: string;
		let parsedResponse: Response;

		beforeAll(() => {
			jsonData = fs.readFileSync(filePath, 'utf-8');
			parsedResponse = parseResults(jsonData);
		});

		it(`should parse ${fileName} without throwing an error and return valid arrays for the given properties`, () => {
			expect(parsedResponse).toBeDefined();
			expectArrayProperty(parsedResponse, 'outbounds', expectedCounts.outbounds);
			expectArrayProperty(parsedResponse, 'companies', expectedCounts.companies);
			expectArrayProperty(parsedResponse, 'positions', expectedCounts.positions);
			expectArrayProperty(parsedResponse, 'providers', expectedCounts.providers);
			expectArrayProperty(parsedResponse, 'segmentDetails', expectedCounts.segmentDetails);
		});

		it(`should extract ${expectedCounts.resultsCount} Result objects from ${fileName}`, () => {
			const results = extractResults(parsedResponse);
			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBe(expectedCounts.resultsCount);
		});
	});
}

describe('Response Parsing and Extraction Tests', () => {
	runParseAndExtractTests('example_response.json', {
		outbounds: 71,
		companies: 3,
		positions: 13,
		providers: 3,
		segmentDetails: 71,
		resultsCount: 71,
	});

	runParseAndExtractTests('example_response2.json', {
		outbounds: 89,
		companies: 4,
		positions: 14,
		providers: 3,
		segmentDetails: 96,
		resultsCount: 89,
	});

	runParseAndExtractTests('example_response3.json', {
		outbounds: 1,
		companies: 1,
		positions: 1,
		providers: 1,
		segmentDetails: 1,
		resultsCount: 1,
	});
});
