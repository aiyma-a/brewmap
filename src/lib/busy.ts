// "How busy is it?" reports: 1 = quiet, 2 = moderate, 3 = packed.
export type BusyLevel = 1 | 2 | 3;
export interface BusyReport { level: BusyLevel; ts: number }  // ts = ms since epoch

export const BUSY_WINDOW_MS = 60 * 60 * 1000; // reports older than an hour are ignored

export interface BusySummary { level: BusyLevel; count: number; minutesAgo: number }

/** Combines recent reports; newer reports weigh more. Returns null when nothing is fresh. */
export function summarizeBusy(reports: BusyReport[], now: number): BusySummary | null {
  const fresh = reports.filter(r => now - r.ts >= -60_000 && now - r.ts <= BUSY_WINDOW_MS);
  if (fresh.length === 0) return null;

  let weighted = 0, weights = 0, newest = 0;
  for (const r of fresh) {
    const ageFraction = Math.max(0, now - r.ts) / BUSY_WINDOW_MS;   // 0 = just now, 1 = an hour old
    const w = 1 - 0.7 * ageFraction;                                // 1.0 .. 0.3
    weighted += r.level * w;
    weights += w;
    newest = Math.max(newest, r.ts);
  }
  const level = Math.min(3, Math.max(1, Math.round(weighted / weights))) as BusyLevel;
  return { level, count: fresh.length, minutesAgo: Math.max(0, Math.round((now - newest) / 60_000)) };
}
