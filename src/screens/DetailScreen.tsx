import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Share2, Star, Navigation, Bookmark, Wifi, MapPin, Navigation2, Heart, Users, Trash2, PenLine, Coffee, X, MessageSquare, Send, Mail, Copy, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { COFFEE_SHOPS } from '../data';
import { useState, useEffect, FormEvent } from 'react';

const CUSTOM_VECTOR_AVATARS = [
  { id: 'vec_espresso', name: 'Espresso', bg: 'bg-[#4B3621]', text: 'text-white' },
  { id: 'vec_latte', name: 'Latte', bg: 'bg-[#C2B280]', text: 'text-[#4B3621]' },
  { id: 'vec_mocha', name: 'Mocha', bg: 'bg-brand', text: 'text-white' },
  { id: 'vec_caramel', name: 'Caramel', bg: 'bg-[#C68E17]', text: 'text-white' },
  { id: 'vec_cream', name: 'Cream', bg: 'bg-[#F5F5DC]', text: 'text-brand' },
  { id: 'vec_black', name: 'Black', bg: 'bg-[#1A1A1A]', text: 'text-white' }
];

const getRatingLabel = (val: number): string => {
  if (val <= 1.5) return "Pod";
  if (val <= 2.5) return "Drip";
  if (val <= 3.5) return "Medium";
  if (val <= 4.5) return "Pour-Over";
  return "Ristretto";
};

