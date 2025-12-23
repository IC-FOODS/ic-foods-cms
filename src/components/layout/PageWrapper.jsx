/**
 * PageWrapper Component
 * Consistent page layout wrapper with navbar and footer
 */

import Navbar from './Navbar';
import Footer from './Footer';

export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

