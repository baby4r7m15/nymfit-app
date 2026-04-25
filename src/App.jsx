import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { UserProvider } from '@/lib/UserContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import LoginScreen from '@/components/LoginScreen';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Diet from '@/pages/Diet';
import Workouts from '@/pages/Workouts';
import Tracker from '@/pages/Tracker';
import ProgressPage from '@/pages/Progress';
import Profile from '@/pages/Profile';
import Community from '@/pages/Community';
import AdminDashboard from '@/pages/AdminDashboard';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-sniff-gradient">
        <div className="font-display text-3xl text-primary animate-pulse">NymFit</div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { return <LoginScreen />; }
  }

  return (
    <Routes>
      {/* Public landing */}
      <Route path="/" element={<Landing />} />

      {/* App shell — all authenticated pages get the sidebar */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
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
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;