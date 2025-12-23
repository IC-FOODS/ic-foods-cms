import { fetchAndParseCSV } from './csvParser';

/**
 * Loads team data from CSV
 * @returns {Promise<Array>} Array of team member objects
 */
export async function loadTeamData() {
  return fetchAndParseCSV('/data/team.csv');
}

/**
 * Loads projects data from CSV
 * @returns {Promise<Array>} Array of project objects
 */
export async function loadProjectsData() {
  return fetchAndParseCSV('/data/projects.csv');
}

/**
 * Loads publications data from CSV
 * @returns {Promise<Array>} Array of publication objects
 */
export async function loadPublicationsData() {
  return fetchAndParseCSV('/data/publications.csv');
}

/**
 * Loads events data from CSV
 * @returns {Promise<Array>} Array of event objects
 */
export async function loadEventsData() {
  return fetchAndParseCSV('/data/events.csv');
}

/**
 * Formats a date string for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a year range for display
 * @param {string} startYear - Start year
 * @param {string} endYear - End year (optional)
 * @returns {string} Formatted year range
 */
export function formatYearRange(startYear, endYear) {
  if (!startYear) return '';
  if (!endYear) return startYear;
  return `${startYear} - ${endYear}`;
}