const renderInteractiveStars = (
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

export default function DetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const shop = COFFEE_SHOPS.find(s => s.id === id) || COFFEE_SHOPS[0];

  const [userProfile] = useState(() => {
    let profile = {
      name: 'Aydana Temirova',
      username: 'aydana_brews',
      bio: 'Specialty coffee connoisseur / Manual brew fanatic',
      avatar: 'vector:Espresso'
    };
    const saved = localStorage.getItem('brewmap_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          profile = { ...profile, ...parsed };
        }
      } catch (e) {}
    }
    if (!profile.avatar.startsWith('vector:')) {
      profile.avatar = 'vector:Espresso';
    }
    return profile;
  });

  const [favorites, setFavorites] = useState<any[]>(() => {
    const saved = localStorage.getItem('brewmap_saved_spots');
    return saved ? JSON.parse(saved) : COFFEE_SHOPS;
  });

  const [reviews, setReviews] = useState<any[]>(() => {
    const saved = localStorage.getItem('brewmap_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [isFavorite, setIsFavorite] = useState(() => {
    return favorites.some(f => f.id === shop.id);
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShopCopied, setIsShopCopied] = useState(false);

  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineRating, setInlineRating] = useState(5);
  const [inlineComment, setInlineComment] = useState('');
  const [inlineHoverRating, setInlineHoverRating] = useState<number | null>(null);

  useEffect(() => {
    const userReviewForThisShop = reviews.find(r => r.shopId === shop.id);
    if (userReviewForThisShop) {
      setInlineRating(userReviewForThisShop.rating);
      setInlineComment(userReviewForThisShop.comment);
      setIsEditingInline(false);
    } else {
      setInlineRating(5);
      setInlineComment('');
      setIsEditingInline(false);
    }
  }, [shop.id]);

  const handleToggleFavorite = () => {
    let updated;
    if (isFavorite) {
      updated = favorites.filter(f => f.id !== shop.id);
      setIsFavorite(false);
      setNotification(`Removed ${shop.name} from saved spots.`);
    } else {
      updated = [...favorites, shop];
      setIsFavorite(true);
      setNotification(`Saved ${shop.name} to favorites!`);
    }
    setFavorites(updated);
    localStorage.setItem('brewmap_saved_spots', JSON.stringify(updated));
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePostReview = (e: FormEvent) => {
    e.preventDefault();
    const newReview = {
      id: `rev_${Date.now()}`,
      shopId: shop.id,
      shopName: shop.name,
      user: userProfile.name,
      avatar: userProfile.avatar,
      rating: rating,
      comment: comment,
      time: 'Just now'
    };
    
    const updatedReviews = [newReview, ...reviews.filter(r => r.shopId !== shop.id)];
    setReviews(updatedReviews);
    localStorage.setItem('brewmap_reviews', JSON.stringify(updatedReviews));
    setNotification('Thank you for your review!');
    setComment('');
    setRating(5);
    setShowReviewForm(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteReview = () => {
    const updatedReviews = reviews.filter(r => r.shopId !== shop.id);
    setReviews(updatedReviews);
    localStorage.setItem('brewmap_reviews', JSON.stringify(updatedReviews));
    setNotification('Your review has been removed.');
    setInlineComment('');
    setInlineRating(5);
    setIsEditingInline(true);
    setTimeout(() => setNotification(null), 3000);
  };

  const currentHour = new Date().getHours();
  const isOpen = (shop.openingHour !== undefined && shop.closingHour !== undefined)
    ? (currentHour >= shop.openingHour && currentHour < shop.closingHour)
    : shop.status === 'Open Now';

  return (
    <div className="bg-surface text-on-surface h-screen font-sans overflow-hidden relative flex flex-col">
      {/* Floating Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand text-white shadow-soft font-semibold px-5 py-3 rounded-full text-xs flex items-center gap-2 border border-brand/10"
          >
            <span>☕ {notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-transparent pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-neutral-800 hover:bg-white/90 transition-all active:scale-95 shadow-md pointer-events-auto"
          title="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="w-9" />
      </header>

      <main className="w-full max-w-2xl mx-auto flex-1 flex flex-col min-h-0 relative">
        {/* Hero */}
        <section className="relative w-full h-[18vh] min-h-[140px] overflow-hidden shrink-0">
          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/30" />
        </section>

        {/* Content Canvas */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative -mt-8 bg-surface rounded-t-[32px] px-4 pt-5 pb-4 z-10 shadow-2xl flex-1 flex flex-col min-h-0"
        >
          {/* Title Info */}
          <div className="flex flex-col items-center justify-center text-center mb-3.5 relative w-full px-12 shrink-0">
            <div className="space-y-0.5 flex flex-col items-center justify-center w-full">
              <h1 className="font-headline text-base sm:text-lg text-primary font-black tracking-tight line-clamp-1">{shop.name}</h1>
              
              {/* Open Now Pill & rating/distance Under the Coffee Spot Name */}
              <div className="flex items-center gap-2 justify-center flex-wrap">
                <span className={`${isOpen ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/10' : 'bg-rose-50 text-rose-700 border border-rose-500/10'} px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide uppercase shadow-sm`}>
                  {isOpen ? 'Open Now' : 'Closed'}
                </span>
                <span className="w-1 h-1 bg-outline-variant/50 rounded-full" />
                <div className="flex items-center gap-0.5 text-on-surface-variant">
                  <Star size={11} fill="currentColor" className="text-secondary fill-secondary" />
                  <span className="text-[11px] font-bold text-on-surface">{shop.rating}</span>
                  <span className="text-[10px] text-on-surface-variant/80">({shop.reviewCount + (reviews.some(r => r.shopId === shop.id) ? 1 : 0)})</span>
                </div>
                <span className="w-1 h-1 bg-outline-variant/50 rounded-full" />
                <div className="flex items-center gap-0.5 text-on-surface-variant">
                  <Navigation size={10} className="rotate-45" />
                  <span className="text-[11px] font-bold text-on-surface">{shop.distance}</span>
                </div>
              </div>
            </div>
            
            {/* Share and Bookmark buttons grouped together on the right of the Name block */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button 
                onClick={() => {
                  setIsShareModalOpen(true);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high text-primary hover:bg-secondary-container hover:text-on-secondary-container transition-all active:scale-90 shadow-sm"
                title="Share Cafe"
              >
                <Share2 size={13} />
              </button>
              <button 
                onClick={handleToggleFavorite}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-95 shadow-sm ${
                  isFavorite 
                  ? 'bg-[#FF4B4B]/10 text-[#FF4B4B]' 
                  : 'bg-surface-container-high text-primary hover:bg-secondary-container hover:text-on-secondary-container'
                }`}
                title={isFavorite ? 'Saved in Favorites' : 'Save to Favorites'}
              >
                <Bookmark size={13} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Compact Info Row */}
          <div className="grid grid-cols-2 gap-2 mb-3.5 shrink-0">
            <div className="bg-white rounded-xl p-2.5 shadow-sm border border-surface-container-low flex items-center gap-2">
              <div className="w-7 h-7 shrink-0 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <Wifi size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">WiFi</p>
                <p className={`text-xs font-bold truncate ${
                  shop.wifi && shop.wifi.toLowerCase() !== 'none' && shop.wifi.toLowerCase() !== 'unavailable'
                    ? 'text-emerald-600' 
                    : 'text-red-500'
                }`}>
                  {shop.wifi && shop.wifi.toLowerCase() !== 'none' && shop.wifi.toLowerCase() !== 'unavailable'
                    ? 'Available' 
                    : 'Unavailable'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-2.5 shadow-sm border border-surface-container-low flex items-center gap-2 md:col-span-1 col-span-1">
              <div className="w-7 h-7 shrink-0 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <MapPin size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Location</p>
                <p className="text-xs font-bold text-primary truncate" title={shop.address}>
                  {shop.address ? shop.address.split(',')[0] : 'Central'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-3 px-0.5 shrink-0">
            <button className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-md text-xs">
              <Navigation2 size={15} className="fill-current" />
              Get Directions
            </button>
            <button 
              onClick={handleToggleFavorite}
              className={`flex-1 py-2.5 border rounded-xl font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-xs ${
                isFavorite
                ? 'bg-[#FF4B4B]/5 text-[#FF4B4B] border-[#FF4B4B]/20'
                : 'bg-white text-primary border-primary/10 hover:bg-primary/5'
              }`}
            >
              <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-[#FF4B4B]' : ''} />
              {isFavorite ? 'Saved Spot' : 'Save Spot'}
            </button>
          </div>

          {/* About Section */}
          <section className="mb-3.5 px-0.5 shrink-0">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono mb-1">About the Cafe</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2 bg-surface-container/30 px-3 py-2 rounded-xl">
              {shop.about}
            </p>
          </section>

          {/* Reviews Section */}
          <section className="border-t border-outline-variant/20 pt-3 flex-1 flex flex-col min-h-0 overflow-hidden px-0.5">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono">Reviews</h3>
              <button 
                onClick={() => {
                  const userRev = reviews.find(r => r.shopId === shop.id);
                  if (userRev) {
                    setRating(userRev.rating);
                    setComment(userRev.comment);
                  } else {
                    setRating(5);
                    setComment('');
                  }
                  setShowReviewForm(true);
                }}
                className="text-secondary text-[10px] font-bold uppercase tracking-wider hover:brightness-110 transition-all font-mono"
              >
                {reviews.some(r => r.shopId === shop.id) ? 'Open Review Form' : 'Leave a Review'}
              </button>
            </div>

            {/* Featured Inline "Your Experience" Editor Card */}
            {(() => {
              const userReviewForThisShop = reviews.find(r => r.shopId === shop.id);
              return (
                <div className="mb-3.5 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 shadow-sm shrink-0 transition-all duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Coffee size={13} className="text-[#a55e2b]" />
                      <span className="text-[10px] font-extrabold text-brand uppercase tracking-wider font-mono">Your Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isEditingInline ? (
                        <div className="flex gap-1.5 items-center">
                          <button 
                            type="button"
                            onClick={() => {
                              if (userReviewForThisShop) {
                                setInlineRating(userReviewForThisShop.rating);
                                setInlineComment(userReviewForThisShop.comment);
                              } else {
                                setInlineRating(5);
                                setInlineComment('');
                              }
                              setIsEditingInline(false);
                            }}
                            className="bg-outline-variant/10 text-on-surface-variant text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider font-mono hover:bg-outline-variant/25 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              if (!inlineComment.trim()) return;
                              const newReview = {
                                id: userReviewForThisShop?.id || `rev_${Date.now()}`,
                                shopId: shop.id,
                                shopName: shop.name,
                                user: userProfile.name,
                                avatar: userProfile.avatar,
                                rating: inlineRating,
                                comment: inlineComment,
                                time: 'Just now'
                              };
                              const updated = [newReview, ...reviews.filter(r => r.shopId !== shop.id)];
                              setReviews(updated);
                              localStorage.setItem('brewmap_reviews', JSON.stringify(updated));
                              setNotification(userReviewForThisShop ? 'Review saved!' : 'Review posted!');
                              setIsEditingInline(false);
                            }}
                            className="bg-[#a55e2b] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider font-mono hover:brightness-110 shadow-sm transition-all cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <button 
                            type="button"
                            onClick={() => {
                              if (userReviewForThisShop) {
                                setInlineRating(userReviewForThisShop.rating);
                                setInlineComment(userReviewForThisShop.comment);
                              } else {
                                setInlineRating(5);
                                setInlineComment('');
                              }
                              setIsEditingInline(true);
                            }}
                            className="bg-primary/5 text-primary text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider font-mono hover:bg-primary/15 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <PenLine size={9} />
                            {userReviewForThisShop ? 'Edit' : 'Write'}
                          </button>
                          {userReviewForThisShop && (
                            <>
                              <span className="text-outline-variant/30 text-[10px]">|</span>
                              <button 
                                type="button"
                                onClick={handleDeleteReview}
                                className="text-error/80 hover:text-error text-[10px] font-extrabold uppercase tracking-wider font-mono hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditingInline ? (
                    <div className="space-y-3">
                      <div className="flex flex-col items-center py-2 px-1 bg-surface/40 rounded-xl border border-outline-variant/10">
                        {renderInteractiveStars(
                          inlineRating,
                          setInlineRating,
                          inlineHoverRating,
                          setInlineHoverRating
                        )}
                        <p className="text-[10px] font-extrabold text-brand uppercase tracking-widest mt-1.5 font-mono">
                          ☕ {getRatingLabel(inlineRating)} ({inlineRating.toFixed(1)})
                        </p>
                      </div>
                      
                      <textarea
                        value={inlineComment}
                        onChange={(e) => setInlineComment(e.target.value)}
                        placeholder="Rate your sip! Mention manual drip roasts, acidity notes, baristas' service, or WiFi quality..."
                        className="w-full text-xs bg-surface/50 rounded-xl p-2.5 border border-outline-variant/30 min-h-[60px] outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary placeholder:text-on-surface-variant/40 text-on-surface leading-normal resize-none"
                      />
                      
                      <div className="flex justify-end gap-2 pt-1 border-t border-outline-variant/5">
                        <button 
                          type="button"
                          onClick={() => {
                            if (userReviewForThisShop) {
                              setInlineRating(userReviewForThisShop.rating);
                              setInlineComment(userReviewForThisShop.comment);
                            } else {
                              setInlineRating(5);
                              setInlineComment('');
                            }
                            setIsEditingInline(false);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-outline-variant text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            if (!inlineComment.trim()) return;
                            const newReview = {
                              id: userReviewForThisShop?.id || `rev_${Date.now()}`,
                              shopId: shop.id,
                              shopName: shop.name,
                              user: userProfile.name,
                              avatar: userProfile.avatar,
                              rating: inlineRating,
                              comment: inlineComment,
                              time: 'Just now'
                            };
                            const updated = [newReview, ...reviews.filter(r => r.shopId !== shop.id)];
                            setReviews(updated);
                            localStorage.setItem('brewmap_reviews', JSON.stringify(updated));
                            setNotification(userReviewForThisShop ? 'Review saved!' : 'Review posted!');
                            setIsEditingInline(false);
                          }}
                          className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-[10px] font-bold uppercase tracking-wider hover:brightness-110 shadow-sm transition-all"
                        >
                          Save Experience
                        </button>
                      </div>
                    </div>
                  ) : userReviewForThisShop ? (
                    <div className="bg-surface/55 rounded-xl p-3 border border-outline-variant/10">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            {[0, 1, 2, 3, 4].map((j) => {
                              const isFull = userReviewForThisShop.rating >= j + 1;
                              const isHalf = userReviewForThisShop.rating === j + 0.5;
                              return (
                                <div key={j} className="relative w-3 h-3">
                                  <Star size={12} className="text-outline-variant absolute inset-0" />
                                  {isFull && <Star size={12} className="fill-secondary text-secondary absolute inset-0" />}
                                  {isHalf && (
                                    <div className="absolute inset-y-0 left-0 overflow-hidden w-1/2">
                                      <Star size={12} className="fill-secondary text-secondary" style={{ maxWidth: 'none' }} />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <span className="text-[10px] font-extrabold text-brand bg-brand/10 px-1.5 py-0.5 rounded font-mono tracking-wider uppercase ml-1.5">
                            {getRatingLabel(userReviewForThisShop.rating)} ({userReviewForThisShop.rating.toFixed(1)})
                          </span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant font-medium">{userReviewForThisShop.time}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed italic">
                        "{userReviewForThisShop.comment}"
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4 px-2 bg-surface/30 rounded-xl border border-dashed border-outline-variant/20">
                      <p className="text-[10px] font-bold text-on-surface-variant/75 font-sans">You haven't reviewed this coffee spot yet.</p>
                      <p className="text-[10px] text-on-surface-variant/50 mt-0.5 mb-2 font-sans">Share your drip notes, wifi speed, and cozy vibes with the circle.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setInlineRating(5);
                          setInlineComment('');
                          setIsEditingInline(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#a55e2b]/10 text-[#a55e2b] rounded-lg text-[10px] font-extrabold uppercase tracking-wider font-mono hover:bg-[#a55e2b]/20 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <PenLine size={9} />
                        Write / Edit Review
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
            
            {/* Scrollable Reviews List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
              {(() => {
                const combinedReviews = [];
                
                // Tailored community reviews to provide rich reading experience
                if (shop.id === '1') {
                  combinedReviews.push(
                    { name: 'Alex', comment: 'Amazing specialty coffee, very knowledgeable baristas! The manual pour-over had incredible jasmine notes.', rating: 5, date: '2 days ago', avatar: 'vector:Black' },
                    { name: 'Sarah', comment: 'Perfect spot for remote work. The forest green atmosphere is super cozy and the WiFi is incredibly fast!', rating: 4, date: '1 week ago', avatar: 'vector:Cream' },
                    { name: 'Nurlan', comment: 'Highly recommend their in-house roasted espresso. The taste is balanced, acidity is spot on.', rating: 5, date: '2 weeks ago', avatar: 'vector:Latte' }
                  );
                } else if (shop.id === '2') {
                  combinedReviews.push(
                    { name: 'Elena', comment: 'Best latte art in Bishkek! Super creamy texture and the milk temp was perfect.', rating: 5, date: '1 day ago', avatar: 'vector:Mocha' },
                    { name: 'Daniar', comment: 'Centrally located and great vibes. A bit crowded during lunch hours, but service is still fast.', rating: 4, date: '5 days ago', avatar: 'vector:Caramel' }
                  );
                } else {
                  combinedReviews.push(
                    { name: 'Zamir', comment: 'For hardcore specialty fans! They roast the beans live in the cafe, the aroma is celestial.', rating: 5, date: '3 days ago', avatar: 'vector:Espresso' },
                    { name: 'Kamila', comment: 'Outstanding single-origin espresso. Simple list, highly professional execution.', rating: 5, date: '1 week ago', avatar: 'vector:Cream' }
                  );
                }

                return combinedReviews.map((rev: any, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center shrink-0 border border-outline-variant/30 shadow-sm bg-[#faf8f5]">
                      {(() => {
                        let matched = CUSTOM_VECTOR_AVATARS[0];
                        if (rev.avatar && rev.avatar.startsWith('vector:')) {
                          const name = rev.avatar.substring(7);
                          matched = CUSTOM_VECTOR_AVATARS.find(v => v.name === name) || CUSTOM_VECTOR_AVATARS[0];
                        } else if (rev.avatar) {
                          const seed = rev.avatar.length;
                          matched = CUSTOM_VECTOR_AVATARS[seed % CUSTOM_VECTOR_AVATARS.length];
                        }
                        return (
                          <div className={`w-full h-full flex items-center justify-center ${matched.bg} ${matched.text}`}>
                            <Coffee size={14} fill="currentColor" />
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-on-surface">{rev.name}</h4>
                        <p className="text-[10px] text-on-surface-variant font-medium">{rev.date}</p>
                      </div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {[0, 1, 2, 3, 4].map((j) => {
                          const isFull = rev.rating >= j + 1;
                          const isHalf = rev.rating === j + 0.5;
                          return (
                            <div key={j} className="relative w-2 h-2">
                              <Star size={8} className="text-outline-variant absolute inset-0" />
                              {isFull && <Star size={8} className="fill-secondary text-secondary absolute inset-0" />}
                              {isHalf && (
                                <div className="absolute inset-y-0 left-0 overflow-hidden w-1/2">
                                  <Star size={8} className="fill-secondary text-secondary" style={{ maxWidth: 'none' }} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">"{rev.comment}"</p>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Read Community Reviews Button */}
            <button 
              onClick={() => navigate('/brewlog')}
              className="w-full py-2 border border-outline-variant/45 rounded-xl text-on-surface-variant text-[11px] font-bold hover:bg-surface-container transition-colors mt-2.5 shrink-0"
            >
              Read Community Reviews
            </button>
          </section>
        </motion.div>
      </main>

      {/* Review Modal Form Sheet */}
      <AnimatePresence>
        {showReviewForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewForm(false)}
              className="fixed inset-0 bg-neutral-900 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-surface rounded-t-[32px] border-t border-outline-variant/30 z-50 px-6 pt-5 pb-10 shadow-2xl overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-6" />
              <div className="max-w-md mx-auto">
                <div className="mb-4 flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                    <Coffee size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-brand uppercase">Brew Rating</span>
                    <h3 className="text-lg font-black text-on-surface leading-snug">{shop.name}</h3>
                  </div>
                </div>

                <form onSubmit={handlePostReview} className="space-y-5">
                  <div className="bg-surface-container rounded-2xl p-4 text-center border border-outline-variant/10">
                    <p className="text-xs font-bold text-on-surface-variant mb-2">Rate your sip!</p>
                    
                    {renderInteractiveStars(
                      rating,
                      setRating,
                      hoverRating,
                      setHoverRating
                    )}
                    
                    <p className="text-xs font-extrabold text-brand mt-2.5 uppercase tracking-widest font-mono flex items-center justify-center gap-1">
                      <span>☕</span>
                      <span>{getRatingLabel(rating)}</span>
                      <span className="text-[10px] text-on-surface-variant/70">({rating.toFixed(1)})</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider font-mono">Your Experience</label>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full min-h-[120px] bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 text-sm placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none outline-none leading-relaxed"
                      placeholder="What did you order? Mention manual drip roasts, acidity notes, baristas' service, or WiFi quality..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="py-3.5 border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-3.5 bg-primary hover:brightness-110 text-on-primary rounded-xl text-xs font-bold shadow-soft transition-all"
                    >
                      Save/Edit
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Specialty Coffee Shop Share Sheet */}
      <AnimatePresence>
        {isShareModalOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="fixed inset-0 bg-neutral-900 z-50 pointer-events-auto cursor-pointer"
            />

            {/* Share Coffee Shop Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-surface rounded-t-[32px] border-t border-outline-variant/30 z-50 px-6 pt-5 pb-10 shadow-2xl overflow-y-auto pointer-events-auto text-left"
            >
              <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-6 shrink-0" />

              <div className="max-w-md mx-auto">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <Coffee size={30} className="fill-current text-brand" />
                    </div>
                    <div>
                      <h3 className="font-headline font-black text-primary text-base">Share Coffee Shop</h3>
                      <p className="text-[10px] text-on-surface-variant/70 font-mono">Recommend this specialty spot</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsShareModalOpen(false)}
                    className="p-1.5 rounded-full hover:bg-surface-container active:scale-90 transition-colors border border-outline-variant/10"
                  >
                    <X size={16} className="text-on-surface-variant" />
                  </button>
                </div>

                {/* Coffee Shop Preview Card */}
                <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 flex items-center gap-4 mb-6 shadow-sm">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-outline-variant/10 bg-surface-container-high">
                    <img 
                      src={shop.image} 
                      alt={shop.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-headline font-black text-primary text-sm uppercase tracking-tight truncate">{shop.name}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={11} fill="currentColor" className="text-secondary fill-secondary" />
                      <span className="text-[11px] font-bold text-on-surface">{shop.rating}</span>
                      <span className="text-[10px] text-on-surface-variant/80">({shop.reviewCount || 120} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-on-surface-variant/80">
                      <MapPin size={10} className="text-brand shrink-0" />
                      <p className="text-[10px] truncate font-sans">{shop.address}</p>
                    </div>
                  </div>
                </div>

                {/* Social networks & text messaging buttons */}
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 font-mono">Share via</h4>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {/* SMS & Text Msg */}
                  <a
                    href={`sms:?body=${encodeURIComponent(`Check out this coffee shop on Brewmap! ☕✨\n\n🏠 ${shop.name}\n📍 ${shop.address}\n\nJoin the roaster community and discover more: ${window.location.origin}/shop/${shop.id}`)}`}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-center group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <MessageSquare size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">Text Msg</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this specialty coffee shop on Brewmap! ☕✨\n\n🏠 *${shop.name}* \n⭐️ ${shop.rating} Rating\n📍 ${shop.address}\n\nView details here: ${window.location.origin}/shop/${shop.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-center group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#128C7E] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <Coffee size={18} fill="currentColor" />
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">WhatsApp</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/shop/${shop.id}`)}&text=${encodeURIComponent(`Check out this awesome specialty coffee shop, ${shop.name}, on Brewmap! ☕✨\n\n⭐️ Rating: ${shop.rating}\n🗺️ Address: ${shop.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-center group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <Send size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">Telegram</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(`Specialty Coffee Recommendation: ${shop.name}`)}&body=${encodeURIComponent(`Hey! I wanted to recommend this coffee shop from Brewmap:\n\n🏠 ${shop.name}\n⭐️ Rating: ${shop.rating}\n📍 Address: ${shop.address}\n\nCheck out reviews and details here: ${window.location.origin}/shop/${shop.id}\n\nHappy brewing!`)}`}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-center group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <Mail size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">Email</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
