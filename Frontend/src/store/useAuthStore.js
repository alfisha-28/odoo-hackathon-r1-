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

const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const getInitialAuth = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
};

export const useAuthStore = create((set) => ({
  isAuthenticated: getInitialAuth(),
  user: getInitialUser(),
  theme: getInitialTheme(),
  language: getInitialLanguage(),

  login: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    set({ isAuthenticated: true, user: userData });
  },

  register: (userData) => {
    // If registration automatically logs user in or requires manual log in,
    // handle it here. Otherwise redirect them.
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', nextTheme);
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
