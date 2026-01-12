
import React, { useState, useEffect } from 'react';
import { Linkedin, Target, Zap, Users, ArrowLeftRight, GraduationCap } from 'lucide-react';
import Papa from 'papaparse';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  google_scholar_link: string;
  orcid_link: string;
  linkedin: string;
  imgUrl: string;
}

const AboutUs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mission' | 'activity' | 'team'>('team');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/team.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setTeam(results.data as TeamMember[]);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching team CSV:', error);
        setLoading(false);
      });
  }, []);

  const tabs = [
    { id: 'team', label: 'Team', icon: Users },
    { id: 'mission', label: 'Mission', icon: Target },
    { id: 'activity', label: 'Core Activity', icon: Zap },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="ucd-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About IC-FOODS</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Democratizing the world's food system through semantic standards, interoperability, and ethical data engineering.
          </p>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'mission' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl">
              <div className="prose prose-lg text-gray-600 space-y-6">
                <p className="text-xl font-medium text-aggie-blueLight leading-relaxed">
                  The mission of IC-FOODS is to create the architectural foundation for a global, decentralized, and transparent food system.
                </p>
                <p>
                  We are building a common language—an "Ontology of Food"—that allows for seamless communication between different sectors of the food industry, from agriculture and manufacturing to nutrition and personalized health.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-aggie-gray p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-aggie-blue mb-2">Decentralization</h4>
                    <p className="text-sm">Empowering local food systems with data tools that were previously only available to industrial giants.</p>
                  </div>
                  <div className="bg-aggie-gray p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-aggie-blue mb-2">Equity</h4>
                    <p className="text-sm">Ensuring that food data sovereignty belongs to the producers and communities, not just the platforms.</p>
                  </div>
                  <div className="bg-aggie-gray p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-aggie-blue mb-2">Interoperability</h4>
                    <p className="text-sm">Connecting silos so that information flows as freely as the physical products in the supply chain.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl space-y-12">
              <div className="flex items-start space-x-6">
                <div className="text-4xl font-black text-aggie-gold pt-1">01</div>
                <div>
                  <h3 className="text-xl font-bold text-aggie-blue mb-3 uppercase tracking-tight">Conference</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The meeting of stakeholders from the 
                    <span className="inline-flex items-center mx-1 font-semibold text-aggie-blue">Environment <ArrowLeftRight size={14} className="mx-1 text-aggie-gold" /> Ag <ArrowLeftRight size={14} className="mx-1 text-aggie-gold" /> Food <ArrowLeftRight size={14} className="mx-1 text-aggie-gold" /> Diet <ArrowLeftRight size={14} className="mx-1 text-aggie-gold" /> Health</span> 
                    knowledge spectrum across academic institutions and businesses (commercial or research) to discuss the role of IC-FOODS data platform as relevant to each.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="text-4xl font-black text-aggie-gold pt-1">02</div>
                <div>
                  <h3 className="text-xl font-bold text-aggie-blue mb-3 uppercase tracking-tight">Consortium</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The IC-FOODS platform has a membership model to represent stakeholders from academia, industry, and (non-)governmental organizations to support and guide research priorities and development trajectories.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="text-4xl font-black text-aggie-gold pt-1">03</div>
                <div>
                  <h3 className="text-xl font-bold text-aggie-blue mb-3 uppercase tracking-tight">Centre</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The IC-FOODS sources external funds from granting bodies in order to expand capacity for the consortium members and the center itself. It also invites collaboration on ideas that can be built on the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading team members...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((member, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
                  {/* Profile Header (Image, Name, Role) */}
                  <div className="p-8 pb-4 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-48 h-48 rounded-full overflow-hidden bg-aggie-gray shadow-inner border-4 border-white relative">
                        <img 
                          src={member.imgUrl} 
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-aggie-blue mb-1">{member.name}</h3>
                    <p className="text-aggie-gold font-black text-xs uppercase tracking-[0.2em]">{member.role}</p>
                  </div>

                  {/* Biography & Social Icons */}
                  <div className={`px-8 pb-8 flex-grow flex flex-col ${!member.bio ? 'justify-start' : ''}`}>
                    <div className="w-12 h-1 bg-aggie-gold/20 mx-auto mb-6 rounded-full"></div>
                    {member.bio ? (
                      <>
                        <p className="text-gray-600 text-sm leading-relaxed text-center italic px-2 mb-6">
                          {member.bio}
                        </p>
                      </>
                    ) : (
                       // Minimal spacing if bio is empty
                       <div className="h-4"></div>
                    )}
                    
                    {/* Social/Academic Icons */}
                    <div className={`${member.bio ? 'mt-auto' : 'mt-2'} flex justify-center items-center gap-6`}>
                      {member.linkedin && (
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-400 hover:text-aggie-blue transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin size={22} />
                        </a>
                      )}
                      {member.google_scholar_link && (
                        <a 
                          href={member.google_scholar_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-400 hover:text-aggie-blue transition-colors"
                          title="Google Scholar"
                        >
                          <GraduationCap size={24} />
                        </a>
                      )}
                      {member.orcid_link && (
                        <a 
                          href={member.orcid_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:opacity-80 transition-opacity grayscale hover:grayscale-0"
                          title="ORCID"
                        >
                          <img 
                            src="https://orcid.org/assets/vectors/orcid.logo.icon.svg" 
                            alt="ORCID" 
                            className="w-5 h-5"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
