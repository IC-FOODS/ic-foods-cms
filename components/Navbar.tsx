
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [localUser, setLocalUser] = useState('');
  const [localPass, setLocalPass] = useState('');
  const [localError, setLocalError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, isAuthenticated, isLoading, googleLogin, localLogin, logout } = useAuth();

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setLocalLoading(true);
    const err = await localLogin(localUser, localPass);
    setLocalLoading(false);
    if (err) {
      setLocalError(err);
    } else {
      setUserMenuOpen(false);
      setLocalUser('');
      setLocalPass('');
    }
  };

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

            {/* Auth: User icon dropdown */}
            {!isLoading && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-2 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                  title={isAuthenticated ? (user?.email || 'Account') : 'Sign in'}
                >
                  {isAuthenticated && user ? (
                    <div className="w-8 h-8 rounded-full bg-aggie-gold text-aggie-blue flex items-center justify-center text-sm font-bold">
                      {(user.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </div>
                  ) : (
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  )}
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-4 py-3 border-b bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">
                            {user.first_name || user.username} {user.last_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <a
                          href="//localhost:8010/cms/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                          <span>CMS</span>
                        </a>
                        <a
                          href="//localhost:8010/admin/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Django Admin</span>
                        </a>
                        <div className="border-t">
                          <button
                            onClick={() => { setUserMenuOpen(false); logout(); }}
                            className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            <span>Sign out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b bg-gray-50">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sign in</p>
                        </div>

                        {/* Google OAuth */}
                        <button
                          onClick={() => { setUserMenuOpen(false); googleLogin(); }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          <span>Continue with Google</span>
                        </button>

                        {/* Local login form */}
                        <form onSubmit={handleLocalLogin} className="px-4 py-3 space-y-2">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Admin login</p>
                          <input
                            type="text"
                            placeholder="Username"
                            value={localUser}
                            onChange={(e) => setLocalUser(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-aggie-blue text-gray-900"
                            autoComplete="username"
                          />
                          <input
                            type="password"
                            placeholder="Password"
                            value={localPass}
                            onChange={(e) => setLocalPass(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-aggie-blue text-gray-900"
                            autoComplete="current-password"
                          />
                          {localError && (
                            <p className="text-xs text-red-600">{localError}</p>
                          )}
                          <button
                            type="submit"
                            disabled={localLoading || !localUser || !localPass}
                            className="w-full py-1.5 text-sm font-medium text-white bg-aggie-blue rounded-md hover:bg-aggie-blueLight disabled:opacity-50 transition-colors"
                          >
                            {localLoading ? 'Signing in…' : 'Sign in'}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                )}
              </div>
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
                <div className="border-t border-blue-800 mt-2 pt-3 space-y-3">
                  <button
                    onClick={() => { setIsOpen(false); googleLogin(); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-aggie-blue"
                  >
                    Sign in with Google
                  </button>
                  <form onSubmit={(e) => { handleLocalLogin(e).then(() => setIsOpen(false)); }} className="px-3 space-y-2 pb-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Admin login</p>
                    <input
                      type="text"
                      placeholder="Username"
                      value={localUser}
                      onChange={(e) => setLocalUser(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-aggie-gold text-gray-900"
                      autoComplete="username"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={localPass}
                      onChange={(e) => setLocalPass(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-aggie-gold text-gray-900"
                      autoComplete="current-password"
                    />
                    {localError && <p className="text-xs text-red-400">{localError}</p>}
                    <button
                      type="submit"
                      disabled={localLoading || !localUser || !localPass}
                      className="w-full py-1.5 text-sm font-medium text-aggie-blue bg-aggie-gold rounded-md hover:bg-white disabled:opacity-50 transition-colors"
                    >
                      {localLoading ? 'Signing in…' : 'Sign in'}
                    </button>
                  </form>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
