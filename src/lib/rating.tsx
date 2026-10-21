import { Star } from 'lucide-react';

export const getRatingLabel = (val: number): string => {
  if (val <= 1.5) return "Pod";
  if (val <= 2.5) return "Drip";
  if (val <= 3.5) return "Medium";
  if (val <= 4.5) return "Pour-Over";
  return "Ristretto";
};


export const renderInteractiveStars = (
  rating: number,
  setRating: (val: number) => void,
  hoverRating: number | null,
  setHoverRating: (val: number | null) => void
) => {
  const activeRating = hoverRating !== null ? hoverRating : rating;
  return (
    <div className="flex items-center justify-center gap-1.5" onMouseLeave={() => setHoverRating(null)}>
      {[0, 1, 2, 3, 4].map((j) => {
        const starValLeft = j + 0.5;
        const starValRight = j + 1.0;
        
        let starFillType: 'none' | 'half' | 'full' = 'none';
        if (activeRating >= starValRight) {
          starFillType = 'full';
        } else if (activeRating === starValLeft) {
          starFillType = 'half';
        }
        
        return (
          <div key={j} className="relative w-8 h-8 select-none">
            {/* Background empty star */}
            <Star 
              size={32} 
              className="text-outline-variant absolute inset-0 pointer-events-none" 
            />
            {/* Foreground filled/half star */}
            {starFillType === 'full' && (
              <Star 
                size={32} 
                className="fill-secondary text-secondary drop-shadow-[0_0_6px_rgba(235,178,96,0.5)] absolute inset-0 pointer-events-none" 
              />
            )}
            {starFillType === 'half' && (
              <div className="absolute inset-y-0 left-0 overflow-hidden w-1/2 pointer-events-none">
                <Star 
                  size={32} 
                  className="fill-secondary text-secondary drop-shadow-[0_0_6px_rgba(235,178,96,0.5)]" 
                  style={{ maxWidth: 'none' }}
                />
              </div>
            )}
            
            {/* Left and Right half click areas */}
            <div 
              onMouseEnter={() => setHoverRating(starValLeft)}
              onClick={() => setRating(starValLeft)}
              className="absolute left-0 top-0 bottom-0 w-1/2 cursor-pointer z-10"
              title={`${starValLeft} Stars`}
            />
            <div 
              onMouseEnter={() => setHoverRating(starValRight)}
              onClick={() => setRating(starValRight)}
              className="absolute right-0 top-0 bottom-0 w-1/2 cursor-pointer z-10"
              title={`${starValRight} Stars`}
            />
          </div>
        );
      })}
    </div>
  );
};
