import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';

interface Partner {
  publish: string;
  partner_name: string;
  partner_logo_url: string;
}

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const offerings = [
     {
      title: "Research and Development",
      desc: "Co-develop technical infrastructures for cross-cutting food systems research."
    },{
      title: "Data Interoperability Audits",
      desc: "Comprehensive analysis of your organization's current data structures to identify silos and mapping opportunities with global standards."
    },
    {
      title: "Custom Ontology Development",
      desc: "Tailored semantic models that define your specific food system domain while remaining compatible with the core IC-FOODS framework."
    },
    {
      title: "Policy & Governance Consulting",
      desc: "Expert guidance for government agencies on drafting data sovereignty and interoperability requirements for public tenders and grants."
    },
    {
      title: "Implementation Support",
      desc: "Hands-on technical assistance for NGOs and industry partners to integrate our semantic standards into existing software ecosystems."
    }
  ];

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}partners_list.csv`)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Filter only rows where publish === "publish"
            const published = (results.data as Partner[]).filter(
              (partner) => partner.publish && partner.publish.toLowerCase().trim() === 'publish'
            );
            // Sort partners alphabetically by partner_name (case-insensitive)
            const sorted = published.sort((a, b) => {
              const nameA = (a.partner_name || '').toLowerCase().trim();
              const nameB = (b.partner_name || '').toLowerCase().trim();
              return nameA.localeCompare(nameB);
            });
            setPartners(sorted);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching partners CSV:', error);
        setLoading(false);
      });
  }, []);

  const getLogoUrl = (logoUrl: string) => {
    if (!logoUrl || !logoUrl.trim()) {
      return null;
    }
    // partner_logo_url is always a filename in the partners_logos folder
    return `${import.meta.env.BASE_URL}images/partners_logos/${logoUrl.trim()}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="ucd-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Strategic Partners</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            IC-FOODS collaborates with global institutions to build the semantic infrastructure required for a resilient and equitable global food system.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Offerings Section */}
          <div>
            <h2 className="text-3xl font-bold text-aggie-blue mb-8 text-center">Collaborate With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offerings.map((offering, idx) => (
                <div key={idx} className="group flex items-start space-x-4 bg-aggie-gray p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="bg-white p-2 rounded-lg mt-1 border border-gray-100/30 shadow-sm group-hover:bg-aggie-gold transition-colors">
                    <CheckCircle2 
                      className="text-aggie-blue duration-300" 
                      size={20} 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-aggie-blue mb-1">{offering.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{offering.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-aggie-blue text-white rounded-2xl shadow-lg text-center">
              <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-aggie-gold">Mission-Driven Collaboration</h3>
              <p className="text-blue-100 text-sm leading-relaxed max-w-2xl mx-auto">
                We prioritize partnerships that advance the public good, emphasizing data transparency, ethical AI, and food security. Our collaboration models are designed to be flexible, ranging from rapid technical audits to multi-year research consortia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Network Section with Logos */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-aggie-blue">Our Global Network</h2>
            <div className="w-16 h-1 bg-aggie-gold mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-16 gap-x-8 items-center justify-items-center">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">Loading partners...</div>
            ) : (
              partners.map((partner) => {
                const logoUrl = getLogoUrl(partner.partner_logo_url);
                return (
                  <div key={partner.partner_name} className="flex flex-col items-center group relative w-full">
                    <div className="w-full h-24 flex items-center justify-center p-4">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt={partner.partner_name} 
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.partner_name)}&background=022851&color=fff&size=128&bold=true`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-aggie-gray rounded-lg">
                          <span className="text-xs text-gray-400 font-semibold text-center px-2">
                            {partner.partner_name}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Reveal name on hover as requested */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-center pointer-events-none">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-aggie-blue px-3 py-1">
                        {partner.partner_name}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="mt-24 text-center">
            <p className="text-gray-400 text-xs max-w-2xl mx-auto leading-relaxed border-t border-gray-100 pt-12 italic uppercase tracking-wider">
              IC-FOODS is proud to collaborate with world-leading academic, governmental, and non-governmental organizations to foster an open, standards-based ecosystem for global food data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
