import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, Coffee, Eye, EyeOff, Lock, Mail, MailCheck, PartyPopper, User } from 'lucide-react';
import { authErrorMessage, resendVerification, signInWithGoogle, signUpWithEmail } from '../../lib/auth';
import { firebaseEnabled } from '../../lib/firebase';
import { getLanguage } from '../../lib/i18n';

export const AVATAR_COLORS = [
  { name: 'Espresso', bg: 'bg-[#4B3621]', text: 'text-white' },
  { name: 'Latte', bg: 'bg-[#C2B280]', text: 'text-[#4B3621]' },
  { name: 'Mocha', bg: 'bg-brand', text: 'text-white' },
  { name: 'Caramel', bg: 'bg-[#C68E17]', text: 'text-white' },
  { name: 'Cream', bg: 'bg-[#F5F5DC]', text: 'text-brand' },
  { name: 'Black', bg: 'bg-[#1A1A1A]', text: 'text-white' },
];

const TEXT = {
  en: {
    stepOf: (n: number) => `Step ${n} of 3`, steps: ['Account', 'Profile', 'Done'],
    t1: 'Create your account', s1: 'Start with your email and a password',
    t2: 'Your coffee profile', s2: 'How should other coffee fans see you?',
    t3: 'Check your email', s3: (e: string) => `We sent a confirmation link to ${e}. Open it to confirm your address.`,
    t3g: "You're all set!", s3g: 'Welcome to Brewmap. Your account is ready.',
    email: 'Email address', password: 'Password', show: 'Show password', hide: 'Hide password',
    rule8: 'At least 8 characters', ruleMail: 'A valid email address',
    next: 'Continue', back: 'Back', create: 'Create account', creating: 'Creating…',
    google: 'Continue with Google', or: 'or',
    avatar: 'Choose your coffee mug', name: 'Full name', username: 'username',
    userRule: '3–20 letters, numbers, dots or underscores',
    resend: 'Send the email again', resent: 'Sent again. Check your inbox and spam folder.',
    openMap: 'Open the map', nextHint: 'You can use Brewmap before confirming.',
  },
  ru: {
    stepOf: (n: number) => `Шаг ${n} из 3`, steps: ['Аккаунт', 'Профиль', 'Готово'],
    t1: 'Создайте аккаунт', s1: 'Начнём с email и пароля',
    t2: 'Ваш кофейный профиль', s2: 'Как вас увидят другие любители кофе?',
    t3: 'Проверьте почту', s3: (e: string) => `Мы отправили ссылку для подтверждения на ${e}. Откройте её, чтобы подтвердить адрес.`,
    t3g: 'Всё готово!', s3g: 'Добро пожаловать в Brewmap. Ваш аккаунт создан.',
    email: 'Email', password: 'Пароль', show: 'Показать пароль', hide: 'Скрыть пароль',
    rule8: 'Не менее 8 символов', ruleMail: 'Корректный email',
    next: 'Продолжить', back: 'Назад', create: 'Создать аккаунт', creating: 'Создаём…',
    google: 'Продолжить с Google', or: 'или',
    avatar: 'Выберите кофейную кружку', name: 'Полное имя', username: 'имя пользователя',
    userRule: '3–20 символов: латинские буквы, цифры, точки или подчёркивания',
    resend: 'Отправить письмо ещё раз', resent: 'Отправлено снова. Проверьте входящие и «Спам».',
    openMap: 'Открыть карту', nextHint: 'Пользоваться Brewmap можно и до подтверждения.',
  },
  ky: {
    stepOf: (n: number) => `${n}-кадам, 3төн`, steps: ['Аккаунт', 'Профиль', 'Даяр'],
    t1: 'Аккаунт түзүңүз', s1: 'Email жана сырсөздөн баштайлы',
    t2: 'Кофе профилиңиз', s2: 'Башка кофе сүйүүчүлөр сизди кандай көрөт?',
    t3: 'Почтаңызды текшериңиз', s3: (e: string) => `${e} дарегине ырастоо шилтемесин жибердик. Дарегиңизди ырастоо үчүн аны ачыңыз.`,
    t3g: 'Баары даяр!', s3g: 'Brewmap’ка кош келиңиз. Аккаунтуңуз даяр.',
    email: 'Email дареги', password: 'Сырсөз', show: 'Сырсөздү көрсөтүү', hide: 'Сырсөздү жашыруу',
    rule8: 'Кеминде 8 символ', ruleMail: 'Туура email дареги',
    next: 'Улантуу', back: 'Артка', create: 'Аккаунт түзүү', creating: 'Түзүлүүдө…',
    google: 'Google менен улантуу', or: 'же',
    avatar: 'Кофе чөйчөгүңүздү тандаңыз', name: 'Толук атыңыз', username: 'колдонуучу аты',
    userRule: '3–20 символ: латын тамгалары, сандар, чекиттер же асты сызыктар',
    resend: 'Катты кайра жөнөтүү', resent: 'Кайра жөнөтүлдү. Кириш жана «Спам» папкаларын текшериңиз.',
    openMap: 'Картаны ачуу', nextHint: 'Ырастаганга чейин Brewmap’ты колдоно берсеңиз болот.',
  },
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_RE = /^[a-z0-9._]{3,20}$/;

interface Props {
  onNotify: (message: string, type: 'success' | 'info' | 'error') => void;
  /** Called with the details to keep the app's profile screens in step with the account */
  onProfileReady: (name: string, username: string, avatarName: string) => void;
  onOpenMap: () => void;
}

const inputClass = 'w-full py-3.5 bg-[#FAF8F5] border border-brand/10 rounded-2xl text-xs focus:ring-1 focus:ring-brand focus:border-brand transition-all outline-none';

export function SignupWizard({ onNotify, onProfileReady, onOpenMap }: Props) {
  const t = TEXT[getLanguage()];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [viaGoogle, setViaGoogle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(0);
  const [busy, setBusy] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);   // seconds until the email can be sent again

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const emailOk = EMAIL_RE.test(email.trim());
  const pwOk = password.length >= 8;
  const userOk = USERNAME_RE.test(username);

  const fail = (e: any) => onNotify(authErrorMessage(firebaseEnabled ? e : { code: 'not-configured' }), 'error');

  const google = async () => {
    setBusy(true);
    try {
      const u = await signInWithGoogle();
      setViaGoogle(true);
      setEmail(u.email || '');
      setFullName(u.displayName || '');
      setUsername((u.displayName || (u.email || '').split('@')[0] || '').toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 20));
      setStep(2);
    } catch (e) { fail(e); }
    setBusy(false);
  };

  const finishProfile = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (!viaGoogle) await signUpWithEmail(email.trim(), password, fullName.trim());
      onProfileReady(fullName.trim(), username, AVATAR_COLORS[avatar].name);
      setCooldown(60);   // the confirmation email was just sent
      setStep(3);
    } catch (e) {
      fail(e);
      // The email is the likely problem (already registered / invalid): take them back to fix it
      if (['auth/email-already-in-use', 'auth/invalid-email', 'auth/weak-password'].includes((e as any)?.code)) setStep(1);
    }
    setBusy(false);
  };

  const resend = async () => {
    if (cooldown > 0) return;
    try { await resendVerification(); setResent(true); setCooldown(60); } catch (e) { fail(e); setCooldown(60); }
  };

  const title = step === 1 ? t.t1 : step === 2 ? t.t2 : viaGoogle ? t.t3g : t.t3;
  const subtitle = step === 1 ? t.s1 : step === 2 ? t.s2 : viaGoogle ? t.s3g : t.s3(email);

  return (
    <div>
      {/* Progress */}
      <div className="mb-6" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-label={t.stepOf(step)}>
        <div className="flex items-center justify-between mb-2">
          {t.steps.map((label, i) => {
            const n = i + 1;
            const done = step > n || step === 3;
            const current = step === n;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1" aria-current={current ? 'step' : undefined}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${done ? 'bg-brand text-white' : current ? 'bg-brand text-white ring-4 ring-brand/20' : 'bg-brand/10 text-brand/60'}`}>
                  {done ? <Check size={14} strokeWidth={3} /> : n}
                </div>
                <span className={`text-[10px] font-bold ${current || done ? 'text-brand' : 'text-brand/50'}`}>{label}</span>
              </div>
            );
          })}
        </div>
        <div className="h-1.5 bg-brand/10 rounded-full overflow-hidden">
          <div className="h-full bg-brand rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-brand/60 font-mono">{t.stepOf(step)}</p>
      </div>

      <div className="mb-6 text-center">
        <h2 className="font-headline text-2xl font-black uppercase text-primary tracking-tight">{title}</h2>
        <p className="text-xs mt-1.5 text-brand/75">{subtitle}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); if (emailOk && pwOk) setStep(2); }} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/60" size={16} />
                <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.email} aria-label={t.email} className={`${inputClass} pl-11 pr-4`} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/60" size={16} />
                <input required type={showPw ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.password} aria-label={t.password} className={`${inputClass} pl-11 pr-12`} />
                <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? t.hide : t.show} className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-brand/60 hover:text-brand">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <ul className="space-y-1 text-[11px]" aria-live="polite">
                {[[emailOk, t.ruleMail], [pwOk, t.rule8]].map(([ok, label]) => (
                  <li key={label as string} className={`flex items-center gap-1.5 ${ok ? 'text-open font-bold' : 'text-brand/60'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${ok ? 'bg-open text-white' : 'bg-brand/10'}`}>{ok && <Check size={10} strokeWidth={3} />}</span>
                    {label as string}
                  </li>
                ))}
              </ul>
              <button type="submit" disabled={!emailOk || !pwOk} className="w-full min-h-[48px] bg-brand text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-brand/10 transition-all disabled:opacity-40 active:scale-[0.99]">
                {t.next} <ChevronRight size={14} />
              </button>
              <div className="flex items-center gap-3 text-[10px] text-brand/50 uppercase tracking-wider">
                <span className="flex-1 h-px bg-brand/10" /> {t.or} <span className="flex-1 h-px bg-brand/10" />
              </div>
              <button type="button" onClick={google} disabled={busy} className="w-full min-h-[44px] bg-white text-brand py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-brand/20 hover:bg-brand/5 active:scale-[0.99] transition-all disabled:opacity-60">
                <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.5 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
                {t.google}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); if (userOk && fullName.trim()) finishProfile(); }} className="space-y-4">
              <div>
                <p className="block text-[10px] font-bold text-brand uppercase tracking-wider text-center font-mono mb-2">{t.avatar}</p>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t.avatar}>
                  {AVATAR_COLORS.map((a, idx) => (
                    <button key={a.name} type="button" role="radio" aria-checked={avatar === idx} onClick={() => setAvatar(idx)}
                      className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${avatar === idx ? 'border-brand bg-brand/5 shadow-sm' : 'border-brand/10 bg-[#FAF8F5] hover:border-brand/30'}`}>
                      <div className={`w-9 h-9 rounded-full ${a.bg} ${a.text} flex items-center justify-center shadow-sm`}><Coffee size={18} fill="currentColor" /></div>
                      <span className="text-[10px] font-bold text-brand/85">{a.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/60" size={16} />
                <input required type="text" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t.name} aria-label={t.name} className={`${inputClass} pl-11 pr-4`} />
              </div>
              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-brand/60 font-mono">@</span>
                  <input required type="text" autoCapitalize="none" autoCorrect="off" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))} placeholder={t.username} aria-label={t.username} aria-describedby="username-rule" className={`${inputClass} pl-8 pr-4`} />
                </div>
                <p id="username-rule" className={`mt-1.5 text-[11px] ${username && !userOk ? 'text-red-600 font-bold' : 'text-brand/60'}`}>{t.userRule}</p>
              </div>
              <div className="flex gap-2 pt-1">
                {!viaGoogle && (
                  <button type="button" onClick={() => setStep(1)} disabled={busy} className="min-h-[48px] px-5 rounded-2xl border border-brand/20 text-brand text-xs font-bold hover:bg-brand/5 disabled:opacity-50">{t.back}</button>
                )}
                <button type="submit" disabled={busy || !userOk || !fullName.trim()} className="flex-1 min-h-[48px] bg-brand text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-brand/10 transition-all disabled:opacity-40 active:scale-[0.99]">
                  {busy ? t.creating : (<>{viaGoogle ? t.next : t.create} <ChevronRight size={14} /></>)}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-open/15 text-open flex items-center justify-center">
                {viaGoogle ? <PartyPopper size={30} /> : <MailCheck size={30} />}
              </div>
              {!viaGoogle && <p className="text-[11px] text-brand/70">{t.nextHint}</p>}
              <button type="button" onClick={onOpenMap} className="w-full min-h-[48px] bg-brand text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-brand/10 active:scale-[0.99]">
                {t.openMap} <ChevronRight size={14} />
              </button>
              {!viaGoogle && (
                <div>
                  <button type="button" onClick={resend} disabled={cooldown > 0} className="min-h-[44px] px-4 text-xs font-bold text-brand underline disabled:opacity-50 disabled:no-underline">
                    {t.resend}{cooldown > 0 ? ` (${cooldown})` : ''}
                  </button>
                  {resent && <p role="status" className="text-[11px] text-open font-bold">{t.resent}</p>}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
