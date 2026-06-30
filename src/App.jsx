import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// FIXED PATHS: Changed from "@/" to normal relative paths
import { Toaster } from "./components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from './lib/query-client'
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { UserProvider, useUser } from './lib/UserContext';
import UserNotRegisteredError from './components/UserNotRegisteredError';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import InstallBanner from './components/InstallBanner';
import GlobalAnnouncementPopup from './components/GlobalAnnouncementPopup';
import PwaGuard from './components/PwaGuard';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Lazy-loaded pages
const Landing   = lazy(() => import('./pages/NymLanding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Food      = lazy(() => import('./pages/Food'));
const Profile   = lazy(() => import('./pages/Profile'));
const Admin       = lazy(() => import('./pages/Admin'));
const BodyProgress = lazy(() => import('./pages/BodyProgress'));
const Workouts     = lazy(() => import('./pages/Workouts'));
const Community    = lazy(() => import('./pages/Community'));
const Leaderboard  = lazy(() => import('./pages/Leaderboard'));



const pageVariants = {
  initial:  { opacity: 0, x: 18 },
  animate:  { opacity: 1, x: 0,  transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:     { opacity: 0, x: -18, transition: { duration: 0.16, ease: 'easeIn' } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="font-display text-2xl animate-pulse" style={{ background: 'linear-gradient(135deg, #1a6bbf 0%, #5bc8f5 35%, #f9a8d4 65%, #be185d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>NymFit</div>
          </div>
        }>
          <Routes location={location}>
            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Public routes */}
            <Route path="/" element={<Landing />} />

            {/* Protected app routes */}
            <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/food" element={<Food />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/body-progress" element={<BodyProgress />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/community" element={<Community />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Route>
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

// REMOVED: DynamicFavicon. Real applications configure fallback favicons via standard public/index.html assets.
// REMOVED: MaintenanceGate. Network configurations for locking down development environments are managed via Vercel platform toggles.

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="font-display text-3xl animate-pulse" style={{ background: 'linear-gradient(135deg, #1a6bbf 0%, #5bc8f5 35%, #f9a8d4 65%, #be185d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>NymFit</div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <PwaGuard>
      <AnimatedRoutes />
    </PwaGuard>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <UserProvider>
            <AuthenticatedApp />
          </UserProvider>
        </Router>
        <InstallBanner />
        <GlobalAnnouncementPopup />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
