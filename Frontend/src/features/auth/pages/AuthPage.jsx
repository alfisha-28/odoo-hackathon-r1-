import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import AuthCard from '../components/AuthCard';

export default function AuthPage() {
  const { language, setLanguage } = useAuthStore();
  const [langOpen, setLangOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' },
  ];

  const handleLangSelect = (code) => {
    setLanguage(code);
    setLangOpen(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between p-6 lg:p-10 font-sans bg-cover bg-center bg-no-repeat relative transition-colors duration-300 select-none"
      style={{ backgroundImage: `url('/auth-background.png')` }}
    >
      {/* Dark overlay for dark theme, very transparent light overlay for light theme */}
      <div className="absolute inset-0 bg-transparent dark:bg-[#070310]/15 pointer-events-none transition-colors duration-300" />

      {/* Global Control Utilities (Top Right) */}
      <div className="flex items-center justify-end gap-6 z-20 self-end">
        {/* Language Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[#7C3AED] dark:hover:text-[#a78bfa] transition-colors cursor-pointer select-none py-1.5 px-2"
          >
            <Globe className="w-4.5 h-4.5 text-gray-655 dark:text-gray-350" />
            <span>{language}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <>
              {/* Backdrop Clicker */}
              <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
              
              {/* Floating Dropdown */}
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#120c24] border border-gray-150 dark:border-white/5 rounded-2xl shadow-xl py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLangSelect(lang.code)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                      language === lang.code
                        ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400'
                        : 'text-gray-750 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {lang.name}
                    {language === lang.code && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Central Auth Card Container - Placed to the Right on Desktop */}
      <div className="my-auto py-8 w-full flex justify-center lg:justify-end items-center z-10 lg:pr-[6%] xl:pr-[9%]">
        <AuthCard />
      </div>

      {/* Notice only visible on mobile (since background pre-renders it on desktop at the bottom left) */}
      <div className="lg:hidden flex items-center justify-center gap-2.5 z-10 mt-auto">
        <div className="bg-white/80 dark:bg-black/40 border border-gray-200/50 dark:border-white/5 rounded-full px-3.5 py-1.5 shadow-sm flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 tracking-wide">All systems operational</span>
        </div>
      </div>
    </div>
  );
}
