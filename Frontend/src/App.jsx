import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import AppRouter from './router';

export default function App() {
  const theme = useAuthStore((state) => state.theme);

  useEffect(() => {
    // Synchronize document body dark class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <AppRouter />;
}