import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Coffee, Lock, XCircle } from 'lucide-react';
import { applyEmailAction, authErrorMessage, checkResetCode } from '../lib/auth';
import { getLanguage } from '../lib/i18n';

const TEXT = {
  en: { working: 'One moment…', verified: 'Email confirmed!', verifiedSub: 'Thanks. Your Brewmap account is confirmed.', resetTitle: 'Choose a new password', resetFor: (e: string) => `For ${e}`,
    newPw: 'New password (at least 8 characters)', save: 'Save password', saved: 'Password changed!', savedSub: 'You can now sign in with your new password.',
    signIn: 'Sign in', openMap: 'Open the map', problem: 'This link did not work', unknown: 'Unknown link.' },
  ru: { working: 'Минутку…', verified: 'Email подтверждён!', verifiedSub: 'Спасибо. Ваш аккаунт Brewmap подтверждён.', resetTitle: 'Задайте новый пароль', resetFor: (e: string) => `Для ${e}`,
    newPw: 'Новый пароль (не менее 8 символов)', save: 'Сохранить пароль', saved: 'Пароль изменён!', savedSub: 'Теперь вы можете войти с новым паролем.',
    signIn: 'Войти', openMap: 'Открыть карту', problem: 'Ссылка не сработала', unknown: 'Неизвестная ссылка.' },
  ky: { working: 'Бир мүнөт…', verified: 'Email ырасталды!', verifiedSub: 'Рахмат. Brewmap аккаунтуңуз ырасталды.', resetTitle: 'Жаңы сырсөз коюңуз', resetFor: (e: string) => `${e} үчүн`,
    newPw: 'Жаңы сырсөз (кеминде 8 символ)', save: 'Сырсөздү сактоо', saved: 'Сырсөз өзгөртүлдү!', savedSub: 'Эми жаңы сырсөз менен кире аласыз.',
    signIn: 'Кирүү', openMap: 'Картаны ачуу', problem: 'Шилтеме иштеген жок', unknown: 'Белгисиз шилтеме.' },
} as const;

type State = 'working' | 'verified' | 'reset' | 'saved' | 'error';

/** Landing page for the links in Firebase emails (confirm email, reset password). */
export default function AuthActionScreen() {
  const [params] = useSearchParams();
  const mode = params.get('mode') || '';
  const code = params.get('oobCode') || '';
  const lang = (['en', 'ru', 'ky'] as const).includes(params.get('lang') as any) ? (params.get('lang') as 'en' | 'ru' | 'ky') : getLanguage();
  const t = TEXT[lang];
  const [state, setState] = useState<State>('working');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const started = useRef(false);   // a link's code works only once, so never run the check twice

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        if (!code) throw Object.assign(new Error('no code'), { code: 'auth/invalid-action-code' });
        if (mode === 'verifyEmail' || mode === 'recoverEmail') {
          await applyEmailAction(mode, code);
          setState('verified');
        } else if (mode === 'resetPassword') {
          setEmail(await checkResetCode(code));
          setState('reset');
        } else {
          setError(t.unknown);
          setState('error');
        }
      } catch (e: any) {
        setError(authErrorMessage(e));
        setState('error');
      }
    })();
  }, []);

  const savePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) { setError(authErrorMessage({ code: 'auth/weak-password' })); return; }
    setBusy(true); setError('');
    try { await applyEmailAction('resetPassword', code, pw); setState('saved'); }
    catch (err: any) { setError(authErrorMessage(err)); }
    setBusy(false);
  };

  const button = 'inline-flex items-center justify-center min-h-[48px] px-6 rounded-2xl bg-brand text-white font-bold text-sm active:scale-[0.99]';

  return (
    <div className="bg-[#FAF8F5] min-h-screen flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-brand/10 rounded-[2rem] p-8 shadow-xl text-center space-y-4">
        <div className="flex items-center justify-center gap-1.5">
          <span className="font-headline text-2xl text-primary tracking-tighter uppercase font-black">Brewmap</span>
          <Coffee className="text-brand" size={26} fill="currentColor" />
        </div>

        {state === 'working' && (
          <div role="status" className="py-6">
            <div className="w-10 h-10 border-4 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-brand/70">{t.working}</p>
          </div>
        )}

        {state === 'verified' && (
          <>
            <CheckCircle2 size={56} className="mx-auto text-open" />
            <h1 className="font-headline text-2xl font-black text-primary">{t.verified}</h1>
            <p className="text-xs text-brand/75">{t.verifiedSub}</p>
            <Link to="/" className={button}>{t.openMap}</Link>
          </>
        )}

        {state === 'reset' && (
          <form onSubmit={savePassword} className="space-y-4 text-left">
            <h1 className="font-headline text-2xl font-black text-primary text-center">{t.resetTitle}</h1>
            <p className="text-xs text-brand/75 text-center">{t.resetFor(email)}</p>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/60" size={16} />
              <input type="password" autoComplete="new-password" required value={pw} onChange={(e) => setPw(e.target.value)} placeholder={t.newPw} aria-label={t.newPw}
                className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-brand/10 rounded-2xl text-xs focus:ring-1 focus:ring-brand focus:border-brand outline-none" />
            </div>
            {error && <p role="alert" className="text-xs text-red-700 font-bold">{error}</p>}
            <button type="submit" disabled={busy} className={`${button} w-full disabled:opacity-50`}>{t.save}</button>
          </form>
        )}

        {state === 'saved' && (
          <>
            <CheckCircle2 size={56} className="mx-auto text-open" />
            <h1 className="font-headline text-2xl font-black text-primary">{t.saved}</h1>
            <p className="text-xs text-brand/75">{t.savedSub}</p>
            <Link to="/auth" className={button}>{t.signIn}</Link>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle size={56} className="mx-auto text-red-600" />
            <h1 className="font-headline text-xl font-black text-primary">{t.problem}</h1>
            <p role="alert" className="text-xs text-brand/75">{error}</p>
            <Link to="/auth" className={button}>{t.signIn}</Link>
          </>
        )}
      </div>
    </div>
  );
}
