import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import HistoryPage from '@/pages/HistoryPage';
import ItineraryDetailPage from '@/pages/ItineraryDetailPage';
import SharePage from '@/pages/SharePage';
import NotFoundPage from '@/pages/NotFoundPage';
import useAuthStore from '@/store/authStore';
import { getMe } from '@/api/auth.api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

const AuthInit = () => {
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;
    getMe()
      .then(({ data }) => setAuth(data.data.user, token))
      .catch(() => clearAuth());
  }, []);

  return null;
};

const AUTH_PATHS = ['/login', '/register'];

const AppRoutes = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={accessToken ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
          <Route path="/login" element={accessToken ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={accessToken ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
          <Route path="/s/:shareToken" element={<SharePage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthInit />
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
