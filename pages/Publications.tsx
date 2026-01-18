
import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, BookOpen, Glasses, Library } from 'lucide-react';
import Papa from 'papaparse';

interface Publication {
  publish: string;
  publication_text: string;
  publication_file_name: string;
  author_list: string;
  publication_type: string;
  project_url: string;
  resource_url: string;
  method: string;
}

const Publications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}publications.csv`)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Filter only rows where publish === "publish"
            const published = (results.data as Publication[]).filter(
              (pub) => pub.publish && pub.publish.toLowerCase().trim() === 'publish'
            );
            setPublications(published);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching publications CSV:', error);
        setLoading(false);
      });
  }, []);

  // Check if a URL is a web URL or a filename
  const isUrl = (url: string) => {
    if (!url) return false;
    const trimmed = url.trim();
    return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('www.');
  };

  const getResourceUrl = (url: string) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (isUrl(trimmed)) {
      // It's a URL - add https:// if it starts with www.
      if (trimmed.startsWith('www.')) {
        return `https://${trimmed}`;
      }
      return trimmed;
    } else {
      // It's a filename - point to resources folder
      return `${import.meta.env.BASE_URL}resources/${trimmed}`;
    }
  };

  const getPublicationFileUrl = (filename: string) => {
    if (!filename) return null;
    const trimmed = filename.trim();
    // Publication files are also in the resources folder
    return `${import.meta.env.BASE_URL}resources/${trimmed}`;
  };

  const getPubTypeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('article') || t.includes('paper')) return <FileText size={20} className="text-aggie-blue" />;
    return <BookOpen size={20} className="text-aggie-blue" />;
  };

  return (
    <div className="bg-aggie-gray min-h-screen">
      {/* Hero Section Aligned with Partners page */}
      <div className="ucd-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Research Outputs</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Peer-reviewed publications, technical white papers, and curated datasets that demonstrate our commitment to academic excellence and research rigor.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading publications...</div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {publications.map((pub, idx) => {
              const resourceUrl = pub.resource_url ? getResourceUrl(pub.resource_url) : null;
              const isResourceFile = resourceUrl && !isUrl(pub.resource_url || '');
              const publicationFileUrl = pub.publication_file_name ? getPublicationFileUrl(pub.publication_file_name) : null;
              const projectUrl = pub.project_url ? getResourceUrl(pub.project_url) : null;
              const isProjectFile = projectUrl && !isUrl(pub.project_url || '');

              return (
                <div key={idx} className="bg-aggie-gray p-8 rounded-2xl border border-gray-100 group flex flex-col md:flex-row justify-between hover:shadow-lg transition-all">
                  <div className="flex-grow md:pr-12">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-aggie-gold transition-colors">
                        {getPubTypeIcon(pub.publication_type)}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-aggie-blue mb-2 leading-tight group-hover:text-aggie-blueLight transition-colors">
                      {pub.publication_text}
                    </h3>

                    {pub.author_list && (<p className="text-gray-700 font-medium mb-3 text-sm">
                      {pub.author_list}
                    </p>)}

                    <div className="mb-4">
                      {pub.publication_type && (
                        <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold bg-white text-gray-600 tracking-[0.15em]">
                          {pub.publication_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 md:mt-0 flex flex-col justify-center items-start md:items-end md:min-w-[220px] border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8 space-y-5">
                    <a
                      href={publicationFileUrl}
                      download={pub.publication_file_name}
                      className="inline-flex items-center bg-aggie-blue text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-aggie-blueLight transition-all shadow-sm hover:shadow-md w-full md:w-full justify-center"
                    >
                      <FileText size={18} className="mr-2" />
                      View Full Text
                    </a>

                    <div className="flex flex-col space-y-3 w-full items-start md:items-end pr-2">
                      {pub.project_url && (
                        <a
                          href={projectUrl}
                          target={isProjectFile ? undefined : "_blank"}
                          rel={isProjectFile ? undefined : "noopener noreferrer"}
                          download={isProjectFile ? pub.project_url?.trim() : undefined}
                          className="flex items-center text-xs font-bold text-aggie-blue hover:text-aggie-gold transition-colors group/link text-right"
                        >
                          <Glasses size={14} className="mr-2" /> Project <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                        </a>
                      )}
                      {resourceUrl && (
                        <a
                          href={resourceUrl}
                          target={isResourceFile ? undefined : "_blank"}
                          rel={isResourceFile ? undefined : "noopener noreferrer"}
                          className="flex items-center text-xs font-bold text-aggie-blue hover:text-aggie-gold transition-colors group/link text-right"
                        >
                          <Library size={14} className="mr-2" /> Resource <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;
