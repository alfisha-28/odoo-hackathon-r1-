import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import AuthPage from './features/auth/pages/AuthPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';

// Route Protection & Dashboard view
function HomeRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <DashboardPage />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRedirect />,
  },
  {
    path: '/dashboard',
    element: <HomeRedirect />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
