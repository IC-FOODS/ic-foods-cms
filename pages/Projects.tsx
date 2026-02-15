import React, { useState, useEffect } from 'react';
import {
  FileText,
  Settings,
  MonitorPlay,
  ClipboardCheck,
  Glasses,
  Database,
  ArrowRight,
  BookOpen,
  Library,
  FileSpreadsheet,
  ExternalLink,
  Calendar,
  Building2,
  Award,
  Globe
} from 'lucide-react';
import Papa from 'papaparse';
import { useCmsPage, stripHtml } from '../lib/useCmsPage';

interface Project {
  title: string;
  description: string;
  category: string;
}

interface ResearchArea {
  publish: string;
  ra_name: string;
  ra_description: string;
  external_ra_url: string;
  output_types: string;
  partner_name: string;
  resource_name: string;
}

interface RDProject {
  publish: string;
  rd_name: string;
  rd_description: string;
  external_rd_url: string;
  resource_type: string;
  partner_name: string;
  resource_name: string;
  publication_name: string;
  success_story: string;
  funder_name: string;
  rd_period: string;
  'Separate subpage (y/n)': string;
}

interface Resource {
  publish: string;
  resource_name: string;
  resource_type: string;
  resource_description: string;
  resource_url: string;
}

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guidelines' | 'technical' | 'resources'>('guidelines');
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [rdProjects, setRdProjects] = useState<RDProject[]>([]);
  const [rdResources, setRdResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [researchAreasLoading, setResearchAreasLoading] = useState(true);
  const [rdProjectsLoading, setRdProjectsLoading] = useState(true);
  const [rdResourcesLoading, setRdResourcesLoading] = useState(true);

  const { page: cmsPage } = useCmsPage('projects');
  const heroTitle = cmsPage?.hero_title || 'Research & Development';
  const heroSubtitle = cmsPage?.hero_subtitle
    ? stripHtml(cmsPage.hero_subtitle)
    : 'IC-FOODS standardizes food data so that the entire food system\u2014from the farmer\'s field to the consumer\'s health\u2014is more transparent, efficient, and data-driven.';

  const tabs = [
    { id: 'guidelines', label: 'Research Areas', icon: ClipboardCheck },
    { id: 'technical', label: 'R&D Projects', icon: Glasses },
    { id: 'resources', label: 'Resources', icon: Library },
  ];

  // Load projects CSV for other tabs
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}projects.csv`)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setProjects(results.data as Project[]);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching projects CSV:', error);
        setLoading(false);
      });
  }, []);

  // Load research areas CSV
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}rd_research_areas.csv`)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Filter only rows where publish === "publish"
            const published = (results.data as ResearchArea[]).filter(
              (ra) => ra.publish && ra.publish.toLowerCase().trim() === 'publish'
            );
            setResearchAreas(published);
            setResearchAreasLoading(false);
          },
          error: (error) => {
            console.error('Error parsing research areas CSV:', error);
            setResearchAreasLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching research areas CSV:', error);
        setResearchAreasLoading(false);
      });
  }, []);

  // Load R&D projects CSV
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}rd_list.csv`)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Filter only rows where publish === "publish"
            const published = (results.data as RDProject[]).filter(
              (rd) => rd.publish && rd.publish.toLowerCase().trim() === 'publish'
            );
            setRdProjects(published);
            setRdProjectsLoading(false);
          },
          error: (error) => {
            console.error('Error parsing R&D projects CSV:', error);
            setRdProjectsLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching R&D projects CSV:', error);
        setRdProjectsLoading(false);
      });
  }, []);

  // Load R&D resources CSV
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}rd_resources.csv`)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Filter only rows where publish === "publish"
            const published = (results.data as Resource[]).filter(
              (resource) => resource.publish && resource.publish.toLowerCase().trim() === 'publish'
            );
            setRdResources(published);
            setRdResourcesLoading(false);
          },
          error: (error) => {
            console.error('Error parsing R&D resources CSV:', error);
            setRdResourcesLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching R&D resources CSV:', error);
        setRdResourcesLoading(false);
      });
  }, []);

  const getResourceIcon = (url: string, type: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith('.xlsx') || lowerUrl.endsWith('.xls')) return <FileSpreadsheet className="text-aggie-blue" size={20} />;
    if (lowerUrl.endsWith('.pdf')) return <FileText className="text-aggie-blue" size={20} />;
    if (type.toLowerCase().includes('webinar')) return <MonitorPlay className="text-aggie-blue" size={20} />;
    return <Globe className="text-aggie-blue" size={20} />;
  };

  const isFilename = (url: string) => {
    const lowerUrl = url.toLowerCase();
    return (lowerUrl.endsWith('.xlsx') || lowerUrl.endsWith('.xls') || lowerUrl.endsWith('.pdf')) && !lowerUrl.startsWith('http');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section strictly aligned with Publications page styling */}
      <div className="ucd-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            {heroSubtitle}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-20 bg-white border-b border-gray-200 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-6 border-b-2 font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'border-aggie-gold text-aggie-blue'
                  : 'border-transparent text-gray-400 hover:text-aggie-blueLight'
                  }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Section 1: Research Areas */}
        {activeTab === 'guidelines' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {researchAreasLoading ? (
              <div className="text-center py-12 text-gray-500">Loading research areas...</div>
            ) : researchAreas.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No research areas available.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {researchAreas.map((item, idx) => (
                  <div key={idx} className="bg-aggie-gray p-8 rounded-2xl border border-gray-100 group flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:bg-aggie-gold transition-colors">
                        <FileText className="text-aggie-blue" size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-aggie-blue mb-3">{item.ra_name || 'Untitled Research Area'}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm mb-6">{item.ra_description || 'No description available.'}</p>
                      {item.output_types && (
                        <div className="mb-6 space-y-2 text-xs text-gray-500">
                          <div className="space-y-4 mb-8">
                            <div className="flex flex-col">
                              <div className="flex flex-wrap gap-2">
                                {item.output_types.split('|').map((type, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold bg-aggie-blue/5 rounded-full text-aggie-blue uppercase tracking-wider"
                                  >
                                    {type.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* {item.partner_name && (
                            <div><span className="font-semibold">Partner:</span> {item.partner_name}</div>
                          )}
                          {item.resource_name && (
                            <div><span className="font-semibold">Resource:</span> {item.resource_name}</div>
                          )} */}
                        </div>
                      )}
                    </div>
                    {item.external_ra_url && (
                      <a
                        href={item.external_ra_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-aggie-blue font-bold text-sm hover:text-aggie-gold transition-colors group/btn w-fit"
                      >
                        View Research Area <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 2: R&D Projects */}
        {activeTab === 'technical' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {rdProjectsLoading ? (
              <div className="text-center py-12 text-gray-500">Loading R&D projects...</div>
            ) : rdProjects.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No R&D projects available.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rdProjects.map((item, idx) => {
                  const getResourceTypeIcon = () => {
                    const type = item.resource_type?.toLowerCase() || '';
                    if (type.includes('guideline')) return <FileText className="text-aggie-blue" size={20} />;
                    if (type.includes('report')) return <FileText className="text-aggie-blue" size={20} />;
                    if (type.includes('portal')) return <Globe className="text-aggie-blue" size={20} />;
                    if (type.includes('book')) return <BookOpen className="text-aggie-blue" size={20} />;
                    if (type.includes('webinar')) return <Glasses className="text-aggie-blue" size={20} />;
                    if (type.includes('training')) return <Settings className="text-aggie-blue" size={20} />;
                    return <Database className="text-aggie-blue" size={20} />;
                  };

                  return (
                    <div key={idx} className="bg-white p-8 rounded-2xl border border-aggie-gold group flex flex-col justify-between hover:shadow-xl hover:border-aggie-gold transition-all duration-300">
                      <div>
                        <div className={`w-10 h-10 bg-aggie-gold/20 rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:bg-aggie-gold transition-colors`}>
                          {getResourceTypeIcon()}
                        </div>
                        <h3 className="text-xl font-bold text-aggie-blue mb-3">{item.rd_name}</h3>
                        {item.rd_description && (
                          <p className="text-gray-600 leading-relaxed text-sm mb-6">{item.rd_description}</p>
                        )}

                        <div className="space-y-4 mb-8">
                          {item.resource_type && (
                            <div className="flex flex-wrap gap-2">
                              {item.resource_type.split(',').map((type, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold bg-aggie-blue/5 rounded-full text-aggie-blue uppercase tracking-wider"
                                >
                                  {type.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* {item.partner_name && (
                            <p className="text-[11px] text-gray-500 font-semibold italic">
                              Partnered with: {item.partner_name.replace(/"/g, '')}
                            </p>
                          )} */}
                        </div>
                      </div>

                      {item.external_rd_url && (
                        <a
                          href={item.external_rd_url.startsWith('http') ? item.external_rd_url : `https://${item.external_rd_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-aggie-blue font-bold text-sm hover:text-aggie-gold transition-colors group/btn w-fit"
                        >
                          View Project <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Section 3: RESOURCES */}
        {activeTab === 'resources' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rdResources.map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 group flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                  <div>
                    <div className="w-10 h-10 bg-aggie-gray rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:bg-aggie-gold transition-colors">
                      {getResourceIcon(item.resource_url, item.resource_type)}
                    </div>
                    <h3 className="text-xl font-bold text-aggie-blue mb-3">{item.resource_name}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm mb-6">{item.resource_description}</p>

                    <div className="space-y-4 mb-8">
                      <div className="flex flex-col">
                        <div className="flex flex-wrap gap-2">
                          {item.resource_type.split(',').map((type, tIdx) => (
                            <span
                              key={tIdx}
                              className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold bg-aggie-blue/5 rounded-full text-aggie-blue uppercase tracking-wider"
                            >
                              {type.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <a
                    href={item.resource_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-aggie-blue font-bold text-sm hover:text-aggie-gold transition-colors group/btn w-fit"
                  >
                    {isFilename(item.resource_url) ? (
                      <><FileText size={16} className="mr-2" /> Read Full File</>
                    ) : (
                      <><Globe size={16} className="mr-2" /> Visit Resource</>
                    )}
                    <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;