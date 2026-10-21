import { describe, expect, it } from 'vitest';
import { getDistanceInKm } from './geo';

describe('getDistanceInKm', () => {
  it('is 0 for the same point', () => {
    expect(getDistanceInKm({ lat: 42.87, lng: 74.59 }, { lat: 42.87, lng: 74.59 })).toBeCloseTo(0, 6);
  });
  it('Bishkek to Kant is about 25 km', () => {
    const d = getDistanceInKm({ lat: 42.8746, lng: 74.5898 }, { lat: 42.8911, lng: 74.8504 });
    expect(d).toBeGreaterThan(20);
    expect(d).toBeLessThan(30);
  });
  it('is symmetric', () => {
    const a = { lat: 42.8746, lng: 74.5898 }, b = { lat: 42.8419, lng: 75.3015 };
    expect(getDistanceInKm(a, b)).toBeCloseTo(getDistanceInKm(b, a), 9);
  });
});
