
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'R&D', path: '/research' },
    { name: 'Publications', path: '/publications' },
    { name: 'Partners', path: '/partners' },
    { name: 'About', path: '/about' },
    { name: 'Conferences', path: '/conferences' },
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
                  src={`${import.meta.env.BASE_URL}images/ic-foods-logo.png`}
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
              Connect
            </Link>

            {/* Auth: Sign In / User Menu */}
            {!isLoading && (
              isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-400 hover:border-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-aggie-gold text-aggie-blue flex items-center justify-center text-xs font-bold">
                      {(user.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-200 hidden lg:inline">
                      {user.first_name || user.email?.split('@')[0]}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={login}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-200 hover:bg-white/10 hover:border-white transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign in</span>
                </button>
              )
            )}
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
            {/* Mobile auth */}
            {!isLoading && (
              isAuthenticated && user ? (
                <div className="border-t border-blue-800 mt-2 pt-2">
                  <div className="px-3 py-2 text-sm text-gray-300">
                    {user.first_name || user.email?.split('@')[0]}
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); logout(); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-aggie-blue"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsOpen(false); login(); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-aggie-blue mt-2 border-t border-blue-800 pt-3"
                >
                  Sign in with Google
                </button>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
