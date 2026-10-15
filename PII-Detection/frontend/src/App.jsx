import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';

// Pages
import Dashboard from './pages/Dashboard.jsx';
import DocumentScanner from './pages/DocumentScanner.jsx';
import TextScanner from './pages/TextScanner.jsx';
import DetectionResults from './pages/DetectionResults.jsx';
import ScanHistory from './pages/ScanHistory.jsx';
import SecurityReport from './pages/SecurityReport.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

import { authService } from './services/auth.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Check initial authentication or demo session
    const unsubscribe = authService.onStateChange((currentUser) => {
      setUser(currentUser);
      setAuthInitialized(true);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center text-cyan-400 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <span>Initializing GovPII Security Environment...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Unauthenticated Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login onAuthSuccess={setUser} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register onAuthSuccess={setUser} /> : <Navigate to="/" replace />} 
        />

        {/* Protected Application Routes */}
        <Route
          path="/*"
          element={
            user ? (
              <div className="flex min-h-screen bg-[#0a0d14] text-slate-100 font-sans">
                {/* Fixed Cybersecurity Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                  <Navbar user={user} onLogout={handleLogout} />
                  <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/scanner/document" element={<DocumentScanner />} />
                      <Route path="/scanner/text" element={<TextScanner />} />
                      <Route path="/results/:id?" element={<DetectionResults />} />
                      <Route path="/history" element={<ScanHistory />} />
                      <Route path="/reports/:id?" element={<SecurityReport />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
