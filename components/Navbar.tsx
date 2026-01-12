
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Projects', path: '/projects' },
    { name: 'Publications', path: '/publications' },
    { name: 'Partners', path: '/partners' },
    { name: 'About Us', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-aggie-blue sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-3 group">
              <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src="https://images.squarespace-cdn.com/content/v1/59a9c2ff8dd041f31701dea3/1602745366392-62IIKPSCRXAO464UJ4HA/IC-FOODS+Logo+Better.png"
                  alt="IC-FOODS Cube Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-10 h-10 bg-aggie-gold rounded flex items-center justify-center font-bold text-aggie-blue text-xl">IC</div>';
                    }
                  }}
                />
              </div>
              <span className="text-white text-xl font-bold tracking-tight">IC-FOODS</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-aggie-gold border-b-2 border-aggie-gold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/connect"
              className="bg-aggie-gold text-aggie-blue px-4 py-2 rounded-md text-sm font-bold hover:bg-white transition-all"
            >
              Connect With Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-aggie-blueLight border-t border-blue-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-aggie-blue text-aggie-gold'
                    : 'text-gray-300 hover:text-white hover:bg-aggie-blue'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/connect"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-bold bg-aggie-gold text-aggie-blue"
            >
              Connect With Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
