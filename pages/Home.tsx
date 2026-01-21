
import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Globe } from 'lucide-react';

const OntologyBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate a stable set of random dots (all white)
  const dots = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 5 + 2,
    }));
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  const PROXIMITY_THRESHOLD = 20; // percentage radius for visibility and influence
  const ATTRACTION_FORCE = 0.35; // Strength of pull towards cursor

  // Calculate visual positions with attraction and visibility states
  const dotsWithPhysics = dots.map(dot => {
    const dx = mousePos.x - dot.x;
    const dy = mousePos.y - dot.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    let visualX = dot.x;
    let visualY = dot.y;
    let isVisible = false;
    let opacity = 0;

    if (dist < PROXIMITY_THRESHOLD) {
      const force = (1 - dist / PROXIMITY_THRESHOLD) * ATTRACTION_FORCE;
      visualX += dx * force;
      visualY += dy * force;
      isVisible = true;
      // Calculate opacity based on proximity: 1 at center, 0 at threshold
      opacity = Math.pow(1 - dist / PROXIMITY_THRESHOLD, 1.5);
    }

    return { ...dot, visualX, visualY, distToMouse: dist, isVisible, opacity };
  });

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 pointer-events-auto overflow-hidden select-none"
    >
      <svg className="w-full h-full">
        {/* Render connections (Only between visible dots and hub) */}
        {dotsWithPhysics.map((dot, i) => {
          if (dot.isVisible) {
            return (
              <g key={`links-${dot.id}`}>
                {/* Connection to cursor hub (Yellow Dot) */}
                <line 
                  x1={`${dot.visualX}%`} 
                  y1={`${dot.visualY}%`} 
                  x2={`${mousePos.x}%`} 
                  y2={`${mousePos.y}%`} 
                  stroke="white" 
                  strokeWidth="0.8" 
                  opacity={dot.opacity * 0.6}
                  style={{ transition: 'opacity 0.3s ease-out' }}
                />
                
                {/* Connections to other nearby visible dots */}
                {dotsWithPhysics.slice(i + 1).map(otherDot => {
                  if (!otherDot.isVisible) return null;
                  
                  const ddx = dot.visualX - otherDot.visualX;
                  const ddy = dot.visualY - otherDot.visualY;
                  const distDots = Math.sqrt(ddx * ddx + ddy * ddy);

                  if (distDots < 10) {
                    return (
                      <line 
                        key={`inter-link-${dot.id}-${otherDot.id}`}
                        x1={`${dot.visualX}%`} 
                        y1={`${dot.visualY}%`} 
                        x2={`${otherDot.visualX}%`} 
                        y2={`${otherDot.visualY}%`} 
                        stroke="white" 
                        strokeWidth="0.4" 
                        opacity={Math.min(dot.opacity, otherDot.opacity) * 0.3}
                        style={{ transition: 'opacity 0.3s ease-out' }}
                      />
                    );
                  }
                  return null;
                })}
              </g>
            );
          }
          return null;
        })}

        {/* Render the dots (White, fade in only when near hub) */}
        {dotsWithPhysics.map(dot => (
          <circle 
            key={dot.id}
            cx={`${dot.visualX}%`}
            cy={`${dot.visualY}%`}
            r={dot.size}
            fill="white"
            style={{ 
              opacity: dot.opacity,
              transition: 'cx 0.5s cubic-bezier(0.23, 1, 0.32, 1), cy 0.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease-out',
            }}
          />
        ))}

        {/* Cursor Node Hub (Yellow Dot) */}
        {mousePos.x > -500 && (
          <circle 
            cx={`${mousePos.x}%`} 
            cy={`${mousePos.y}%`} 
            r="8" 
            fill="#FFBF00" 
            className="animate-pulse"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255, 191, 0, 0.6))' }}
          />
        )}
      </svg>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section with Hidden Interactive Background */}
      <section className="ucd-gradient text-white py-20 lg:py-32 relative overflow-hidden">
        
        {/* Interactive Background Layer */}
        <OntologyBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pointer-events-none">
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight pointer-events-auto">
            Connecting the Dots of the <span className="text-aggie-gold">Global Food System since 2016</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed pointer-events-auto">
            At the International Center for Food Ontology Operability Data and Semantics (IC-FOODS), we build cyberinfrastructure for the emerging Internet of Food.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pointer-events-auto">
            <button
              onClick={() => navigate('/research')}
              className="bg-aggie-gold text-aggie-blue px-8 py-3 rounded-md font-bold text-lg hover:bg-white transition-all shadow-lg"
            >
              Explore Our Work
            </button>
            <button 
              onClick={() => navigate('/connect')}
              className="border-2 border-white text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-white hover:text-aggie-blue transition-all">
              Collaborate With Us
            </button>
          </div>
        </div>
      </section>

      {/* Problem / Why Now / How Section */}
      <section className="py-20 bg-aggie-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-aggie-blue">The Challenge We're Solving</h2>
            <div className="w-24 h-1 bg-aggie-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-6">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">The Problem</h3>
              <p className="text-gray-600 leading-relaxed">
                Food data is "siloed." A hospital's nutrition data can't talk to a supermarket's inventory, and neither can talk to a farmer's climate reports. This makes solving global hunger or improving public health nearly impossible at scale.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-aggie-blueLight rounded-lg flex items-center justify-center mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Why Now?</h3>
              <p className="text-gray-600 leading-relaxed">
                We are facing a "Perfect Storm": Climate change is disrupting crops, AI needs high-quality data to be useful, and global supply chains are more fragile than ever. We can no longer afford to work in the dark.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 text-aggie-gold rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">How We Solve It</h3>
              <p className="text-gray-600 leading-relaxed">
                We build <strong>Interoperable Standards</strong>. We don't just collect data; we build the infrastructure that allows *everyone* to share data safely, ethically, and accurately across the entire food system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plain Language Explainer Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mt-2 mb-6">What is "Food Ontology" in plain English?</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Imagine a massive library where every book is written in a different secret code. Scientists, farmers, and doctors all have their own "codes" for food.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong>An ontology is the master translation key.</strong> It's a structured map that tells computers: "A 'Golden Delicious' isn't just a word; it's a type of Apple, it contains Vitamin C, and it belongs to the Fruit category." By creating these standard definitions, we let different systems talk to each other for the first time.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-aggie-gray p-12 rounded-3xl shadow-sm relative overflow-hidden">
                <p className="text-2xl font-medium text-aggie-blue leading-relaxed italic relative z-10">
                  "It's like GPS for food data. Without the map, you're just looking at numbers. With the map, you see the whole journey from farm to fork."
                </p>
                <div className="mt-8 flex items-center space-x-3">
                  <div className="h-1 w-8 bg-aggie-gold rounded-full"></div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-aggie-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-aggie-gold mb-2">80+</div>
              <div className="text-sm uppercase tracking-widest text-gray-300">Global Partners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-aggie-gold mb-2">20+</div>
              <div className="text-sm uppercase tracking-widest text-gray-300">Ontology / Standards Co-Developed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-aggie-gold mb-2">$60M+</div>
              <div className="text-sm uppercase tracking-widest text-gray-300">Collaborative Research Funded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-aggie-gold mb-2">25+</div>
              <div className="text-sm uppercase tracking-widest text-gray-300">Publications</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
