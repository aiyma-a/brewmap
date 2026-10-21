// Real photos for known coffee shops, loaded from Google Places at runtime.
// Google's terms do not allow storing its photos, so we keep only the Place ID in our data
// and fetch (and remember for this visit only) a temporary photo URL.
export interface PlacePhoto { url: string; author: string | null }

const cache = new Map<string, Promise<PlacePhoto | null>>();

async function waitForPlacesLibrary(timeoutMs = 15000): Promise<any | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const g = (window as any).google;
    if (g?.maps?.importLibrary) {
      try { return await g.maps.importLibrary('places'); } catch { return null; }
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return null;
}

export function getPlacePhoto(placeId: string): Promise<PlacePhoto | null> {
  let p = cache.get(placeId);
  if (!p) {
    p = (async () => {
      const lib = await waitForPlacesLibrary();
      if (!lib) return null;
      try {
        const place = new lib.Place({ id: placeId });
        await place.fetchFields({ fields: ['photos'] });
        const photo = place.photos?.[0];
        if (!photo) return null;
        return { url: photo.getURI({ maxWidth: 600 }), author: photo.authorAttributions?.[0]?.displayName ?? null };
      } catch {
        return null;
      }
    })();
    cache.set(placeId, p);
  }
  return p;
}
