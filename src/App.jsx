import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Core clean landing page
import Landing from './pages/NymLanding';

// Core feature views (Ensure you have these files in your src/pages folder!)
// const Dashboard = lazy(() => import('./pages/Dashboard'));
//const Food      = lazy(() => import('./pages/Food'));
//const Workouts  = lazy(() => import('./pages/Workouts'));
//const Profile   = lazy(() => import('./pages/Profile'));

export default function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#0d0d11] font-mono text-pink-400">
          INITIALIZING NYMFIT SYSTEM v3.7...
        </div>
      }>
        <Routes>
          {/* Public Routing */}
          <Route path="/" element={<Landing />} />

          {/* Core Feature Routing */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/food" element={<Food />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/profile" element={<Profile />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
