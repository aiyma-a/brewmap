import { useCallback, useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { firebaseEnabled, fetchBusyReports, submitBusyReport } from '../lib/firebase';
import { BUSY_WINDOW_MS, BusyLevel, BusySummary, summarizeBusy } from '../lib/busy';
import { getLanguage } from '../lib/i18n';

const TEXT = {
  en: {
    title: 'How busy is it?', quiet: 'Quiet', moderate: 'Moderate', packed: 'Packed',
    noReports: 'No reports in the last hour. Be the first!', ask: 'Visiting now? Tell others:',
    reports: (n: number) => `${n} report${n === 1 ? '' : 's'}`, ago: (m: number) => (m < 1 ? 'just now' : `${m} min ago`),
    thanks: 'Thanks! Your report is in.', already: 'You already reported this shop this hour.', failed: 'Could not send. Try again.',
  },
  ru: {
    title: 'Насколько людно?', quiet: 'Тихо', moderate: 'Средне', packed: 'Много людей',
    noReports: 'За последний час отчётов нет. Будьте первым!', ask: 'Вы здесь сейчас? Расскажите другим:',
    reports: (n: number) => `отчётов: ${n}`, ago: (m: number) => (m < 1 ? 'только что' : `${m} мин назад`),
    thanks: 'Спасибо! Ваш отчёт принят.', already: 'Вы уже сообщали об этом месте в этот час.', failed: 'Не удалось отправить. Попробуйте ещё раз.',
  },
  ky: {
    title: 'Элдүүбү?', quiet: 'Тынч', moderate: 'Орточо', packed: 'Толуп калган',
    noReports: 'Акыркы саатта билдирүү жок. Биринчи болуңуз!', ask: 'Азыр ушул жердесизби? Башкаларга айтыңыз:',
    reports: (n: number) => `билдирүү: ${n}`, ago: (m: number) => (m < 1 ? 'эми гана' : `${m} мүн. мурун`),
    thanks: 'Рахмат! Билдирүүңүз кабыл алынды.', already: 'Бул саатта бул жер жөнүндө билдирип койгонсуз.', failed: 'Жөнөтүлгөн жок. Кайра аракет кылыңыз.',
  },
} as const;

const DOT: Record<BusyLevel, string> = { 1: 'bg-open', 2: 'bg-amber-500', 3: 'bg-red-500' };

/** Self-reported crowd level for one coffee shop, based on the last hour of visitor reports. */
export function BusyReport({ shopId }: { shopId: string }) {
  const t = TEXT[getLanguage()];
  const [summary, setSummary] = useState<BusySummary | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      const reports = await fetchBusyReports(shopId, Date.now() - BUSY_WINDOW_MS);
      setSummary(summarizeBusy(reports, Date.now()));
    } catch {
      setSummary(null);
    }
    setLoaded(true);
  }, [shopId]);

  useEffect(() => {
    setSummary(null); setLoaded(false); setMessage(null);
    if (firebaseEnabled) load();
  }, [shopId, load]);

  if (!firebaseEnabled) return null;

  const submit = async (level: BusyLevel) => {
    setSending(true); setMessage(null);
    try {
      await submitBusyReport(shopId, level);
      setMessage(t.thanks);
      await load();
    } catch (e: any) {
      setMessage(e?.code === 'permission-denied' ? t.already : t.failed);
    }
    setSending(false);
  };

  const label = (l: BusyLevel) => (l === 1 ? t.quiet : l === 2 ? t.moderate : t.packed);

  return (
    <div className="p-3 rounded-2xl border bg-surface-container-low border-outline-variant/10 text-on-surface space-y-2.5">
      <div className="flex items-center gap-2">
        <Users size={14} className="text-brand" />
        <span className="text-xs font-bold">{t.title}</span>
      </div>

      <div aria-live="polite" className="text-xs">
        {!loaded ? null : summary ? (
          <span className="inline-flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${DOT[summary.level]}`} />
            <span className="font-bold">{label(summary.level)}</span>
            <span className="text-on-surface-variant">· {t.reports(summary.count)} · {t.ago(summary.minutesAgo)}</span>
          </span>
        ) : (
          <span className="text-on-surface-variant">{t.noReports}</span>
        )}
      </div>

      <div>
        <p className="text-[11px] text-on-surface-variant mb-1.5">{t.ask}</p>
        <div className="grid grid-cols-3 gap-2">
          {([1, 2, 3] as BusyLevel[]).map(l => (
            <button
              key={l}
              type="button"
              disabled={sending}
              onClick={() => submit(l)}
              className="min-h-[44px] rounded-xl border border-outline-variant/30 bg-surface text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 hover:bg-surface-container"
            >
              <span className={`w-2 h-2 rounded-full ${DOT[l]}`} />{label(l)}
            </button>
          ))}
        </div>
        {message && <p role="status" className="text-[11px] mt-1.5 text-on-surface-variant">{message}</p>}
      </div>
    </div>
  );
}
