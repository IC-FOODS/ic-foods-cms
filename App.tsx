
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Publications from './pages/Publications';
import AboutUs from './pages/AboutUs';
import Partners from './pages/Partners';
import Conferences from './pages/Conferences';
import Connect from './pages/Connect';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/research" element={<Projects />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/conferences" element={<Conferences />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/connect" element={<Connect />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
