import { describe, expect, it } from 'vitest';
import { summarizeBusy, BUSY_WINDOW_MS } from './busy';

const NOW = 1_000_000_000_000;
const min = (m: number) => NOW - m * 60_000;

describe('summarizeBusy', () => {
  it('returns null with no reports', () => {
    expect(summarizeBusy([], NOW)).toBeNull();
  });
  it('ignores reports older than an hour', () => {
    expect(summarizeBusy([{ level: 3, ts: NOW - BUSY_WINDOW_MS - 1 }], NOW)).toBeNull();
  });
  it('single fresh report', () => {
    expect(summarizeBusy([{ level: 3, ts: min(12) }], NOW)).toEqual({ level: 3, count: 1, minutesAgo: 12 });
  });
  it('newer reports outweigh older ones', () => {
    const s = summarizeBusy([{ level: 1, ts: min(55) }, { level: 3, ts: min(2) }, { level: 3, ts: min(5) }], NOW)!;
    expect(s.level).toBe(3);
    expect(s.count).toBe(3);
    expect(s.minutesAgo).toBe(2);
  });
  it('averages a mixed crowd to moderate', () => {
    const s = summarizeBusy([{ level: 1, ts: min(10) }, { level: 3, ts: min(10) }], NOW)!;
    expect(s.level).toBe(2);
  });
  it('tolerates small clock differences (report slightly in the future)', () => {
    expect(summarizeBusy([{ level: 2, ts: NOW + 30_000 }], NOW)?.minutesAgo).toBe(0);
  });
});
