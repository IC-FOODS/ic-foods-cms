/**
 * React hook for fetching Wagtail CMS page content via the API.
 *
 * Usage:
 *   const { page, loading, error } = useCmsPage('about');
 *   const { page, loading } = useCmsPage(4);  // by ID
 *
 * The hook caches responses in memory so repeated renders don't re-fetch.
 * In development, the Vite proxy forwards /api → Django.
 * In production, set VITE_CMS_API_URL to the Django host.
 */
import { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_CMS_API_URL || '';

// Simple in-memory cache keyed by page slug or id
const pageCache: Record<string, { data: any; ts: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface CmsPageMeta {
  type: string;
  slug: string;
  detail_url: string;
  html_url: string;
  first_published_at: string;
  search_description?: string;
  seo_title?: string;
  show_in_menus?: boolean;
}

export interface CmsPage {
  id: number;
  meta: CmsPageMeta;
  title: string;
  [key: string]: any;
}

interface UseCmsPageResult {
  page: CmsPage | null;
  loading: boolean;
  error: string | null;
}

async function fetchPageBySlug(slug: string): Promise<CmsPage> {
  const listRes = await fetch(
    `${API_BASE}/api/cms/pages/?slug=${encodeURIComponent(slug)}&fields=*&format=json`
  );
  if (!listRes.ok) throw new Error(`CMS API error: ${listRes.status}`);
  const listData = await listRes.json();
  if (!listData.items || listData.items.length === 0) {
    throw new Error(`Page not found: slug="${slug}"`);
  }
  // The list endpoint with fields=* returns full detail for each item
  return listData.items[0];
}

async function fetchPageById(id: number): Promise<CmsPage> {
  const res = await fetch(`${API_BASE}/api/cms/pages/${id}/?format=json`);
  if (!res.ok) throw new Error(`CMS API error: ${res.status}`);
  return res.json();
}

export function useCmsPage(slugOrId: string | number): UseCmsPageResult {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const cacheKey = String(slugOrId);

    // Check cache
    const cached = pageCache[cacheKey];
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      setPage(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const doFetch = async () => {
      try {
        const result =
          typeof slugOrId === 'number'
            ? await fetchPageById(slugOrId)
            : await fetchPageBySlug(slugOrId);

        pageCache[cacheKey] = { data: result, ts: Date.now() };
        setPage(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load CMS content');
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    doFetch();

    return () => {
      abortRef.current?.abort();
    };
  }, [slugOrId]);

  return { page, loading, error };
}

/**
 * Fetch all child pages of a given parent (e.g. all ProjectPages under Research).
 */
export function useCmsChildren(parentId: number | null) {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parentId === null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const doFetch = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/cms/pages/?child_of=${parentId}&fields=*&format=json`
        );
        if (!res.ok) throw new Error(`CMS API error: ${res.status}`);
        const data = await res.json();
        setPages(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [parentId]);

  return { pages, loading, error };
}

/**
 * Strip HTML tags from a rich text string, returning plain text.
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/**
 * Render rich text HTML safely. Returns an object for dangerouslySetInnerHTML.
 */
export function richTextHtml(html: string) {
  return { __html: html || '' };
}

/**
 * Fetch snippets from the CMS API (Research Areas, Resources, Publications, etc.)
 */
export interface CmsSnippet {
  id: number;
  name?: string;
  title?: string;
  slug: string;
  [key: string]: any;
}

interface UseSnippetsResult {
  items: CmsSnippet[];
  loading: boolean;
  error: string | null;
}

// Cache for snippets
const snippetCache: Record<string, { data: CmsSnippet[]; ts: number }> = {};

export function useCmsSnippets(snippetType: 'research_areas' | 'resources' | 'publications' | 'organizations' | 'individuals'): UseSnippetsResult {
  const [items, setItems] = useState<CmsSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = snippetType;
    const cached = snippetCache[cacheKey];
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      setItems(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const doFetch = async () => {
      try {
        // Map snippet type to API endpoint
        const endpointMap: Record<string, string> = {
          research_areas: 'researcharea',
          resources: 'resource',
          publications: 'publication',
          organizations: 'organization',
          individuals: 'individual',
        };
        const endpoint = endpointMap[snippetType] || snippetType;
        
        const res = await fetch(
          `${API_BASE}/api/cms/snippets/graphs.${endpoint}/?format=json`
        );
        if (!res.ok) throw new Error(`CMS API error: ${res.status}`);
        const data = await res.json();
        const fetchedItems = data.items || [];
        snippetCache[cacheKey] = { data: fetchedItems, ts: Date.now() };
        setItems(fetchedItems);
      } catch (err: any) {
        setError(err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [snippetType]);

  return { items, loading, error };
}

/**
 * Fetch R&D Projects (child pages of Research Index Page)
 */
export function useRdProjects() {
  const { page: researchPage } = useCmsPage('projects');
  const parentId = researchPage?.id || null;
  return useCmsChildren(parentId);
}
