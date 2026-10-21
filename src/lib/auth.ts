// Real accounts (Firebase Authentication). Loaded on demand like the rest of Firebase.
// Anonymous visitors (used for busy reports) are NOT treated as signed in.
import { useEffect, useState } from 'react';
import { firebaseEnabled, getFirebase } from './firebase';
import { getLanguage } from './i18n';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

const toUser = (u: any): AuthUser | null =>
  u && !u.isAnonymous
    ? { uid: u.uid, email: u.email, displayName: u.displayName, emailVerified: u.emailVerified }
    : null;

/** Current signed-in user (null = browsing as a guest). `ready` turns true once Firebase has answered. */
export function useAuthUser() {
  const [state, setState] = useState<{ user: AuthUser | null; ready: boolean }>({ user: null, ready: !firebaseEnabled });

  useEffect(() => {
    if (!firebaseEnabled) return;
    let unsub: (() => void) | undefined;
    let cancelled = false;
    getFirebase().then(({ auth, authMod }) => {
      if (cancelled) return;
      unsub = authMod.onAuthStateChanged(auth, (u: any) => setState({ user: toUser(u), ready: true }));
    }).catch(() => setState({ user: null, ready: true }));
    return () => { cancelled = true; unsub?.(); };
  }, []);

  return state;
}


export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const fb = await getFirebase();
  const { authMod, auth } = fb;
  const credential = authMod.EmailAuthProvider.credential(email, password);
  const current = auth.currentUser;
  let result;
  if (current?.isAnonymous) {
    result = await authMod.linkWithCredential(current, credential);   // keeps the anonymous ID
  } else {
    result = await authMod.createUserWithEmailAndPassword(auth, email, password);
  }
  if (displayName) await authMod.updateProfile(result.user, { displayName });
  await authMod.sendEmailVerification(result.user).catch(() => {});
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  const { auth, authMod } = await getFirebase();
  return (await authMod.signInWithEmailAndPassword(auth, email, password)).user;
}

export async function signInWithGoogle() {
  const fb = await getFirebase();
  const { auth, authMod } = fb;
  const provider = new authMod.GoogleAuthProvider();
  const current = auth.currentUser;
  if (current?.isAnonymous) {
    try {
      return (await authMod.linkWithPopup(current, provider)).user;
    } catch (e: any) {
      if (e?.code !== 'auth/credential-already-in-use') throw e;
    }
  }
  return (await authMod.signInWithPopup(auth, provider)).user;
}

export async function sendPasswordReset(email: string) {
  const { auth, authMod } = await getFirebase();
  await authMod.sendPasswordResetEmail(auth, email);
}

export async function signOutUser() {
  const { auth, authMod } = await getFirebase();
  await authMod.signOut(auth);
}

const ERRORS = {
  en: {
    'auth/invalid-credential': 'Wrong email or password.',
    'auth/wrong-password': 'Wrong email or password.',
    'auth/user-not-found': 'Wrong email or password.',
    'auth/invalid-email': 'That email address does not look right.',
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
    'auth/weak-password': 'Choose a longer password (at least 8 characters).',
    'auth/too-many-requests': 'Too many tries. Wait a few minutes and try again.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled.',
    'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-ups and try again.',
    'auth/network-request-failed': 'No connection. Check your internet and try again.',
    'not-configured': 'Accounts are not available right now.',
    default: 'Something went wrong. Please try again.',
  },
  ru: {
    'auth/invalid-credential': 'Неверный email или пароль.',
    'auth/wrong-password': 'Неверный email или пароль.',
    'auth/user-not-found': 'Неверный email или пароль.',
    'auth/invalid-email': 'Похоже, email указан неверно.',
    'auth/email-already-in-use': 'Аккаунт с таким email уже есть. Попробуйте войти.',
    'auth/weak-password': 'Выберите пароль подлиннее (не менее 8 символов).',
    'auth/too-many-requests': 'Слишком много попыток. Подождите несколько минут.',
    'auth/popup-closed-by-user': 'Вход отменён.',
    'auth/cancelled-popup-request': 'Вход отменён.',
    'auth/popup-blocked': 'Браузер заблокировал окно входа. Разрешите всплывающие окна и повторите.',
    'auth/network-request-failed': 'Нет соединения. Проверьте интернет и повторите.',
    'not-configured': 'Аккаунты сейчас недоступны.',
    default: 'Что-то пошло не так. Попробуйте ещё раз.',
  },
  ky: {
    'auth/invalid-credential': 'Email же сырсөз туура эмес.',
    'auth/wrong-password': 'Email же сырсөз туура эмес.',
    'auth/user-not-found': 'Email же сырсөз туура эмес.',
    'auth/invalid-email': 'Email дареги туура эмес окшойт.',
    'auth/email-already-in-use': 'Бул email менен аккаунт бар. Кирип көрүңүз.',
    'auth/weak-password': 'Узунураак сырсөз тандаңыз (кеминде 8 символ).',
    'auth/too-many-requests': 'Аракет өтө көп. Бир нече мүнөт күтүп, кайра аракет кылыңыз.',
    'auth/popup-closed-by-user': 'Кирүү токтотулду.',
    'auth/cancelled-popup-request': 'Кирүү токтотулду.',
    'auth/popup-blocked': 'Браузер кирүү терезесин бөгөттөдү. Калкыма терезелерге уруксат берип, кайра аракет кылыңыз.',
    'auth/network-request-failed': 'Байланыш жок. Интернетти текшерип, кайра аракет кылыңыз.',
    'not-configured': 'Аккаунттар азыр жеткиликсиз.',
    default: 'Бир нерсе туура эмес болду. Кайра аракет кылыңыз.',
  },
} as const;

export function authErrorMessage(e: any): string {
  const dict = ERRORS[getLanguage()] as Record<string, string>;
  return dict[e?.code] || dict.default;
}

/** Sends the confirmation email again to the signed-in user. */
export async function resendVerification() {
  const { auth, authMod } = await getFirebase();
  if (!auth.currentUser) throw Object.assign(new Error('no user'), { code: 'auth/user-not-found' });
  await authMod.sendEmailVerification(auth.currentUser);
}
