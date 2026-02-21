import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importing the pages from the previous response
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      {/* A simple global navigation bar so you can test all 3 pages */}
      <nav className="bg-slate-900 text-white p-4 flex gap-6 justify-center border-b border-slate-800 relative z-50">
        <Link to="/" className="hover:text-blue-400 transition-colors">Landing Page</Link>
        <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
        <Link to="/profile" className="hover:text-blue-400 transition-colors">Developer Profile</Link>
      </nav>

      {/* The routing system that switches the page content */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;