import React, { useState, useEffect } from 'react';
import { CheckCircle2, Star, Globe2 } from 'lucide-react';
import Papa from 'papaparse';

interface Partner {
  name: string;
  logoUrl: string;
}

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const offerings = [
    {
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
    fetch('/partners.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setPartners(results.data as Partner[]);
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
            <h2 className="text-3xl font-bold text-aggie-blue mb-8 text-center">What We Offer Our Partners</h2>
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

      {/* Partner Success Story Section */}
      <section className="bg-aggie-gray py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-aggie-blue mt-2">Success Story: Global Hunger Initiative</h2>
          </div>
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row border border-gray-200">
            <div className="md:w-1/2 bg-aggie-blue p-12 text-white flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-6">
                <Star className="text-aggie-gold fill-aggie-gold" size={24} />
                <span className="text-lg font-bold tracking-tight uppercase">Impact Highlights</span>
              </div>
              <p className="text-blue-100 text-lg leading-relaxed mb-6 italic">
                "Working with IC-FOODS allowed us to finally see the invisible gaps in our distribution network. Their semantic framework turned raw spreadsheets into life-saving insights for thousands of households."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Globe2 size={24} className="text-aggie-gold" />
                </div>
                <div>
                  <p className="font-bold">Regional Logistics Director</p>
                  <p className="text-sm text-blue-300">Global Hunger Initiative (GHI)</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-12">
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">The Collaboration</h4>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    We partnered with GHI to develop the "Last-Mile Delivery Ontology," a specialized semantic bridge that connects diverse agricultural logistics data with local nutritional requirement databases across East Africa.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-aggie-blue uppercase tracking-widest mb-2">Problem Solved</h4>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Prior to our intervention, disconnected data silos meant urban food centers couldn't accurately predict fleet availability in rural zones, leading to a 15% spoilage rate in perishable nutritional supplements.
                  </p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                  <h4 className="text-xs font-bold text-aggie-gold uppercase tracking-widest mb-2">Measured Impact</h4>
                  <p className="text-aggie-blue font-medium">
                    Real-time semantic synchronization reduced logistical spoilage by <span className="text-2xl font-black">30%</span> and improved supply chain transparency by <span className="text-2xl font-black">85%</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              partners.map((partner) => (
              <div key={partner.name} className="flex flex-col items-center group relative w-full">
                <div className="w-full h-24 flex items-center justify-center p-4 grayscale">
                  <img 
                    src={partner.logoUrl} 
                    alt={partner.name} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=022851&color=fff&size=128&bold=true`;
                    }}
                  />
                </div>
                {/* Reveal name on hover as requested */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-center pointer-events-none">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-aggie-blue px-3 py-1">
                    {partner.name}
                  </span>
                </div>
              </div>
              ))
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