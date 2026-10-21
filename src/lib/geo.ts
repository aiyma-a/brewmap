export type LatLng = { lat: number; lng: number };

/** Straight-line distance in km between two points (haversine). */
export const getDistanceInKm = (loc1: LatLng, loc2: LatLng): number => {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a = 0.5 - c((loc2.lat - loc1.lat) * p) / 2 +
    c(loc1.lat * p) * c(loc2.lat * p) *
    (1 - c((loc2.lng - loc1.lng) * p)) / 2;
  return 12742 * Math.asin(Math.sqrt(a));
};

export const BISHKEK_CENTER: LatLng = { lat: 42.8746, lng: 74.5898 };
