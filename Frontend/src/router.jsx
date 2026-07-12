import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import AuthPage from './features/auth/pages/AuthPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import AssetDirectoryPage from './features/assets/pages/AssetDirectoryPage';
import RegisterAssetPage from './features/assets/pages/RegisterAssetPage';
import OrganizationSetupPage from './features/organization/pages/OrganizationSetupPage';
import DashboardLayout from './shared/components/DashboardLayout';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/assets',
        element: <Navigate to="/assets/directory" replace />,
      },
      {
        path: '/assets/directory',
        element: <AssetDirectoryPage />,
      },
      {
        path: '/assets/register',
        element: <RegisterAssetPage />,
      },
      {
        path: '/organization',
        element: <OrganizationSetupPage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
