import { motion, AnimatePresence } from 'motion/react';
import { Navigation2, Coffee, X, MessageSquare, Compass, Star, Heart, PenLine, Check, CheckCircle2, Share2, Copy, Wifi, ChevronDown } from 'lucide-react';
import { getRatingLabel, renderInteractiveStars } from '../../lib/rating';
import { BusyReport } from '../../components/BusyReport';
import { statusLabel } from '../../lib/shops';

export interface ShopDetailSheetProps {
  Date: DateConstructor;
  favoritesList: any;
  handleToggleFavorite: (shop: any) => void;
  handleToggleVisited: (shop: any) => void;
  inlineCommentExplore: any;
  inlineHoverRatingExplore: any;
  inlineRatingExplore: any;
  isDetailExpanded: any;
  isEditingInlineExplore: any;
  reviewsList: any;
  selectedShopDetail: any;
  setAddNotification: any;
  setInlineCommentExplore: any;
  setInlineHoverRatingExplore: any;
  setInlineRatingExplore: any;
  setIsDetailExpanded: any;
  setIsEditingInlineExplore: any;
  setReviewComment: any;
  setReviewRating: any;
  setReviewsList: any;
  setSelectedShopDetail: any;
  setSelectedShopForReview: any;
  setShareShopData: any;
  String: StringConstructor;
  userProfile: any;
  visitedList: any;
}

