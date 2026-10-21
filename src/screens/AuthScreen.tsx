import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Coffee, Check, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';

const AVATAR_COLORS = [
  { name: 'Espresso', bg: 'bg-[#4B3621]', text: 'text-white' },
  { name: 'Latte', bg: 'bg-[#C2B280]', text: 'text-[#4B3621]' },
  { name: 'Mocha', bg: 'bg-brand', text: 'text-white' },
  { name: 'Caramel', bg: 'bg-[#C68E17]', text: 'text-white' },
  { name: 'Cream', bg: 'bg-[#F5F5DC]', text: 'text-brand' },
  { name: 'Black', bg: 'bg-[#1A1A1A]', text: 'text-white' },
];

export default function AuthScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // If already authorized, redirect immediately to explore screen
  useEffect(() => {
    if (localStorage.getItem('brewmap_authorised') === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'forgot') {
      // Forgot password simulation
      setTimeout(() => {
        setIsLoading(false);
        showNotification(`A password reset link has been dispatched to ${email}!`, 'success');
        // Keep screen on forgot but clear field or switch back automatically after delay
        setTimeout(() => {
          setMode('login');
          setPassword('');
        }, 2000);
      }, 1200);
      return;
    }

    // Login or Signup
    setTimeout(() => {
      setIsLoading(false);
      
      if (mode === 'signup') {
        const chosenAvatar = `vector:${AVATAR_COLORS[selectedAvatar].name}`;
        localStorage.setItem('brewmap_user_profile', JSON.stringify({
          name: fullName || 'Aydana Temirova',
          username: username.replace(/\s+/g, '').toLowerCase() || 'aydana_brews',
          bio: 'Specialty coffee connoisseur / Manual brew fanatic',
          avatar: chosenAvatar
        }));
        showNotification('Profile created successfully! Loading your coffee space...', 'success');
      } else {
        showNotification('Signed in successfully! Coffee map updated.', 'success');
      }

      // Authorise and update global app listeners
      localStorage.setItem('brewmap_authorised', 'true');
      window.dispatchEvent(new CustomEvent('auth_state_changed'));

      setTimeout(() => {
        navigate('/');
      }, 8000); // Allow brief notification review, or user will auto-redirect
      
    }, 1200);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen flex flex-col font-sans">
      {/* Absolute top action notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -40 }}
            className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${
              notification.type === 'success' 
                ? 'bg-[#EAF5EC] border-[#A8D3B2] text-[#1E4D2B]' 
                : 'bg-primary/5 border-outline-variant text-brand'
            }`}
          >
            <div className="bg-white/80 p-1.5 rounded-full flex-shrink-0">
              <Sparkles size={16} className="text-brand" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold leading-tight">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between relative border-b border-brand/5 bg-white/70 backdrop-blur-md z-10">
        <button 
          onClick={() => {
            // Let them browse anonymously or go back if already logged in
            localStorage.setItem('brewmap_authorised', 'true');
            window.dispatchEvent(new CustomEvent('auth_state_changed'));
            navigate('/');
          }}
          className="text-primary hover:bg-primary/5 px-3 py-1.5 rounded-full transition-colors active:scale-95 text-xs font-bold font-mono text-brand"
        >
          Skip Verification
        </button>
        <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
          <h1 className="font-headline text-2xl text-primary tracking-tighter uppercase font-black">Brewmap</h1>
          <Coffee className="text-brand" size={26} fill="currentColor" />
        </div>
        <div className="w-12 text-xs text-on-surface-variant font-medium text-right font-mono">v1.0.2</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-16">
        <motion.div 
          layout
          className="w-full max-w-md bg-white border border-brand/10 rounded-[2.5rem] p-8 shadow-xl overflow-hidden relative"
        >
          {/* Subtle background branding flourish */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/3 rounded-full blur-2xl pointer-events-none" />
          
          {mode !== 'forgot' && (
            <div className="flex bg-[#FAF8F5] rounded-2xl p-1 mb-8 border border-brand/5">
              <button 
                type="button"
                onClick={() => {
                  setMode('login');
                  setNotification(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-brand text-white shadow-sm' : 'text-brand/70 hover:text-brand'}`}
              >
                Log In
              </button>
              <button 
                type="button"
                onClick={() => {
                  setMode('signup');
                  setNotification(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-brand text-white shadow-sm' : 'text-brand/70 hover:text-brand'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="mb-6">
              <button 
                type="button"
                onClick={() => setMode('login')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand/70 hover:text-brand cursor-pointer bg-brand/5 px-3 py-1.5 rounded-xl transition-colors"
              >
                <ArrowLeft size={13} />
                Back to Log In
              </button>
            </div>
          )}

          <div className="mb-8 text-center">
            <h2 className="font-headline text-2xl text-on-surface font-black uppercase text-primary tracking-tight">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Profile'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1.5 text-brand/75">
              {mode === 'login' && 'Log in to sync recipes and favorited Biskek spots'}
              {mode === 'signup' && 'Register your brew profile today'}
              {mode === 'forgot' && 'Provide your email to receive password recovery directions'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-brand uppercase tracking-wider text-center font-mono mb-2">
                    Choose Your Coffee Mug avatar
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVATAR_COLORS.map((avatar, idx) => (
                      <button
                        key={avatar.name}
                        type="button"
                        onClick={() => setSelectedAvatar(idx)}
                        className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                          selectedAvatar === idx 
                            ? 'border-brand bg-brand/5 shadow-sm' 
                            : 'border-brand/10 bg-[#FAF8F5] hover:border-brand/30'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full ${avatar.bg} ${avatar.text} flex items-center justify-center shadow-sm transition-transform ${selectedAvatar === idx ? 'scale-105' : ''}`}>
                          <Coffee size={18} fill="currentColor" />
                        </div>
                        <span className="text-[10px] font-bold text-brand/85">{avatar.name}</span>
                        {selectedAvatar === idx && (
                          <div className="absolute top-1 right-1 bg-brand text-white rounded-full p-0.5 shadow-md">
                            <Check size={6} strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name fields */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/60" size={16} />
                  <input 
                    required
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name (e.g., Aydana Temirova)"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-brand/10 rounded-2xl text-xs focus:ring-1 focus:ring-brand focus:border-brand transition-all outline-none font-medium"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-brand/60 font-mono">@</span>
                  <input 
                    required
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                    placeholder="username"
                    className="w-full pl-8 pr-4 py-3.5 bg-[#FAF8F5] border border-brand/10 rounded-2xl text-xs focus:ring-1 focus:ring-brand focus:border-brand transition-all outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/60" size={16} />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-brand/10 rounded-2xl text-xs focus:ring-1 focus:ring-brand/60 focus:border-brand transition-all outline-none font-medium text-[#442c19]"
              />
            </div>

            {/* Password input (not shown on forgot view) */}
            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/60" size={16} />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-brand/10 rounded-2xl text-xs focus:ring-1 focus:ring-brand/60 focus:border-brand transition-all outline-none font-medium text-[#442c19]"
                  />
                </div>
                
                {mode === 'login' && (
                  <div className="text-right pt-0.5">
                    <button 
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] font-bold text-brand hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-brand/10 transition-all hover:brightness-110 active:scale-98 disabled:opacity-50 text-xs text-center cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' && 'Log In'}
                  {mode === 'signup' && 'Create Profile'}
                  {mode === 'forgot' && 'Send Reset Directions'}
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick Info text / Switching options */}
          <div className="mt-6 text-center">
            {mode === 'login' && (
              <p className="text-[11px] text-brand/70">
                Don't have an account or profile?{' '}
                <button 
                  type="button" 
                  onClick={() => setMode('signup')}
                  className="font-bold text-brand hover:underline"
                >
                  Create Profile
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-[11px] text-brand/70">
                Already registered with Brewmap?{' '}
                <button 
                  type="button" 
                  onClick={() => setMode('login')}
                  className="font-bold text-brand hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p className="text-[11px] text-brand/70">
                Remembered your password?{' '}
                <button 
                  type="button" 
                  onClick={() => setMode('login')}
                  className="font-bold text-brand hover:underline"
                >
                  Back to Log In
                </button>
              </p>
            )}
          </div>

          <p className="mt-8 text-center text-[10px] text-brand/50">
            By continuing, you agree to Brewmap's{' '}
            <a href={`${import.meta.env.BASE_URL}terms.html`} target="_blank" rel="noopener" className="underline hover:text-brand">Terms of Service</a>
            {' '}and{' '}
            <a href={`${import.meta.env.BASE_URL}privacy.html`} target="_blank" rel="noopener" className="underline hover:text-brand">Privacy Policy</a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
