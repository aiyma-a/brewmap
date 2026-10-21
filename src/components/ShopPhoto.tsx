import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import { getPlacePhoto } from '../lib/placePhotos';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  shop: { image?: string; placeId?: string; name?: string };
  /** Show "Photo: <author> · Google Maps" under/over the image (use on large photos) */
  showCredit?: boolean;
}

/**
 * Shop picture: the real Google Maps photo when the shop has a Place ID,
 * otherwise (or while loading / if it fails) the shop's own image.
 */
export function ShopPhoto({ shop, showCredit, alt, title, ...imgProps }: Props) {
  const [photo, setPhoto] = useState<{ url: string; author: string | null } | null>(null);

  useEffect(() => {
    setPhoto(null);
    if (!shop.placeId) return;
    let cancelled = false;
    getPlacePhoto(shop.placeId).then(p => { if (!cancelled) setPhoto(p); });
    return () => { cancelled = true; };
  }, [shop.placeId]);

  const credit = photo ? `Photo: ${photo.author ? photo.author + ' · ' : ''}Google Maps` : undefined;

  return (
    <>
      <img {...imgProps} src={photo?.url || shop.image} alt={alt ?? shop.name ?? ''} title={title ?? credit} />
      {showCredit && credit && (
        <span className="absolute bottom-1 right-1 z-10 max-w-[90%] truncate rounded bg-black/55 px-1.5 py-0.5 text-[9px] text-white">{credit}</span>
      )}
    </>
  );
}
