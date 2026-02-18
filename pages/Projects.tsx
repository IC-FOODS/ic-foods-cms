import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Database,
  ExternalLink,
  FileText,
  Folder,
  Glasses,
  GraduationCap,
  Globe,
  Library,
  LucideIcon,
  X,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { richTextHtml, stripHtml, useCmsPage } from '../lib/useCmsPage';

type TabPanel = {
  id: number;
  panel_id: number;
  panel: {
    title: string;
    slug: string;
    panel_type: 'research_area' | 'project' | 'general' | string;
    description: string;
    entities?: Array<{
      id: number;
      kind: string;
      title: string;
      slug: string;
      summary?: string;
      thumbnail_url?: string;
    }>;
    publications?: Array<{
      id: number;
      publication_id: number;
      title: string;
      slug: string;
      subtitle?: string;
      journal?: string;
      volume?: string;
      pages?: string;
      authors?: string;
      publication_type?: string;
      publication_year?: number;
      summary?: string;
      abstract?: string;
      linked_authors?: Array<{
        id: number;
        name: string;
        slug: string;
        orcid?: string;
        author_order?: number;
        thumbnail_url?: string;
      }>;
      links?: Array<{ kind?: string; label: string; url: string }>;
    }>;
    external_links?: Array<{ id: number; label: string; url: string }>;
  };
};

type PanelTab = {
  id: number;
  title: string;
  icon?: string;
  heading?: string;
  image_url?: string;
  panels_across?: number;
  panels: TabPanel[];
};

type TabbedPanelPagePayload = {
  hero_title?: string;
  intro?: string;
  get_tabs_data?: PanelTab[];
};

const TAB_ICON_MAP: Record<string, LucideIcon> = {
  'clipboard-check': ClipboardCheck,
  clipboardcheck: ClipboardCheck,
  glasses: Glasses,
  library: Library,
  folder: Folder,
};

const getTabIcon = (tab: PanelTab): LucideIcon => {
  const title = (tab.title || '').toLowerCase();
  if (title.includes('research') && title.includes('area')) {
    return Glasses;
  }
  if (title.includes('project')) {
    return ClipboardCheck;
  }
  const key = (tab.icon || 'folder').toLowerCase();
  return TAB_ICON_MAP[key] || Folder;
};

const PANEL_ICON_MAP: Record<string, LucideIcon> = {
  research_area: Glasses,
  project: ClipboardCheck,
  publication: BookOpen,
  general: FileText,
};

const sentenceSummary = (text: string, maxSentences = 3): string => {
  const cleaned = (text || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  const parts = cleaned.split(/(?<=[.!?])\s+/);
  return parts.slice(0, maxSentences).join(' ').trim();
};

const displayPublicationTitle = (rawTitle: string): string => {
  const title = (rawTitle || '').trim();
  if (!title) return '';
  // If a full citation slipped through, try stripping the leading author+year.
  const m = title.match(/^\s*.+?\((19|20)\d{2}[^)]*\)\.?\s*(.+)$/);
  if (m && m[2]) {
    return m[2].trim();
  }
  return title;
};

const classifyLink = (label?: string, url?: string): 'doi' | 'pubmed' | 'semantic' | 'scholar' | 'publisher' | 'document' | 'external' => {
  const haystack = `${label || ''} ${url || ''}`.toLowerCase();
  if (haystack.includes('doi.org') || haystack.includes(' doi')) return 'doi';
  if (haystack.includes('pubmed')) return 'pubmed';
  if (haystack.includes('semanticscholar') || haystack.includes('semantic scholar')) return 'semantic';
  if (haystack.includes('scholar.google') || haystack.includes('google scholar')) return 'scholar';
  if (haystack.includes('.pdf') || haystack.includes('/media/documents/')) return 'document';
  if (haystack.includes('publisher')) return 'publisher';
  return 'external';
};

const LINK_ICON_MAP: Record<string, LucideIcon> = {
  doi: FileText,
  pubmed: BookOpen,
  semantic: Database,
  scholar: GraduationCap,
  publisher: Globe,
  document: FileText,
  external: ExternalLink,
};

