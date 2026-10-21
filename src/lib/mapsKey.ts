export const API_KEY = (
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  ''
).replace(/^["']|["']$/g, '').trim();

export const hasValidKey = 
  Boolean(API_KEY) && 
  API_KEY.startsWith('AIza') &&
  API_KEY.length > 20;

