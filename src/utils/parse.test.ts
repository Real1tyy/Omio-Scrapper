import fs from 'fs';
import path from 'path';
import { parseResults } from './parse.js';
describe('parseResults', () => {
  it('should parse the example response without throwing an error and return 71 results of type Result', () => {
    const filePath = path.join(__dirname, '../../data/example_response.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');

    const results = parseResults(jsonData);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    expect(results.length).toBe(71);

    results.forEach((result) => {
      expect(result).toHaveProperty('companyId');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('departureTime');
      expect(result).toHaveProperty('arrivalTime');
      expect(result).toHaveProperty('stops');
      expect(result).toHaveProperty('mode');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('originalPrice');
      expect(result).toHaveProperty('ticketsLeft');
    });
  });
});
