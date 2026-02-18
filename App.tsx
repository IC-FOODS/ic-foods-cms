
import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import AboutUs from './pages/AboutUs';
import Partners from './pages/Partners';
import Conferences from './pages/Conferences';
import Connect from './pages/Connect';
import AuthCallback from './pages/AuthCallback';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './lib/AuthContext';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/research" element={<Projects />} />
              <Route path="/publications" element={<Navigate to="/research?tab=publications" replace />} />
              <Route path="/conferences" element={<Conferences />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
