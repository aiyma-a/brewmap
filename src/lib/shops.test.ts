import { describe, expect, it } from 'vitest';
import { filterShops, isShopOpen, statusLabel, ShopFilters } from './shops';

const CITIES = [
  { name: 'Bishkek', location: { lat: 42.8746, lng: 74.5898 } },
  { name: 'Kant', location: { lat: 42.8911, lng: 74.8504 } },
];

const base: ShopFilters = {
  searchQuery: '', cities: [], openNow: false, wifi: false, outlets: false, nearby: false,
  radiusKm: null, userLocation: null, pointedLocation: null, pointedRadiusKm: 1,
  cityCenters: CITIES, currentHour: 12,
};

const shops = [
  { id: '1', name: 'Bishkek Coffee Roasters', address: 'Bokonbaev St 103, Bishkek', location: { lat: 42.8715, lng: 74.6052 }, openingHour: 8, closingHour: 22, wifi: 'Free', outlets: true },
  { id: '2', name: 'Night Owl', address: 'Chuy Ave 5, Bishkek', location: { lat: 42.876, lng: 74.59 }, openingHour: 18, closingHour: 23, wifi: 'None', outlets: false },
  { id: '3', name: 'Kant Corner', address: 'Lenin St 1, Kant', location: { lat: 42.8911, lng: 74.8504 }, status: 'Open Now' },
  { id: 'g1', name: 'Google Cafe', address: 'Somewhere, Osh', location: { lat: 40.5, lng: 72.8 }, status: 'Hours unknown', fromGoogle: true },
];
const ids = (r: any[]) => r.map(s => s.id);

describe('isShopOpen / statusLabel', () => {
  it('uses opening hours when present', () => {
    expect(isShopOpen(shops[0], 12)).toBe(true);
    expect(isShopOpen(shops[0], 22)).toBe(false);
    expect(isShopOpen(shops[1], 12)).toBe(false);
  });
  it('falls back to status text', () => {
    expect(isShopOpen(shops[2], 3)).toBe(true);
    expect(isShopOpen(shops[3], 12)).toBe(false);
  });
  it('labels unknown hours instead of Closed', () => {
    expect(statusLabel(false, 'Hours unknown', 'Open now')).toBe('Hours unknown');
    expect(statusLabel(false, 'Closed', 'Open now')).toBe('Closed');
    expect(statusLabel(true, 'Open Now', 'Open now')).toBe('Open now');
  });
});

describe('filterShops', () => {
  it('returns everything with no filters (all cities)', () => {
    expect(ids(filterShops(shops, base))).toEqual(['1', '2', '3', 'g1']);
  });
  it('searches name and address, case-insensitively', () => {
    expect(ids(filterShops(shops, { ...base, searchQuery: 'roasters' })).sort()).toEqual(['1', 'g1']);
    expect(ids(filterShops(shops, { ...base, searchQuery: 'KANT' })).sort()).toEqual(['3', 'g1']);
  });
  it("never drops Google results because of the typed text", () => {
    expect(ids(filterShops(shops, { ...base, searchQuery: 'zzz' }))).toEqual(['g1']);
  });
  it('filters by city using the address', () => {
    expect(ids(filterShops(shops, { ...base, cities: ['Kant'] }))).toEqual(['3']);
    expect(ids(filterShops(shops, { ...base, cities: ['All Cities'] }))).toHaveLength(4);
  });
  it('open now uses the current hour', () => {
    expect(ids(filterShops(shops, { ...base, openNow: true, currentHour: 12 }))).toEqual(['1', '3']);
    expect(ids(filterShops(shops, { ...base, openNow: true, currentHour: 19 }))).toEqual(['1', '2', '3']);
  });
  it('wifi and outlets filters', () => {
    expect(ids(filterShops(shops, { ...base, wifi: true }))).toEqual(['1']);
    expect(ids(filterShops(shops, { ...base, outlets: true }))).toEqual(['1', '3', 'g1']);
  });
  it('nearby = within 2 km of the user', () => {
    const r = filterShops(shops, { ...base, nearby: true, userLocation: { lat: 42.8715, lng: 74.6052 } });
    // Night Owl is ~1.5 km away (inside), Kant is ~25 km away (outside)
    expect(ids(r)).toEqual(['1', '2']);
  });
  it('custom radius counts from the selected city', () => {
    const r = filterShops(shops, { ...base, cities: ['Kant'], radiusKm: 5 });
    expect(ids(r)).toEqual(['3']);
  });
  it('pointed location limits by its radius', () => {
    const r = filterShops(shops, { ...base, pointedLocation: { lat: 42.8715, lng: 74.6052 }, pointedRadiusKm: 1 });
    expect(ids(r)).toEqual(['1']);
  });
  it('adds isOpen to each result', () => {
    expect(filterShops(shops, base).map(s => s.isOpen)).toEqual([true, false, true, false]);
  });
});
