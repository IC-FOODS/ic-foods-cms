import fs from "fs";
import path from "path";
import type {
  TeamMember,
  Project,
  Event,
  Media,
  Press,
  Resource,
  Guideline,
  Conference,
  ConferenceProgramItem,
  ConferenceVideo,
  ConferenceSpeaker,
} from "./types";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;

function parseTags(tags: string | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function validateDate(date: string, fieldName: string): void {
  if (!ISO_DATE_REGEX.test(date)) {
    throw new Error(
      `Invalid date format in ${fieldName}: ${date}. Expected ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)`
    );
  }
}

function validateSlugUniqueness<T extends { slug: string }>(
  items: T[],
  type: string
): void {
  const slugs = items.map((item) => item.slug);
  const duplicates = slugs.filter(
    (slug, index) => slugs.indexOf(slug) !== index
  );
  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate slugs found in ${type}: ${duplicates.join(", ")}`
    );
  }
}

function validateRequiredFields<T extends Record<string, unknown>>(
  item: T,
  requiredFields: string[],
  type: string
): void {
  const missing = requiredFields.filter(
    (field) => !item[field] || String(item[field]).trim() === ""
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing required fields in ${type}: ${missing.join(", ")}`
    );
  }
}

export function validateTeamMember(row: Record<string, string>): TeamMember {
  validateRequiredFields(
    row,
    ["name", "slug", "title", "summary", "description", "updated_at"],
    "team member"
  );
  validateDate(row.updated_at, "updated_at");

  return {
    name: row.name,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    tags: parseTags(row.tags),
    updated_at: row.updated_at,
  };
}

export function validateProject(row: Record<string, string>): Project {
  validateRequiredFields(
    row,
    ["title", "slug", "summary", "description", "updated_at"],
    "project"
  );
  validateDate(row.updated_at, "updated_at");

  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    tags: parseTags(row.tags),
    updated_at: row.updated_at,
    seo_title: row.seo_title || undefined,
    seo_description: row.seo_description || undefined,
    image_url: row.image_url || undefined,
    featured: row.featured === "true" || row.featured === "1",
  };
}

export function validateEvent(row: Record<string, string>): Event {
  validateRequiredFields(
    row,
    ["title", "slug", "summary", "description", "start_date", "updated_at"],
    "event"
  );
  validateDate(row.start_date, "start_date");
  if (row.end_date) {
    validateDate(row.end_date, "end_date");
  }
  validateDate(row.updated_at, "updated_at");

  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    start_date: row.start_date,
    end_date: row.end_date || undefined,
    tags: parseTags(row.tags),
    updated_at: row.updated_at,
    seo_title: row.seo_title || undefined,
    seo_description: row.seo_description || undefined,
    image_url: row.image_url || undefined,
    featured: row.featured === "true" || row.featured === "1",
  };
}

export function validateMedia(row: Record<string, string>): Media {
  validateRequiredFields(
    row,
    ["title", "slug", "summary", "description", "url", "type", "updated_at"],
    "media"
  );
  if (!["video", "podcast", "article"].includes(row.type)) {
    throw new Error(
      `Invalid media type: ${row.type}. Must be one of: video, podcast, article`
    );
  }
  validateDate(row.updated_at, "updated_at");

  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    url: row.url,
    type: row.type as "video" | "podcast" | "article",
    tags: parseTags(row.tags),
    updated_at: row.updated_at,
    seo_title: row.seo_title || undefined,
    seo_description: row.seo_description || undefined,
    image_url: row.image_url || undefined,
    featured: row.featured === "true" || row.featured === "1",
  };
}

export function validatePress(row: Record<string, string>): Press {
  validateRequiredFields(
    row,
    [
      "title",
      "slug",
      "summary",
      "description",
      "publication",
      "url",
      "updated_at",
    ],
    "press"
  );
  validateDate(row.updated_at, "updated_at");

  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    publication: row.publication,
    url: row.url,
    tags: parseTags(row.tags),
    updated_at: row.updated_at,
  };
}

