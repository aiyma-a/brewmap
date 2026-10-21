import { getDistanceInKm, LatLng, BISHKEK_CENTER } from './geo';

/** Open/Closed text; Google places without opening hours say so instead of "Closed". */
export const statusLabel = (isOpen: boolean, status: string | undefined, openText: string) =>
  isOpen ? openText : status === 'Hours unknown' ? 'Hours unknown' : 'Closed';

/** Open now? Uses opening/closing hour when the shop has them, otherwise its status text. */
export const isShopOpen = (shop: any, currentHour: number): boolean =>
  (shop.openingHour !== undefined && shop.closingHour !== undefined)
    ? (currentHour >= shop.openingHour && currentHour < shop.closingHour)
    : shop.status === 'Open Now';

export interface ShopFilters {
  searchQuery: string;
  cities: string[];                 // empty or 'All Cities' = no city filter
  openNow: boolean;
  wifi: boolean;
  outlets: boolean;
  nearby: boolean;                  // within 2 km of the user
  radiusKm: number | null;          // custom radius from the filter screen
  userLocation: LatLng | null;
  pointedLocation: LatLng | null;
  pointedRadiusKm: number;
  cityCenters: { name: string; location: LatLng }[];
  currentHour: number;
}

const FALLBACK_USER_LOCATION: LatLng = { lat: 42.8755, lng: 74.5905 };

/** Adds `isOpen` to each shop and keeps those matching every active filter. */
export function filterShops(shops: any[], f: ShopFilters): any[] {
  const query = f.searchQuery.toLowerCase();

  return shops
    .map(shop => ({ ...shop, isOpen: isShopOpen(shop, f.currentHour) }))
    .filter(shop => {
      // Google results were already searched for the typed text
      const matchSearch = shop.fromGoogle || shop.name.toLowerCase().includes(query) ||
        (shop.address && shop.address.toLowerCase().includes(query));

      const matchCity = f.cities.length === 0 || f.cities.includes('All Cities') ||
        f.cities.some(c => shop.address && shop.address.toLowerCase().includes(c.toLowerCase()));

      const matchOpen = !f.openNow || shop.isOpen;

      const matchWifi = !f.wifi || (shop.wifi && shop.wifi.toLowerCase() !== 'none' && shop.wifi.toLowerCase() !== 'unavailable');

      const matchOutlets = !f.outlets || shop.outlets !== false;

      let matchNearby = true;
      if (f.nearby) {
        matchNearby = getDistanceInKm(f.userLocation || FALLBACK_USER_LOCATION, shop.location) <= 2.0;
      } else if (f.radiusKm !== null) {
        const centers: LatLng[] = [];
        if (f.userLocation) centers.push(f.userLocation);
        f.cities.forEach(cityName => {
          const found = f.cityCenters.find(c => c.name.toLowerCase() === cityName.toLowerCase());
          if (found) centers.push(found.location);
        });
        if (centers.length === 0) centers.push(BISHKEK_CENTER);
        const minDistance = Math.min(...centers.map(center => getDistanceInKm(center, shop.location)));
        matchNearby = minDistance <= f.radiusKm;
      }

      const matchPointed = !f.pointedLocation ||
        getDistanceInKm(f.pointedLocation, shop.location) <= f.pointedRadiusKm;

      return matchSearch && matchCity && matchOpen && matchWifi && matchOutlets && matchNearby && matchPointed;
    });
}