const LINK_LABEL_MAP: Record<string, string> = {
  doi: 'DOI',
  pubmed: 'PubMed',
  semantic: 'Semantic Scholar',
  scholar: 'Google Scholar',
  publisher: 'Publisher',
  document: 'Document',
  external: 'External Link',
};

const normalizeUrl = (url: string): string => {
  if (!url) return '#';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const normalizeOrcidUrl = (orcid?: string): string => {
  const value = (orcid || '').trim();
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://orcid.org/${value}`;
};

const gridClassFor = (panelsAcross?: number): string => {
  switch (panelsAcross) {
    case 1:
      return 'grid grid-cols-1 gap-8';
    case 2:
      return 'grid grid-cols-1 md:grid-cols-2 gap-8';
    case 4:
      return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8';
    case 3:
    default:
      return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8';
  }
};

const Projects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabbedPage, setTabbedPage] = useState<TabbedPanelPagePayload | null>(null);
  const [tabbedLoading, setTabbedLoading] = useState(true);
  const [tabbedError, setTabbedError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadTabbedPage = async () => {
      try {
        setTabbedLoading(true);
        setTabbedError(null);
        const apiBase = (import.meta.env.VITE_CMS_API_URL || '').replace(/\/$/, '');
        const endpoint = apiBase
          ? `${apiBase}/api/cms/pages/`
          : '/api/cms/pages/';
        const query =
          '?slug=projects-panels&type=graphs.TabbedPanelPage&fields=hero_title,intro,get_tabs_data&format=json';
        const res = await fetch(`${endpoint}${query}`, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`CMS API error: ${res.status}`);
        }
        const data = await res.json();
        const item = data?.items?.[0] || null;
        setTabbedPage(item);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setTabbedError(err?.message || 'Failed to load tabbed page');
        }
      } finally {
        setTabbedLoading(false);
      }
    };

    loadTabbedPage();
    return () => controller.abort();
  }, []);

  const {
    page: legacyPage,
  } = useCmsPage('projects');

  const tabs: PanelTab[] = useMemo(
    () => (Array.isArray(tabbedPage?.get_tabs_data) ? tabbedPage.get_tabs_data : []),
    [tabbedPage]
  );

  const [activeTabId, setActiveTabId] = useState<string>('');
  const [selectedPanel, setSelectedPanel] = useState<TabPanel['panel'] | null>(null);

  useEffect(() => {
    if (!tabs.length) {
      return;
    }
    const requestedTab = (searchParams.get('tab') || '').toLowerCase().trim();
    const matchedById = tabs.find((tab) => String(tab.id) === requestedTab);
    const matchedByTitle = tabs.find((tab) => (tab.title || '').toLowerCase() === requestedTab);
    const matchedBySlugTitle = tabs.find(
      (tab) => (tab.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === requestedTab
    );
    const requested = matchedById || matchedByTitle || matchedBySlugTitle;

    if (requested) {
      const requestedId = String(requested.id);
      if (activeTabId !== requestedId) {
        setActiveTabId(requestedId);
      }
      return;
    }

    const stillValid = tabs.some((tab) => String(tab.id) === activeTabId);
    if (!stillValid) {
      setActiveTabId(String(tabs[0].id));
    }
  }, [tabs, activeTabId, searchParams]);

  const activeTab = tabs.find((tab) => String(tab.id) === activeTabId) || tabs[0] || null;

  const heroTitle =
    tabbedPage?.hero_title || legacyPage?.hero_title || 'Research & Development';
  const heroSubtitle = tabbedPage?.intro
    ? stripHtml(tabbedPage.intro)
    : legacyPage?.hero_subtitle
      ? stripHtml(legacyPage.hero_subtitle)
      : "IC-FOODS standardizes food data so that the entire food system-from the farmer's field to the consumer's health-is more transparent, efficient, and data-driven.";

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="ucd-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl text-gray-200 max-w-2xl">{heroSubtitle}</p>
        </div>
      </div>

      <div className="sticky top-20 bg-white border-b border-gray-200 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = getTabIcon(tab);
              const isActive = String(activeTab?.id) === String(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTabId(String(tab.id));
                    const slugTitle = (tab.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    const next = new URLSearchParams(searchParams);
                    next.set('tab', slugTitle);
                    setSearchParams(next, { replace: true });
                  }}
                  className={`flex items-center space-x-2 py-6 border-b-2 font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-aggie-gold text-aggie-blue'
                      : 'border-transparent text-gray-400 hover:text-aggie-blueLight'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {tabbedLoading ? (
          <div className="text-center py-12 text-gray-500">Loading research content...</div>
        ) : tabbedError ? (
          <div className="text-center py-12 text-gray-500">Unable to load tabbed content from CMS.</div>
        ) : !activeTab ? (
          <div className="text-center py-12 text-gray-500">No tabbed content configured.</div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab.heading ? (
              <div
                className="mb-8 text-gray-600"
                dangerouslySetInnerHTML={richTextHtml(activeTab.heading)}
              />
            ) : null}

            {activeTab.panels.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No content available in this tab.</div>
            ) : (
              <div className={gridClassFor(activeTab.panels_across)}>
                {activeTab.panels.map((placement) => {
                  const panel = placement.panel;
                  const PanelIcon = PANEL_ICON_MAP[panel.panel_type] || FileText;
                  const primaryPublication = panel.publications?.[0];
                  const cardTitle = primaryPublication?.title || panel.title;
                  const displayTitle = primaryPublication
                    ? displayPublicationTitle(cardTitle)
                    : cardTitle;
                  const cardDescription = primaryPublication?.summary
                    || sentenceSummary(panel.description || primaryPublication?.abstract || '');
                  return (
                    <div
                      key={placement.id || placement.panel_id}
                      className="bg-white p-8 rounded-2xl border border-gray-100 group flex flex-col justify-between hover:shadow-xl transition-all duration-300"
                    >
                      <div>
                        <div className="w-10 h-10 bg-aggie-gray rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:bg-aggie-gold transition-colors">
                          <PanelIcon className="text-aggie-blue" size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-aggie-blue mb-3 text-center">{displayTitle}</h3>
                        {primaryPublication ? (
                          <>
                            {(primaryPublication.journal || primaryPublication.volume || primaryPublication.pages) ? (
                              <p className="text-sm text-gray-500 font-semibold mb-2 text-center">
                                {[
                                  primaryPublication.journal,
                                  primaryPublication.volume,
                                  primaryPublication.pages,
                                ].filter(Boolean).join(', ')}
                              </p>
                            ) : null}
                            {primaryPublication.linked_authors && primaryPublication.linked_authors.length > 0 ? (
                              <p className="text-sm text-gray-600 mb-3">
                                {primaryPublication.linked_authors
                                  .sort((a, b) => (a.author_order || 0) - (b.author_order || 0))
                                  .map((author) => author.name)
                                  .join(', ')}
                              </p>
                            ) : primaryPublication.authors ? (
                              <p className="text-sm text-gray-600 mb-3">{primaryPublication.authors}</p>
                            ) : null}
                          </>
                        ) : null}
                        {cardDescription ? (
                          <p className="text-gray-600 leading-relaxed text-sm mb-6">{cardDescription}</p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedPanel(panel)}
                        className="flex items-center text-aggie-blue font-bold text-sm hover:text-aggie-gold transition-colors group/btn w-fit"
                      >
                        View details
                        <ArrowRight
                          size={16}
                          className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedPanel ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedPanel(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b px-6 py-4">
              <h3 className="text-2xl font-bold text-aggie-blue">{selectedPanel.title}</h3>
              <button
                type="button"
                onClick={() => setSelectedPanel(null)}
                className="text-gray-500 hover:text-aggie-blue"
                aria-label="Close details"
              >
                <X size={24} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-6">
              {selectedPanel.panel_type === 'publication' && selectedPanel.publications?.length ? (
                <div className="space-y-6">
                  {selectedPanel.publications.map((publication) => {
                    const linkCandidates = [
                      ...(publication.links || []),
                      ...(selectedPanel.external_links || []).map((link) => ({
                        label: link.label,
                        url: link.url,
                      })),
                    ];
                    const links = linkCandidates
                      .filter((link) => !!link.url)
                      .map((link) => {
                        const type = classifyLink(link.label, link.url);
                        return {
                          type,
                          label: link.label || LINK_LABEL_MAP[type],
                          url: normalizeUrl(link.url),
                        };
                      });

                    return (
                      <div key={publication.id} className="space-y-4 border-b last:border-b-0 pb-5 last:pb-0">
                        <div>
                          <h4 className="text-xl font-bold text-aggie-blue">{displayPublicationTitle(publication.title)}</h4>
                          {publication.linked_authors && publication.linked_authors.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {publication.linked_authors.map((author) => (
                                <div
                                  key={`${publication.id}-author-${author.id}`}
                                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-aggie-gray text-xs font-semibold text-aggie-blue"
                                >
                                  <a
                                    href={`/api/cms/snippets/graphs.individual/${author.id}/?format=json`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-aggie-gold underline-offset-2 hover:underline"
                                  >
                                    {author.name}
                                  </a>
                                  {author.orcid ? (
                                    <a
                                      href={normalizeOrcidUrl(author.orcid)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-aggie-blue hover:text-aggie-gold"
                                      title={`ORCID: ${author.orcid}`}
                                    >
                                      <ExternalLink size={12} />
                                    </a>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : publication.authors ? (
                            <p className="text-sm text-gray-600 mt-1">{publication.authors}</p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {publication.publication_type ? (
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-aggie-blue/5 rounded-full text-aggie-blue uppercase tracking-wider">
                              {publication.publication_type}
                            </span>
                          ) : null}
                          {publication.publication_year ? (
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-aggie-blue/5 rounded-full text-aggie-blue">
                              {publication.publication_year}
                            </span>
                          ) : null}
                        </div>

                        {publication.abstract ? (
                          <p className="text-gray-700 leading-relaxed">{publication.abstract}</p>
                        ) : publication.summary ? (
                          <p className="text-gray-700 leading-relaxed">{publication.summary}</p>
                        ) : null}

                        {links.length > 0 ? (
                          <div className="space-y-2">
                            <h5 className="text-lg font-semibold text-aggie-blue">Links</h5>
                            <div className="space-y-2">
                              {links.map((link) => {
                                const LinkIcon = LINK_ICON_MAP[link.type] || ExternalLink;
                                return (
                                  <a
                                    key={`${publication.id}-${link.type}-${link.url}`}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-aggie-blue hover:text-aggie-gold font-semibold"
                                  >
                                    <LinkIcon size={16} className="mr-2" />
                                    {link.label || LINK_LABEL_MAP[link.type]}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  {selectedPanel.description ? (
                    <p className="text-gray-700 leading-relaxed">{selectedPanel.description}</p>
                  ) : (
                    <p className="text-gray-500">No description available.</p>
                  )}

                  {selectedPanel.entities && selectedPanel.entities.length > 0 ? (
                    <div>
                      <h4 className="text-lg font-semibold text-aggie-blue mb-3">Related items</h4>
                      <div className="space-y-3">
                        {selectedPanel.entities.map((entity) => (
                          <div key={`${entity.kind}-${entity.id}`} className="flex items-start gap-3 border rounded-lg p-3">
                            {entity.thumbnail_url ? (
                              <img
                                src={entity.thumbnail_url}
                                alt={entity.title}
                                className="w-12 h-12 rounded object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded bg-aggie-gray flex items-center justify-center flex-shrink-0">
                                <Globe size={16} className="text-aggie-blue" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-aggie-blue">{entity.title}</p>
                              <p className="text-xs uppercase tracking-wide text-gray-500">{entity.kind}</p>
                              {entity.summary ? (
                                <p className="text-sm text-gray-600 mt-1">{entity.summary}</p>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selectedPanel.external_links && selectedPanel.external_links.length > 0 ? (
                    <div>
                      <h4 className="text-lg font-semibold text-aggie-blue mb-3">Links</h4>
                      <div className="space-y-2">
                        {selectedPanel.external_links.map((link) => (
                          <a
                            key={link.id}
                            href={normalizeUrl(link.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-aggie-blue hover:text-aggie-gold font-semibold"
                          >
                            <ExternalLink size={16} className="mr-2" />
                            {link.label || link.url}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="pt-2">
                    {selectedPanel.external_links?.[0] ? (
                      <a
                        href={normalizeUrl(selectedPanel.external_links[0].url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-aggie-blue font-bold text-sm hover:text-aggie-gold transition-colors"
                      >
                        {selectedPanel.external_links[0].label || 'Open primary link'}
                        <ArrowRight size={16} className="ml-2" />
                      </a>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Projects;
