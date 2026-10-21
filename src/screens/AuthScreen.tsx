import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Coffee, Check, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import { authErrorMessage, sendPasswordReset, signInWithEmail, signInWithGoogle, signUpWithEmail, useAuthUser } from '../lib/auth';
import { firebaseEnabled } from '../lib/firebase';

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
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const { user } = useAuthUser();

  // Already signed in: go to the map
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Keep the existing profile screens in step with the signed-in account
  const saveLocalProfile = (displayName: string | null, chosenUsername?: string) => {
    let existing: any = {};
    try { existing = JSON.parse(localStorage.getItem('brewmap_user_profile') || '{}') || {}; } catch {}
    const name = displayName || existing.name || email.split('@')[0];
    localStorage.setItem('brewmap_user_profile', JSON.stringify({
      ...existing,
      name,
      username: chosenUsername || existing.username || name.replace(/\s+/g, '').toLowerCase(),
      bio: existing.bio || '',
      avatar: existing.avatar || `vector:${AVATAR_COLORS[selectedAvatar].name}`,
    }));
  };

  const finish = (message: string) => {
    showNotification(message, 'success');
    setTimeout(() => navigate('/'), 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (mode === 'signup' && password.length < 8) {
      showNotification(authErrorMessage({ code: 'auth/weak-password' }), 'error');
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'forgot') {
        await sendPasswordReset(email.trim());
        // Same message whether or not the email has an account (does not reveal who is registered)
        showNotification('If an account exists for that email, a reset link is on its way.', 'success');
        setTimeout(() => { setMode('login'); setPassword(''); }, 2500);
      } else if (mode === 'signup') {
        const created = await signUpWithEmail(email.trim(), password, fullName.trim());
        saveLocalProfile(created.displayName, username.replace(/\s+/g, '').toLowerCase() || undefined);
        finish('Account created! We sent a confirmation link to your email.');
      } else {
        const signedIn = await signInWithEmail(email.trim(), password);
        saveLocalProfile(signedIn.displayName);
        finish('Signed in!');
      }
    } catch (err: any) {
      showNotification(authErrorMessage(firebaseEnabled ? err : { code: 'not-configured' }), 'error');
    }
    setIsLoading(false);
  };

  const handleGoogle = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const signedIn = await signInWithGoogle();
      saveLocalProfile(signedIn.displayName);
      finish('Signed in with Google!');
    } catch (err: any) {
      showNotification(authErrorMessage(firebaseEnabled ? err : { code: 'not-configured' }), 'error');
    }
    setIsLoading(false);
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
            role={notification.type === 'error' ? 'alert' : 'status'}
            className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${
              notification.type === 'success' 
                ? 'bg-[#EAF5EC] border-[#A8D3B2] text-[#1E4D2B]' 
                : notification.type === 'error'
                ? 'bg-[#FDECEA] border-[#E7A9A3] text-[#7A1F17]'
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
      <header className="px-4 sm:px-6 py-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 relative border-b border-brand/5 bg-white/70 backdrop-blur-md z-10">
        <button 
          onClick={() => navigate('/')}
          className="justify-self-start text-primary hover:bg-primary/5 px-2 sm:px-3 py-1.5 rounded-full transition-colors active:scale-95 text-xs font-bold font-mono text-brand"
        >
          Skip
        </button>
        <div className="flex items-center gap-1.5">
          <h1 className="font-headline text-xl sm:text-2xl text-primary tracking-tighter uppercase font-black">Brewmap</h1>
          <Coffee className="text-brand" size={26} fill="currentColor" />
        </div>
        <div className="hidden sm:block justify-self-end text-xs text-on-surface-variant font-medium font-mono">v1.0.2</div>
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
                    placeholder="Full name"
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

          {mode !== 'forgot' && (
            <div className="mt-4">
              <div className="flex items-center gap-3 text-[10px] text-brand/50 uppercase tracking-wider mb-3">
                <span className="flex-1 h-px bg-brand/10" /> or <span className="flex-1 h-px bg-brand/10" />
              </div>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={isLoading}
                className="w-full min-h-[44px] bg-white text-brand py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-brand/20 hover:bg-brand/5 active:scale-[0.99] transition-all disabled:opacity-60"
              >
                <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.5 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
                Continue with Google
              </button>
            </div>
          )}

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
