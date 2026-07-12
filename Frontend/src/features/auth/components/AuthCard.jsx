import { useState, useEffect } from 'react';
import { Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { login, register, forgotPassword } from '../services/authService';
import { useAuthStore } from '../../../store/useAuthStore';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Checkbox from '../../../shared/components/ui/Checkbox';

export default function AuthCard() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Checkbox states
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Password strength state (for registration)
  const [pwStrength, setPwStrength] = useState({ score: 0, text: '', color: 'bg-gray-200' });

  const loginStoreAction = useAuthStore((state) => state.login);
  const registerStoreAction = useAuthStore((state) => state.register);

  // Clear messages when tab changes
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setName('');
    setRememberMe(false);
    setAgreeTerms(false);
  }, [activeTab]);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPwStrength({ score: 0, text: '', color: 'bg-gray-200' });
      return;
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let text = 'Weak';
    let color = 'bg-red-500';
    
    if (score === 2) {
      text = 'Medium';
      color = 'bg-yellow-500';
    } else if (score === 3) {
      text = 'Strong';
      color = 'bg-green-500';
    } else if (score === 4) {
      text = 'Very Strong';
      color = 'bg-emerald-600';
    }

    setPwStrength({ score, text, color });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const user = await login(email, password);
        loginStoreAction(user);
        setSuccessMsg(`Welcome back, ${user.name}!`);
      } else if (activeTab === 'register') {
        if (!agreeTerms) {
          throw new Error('You must agree to the Terms of Service.');
        }
        const user = await register(name, email, password);
        registerStoreAction(user);
        setSuccessMsg(`Account created successfully for ${user.name}!`);
      } else if (activeTab === 'forgot') {
        const res = await forgotPassword(email);
        setSuccessMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Google SVG
  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 select-none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );

  // Microsoft SVG
  const MicrosoftIcon = () => (
    <svg viewBox="0 0 23 23" className="w-5 h-5 select-none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="11" height="11" fill="#F25022" />
      <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
      <rect x="0" y="12" width="11" height="11" fill="#00A1F1" />
      <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
    </svg>
  );

  // Custom Shield Outline
  const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#7C3AED] dark:text-[#a78bfa] fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );

  return (
    <div className="w-full max-w-[450px] bg-white/95 dark:bg-[#110d26]/95 border border-gray-100/50 dark:border-white/5 rounded-[40px] p-9 shadow-2xl relative transition-all duration-300">
      
      {/* Decorative top-right card corner light glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-3xl pointer-events-none" />

      {/* Card Header Orb with FlowSync Vector Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-24 h-24 flex items-center justify-center mb-1">
          {/* Orbital Rings */}
          <div className="absolute inset-0 rounded-full border border-dashed border-gray-150 dark:border-white/10 animate-spin" style={{ animationDuration: '24s' }} />
          <div className="absolute inset-2.5 rounded-full border border-gray-200/60 dark:border-white/10" />
          <div className="absolute inset-5 rounded-full border border-dashed border-primary-500/15 dark:border-primary-400/10 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
          
          {/* Orbital Nodes */}
          <div className="absolute w-1.5 h-1.5 rounded-full bg-[#7C3AED] dark:bg-primary-400 top-0 left-1/2 -translate-x-1/2 shadow shadow-[#7c3aed]/55" />
          <div className="absolute w-1 h-1 rounded-full bg-indigo-400 bottom-3 right-6" />
          <div className="absolute w-1 h-1 rounded-full bg-indigo-500 top-4 right-4" />

          {/* Logo container */}
          <div className="w-15 h-15 rounded-full bg-white dark:bg-[#19133a] border border-gray-150 dark:border-white/10 flex items-center justify-center text-[#7C3AED] dark:text-[#a78bfa] shadow-md z-10 transition-colors">
            <svg viewBox="0 0 100 100" fill="none" className="w-9 h-9 stroke-current stroke-[8]">
              <path d="M50 5L90 28.1V74.4L50 97.5L10 74.4V28.1L50 5Z" strokeLinejoin="round" />
              <path d="M50 25L71.6 37.5V62.5L50 75L28.4 62.5V37.5L50 25Z" fill="currentColor" fillOpacity="0.2" strokeWidth="4" />
              <circle cx="50" cy="50" r="10" fill="currentColor" />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-3 text-center tracking-tight">
          {activeTab === 'forgot' ? 'Reset Password' : (
            <>Welcome to <span className="text-[#7C3AED] dark:text-[#a78bfa] font-extrabold">FlowSync</span></>
          )}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-center font-medium">
          {activeTab === 'forgot'
            ? 'Enter your email to receive recovery instructions'
            : 'Secure access to your enterprise account'}
        </p>
      </div>

      {/* Tabs */}
      {activeTab !== 'forgot' && (
        <div className="border border-gray-200/80 dark:border-white/10 p-1 rounded-2xl flex gap-1 mb-6 bg-gray-50/50 dark:bg-black/10 relative">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-md shadow-[#7c3aed]/25'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-transparent'
            }`}
          >
            <User className="w-4.5 h-4.5" />
            Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-md shadow-[#7c3aed]/25'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-transparent'
            }`}
          >
            <UserPlus className="w-4.5 h-4.5" />
            Create Account
          </button>
        </div>
      )}

      {/* Feedback Alerts */}
      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/30 text-xs font-semibold text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200/60 dark:border-green-900/30 text-xs font-semibold text-green-600 dark:text-green-400">
          {successMsg}
        </div>
      )}

      {/* Form Submission */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name field (Register only) */}
        {activeTab === 'register' && (
          <Input
            id="register-name"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={User}
            required
            disabled={loading}
          />
        )}

        {/* Email field (Always shown) */}
        <Input
          id="auth-email"
          label="Work Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          required
          disabled={loading}
        />

        {/* Password field (Login / Register only) */}
        {activeTab !== 'forgot' && (
          <div className="flex flex-col gap-1.5">
            <Input
              id="auth-password"
              label="Password"
              type="password"
              placeholder={activeTab === 'register' ? 'Create a secure password' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              disabled={loading}
            />
            
            {/* Password Strength Indicator (Register only) */}
            {activeTab === 'register' && password && (
              <div className="mt-1 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400 font-medium">Strength:</span>
                  <span className="font-bold text-gray-600 dark:text-gray-300">{pwStrength.text}</span>
                </div>
                <div className="h-1 w-full bg-gray-150 dark:bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        i <= pwStrength.score ? pwStrength.color : 'bg-gray-200 dark:bg-white/5'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Checkbox / Forgot Link (Login / Register specific) */}
        {activeTab === 'login' && (
          <div className="flex items-center justify-between mt-1 mb-1">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              label="Remember me"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setActiveTab('forgot')}
              className="text-xs font-bold text-[#7C3AED] dark:text-[#a78bfa] hover:text-[#5b21b6] dark:hover:text-[#c084fc] transition-colors cursor-pointer select-none"
            >
              Forgot password?
            </button>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="mt-1 mb-1">
            <Checkbox
              id="agree-terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              label="I agree to the Terms of Service & Privacy Policy"
              disabled={loading}
            />
          </div>
        )}

        {activeTab === 'forgot' && (
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className="text-xs font-bold text-[#7C3AED] dark:text-[#a78bfa] hover:text-[#5b21b6] dark:hover:text-[#c084fc] transition-colors cursor-pointer select-none text-center self-center"
          >
            Back to Login
          </button>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          className="w-full py-3.5 mt-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white hover:from-[#6d28d9] hover:to-[#5b21b6] shadow-md shadow-[#7c3aed]/20 transition-all duration-300 group"
        >
          {activeTab === 'login' ? 'Continue' : activeTab === 'register' ? 'Create Account' : 'Send Instructions'}
          {activeTab !== 'forgot' && !loading && (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </Button>
      </form>

      {/* Social login integration (Login/Register only) */}
      {activeTab !== 'forgot' && (
        <>
          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-150 dark:border-white/5"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">or continue with</span>
            <div className="flex-grow border-t border-gray-150 dark:border-white/5"></div>
          </div>

          {/* Social login grid */}
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => alert('Mocking Google SSO')}
              className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 flex justify-center items-center shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-95"
            >
              <GoogleIcon />
            </button>
            <button
              type="button"
              onClick={() => alert('Mocking Microsoft SSO')}
              className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 flex justify-center items-center shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-95"
            >
              <MicrosoftIcon />
            </button>
            <button
              type="button"
              onClick={() => alert('Mocking Custom SSO Shield')}
              className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 flex justify-center items-center shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ShieldIcon />
            </button>
          </div>

          {/* Terms info */}
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-6 text-center leading-relaxed max-w-xs mx-auto font-medium">
            By continuing, you agree to our{' '}
            <a href="#" className="font-bold text-[#7C3AED] dark:text-[#a78bfa] hover:underline">
              Terms of Service
            </a>{' '}
            and acknowledge our{' '}
            <a href="#" className="font-bold text-[#7C3AED] dark:text-[#a78bfa] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}
