import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import MoodCycle from './pages/MoodCycle';
import AdvicePanel from './pages/ChatBot';

const navItems = [
  { to: '/chat', label: 'Akıllı Öneriler', color: 'bg-gradient-to-r from-green-600 to-green-400' },
  { to: '/MoodCycle', label: 'MoodCycle', color: 'bg-gradient-to-r from-green-700 to-green-400' },
];

function NavBar() {
  const location = useLocation();
  return (
    <nav className="flex gap-4 p-4 bg-gradient-to-r from-green-50 to-green-200 shadow rounded-b-xl justify-center">
      {navItems.map(item => (
        <Link
          key={item.to}
          to={item.to}
          className={`px-4 py-2 rounded-full text-white font-semibold shadow transition-all duration-200 hover:scale-105 ${item.color} ${location.pathname === item.to ? 'ring-4 ring-yellow-200' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
        <NavBar />
        <main className="p-4 max-w-2xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" />} />
            <Route path="/chat" element={<AdvicePanel />} />
            <Route path="/MoodCycle" element={<MoodCycle />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
} 