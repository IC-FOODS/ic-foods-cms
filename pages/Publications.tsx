
import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, Database, Settings, Laptop } from 'lucide-react';
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
                <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-aggie-blue mb-2 hover:text-aggie-blueLight transition-colors cursor-default">
                      {pub.publication_text || 'Untitled Publication'}
                    </h3>
                    {pub.author_list && (
                      <p className="text-gray-700 font-medium mb-4">{pub.author_list}</p>
                    )}
                    
                    <div className="mb-6 flex flex-wrap gap-3">
                      {pub.publication_type && (
                        <span className="text-sm text-aggie-blue bg-blue-50 inline-block px-3 py-1 rounded border border-blue-100 font-semibold">
                          {pub.publication_type}
                        </span>
                      )}
                      {pub.method && (
                        <span className="text-sm text-gray-600 bg-aggie-gray inline-block px-3 py-1 rounded border border-gray-100">
                          {pub.method}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end border-t border-gray-100 pt-6">
                    <div className="space-y-3">
                      {publicationFileUrl && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Publication File</span>
                          <a 
                            href={publicationFileUrl}
                            download={pub.publication_file_name}
                            className="flex items-center text-sm font-bold text-aggie-blue hover:text-aggie-gold transition-colors underline decoration-aggie-gold/30 underline-offset-4"
                          >
                            <FileText size={14} className="mr-1" />
                            {pub.publication_file_name}
                          </a>
                        </div>
                      )}
                      {resourceUrl && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Resource</span>
                          <a 
                            href={resourceUrl}
                            target={isResourceFile ? undefined : "_blank"}
                            rel={isResourceFile ? undefined : "noopener noreferrer"}
                            download={isResourceFile ? pub.resource_url?.trim() : undefined}
                            className="flex items-center text-sm font-bold text-aggie-blue hover:text-aggie-gold transition-colors underline decoration-aggie-gold/30 underline-offset-4"
                          >
                            {isResourceFile ? (
                              <Download size={14} className="mr-1" />
                            ) : (
                              <ExternalLink size={14} className="mr-1" />
                            )}
                            {isResourceFile ? 'Download Resource' : 'View Resource'}
                          </a>
                        </div>
                      )}
                      {projectUrl && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Project</span>
                          <a 
                            href={projectUrl}
                            target={isProjectFile ? undefined : "_blank"}
                            rel={isProjectFile ? undefined : "noopener noreferrer"}
                            download={isProjectFile ? pub.project_url?.trim() : undefined}
                            className="flex items-center text-sm font-bold text-aggie-blue hover:text-aggie-gold transition-colors underline decoration-aggie-gold/30 underline-offset-4"
                          >
                            {isProjectFile ? (
                              <Download size={14} className="mr-1" />
                            ) : (
                              <ExternalLink size={14} className="mr-1" />
                            )}
                            {isProjectFile ? 'Download Project' : 'View Project'}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex md:justify-end">
                      {publicationFileUrl ? (
                        <a 
                          href={publicationFileUrl}
                          download={pub.publication_file_name}
                          className="flex items-center bg-aggie-blue text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-aggie-blueLight transition-all shadow-sm"
                        >
                          <Download size={16} className="mr-2" />
                          Download PDF
                        </a>
                      ) : (
                        <div className="text-gray-400 text-sm">No publication file available</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;
