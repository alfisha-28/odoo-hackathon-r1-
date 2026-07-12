import { create } from 'zustand';

// Check default system theme
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Check default language
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'EN';
  }
  return 'EN';
};

export const useAuthStore = create((set) => ({
  isAuthenticated: true,
  user: {
    id: 'usr_flowsync_001',
    name: 'John Doe',
    email: 'john.doe@assetflow.com',
    avatar: null,
    role: 'Asset Manager',
    department: 'Operations & IT',
  },
  theme: getInitialTheme(),
  language: getInitialLanguage(),

  login: (userData) => {
    localStorage.setItem('token', 'mock-jwt-token-xyz');
    set({ isAuthenticated: true, user: userData });
  },

  register: (userData) => {
    localStorage.setItem('token', 'mock-jwt-token-xyz');
    set({ isAuthenticated: true, user: userData });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, user: null });
  },

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', nextTheme);
    // Apply dark class to documentElement
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: nextTheme };
  }),

  setLanguage: (lang) => set(() => {
    localStorage.setItem('language', lang);
    return { language: lang };
  }),
}));
