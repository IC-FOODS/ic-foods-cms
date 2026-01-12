
import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, Database, Settings, Laptop } from 'lucide-react';
import Papa from 'papaparse';

interface Publication {
  title: string;
  authors: string;
  methodology: string;
  outputs: string;
  pdfUrl: string;
}

interface ParsedOutput {
  type: string;
  label: string;
  url: string;
}

const getOutputIcon = (type: string) => {
  switch (type) {
    case 'Paper': return <FileText size={14} className="mr-1" />;
    case 'Pilot': return <Settings size={14} className="mr-1" />;
    case 'Dataset': return <Database size={14} className="mr-1" />;
    case 'Tool': return <Laptop size={14} className="mr-1" />;
    default: return <ExternalLink size={14} className="mr-1" />;
  }
};

const Publications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/publications.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setPublications(results.data as Publication[]);
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

  const parseOutputs = (outputsString: string): ParsedOutput[] => {
    if (!outputsString) return [];
    return outputsString.split('|').map(output => {
      const [type, label, url] = output.split(':');
      return { type: type.trim(), label: label.trim(), url: url.trim() };
    });
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
              const parsedOutputs = parseOutputs(pub.outputs);
              return (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-aggie-blue mb-2 hover:text-aggie-blueLight transition-colors cursor-default">
                  {pub.title}
                </h3>
                <p className="text-gray-700 font-medium mb-4">{pub.authors}</p>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 bg-aggie-gray inline-block px-3 py-1 rounded border border-gray-100">
                    {pub.methodology}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end border-t border-gray-100 pt-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 block">Research outputs</span>
                  <div className="flex flex-wrap gap-4">
                    {parsedOutputs.map((output, oIdx) => (
                      <a 
                        key={oIdx} 
                        href={output.url} 
                        className="flex items-center text-sm font-bold text-aggie-blue hover:text-aggie-gold transition-colors underline decoration-aggie-gold/30 underline-offset-4"
                      >
                        {getOutputIcon(output.type)}
                        {output.label}
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="flex md:justify-end">
                  <a 
                    href={pub.pdfUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-aggie-blue text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-aggie-blueLight transition-all shadow-sm"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View PDF
                  </a>
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
