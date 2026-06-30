import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

// Import your newly created single-file landing system
import NymLanding from "./NymLanding";

// Import your application's modular page components
// (Double-check your file tree paths for these views!)
import Dashboard from "./pages/Dashboard";
import Food from "./pages/Food";
import Workouts from "./pages/Workouts";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Leaderboard from "./pages/Leaderboard";

// Initialize the master Supabase authenticator check
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Automatically monitor if a user is securely logged in via Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a loading screen while Supabase confirms user authentication tokens
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d11] flex items-center justify-center font-mono text-pink-400">
        INITIALIZING NYMFIT SYSTEM v3.7...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* LANDING PAGE ROUTE */}
        {/* If logged in, skip landing and push straight to internal dashboard */}
        <Route 
          path="/" 
          element={session ? <Navigate to="/dashboard" replace /> : <NymLanding />} 
        />

        {/* SECURE APPLICATION ROUTES */}
        {/* If a random visitor tries to access these paths, they get rejected back to landing */}
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard session={session} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/food" 
          element={session ? <Food session={session} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/workouts" 
          element={session ? <Workouts session={session} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/profile" 
          element={session ? <Profile session={session} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/community" 
          element={session ? <Community session={session} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/leaderboard" 
          element={session ? <Leaderboard session={session} /> : <Navigate to="/" replace />} 
        />

        {/* FALLBACK ROUTE: Catch-all broken links redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
