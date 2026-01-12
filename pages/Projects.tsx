import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Settings, 
  Download, 
  ClipboardCheck, 
  Fingerprint, 
  Database, 
  ArrowRight,
  BookOpen,
  Layout,
  FileSpreadsheet
} from 'lucide-react';
import Papa from 'papaparse';

interface Project {
  title: string;
  description: string;
  category: string;
}

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guidelines' | 'technical' | 'resources'>('guidelines');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'guidelines', label: 'Guidelines', icon: ClipboardCheck },
    { id: 'technical', label: 'Technical Identifiers', icon: Fingerprint },
    { id: 'resources', label: 'Resources', icon: Layout },
  ];

  useEffect(() => {
    fetch('/projects.csv')
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

  const filteredProjects = projects.filter(p => {
    if (activeTab === 'guidelines') return p.category === 'guidelines';
    if (activeTab === 'technical') return p.category === 'technical';
    if (activeTab === 'resources') return p.category === 'resources';
    return false;
  });

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section strictly aligned with Publications page styling */}
      <div className="ucd-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Research & Standards</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            IC-FOODS standardizes food data so that the entire food system—from the farmer's field to the consumer's health—is more transparent, efficient, and data-driven.
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
                className={`flex items-center space-x-2 py-6 border-b-2 font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id
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
        {/* Section 1: Guidelines */}
        {activeTab === 'guidelines' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading projects...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProjects.map((item, idx) => (
                  <div key={idx} className="bg-aggie-gray p-8 rounded-2xl border border-gray-100 group flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:bg-aggie-gold transition-colors">
                        <FileText className="text-aggie-blue" size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-aggie-blue mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm mb-6">{item.description}</p>
                    </div>
                    <button className="flex items-center text-aggie-blue font-bold text-sm hover:text-aggie-gold transition-colors group/btn w-fit">
                      <Download size={16} className="mr-2 group-hover/btn:translate-y-0.5 transition-transform" /> 
                      Download Guideline (PDF)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 2: Technical Identifiers */}
        {activeTab === 'technical' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading projects...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProjects.map((item, idx) => (
                  <div key={idx} className="bg-white p-10 rounded-3xl border-2 border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${idx % 2 === 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                        {idx % 2 === 0 ? (
                          <Database className="text-aggie-blue" size={28} />
                        ) : (
                          <Fingerprint className="text-aggie-gold" size={28} />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-aggie-blue mb-4">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 3: RESOURCES */}
        {activeTab === 'resources' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading projects...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {filteredProjects.map((item, idx) => {
                  const getIcon = () => {
                    if (item.title.includes('Other Resources')) return <BookOpen className="text-aggie-blue mb-4" size={24} />;
                    if (item.title.includes('XLS') || item.title.includes('Template')) return <FileSpreadsheet className="text-aggie-gold mb-4" size={24} />;
                    return <Settings className="text-aggie-gold mb-4" size={24} />;
                  };
                  
                  const getBgClass = () => {
                    if (item.title.includes('Other Resources')) return 'bg-aggie-gray';
                    if (item.title.includes('XLS') || item.title.includes('Template')) return 'bg-aggie-blue text-white';
                    return 'bg-white border-2 border-aggie-gold';
                  };
                  
                  const getTextClass = () => {
                    if (item.title.includes('XLS') || item.title.includes('Template')) return 'text-white';
                    return 'text-aggie-blue';
                  };
                  
                  const getDescClass = () => {
                    if (item.title.includes('XLS') || item.title.includes('Template')) return 'text-blue-100';
                    return 'text-gray-600';
                  };
                  
                  return (
                    <div key={idx} className={`${getBgClass()} p-8 rounded-2xl flex flex-col justify-between ${item.title.includes('XLS') || item.title.includes('Template') ? 'shadow-xl shadow-aggie-blue/10' : item.title.includes('Report') ? 'shadow-lg' : ''}`}>
                      <div>
                        {getIcon()}
                        <h3 className={`text-xl font-bold mb-3 ${getTextClass()}`}>{item.title}</h3>
                        <p className={`text-sm mb-6 ${getDescClass()}`}>{item.description}</p>
                      </div>
                      <button className={`${item.title.includes('XLS') || item.title.includes('Template') ? 'bg-white text-aggie-blue hover:bg-aggie-gold' : 'bg-aggie-blue text-white hover:bg-aggie-blueLight'} px-6 py-2 rounded-lg font-bold flex items-center justify-center transition-all text-sm`}>
                        <Download size={16} className="mr-2" /> 
                        {item.title.includes('XLS') || item.title.includes('Template') ? 'Download XLS' : item.title.includes('Report') ? 'Download PDF' : 'View Resources'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;