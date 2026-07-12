import { useState, useEffect } from 'react';
import { Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';
import { login, register } from '../services/authService';
import { useAuthStore } from '../../../store/useAuthStore';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Checkbox from '../../../shared/components/ui/Checkbox';

export default function AuthCard() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [pwStrength, setPwStrength] = useState({ score: 0, text: '', color: 'bg-gray-200' });

  const loginStoreAction = useAuthStore((state) => state.login);
  const registerStoreAction = useAuthStore((state) => state.register);

  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setName('');
    setRememberMe(false);
    setAgreeTerms(false);
  }, [activeTab]);

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
    if (score === 2) { text = 'Medium'; color = 'bg-yellow-500'; }
    else if (score === 3) { text = 'Strong'; color = 'bg-green-500'; }
    else if (score === 4) { text = 'Very Strong'; color = 'bg-emerald-600'; }

    setPwStrength({ score, text, color });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const { employee, token } = await login(email, password);
        loginStoreAction(employee, token);
        setSuccessMsg(`Welcome back, ${employee.name}!`);
      } else if (activeTab === 'register') {
        if (!agreeTerms) throw new Error('You must agree to the Terms of Service.');
        const { employee } = await register(name, email, password);
        setSuccessMsg(`Account created successfully for ${employee.name}! Please switch to the login tab to log in.`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] bg-white/95 dark:bg-[#110d26]/95 border border-gray-100/50 dark:border-white/5 rounded-[40px] p-9 shadow-2xl relative transition-all duration-300">

      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center tracking-tight">
          <>Welcome to <span className="text-[#7C3AED] dark:text-[#a78bfa] font-extrabold">FlowSync</span></>
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-center font-medium">
          Secure access to your enterprise account
        </p>
      </div>

      {/* Tabs */}
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {activeTab === 'login' && (
          <div className="flex items-center mt-1 mb-1">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              label="Remember me"
              disabled={loading}
            />
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

        <Button
          type="submit"
          loading={loading}
          className="w-full py-3.5 mt-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white hover:from-[#6d28d9] hover:to-[#5b21b6] shadow-md shadow-[#7c3aed]/20 transition-all duration-300 group"
        >
          {activeTab === 'login' ? 'Continue' : 'Create Account'}
          {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>
    </div>
  );
}
