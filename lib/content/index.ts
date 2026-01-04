import { readCSV } from "./csv";
import {
  validateTeamMember,
  validateProject,
  validateEvent,
  validateMedia,
  validatePress,
  validateResource,
  validateGuideline,
  validateConference,
  validateConferenceProgramItem,
  validateConferenceVideo,
  validateConferenceSpeaker,
  validateAndDeduplicate,
} from "./validate";
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

let teamCache: TeamMember[] | null = null;
let projectsCache: Project[] | null = null;
let eventsCache: Event[] | null = null;
let mediaCache: Media[] | null = null;
let pressCache: Press[] | null = null;
let resourcesCache: Resource[] | null = null;

export function getTeam(): TeamMember[] {
  if (teamCache === null) {
    const raw = readCSV<Record<string, string>>("team.csv");
    teamCache = validateAndDeduplicate<TeamMember>(raw, validateTeamMember, "team");
  }
  return teamCache;
}

export function getProjects(): Project[] {
  if (projectsCache === null) {
    const raw = readCSV<Record<string, string>>("projects.csv");
    projectsCache = validateAndDeduplicate<Project>(raw, validateProject, "projects");
  }
  return projectsCache;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getEvents(): Event[] {
  if (eventsCache === null) {
    const raw = readCSV<Record<string, string>>("events.csv");
    eventsCache = validateAndDeduplicate<Event>(raw, validateEvent, "events");
  }
  return eventsCache;
}

export function getEventBySlug(slug: string): Event | undefined {
  return getEvents().find((event) => event.slug === slug);
}

export function getMedia(): Media[] {
  if (mediaCache === null) {
    const raw = readCSV<Record<string, string>>("media.csv");
    mediaCache = validateAndDeduplicate<Media>(raw, validateMedia, "media");
  }
  return mediaCache;
}

export function getPress(): Press[] {
  if (pressCache === null) {
    const raw = readCSV<Record<string, string>>("press.csv");
    pressCache = validateAndDeduplicate<Press>(raw, validatePress, "press");
  }
  return pressCache;
}

export function getResources(): Resource[] {
  if (resourcesCache === null) {
    const raw = readCSV<Record<string, string>>("resources.csv");
    resourcesCache = validateAndDeduplicate<Resource>(raw, validateResource, "resources");
  }
  return resourcesCache;
}

let guidelinesCache: Guideline[] | null = null;

export function getGuidelines(): Guideline[] {
  if (guidelinesCache === null) {
    const raw = readCSV<Record<string, string>>("guidelines.csv");
    guidelinesCache = validateAndDeduplicate<Guideline>(
      raw,
      validateGuideline,
      "guidelines"
    );
  }
  return guidelinesCache;
}

export function getGuidelineBySlug(slug: string): Guideline | undefined {
  return getGuidelines().find((guideline) => guideline.slug === slug);
}

let conferencesCache: Conference[] | null = null;

export function getConferences(): Conference[] {
  if (conferencesCache === null) {
    const raw = readCSV<Record<string, string>>("conferences.csv");
    conferencesCache = validateAndDeduplicate<Conference>(
      raw,
      validateConference,
      "conferences"
    );
  }
  return conferencesCache.sort((a, b) => b.year - a.year);
}

export function getConferenceByYear(year: number): Conference | undefined {
  return getConferences().find((conf) => conf.year === year);
}

let conferenceProgramCache: Map<number, ConferenceProgramItem[]> = new Map();

export function getConferenceProgram(year: number): ConferenceProgramItem[] {
  if (!conferenceProgramCache.has(year)) {
    const raw = readCSV<Record<string, string>>("conference_program_items.csv");
    const allItems = raw.map((item) =>
      validateConferenceProgramItem(item)
    ) as ConferenceProgramItem[];
    const yearItems = allItems.filter((item) => item.year === year);
    conferenceProgramCache.set(year, yearItems);
  }
  return conferenceProgramCache.get(year) || [];
}

let conferenceVideosCache: Map<number, ConferenceVideo[]> = new Map();

export function getConferenceVideos(year: number): ConferenceVideo[] {
  if (!conferenceVideosCache.has(year)) {
    const raw = readCSV<Record<string, string>>("conference_videos.csv");
    const allVideos = raw.map((item) =>
      validateConferenceVideo(item)
    ) as ConferenceVideo[];
    const yearVideos = allVideos.filter((video) => video.year === year);
    conferenceVideosCache.set(year, yearVideos);
  }
  return conferenceVideosCache.get(year) || [];
}

let conferenceSpeakersCache: Map<number, ConferenceSpeaker[]> = new Map();

export function getConferenceSpeakers(year: number): ConferenceSpeaker[] {
  if (!conferenceSpeakersCache.has(year)) {
    const raw = readCSV<Record<string, string>>("conference_speakers.csv");
    const allSpeakers = raw.map((item) =>
      validateConferenceSpeaker(item)
    ) as ConferenceSpeaker[];
    const yearSpeakers = allSpeakers.filter((speaker) => speaker.year === year);
    conferenceSpeakersCache.set(year, yearSpeakers);
  }
  return conferenceSpeakersCache.get(year) || [];
}
