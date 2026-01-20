
import React, { useState, useEffect } from 'react';
import { Linkedin, Target, Zap, Users, ArrowLeftRight, GraduationCap } from 'lucide-react';
import Papa from 'papaparse';

interface TeamMember {
  publish: string;
  member_role: string;
  member_name: string;
  member_degree: string;
  member_linkedin: string;
  member_photo: string;
  member_bio: string;
  member_google_scholar: string;
  member_orcid: string;
}

const AboutUs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mission' | 'activity' | 'team'>('team');
  const [teamFilter, setTeamFilter] = useState<'All' | 'Board' | 'Staff' | 'Advisors' | 'Fellows' | 'Emeriti' | 'Alumni'>('All');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}about_team.csv`)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Filter only rows where publish === "publish"
            const published = (results.data as TeamMember[]).filter(
              (member) => member.publish && member.publish.toLowerCase().trim() === 'publish'
            );
            setTeam(published);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing team CSV:', error);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching team CSV:', error);
        setLoading(false);
      });
  }, []);

  // Clear image errors when filter changes to ensure fresh image loading
  useEffect(() => {
    setImageErrors(new Set());
  }, [teamFilter]);

  const tabs = [
    { id: 'team', label: 'Team', icon: Users },
    { id: 'mission', label: 'Mission', icon: Target },
    { id: 'activity', label: 'Core Activity', icon: Zap },
  ];

  const filterOptions = ['All', 'Staff', 'Board', 'Advisors', 'Fellows', 'Emeriti', 'Alumni'] as const;

  const getPhotoUrl = (photo: string) => {
    if (!photo || !photo.trim()) return null;
    // member_photo is always a filename in the team folder
    return `${import.meta.env.BASE_URL}images/team/${photo.trim()}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const filteredTeam = team.filter(member => {
    const role = member.member_role.toLowerCase();
    const isAlum = role.includes('alum');
    const isEmeritus = role.includes('emeritus');

    if (teamFilter === 'All') return true;
    if (teamFilter === 'Alumni') return isAlum;
    if (teamFilter === 'Emeriti') return isEmeritus;

    // "If anyone has Emeriti/Alumni status, they should not appear in the other tabs."
    if (isAlum || isEmeritus) return false;

    if (teamFilter === 'Board') return role.includes('board');
    if (teamFilter === 'Advisors') return role.includes('advisor');
    if (teamFilter === 'Fellows') return role.includes('fellow');
    if (teamFilter === 'Staff') {
      // Staff includes CEO, COO, Directors, Scientists, Founders or members not matching others
      return role.includes('ceo') || 
             role.includes('coo') || 
             role.includes('director') || 
             role.includes('scientist') || 
             role.includes('founder') ||
             (!role.includes('board') && !role.includes('advisor') && !role.includes('fellow'));
    }
    return false;
  });

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'mission' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto py-8">
              <div className="prose prose-lg text-gray-600 space-y-6">
                <p className="text-xl font-medium text-aggie-blueLight leading-relaxed">
                Our mission is to create the foundations for global, decentralized, traceable, transparent, and trustworthy food systems.
                </p>
                <p>
                We develop shared language, standards, and digital infrastructure enabling seamless communication across food system sectors--from agriculture and manufacturing to nutrition and health.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-aggie-gray p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-aggie-blue mb-2">Lowering barriers to entry</h4>
                    <p className="text-sm">Making it easier for individuals and small businesses to use digital tools, participate in markets, and succeed—without needing specialized expertise or resources.</p>
                  </div>
                  <div className="bg-aggie-gray p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-aggie-blue mb-2">Sovereignty</h4>
                    <p className="text-sm">Ensuring ownership of food data belongs to the producers, artisans, and communities who create it.</p>
                  </div>
                  <div className="bg-aggie-gray p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-aggie-blue mb-2">Interoperability</h4>
                    <p className="text-sm">Creating interoperable standards and infrastructure that connect fragmented food system data--improving market stability and competition while benefitting consumers with more complete information about their food.</p>
                  </div>
                  <div className="bg-aggie-gray p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-aggie-blue mb-2">Decentralization</h4>
                    <p className="text-sm">Equipping local food system actors with digital tools previously available only to industrial giants.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto space-y-12 py-8">
              <div className="flex items-start space-x-6">
                <div className="text-4xl font-black text-aggie-gold pt-1">01</div>
                <div>
                  <h3 className="text-xl font-bold text-aggie-blue mb-3 uppercase tracking-tight">Conference</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The meeting of stakeholders from the 
                    <span className="inline-flex items-center mx-1 font-semibold text-aggie-blue">Environment <ArrowLeftRight size={14} className="mx-1 text-aggie-gold" /> Ag <ArrowLeftRight size={14} className="mx-1 text-aggie-gold" /> Food <ArrowLeftRight size={14} className="mx-1 text-aggie-gold" /> Diet <ArrowLeftRight size={14} className="mx-1 text-aggie-gold" /> Health</span> 
                    knowledge spectrum across academic institutions and businesses.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="text-4xl font-black text-aggie-gold pt-1">02</div>
                <div>
                  <h3 className="text-xl font-bold text-aggie-blue mb-3 uppercase tracking-tight">Consortium</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The IC-FOODS platform has a membership model to represent stakeholders from academia, industry, and governmental organizations to guide research priorities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="text-4xl font-black text-aggie-gold pt-1">03</div>
                <div>
                  <h3 className="text-xl font-bold text-aggie-blue mb-3 uppercase tracking-tight">Centre</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The IC-FOODS sources external funds from granting bodies in order to expand capacity for the consortium members and the center itself.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Team Filter Sub-navigation */}
            <div className="mb-12 flex flex-wrap justify-center gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setTeamFilter(option)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                    teamFilter === option
                      ? 'bg-aggie-blue text-white border-aggie-blue shadow-md'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-aggie-gold hover:text-aggie-blue'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading team members...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTeam.map((member) => {
                  const photoUrl = getPhotoUrl(member.member_photo);
                  const imageKey = `${member.member_name}-${photoUrl}`;
                  const hasImageError = imageErrors.has(imageKey);
                  const shouldShowImage = photoUrl && !hasImageError;
                  
                  return (
                  <div key={`${member.member_name}-${member.member_role}`} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
                    {/* Profile Header (Image or Initials, Name, Role) */}
                    <div className="p-8 pb-4 flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="w-48 h-48 rounded-full overflow-hidden bg-aggie-gray shadow-inner border-4 border-white relative flex items-center justify-center">
                          {shouldShowImage ? (
                            <img 
                              src={photoUrl} 
                              alt={member.member_name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={() => {
                                // Track image error in state instead of manipulating DOM
                                setImageErrors(prev => new Set(prev).add(imageKey));
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-aggie-blue flex items-center justify-center">
                              <span className="text-4xl font-bold text-white">{getInitials(member.member_name)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    
                    <h3 className="text-2xl font-bold text-aggie-blue mb-1">
                      {member.member_name}{member.member_degree && `, ${member.member_degree}`}
                    </h3>
                    <p className="text-aggie-gold font-black text-xs uppercase tracking-[0.2em]">{member.member_role}</p>
                  </div>

                  {/* Biography & Social Icons */}
                  <div className={`px-8 pb-8 flex-grow flex flex-col ${!member.member_bio ? 'justify-start' : ''}`}>
                    {member.member_bio && (
                      <div className="w-12 h-1 bg-aggie-gold/20 mx-auto mb-6 rounded-full"></div>
                    )}
                    
                    {member.member_bio ? (
                      <p className="text-gray-600 text-sm leading-relaxed text-center italic px-2 mb-6">
                        {member.member_bio}
                      </p>
                    ) : (
                       <div className="h-4"></div>
                    )}
                    
                    {/* Social/Academic Icons */}
                    <div className={`${member.member_bio ? 'mt-auto' : 'mt-2'} flex justify-center items-center gap-6`}>
                      {member.member_linkedin && (
                        <a 
                          href={member.member_linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-400 hover:text-aggie-blue transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin size={22} />
                        </a>
                      )}
                      {member.member_google_scholar && (
                        <a 
                          href={member.member_google_scholar} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-400 hover:text-aggie-blue transition-colors"
                          title="Google Scholar"
                        >
                          <GraduationCap size={24} />
                        </a>
                      )}
                      {member.member_orcid && (
                        <a 
                          href={member.member_orcid} 
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
                );
              })}
              
                {filteredTeam.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-gray-400 italic">No team members found in this category.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
