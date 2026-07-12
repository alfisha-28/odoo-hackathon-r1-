import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import AuthPage from './features/auth/pages/AuthPage';

// Simple Route Protection & Welcome Screen
function HomeRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#090514] p-6 text-center transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-300/10 dark:bg-primary-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/5 dark:bg-blue-900/10 blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full bg-white dark:bg-[#120c24] border border-gray-150 dark:border-white/5 rounded-3xl p-8 shadow-xl flex flex-col items-center relative z-10">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-primary-500 shadow-md" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold border-2 border-primary-500 shadow-md">
            {user?.name?.slice(0, 2).toUpperCase() || 'US'}
          </div>
        )}
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mt-4">Welcome, {user?.name}!</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{user?.email}</p>
        
        <div className="mt-6 w-full text-left bg-gray-50 dark:bg-black/20 p-4.5 rounded-2xl border border-gray-150 dark:border-white/5">
          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Access Clearance</div>
          <div className="text-sm font-bold text-gray-700 dark:text-gray-200 mt-1">{user?.role}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.department}</div>
        </div>

        <button
          type="button"
          onClick={() => useAuthStore.getState().logout()}
          className="mt-6 w-full py-3.5 bg-red-500 hover:bg-red-650 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 cursor-pointer text-sm"
        >
          Logout Session
        </button>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
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
