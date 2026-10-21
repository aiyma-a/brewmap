// Firebase is loaded on demand (only when a shop's busy reports are opened),
// so it adds nothing to the first page load.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: 'my-second-project-496804.firebaseapp.com',
  projectId: 'my-second-project-496804',
  appId: '1:624126191196:web:208f608bcf2204b09ca899',
};
const DATABASE_ID = 'brewmap';

export const firebaseEnabled = Boolean(config.apiKey);

let ready: Promise<{ db: any; auth: any; fs: any; authMod: any }> | null = null;

export function getFirebase() {
  if (!ready) {
    ready = (async () => {
      const [{ initializeApp }, authMod, fs] = await Promise.all([
        import('firebase/app'), import('firebase/auth'), import('firebase/firestore'),
      ]);
      const app = initializeApp(config as any);
      return { db: fs.getFirestore(app, DATABASE_ID), auth: authMod.getAuth(app), fs, authMod };
    })();
  }
  return ready;
}

/** Latest reports for a shop (newest first). */
export async function fetchBusyReports(shopId: string, sinceMs: number) {
  const { db, fs } = await getFirebase();
  const q = fs.query(
    fs.collection(db, 'busyReports'),
    fs.where('shopId', '==', shopId),
    fs.where('ts', '>', fs.Timestamp.fromMillis(sinceMs)),
    fs.orderBy('ts', 'desc'),
    fs.limit(30),
  );
  const snap = await fs.getDocs(q);
  return snap.docs.map((d: any) => ({ level: d.data().level, ts: d.data().ts.toMillis() }));
}

/** Adds the visitor's report. One per shop per hour (enforced by the database rules). */
export async function submitBusyReport(shopId: string, level: 1 | 2 | 3) {
  const { db, auth, fs, authMod } = await getFirebase();
  if (!auth.currentUser) await authMod.signInAnonymously(auth);
  const uid = auth.currentUser.uid as string;
  const hourBucket = Math.floor(Date.now() / 3600000);
  // The rules use the server's clock for the hour; near the hour change, try the neighbouring hour too
  let lastError: any;
  for (const bucket of [hourBucket, hourBucket + 1, hourBucket - 1]) {
    try {
      const ref = fs.doc(db, 'busyReports', `${uid}_${shopId}_${bucket}`);
      await fs.setDoc(ref, { shopId, level, ts: fs.serverTimestamp(), uid });
      return;
    } catch (e: any) {
      lastError = e;
      if (e?.code !== 'permission-denied') break;
    }
  }
  throw lastError;
}
