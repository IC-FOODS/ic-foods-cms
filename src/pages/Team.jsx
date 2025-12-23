/**
 * Team Page
 * Displays team members loaded from CSV
 */

import { useEffect, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import { loadTeamData } from '../utils/dataLoader';
import { Mail, Linkedin, ChevronDown, ChevronUp } from 'lucide-react';

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [expandedBios, setExpandedBios] = useState({});

  useEffect(() => {
    loadTeamData().then(setTeamMembers);
  }, []);

  const toggleBio = (index) => {
    setExpandedBios((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <PageWrapper>
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Team"
            description="Meet the researchers, experts, and leaders driving our mission forward."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <div className="mb-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-2">
                  {member.title}
                </p>
                <p className="text-sm text-gray-500 mb-4">{member.affiliation}</p>
                <div className="mb-4">
                  <p
                    className={`text-gray-600 text-sm ${
                      expandedBios[index] ? '' : 'line-clamp-3'
                    }`}
                  >
                    {member.bio}
                  </p>
                  {member.bio && member.bio.length > 100 && (
                    <button
                      onClick={() => toggleBio(index)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 flex items-center mx-auto"
                    >
                      {expandedBios[index] ? (
                        <>
                          Show less <ChevronUp className="w-4 h-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Read more <ChevronDown className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="flex justify-center space-x-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

