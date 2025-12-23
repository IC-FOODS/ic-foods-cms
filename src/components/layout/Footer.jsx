/**
 * Footer Component
 * Site footer with links and contact information
 */

import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Research: [
      { path: '/projects', label: 'Projects' },
      { path: '/publications', label: 'Publications' },
      { path: '/events', label: 'Events' },
    ],
    Organization: [
      { path: '/about', label: 'About Us' },
      { path: '/team', label: 'Team' },
      { path: '/contact', label: 'Contact' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IC</span>
              </div>
              <span className="text-xl font-bold text-white">IC-FOODS</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              International Consortium for Food Systems Research. Advancing
              global food security through innovative research, data-driven
              insights, and collaborative partnerships.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:contact@ic-foods.org"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/ic-foods"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/icfoods"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            © {currentYear} IC-FOODS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

