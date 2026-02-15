
import React from 'react';
import { MessageSquare, Briefcase, GraduationCap } from 'lucide-react';
import { useCmsPage, stripHtml } from '../lib/useCmsPage';

const Connect: React.FC = () => {
  const { page: cmsPage } = useCmsPage('connect');

  const heroTitle = cmsPage?.title || 'Connect With Us';
  const heroSubtitle = cmsPage?.intro
    ? stripHtml(cmsPage.intro)
    : "Interested in exploring how food ontologies can transform your organization's data? Let's start a conversation.";

  return (
    <div className="bg-white min-h-screen">
      <div className="ucd-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            {heroSubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-aggie-blue mb-8">How We Collaborate</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-aggie-gold/10 p-3 rounded-lg mt-1">
                  <Briefcase className="text-aggie-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">For NGOs & Non-Profits</h3>
                  <p className="text-gray-600">
                    We offer data auditing, custom ontology development, and pilot project implementation. We look for mission-aligned partners who value data equity.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-aggie-gold/10 p-3 rounded-lg mt-1">
                  <MessageSquare className="text-aggie-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">For Government Agencies</h3>
                  <p className="text-gray-600">
                    Our team provides expert testimony on food standards and helps integrate semantic frameworks into municipal and federal food systems.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-aggie-gold/10 p-3 rounded-lg mt-1">
                  <GraduationCap className="text-aggie-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">For Fellowship Applicant</h3>
                  <p className="text-gray-600">
                    If you are interested in contributing in projects involving food data research or engineering, we'd love to know more about you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Form Embed */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[800px] lg:min-h-[1300px] transition-all">
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSfFCmHhgJQGlB_zu9qKGqVS7YzH0TD97WYEoE0dC5WXMATT-g/viewform?embedded=true" 
                className="w-full h-[800px] lg:h-[1275px] border-0"
                title="IC-FOODS Inquiry Form"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