export function ShopDetailSheet(props: ShopDetailSheetProps) {
  const {
    Date,
    favoritesList,
    handleToggleFavorite,
    handleToggleVisited,
    inlineCommentExplore,
    inlineHoverRatingExplore,
    inlineRatingExplore,
    isDetailExpanded,
    isEditingInlineExplore,
    reviewsList,
    selectedShopDetail,
    setAddNotification,
    setInlineCommentExplore,
    setInlineHoverRatingExplore,
    setInlineRatingExplore,
    setIsDetailExpanded,
    setIsEditingInlineExplore,
    setReviewComment,
    setReviewRating,
    setReviewsList,
    setSelectedShopDetail,
    setSelectedShopForReview,
    setShareShopData,
    String,
    userProfile,
    visitedList,
  } = props;

  return (
    <>
<AnimatePresence>
            {selectedShopDetail && (
              <>
                {/* Backdrop overlay when expanded to focus user attention */}
                {isDetailExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setIsDetailExpanded(false);
                      setSelectedShopDetail(null);
                    }}
                    className="fixed inset-0 bg-neutral-900/60 z-45 md:hidden pointer-events-auto cursor-pointer"
                  />
                )}

                <motion.div
                  initial={{ y: '100%', opacity: 0.9 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    height: isDetailExpanded ? '80vh' : '330px' 
                  }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                  className="fixed bottom-[102px] left-0 right-0 md:left-4 md:right-auto md:top-[88px] md:bottom-auto md:w-[380px] md:h-[calc(100vh-210px)] md:max-h-[750px] bg-surface/98 dark:bg-[#161412]/98 backdrop-blur-md z-45 rounded-t-[32px] md:rounded-[24px] border border-[#ece3e1]/40 dark:border-[#4f4240]/40 shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in fade-in"
                >
                  {/* Top image header block */}
                  <div className="relative w-full h-[140px] shrink-0 overflow-hidden">
                    <img 
                      src={selectedShopDetail.image} 
                      alt={selectedShopDetail.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
                    
                    {/* Pull utility handle overlay for mobile (increased height and width for premium responsiveness) */}
                    <div 
                      onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                      className="absolute top-0 inset-x-0 h-7 flex items-center justify-center cursor-pointer z-20"
                      title="Toggle expand details"
                    >
                      <div className="w-16 h-1.5 bg-white/55 dark:bg-white/35 rounded-full hover:bg-white/80 transition-colors" />
                    </div>
                    
                    {/* Floating Header Actions inside picture */}
                    <div className="absolute top-5 left-3 right-3 flex justify-between items-center z-20">
                      <div className="flex gap-2">
                        {isDetailExpanded ? (
                          <>
                            {/* Collapse button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDetailExpanded(false);
                              }}
                              className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-[#a55e2b] hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-[#a55e2b]/20 cursor-pointer"
                              title="Collapse details"
                            >
                              <ChevronDown size={18} className="animate-pulse" />
                            </button>
                            {/* Completely Close button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedShopDetail(null);
                                setIsDetailExpanded(false);
                              }}
                              className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-on-surface hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-outline-variant/10 cursor-pointer"
                              title="Close details"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedShopDetail(null);
                              setIsDetailExpanded(false);
                            }}
                            className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-on-surface hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-outline-variant/10 cursor-pointer"
                            title="Close details"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {/* Share action */}
                        <button 
                          onClick={() => {
                            setShareShopData(selectedShopDetail);
                          }}
                          className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-primary hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-outline-variant/10 cursor-pointer"
                          title="Share Cafe"
                        >
                          <Share2 size={14} />
                        </button>

                        {/* Save to favorites toggle */}
                        {(() => {
                          const isFav = favoritesList.some(f => f.id === selectedShopDetail.id);
                          return (
                            <button 
                              onClick={() => handleToggleFavorite(selectedShopDetail)}
                              className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-outline-variant/10 cursor-pointer text-[#FF4B4B]"
                              title={isFav ? "Saved" : "Save"}
                            >
                              <Heart size={14} fill={isFav ? "currentColor" : "none"} className={isFav ? "scale-110 animate-pulse duration-500 text-[#FF4B4B]" : "text-on-surface-variant/75"} />
                            </button>
                          );
                        })()}

                        {/* Visited status toggle */}
                        {(() => {
                          const isVisited = visitedList.some(v => v.id === selectedShopDetail.id);
                          return (
                            <button 
                              onClick={() => handleToggleVisited(selectedShopDetail)}
                              className={`w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-outline-variant/10 cursor-pointer ${isVisited ? 'text-emerald-600 dark:text-emerald-400' : 'text-on-surface-variant/75'}`}
                              title={isVisited ? "Visited" : "Mark as Visited"}
                            >
                              <CheckCircle2 size={14} fill={isVisited ? "currentColor" : "none"} className={isVisited ? "scale-110 text-emerald-600 dark:text-emerald-400" : "text-on-surface-variant/75"} />
                            </button>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Shop title overlay */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-headline font-black text-sm uppercase tracking-tight line-clamp-1">{selectedShopDetail.name}</h3>
                      <p className="text-[10px] text-white/80 line-clamp-1 font-sans mt-0.5">{selectedShopDetail.address || 'Specialty Coffee, Bishkek'}</p>
                    </div>
                  </div>

                  {/* Scrollable pop-up details and reviews container */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 hide-scrollbar">
                    
                    {/* Basic visual parameters stats bar */}
                    <div className="flex items-center justify-between border-b border-outline-variant/10 pb-3 shrink-0">
                      <div className="flex items-center gap-2">
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 bg-surface-container/60 px-2.5 py-1 rounded-xl border border-outline-variant/5">
                          <Star size={13} className="fill-secondary text-secondary" />
                          <span className="text-xs font-black">{selectedShopDetail.rating || '4.8'}</span>
                          <span className="text-[10px] text-on-surface-variant/80">({selectedShopDetail.reviewCount || 10})</span>
                        </div>

                        {/* Store hours opening status */}
                        {(() => {
                          const currentHour = new Date().getHours();
                          const isOpen = selectedShopDetail.openingHour !== undefined && selectedShopDetail.closingHour !== undefined
                            ? currentHour >= selectedShopDetail.openingHour && currentHour < selectedShopDetail.closingHour
                            : selectedShopDetail.status === 'Open Now';
                          return (
                            <span className={`text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded-xl border ${
                              isOpen 
                                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/10' 
                                : 'text-on-surface-variant/40 bg-on-surface-variant/5 border-outline-variant/10'
                            }`}>
                              {statusLabel(isOpen, selectedShopDetail.status, 'Open Now')}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Distance */}
                      {selectedShopDetail.distance && (
                        <div className="flex items-center gap-1 text-[11px] text-on-surface-variant/80 font-mono">
                          <Navigation2 size={11} className="rotate-45" />
                          <span>{selectedShopDetail.distance}</span>
                        </div>
                      )}
                    </div>

                    {/* Self-reported crowd level */}
                    <BusyReport shopId={String(selectedShopDetail.id)} />

                    {/* Visited Status Indicator Card */}
                    {(() => {
                      const isVisited = visitedList.some(v => v.id === selectedShopDetail.id);
                      return (
                        <div className={`p-3 rounded-2xl border flex items-center justify-between transition-all select-none ${
                          isVisited 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-400' 
                            : 'bg-surface-container-low border-outline-variant/10 text-on-surface'
                        }`}>
                          <div className="flex items-center gap-2.5">
                            <span className={`p-2 rounded-xl flex items-center justify-center ${isVisited ? 'bg-emerald-555/5 text-emerald-600 dark:text-emerald-450' : 'bg-surface-variant text-on-surface-variant'}`}>
                              <Coffee size={14} className={isVisited ? "text-emerald-600 dark:text-emerald-400" : "text-on-surface-variant"} />
                            </span>
                            <div className="text-left">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/85">Visited Status</p>
                              <p className="text-xs font-bold">{isVisited ? "You've been here! Checked in." : "Haven't visited yet."}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleVisited(selectedShopDetail)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all active:scale-95 cursor-pointer uppercase ${
                              isVisited 
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm' 
                                : 'bg-brand/10 hover:bg-brand/15 text-brand border border-brand/15'
                            }`}
                          >
                            {isVisited ? 'Visited' : 'Check-In'}
                          </button>
                        </div>
                      );
                    })()}

                    {/* Features checklist: Wifi / outlets */}
                    <div className="grid grid-cols-2 gap-2 shrink-0">
                      <div className="bg-surface-container/40 p-2 rounded-2xl border border-outline-variant/5 flex flex-col items-center justify-center text-center">
                        <Wifi size={14} className="text-primary mb-1" />
                        <span className="text-[10px] font-bold text-on-surface-variant block truncate w-full">WiFi</span>
                        <span className={`text-[10px] font-black truncate w-full ${
                          selectedShopDetail.wifi && selectedShopDetail.wifi.toLowerCase() !== 'none' && selectedShopDetail.wifi.toLowerCase() !== 'unavailable'
                            ? 'text-emerald-600' 
                            : 'text-red-500'
                        }`}>
                          {selectedShopDetail.wifi && selectedShopDetail.wifi.toLowerCase() !== 'none' && selectedShopDetail.wifi.toLowerCase() !== 'unavailable'
                            ? 'WiFi Available' 
                            : 'WiFi Unavailable'}
                        </span>
                      </div>
                      <div className="bg-surface-container/40 p-2 rounded-2xl border border-outline-variant/5 flex flex-col items-center justify-center text-center">
                        <Compass size={14} className="text-primary mb-1" />
                        <span className="text-[10px] font-bold text-on-surface-variant block truncate w-full">Power Plugs</span>
                        <span className="text-[10px] font-black text-on-surface truncate w-full">{selectedShopDetail.outlets ? 'Available' : 'None'}</span>
                      </div>
                    </div>

                    {/* About paragraph block */}
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold text-[#a55e2b] uppercase tracking-wider">About Café</h4>
                      <p className="text-xs text-on-surface-variant/95 leading-relaxed font-sans">
                        {selectedShopDetail.about || 'Specialty artisanal beans harvested, processed, and extracted at maximum extraction yields with focus and love in Bishkek.'}
                      </p>
                    </div>

                    {/* Expand Detail toggle action */}
                    {!isDetailExpanded ? (
                      <button
                        onClick={() => setIsDetailExpanded(true)}
                        className="w-full py-3 mt-1.5 bg-[#a55e2b] hover:bg-[#a55e2b]/90 text-white rounded-2xl text-xs font-black shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 animate-pulse"
                      >
                        <MessageSquare size={14} />
                        Read Coffee Reviews & More
                      </button>
                    ) : (
                      <div className="space-y-4 pt-2 border-t border-outline-variant/15">
                        {/* Extended Coordinates info details */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold text-[#a55e2b] uppercase tracking-wider">Coordinates & Directions</h4>
                          <div className="bg-surface-container/40 p-3 rounded-2xl border border-outline-variant/5 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10.5px] font-bold text-on-surface truncate">{selectedShopDetail.address || 'Bishkek specialty location'}</p>
                              <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">{selectedShopDetail.location.lat.toFixed(4)}°, {selectedShopDetail.location.lng.toFixed(4)}°</p>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedShopDetail.address || '');
                                setAddNotification("Address copied!");
                                setTimeout(() => setAddNotification(null), 2500);
                              }}
                              className="p-1 px-2.5 bg-[#a55e2b]/10 hover:bg-[#a55e2b] text-[#a55e2b] hover:text-white rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <Copy size={11} />
                              Copy
                            </button>
                          </div>
                        </div>

                        {/* Interactive customer feedback review engine inside pop-up */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-bold text-[#a55e2b] uppercase tracking-wider">Reviews Circle</h4>
                            <button
                              onClick={() => {
                                setSelectedShopForReview(selectedShopDetail);
                                setReviewRating(5);
                                setReviewComment('');
                              }}
                              className="text-[10px] text-[#a55e2b] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <PenLine size={10} />
                              Leave feedback
                            </button>
                          </div>

                          {/* Featured Inline "Your Experience" Editor Card */}
                          {(() => {
                            const userReviewForThisShop = reviewsList.find(r => r.shopId === selectedShopDetail.id);
                            return (
                              <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 shadow-sm shrink-0 transition-all duration-300">
                                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15 mb-3">
                                  <div className="flex items-center gap-1.5">
                                    <Coffee size={13} className="text-[#a55e2b]" />
                                    <span className="text-[10px] font-extrabold text-brand uppercase tracking-wider font-mono">Your Experience</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isEditingInlineExplore ? (
                                      <div className="flex gap-1.5 items-center">
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            if (userReviewForThisShop) {
                                              setInlineRatingExplore(userReviewForThisShop.rating);
                                              setInlineCommentExplore(userReviewForThisShop.comment);
                                            } else {
                                              setInlineRatingExplore(5);
                                              setInlineCommentExplore('');
                                            }
                                            setIsEditingInlineExplore(false);
                                          }}
                                          className="bg-outline-variant/10 text-on-surface-variant text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider font-mono hover:bg-outline-variant/25 transition-all cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            if (!inlineCommentExplore.trim()) return;
                                            const newReview = {
                                              id: userReviewForThisShop?.id || `rev_${Date.now()}`,
                                              shopId: selectedShopDetail.id,
                                              shopName: selectedShopDetail.name,
                                              user: userProfile.name,
                                              avatar: userProfile.avatar,
                                              rating: inlineRatingExplore,
                                              comment: inlineCommentExplore,
                                              time: 'Just now'
                                            };
                                            setReviewsList(prev => {
                                              const filtered = prev.filter(r => r.shopId !== selectedShopDetail.id);
                                              return [newReview, ...filtered];
                                            });
                                            setAddNotification(userReviewForThisShop ? 'Review saved!' : 'Review posted!');
                                            setTimeout(() => setAddNotification(null), 2500);
                                            setIsEditingInlineExplore(false);
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
                                              setInlineRatingExplore(userReviewForThisShop.rating);
                                              setInlineCommentExplore(userReviewForThisShop.comment);
                                            } else {
                                              setInlineRatingExplore(5);
                                              setInlineCommentExplore('');
                                            }
                                            setIsEditingInlineExplore(true);
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
                                              onClick={() => {
                                                setReviewsList(prev => prev.filter(r => r.shopId !== selectedShopDetail.id));
                                                setAddNotification("Review deleted!");
                                                setTimeout(() => setAddNotification(null), 2500);
                                              }}
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
                                
                                {isEditingInlineExplore ? (
                                  <div className="space-y-3">
                                    <div className="flex flex-col items-center py-2 px-1 bg-surface/40 rounded-xl border border-outline-variant/10">
                                      {renderInteractiveStars(
                                        inlineRatingExplore,
                                        setInlineRatingExplore,
                                        inlineHoverRatingExplore,
                                        setInlineHoverRatingExplore
                                      )}
                                      <p className="text-[10px] font-extrabold text-brand uppercase tracking-widest mt-1.5 font-mono">
                                        ☕ {getRatingLabel(inlineRatingExplore)} ({inlineRatingExplore.toFixed(1)})
                                      </p>
                                    </div>
                                    
                                    <textarea
                                      value={inlineCommentExplore}
                                      onChange={(e) => setInlineCommentExplore(e.target.value)}
                                      placeholder="Rate your sip! Mention manual drip roasts, acidity notes, baristas' service, or WiFi quality..."
                                      className="w-full text-xs bg-surface/50 rounded-xl p-2.5 border border-outline-variant/30 min-h-[60px] outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary placeholder:text-on-surface-variant/40 text-on-surface leading-normal resize-none"
                                    />
                                    
                                    <div className="flex justify-end gap-2 pt-1 border-t border-outline-variant/5">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          if (userReviewForThisShop) {
                                            setInlineRatingExplore(userReviewForThisShop.rating);
                                            setInlineCommentExplore(userReviewForThisShop.comment);
                                          } else {
                                            setInlineRatingExplore(5);
                                            setInlineCommentExplore('');
                                          }
                                          setIsEditingInlineExplore(false);
                                        }}
                                        className="px-3 py-1.5 rounded-lg border border-outline-variant text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container transition-colors"
                                      >
                                        Cancel
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          if (!inlineCommentExplore.trim()) return;
                                          const newReview = {
                                            id: userReviewForThisShop?.id || `rev_${Date.now()}`,
                                            shopId: selectedShopDetail.id,
                                            shopName: selectedShopDetail.name,
                                            user: userProfile.name,
                                            avatar: userProfile.avatar,
                                            rating: inlineRatingExplore,
                                            comment: inlineCommentExplore,
                                            time: 'Just now'
                                          };
                                          setReviewsList(prev => {
                                            const filtered = prev.filter(r => r.shopId !== selectedShopDetail.id);
                                            return [newReview, ...filtered];
                                          });
                                          setAddNotification(userReviewForThisShop ? 'Review saved!' : 'Review posted!');
                                          setTimeout(() => setAddNotification(null), 2500);
                                          setIsEditingInlineExplore(false);
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
                                    <p className="text-[11px] text-on-surface-variant leading-relaxed italic animate-fade-in">
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
                                        setInlineRatingExplore(5);
                                        setInlineCommentExplore('');
                                        setIsEditingInlineExplore(true);
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

                          <div className="space-y-3">
                            {(() => {
                              const shopReviews = reviewsList.filter(r => r.shopId === selectedShopDetail.id && r.user !== userProfile.name);
                              if (shopReviews.length === 0) {
                                return (
                                  <div className="text-center py-6 px-3 bg-surface-container/30 rounded-2xl border border-dashed border-outline-variant/10">
                                    <Coffee className="mx-auto text-on-surface-variant/30 mb-2" size={24} />
                                    <p className="text-[10px] font-bold text-on-surface-variant/80">No other customer reviews yet</p>
                                    <p className="text-[10px] text-on-surface-variant/60 mt-0.5">Be the first of your circle to rate your sip here!</p>
                                  </div>
                                );
                              }
                              return shopReviews.map(review => (
                                <div key={review.id} className="bg-surface-container/30 p-3 rounded-2xl border border-outline-variant/10 flex flex-col gap-1.5 shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-extrabold font-mono">
                                        {review.user?.substring(0, 2).toUpperCase() || 'CO'}
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-bold text-on-surface leading-tight">
                                          {review.user || 'Coffee Lover'} ({getRatingLabel(review.rating)})
                                        </p>
                                        <p className="text-[10px] text-on-surface-variant/60 mt-0.5">{review.time || 'Reviewed'}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                      {[0, 1, 2, 3, 4].map((j) => {
                                        const isFull = review.rating >= j + 1;
                                        const isHalf = review.rating === j + 0.5;
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
                                  </div>
                                  <p className="text-[11px] text-on-surface leading-relaxed italic px-0.5">
                                    "{review.comment}"
                                  </p>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* Collapsing state button */}
                        <button
                          onClick={() => setIsDetailExpanded(false)}
                          className="w-full py-2.5 bg-surface border border-outline-variant/30 hover:bg-surface-container-low text-on-surface rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer text-center"
                        >
                          Show Less Details
                        </button>
                      </div>
                    )}

                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
    </>
  );
}