export function validateResource(row: Record<string, string>): Resource {
  validateRequiredFields(
    row,
    [
      "title",
      "slug",
      "summary",
      "description",
      "file_url",
      "category",
      "updated_at",
    ],
    "resource"
  );
  validateDate(row.updated_at, "updated_at");

  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    file_url: row.file_url,
    category: row.category,
    tags: parseTags(row.tags),
    updated_at: row.updated_at,
    seo_title: row.seo_title || undefined,
    seo_description: row.seo_description || undefined,
    image_url: row.image_url || undefined,
    featured: row.featured === "true" || row.featured === "1",
  };
}

function validateURL(url: string, fieldName: string): void {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(
      `Invalid URL format in ${fieldName}: ${url}. Must start with http:// or https://`
    );
  }
}

function validateYear(year: string, fieldName: string): number {
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum) || yearNum < 1000 || yearNum > 9999) {
    throw new Error(
      `Invalid year in ${fieldName}: ${year}. Must be a 4-digit number`
    );
  }
  return yearNum;
}

function validateFileExists(filePath: string): void {
  // Paths in CSV are relative to content/ directory
  const contentDir = path.join(process.cwd(), "content");
  const fullPath = path.join(contentDir, filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Content file not found: ${filePath}`);
  }
}

export function validateGuideline(row: Record<string, string>): Guideline {
  validateRequiredFields(
    row,
    ["title", "slug", "summary", "content_path", "updated_at"],
    "guideline"
  );
  validateDate(row.updated_at, "updated_at");
  validateFileExists(row.content_path);

  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content_path: row.content_path,
    tags: parseTags(row.tags),
    updated_at: row.updated_at,
  };
}

export function validateConference(row: Record<string, string>): Conference {
  validateRequiredFields(
    row,
    [
      "year",
      "theme",
      "location",
      "start_date",
      "end_date",
      "summary",
      "updated_at",
    ],
    "conference"
  );
  const year = validateYear(row.year, "year");
  validateDate(row.start_date, "start_date");
  validateDate(row.end_date, "end_date");
  validateDate(row.updated_at, "updated_at");

  return {
    year,
    theme: row.theme,
    location: row.location,
    start_date: row.start_date,
    end_date: row.end_date,
    summary: row.summary,
    updated_at: row.updated_at,
  };
}

export function validateConferenceProgramItem(
  row: Record<string, string>
): ConferenceProgramItem {
  validateRequiredFields(
    row,
    ["year", "day_label", "start_time", "end_time", "title", "speaker_names"],
    "conference program item"
  );
  const year = validateYear(row.year, "year");

  return {
    year,
    day_label: row.day_label,
    start_time: row.start_time,
    end_time: row.end_time,
    title: row.title,
    speaker_names: row.speaker_names,
    track: row.track || undefined,
    type: row.type || undefined,
    tags: row.tags || undefined,
  };
}

export function validateConferenceVideo(
  row: Record<string, string>
): ConferenceVideo {
  validateRequiredFields(
    row,
    ["year", "title", "url", "updated_at"],
    "conference video"
  );
  const year = validateYear(row.year, "year");
  validateURL(row.url, "url");
  validateDate(row.updated_at, "updated_at");

  return {
    year,
    title: row.title,
    url: row.url,
    speaker: row.speaker || undefined,
    tags: row.tags ? parseTags(row.tags) : undefined,
    updated_at: row.updated_at,
  };
}

export function validateConferenceSpeaker(
  row: Record<string, string>
): ConferenceSpeaker {
  validateRequiredFields(
    row,
    ["year", "name", "updated_at"],
    "conference speaker"
  );
  const year = validateYear(row.year, "year");
  validateDate(row.updated_at, "updated_at");
  if (row.url) {
    validateURL(row.url, "url");
  }

  return {
    year,
    name: row.name,
    role: row.role || undefined,
    org: row.org || undefined,
    bio_short: row.bio_short || undefined,
    url: row.url || undefined,
    tags: row.tags ? parseTags(row.tags) : undefined,
    updated_at: row.updated_at,
  };
}

export function validateAndDeduplicate<T extends object>(
  items: Record<string, string>[],
  validator: (row: Record<string, string>) => T,
  type: string
): T[] {
  const validated = items.map((item, index) => {
    try {
      return validator(item);
    } catch (error) {
      throw new Error(
        `Validation error in ${type} row ${index + 1}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });

  if (validated.length > 0 && "slug" in validated[0]) {
    validateSlugUniqueness(validated as Array<T & { slug: string }>, type);
  }

  return validated;
}
