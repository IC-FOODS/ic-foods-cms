import Papa from 'papaparse';

/**
 * Parses a CSV file and returns an array of objects
 * @param {string} csvText - The CSV file content as text
 * @returns {Array<Object>} Array of objects with keys from CSV headers
 */
export function parseCSV(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  if (result.errors.length > 0) {
    console.warn('CSV parsing errors:', result.errors);
  }

  return result.data;
}

/**
 * Fetches and parses a CSV file
 * @param {string} csvPath - Path to the CSV file
 * @returns {Promise<Array<Object>>} Promise that resolves to parsed CSV data
 */
export async function fetchAndParseCSV(csvPath) {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Error loading CSV from ${csvPath}:`, error);
    return [];
  }
}

