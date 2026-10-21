import { motion, AnimatePresence } from 'motion/react';
import { Coffee, X, Star } from 'lucide-react';
import { COFFEE_SHOPS as STATIC_SHOPS } from '../../data';
import { getRatingLabel } from '../../lib/rating';

export interface MyReviewsModalProps {
  discoveredShops: any;
  reviewsList: any;
  setActiveTab: any;
  setIsDetailExpanded: any;
  setSelectedShopDetail: any;
  setShowMyReviewsModal: any;
  showMyReviewsModal: any;
}

export function MyReviewsModal(props: MyReviewsModalProps) {
  const {
    discoveredShops,
    reviewsList,
    setActiveTab,
    setIsDetailExpanded,
    setSelectedShopDetail,
    setShowMyReviewsModal,
    showMyReviewsModal,
  } = props;

  return (
    <>
<AnimatePresence>
            {showMyReviewsModal && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMyReviewsModal(false)}
                  className="fixed inset-0 bg-neutral-900 z-[100] pointer-events-auto cursor-pointer"
                />

                {/* My Reviews Bottom Sheet/Modal */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-surface rounded-t-[32px] border-t border-outline-variant/30 z-[105] px-6 pt-5 pb-10 shadow-2xl overflow-y-auto pointer-events-auto flex flex-col"
                >
                  <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-6 flex-shrink-0" />

                  <div className="max-w-md mx-auto w-full flex-1 flex flex-col min-h-0 text-left">
                    <div className="mb-6 flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-3 text-left">
                        <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                          <Star size={20} className="fill-current text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-headline font-black text-primary text-base">My Reviews</h3>
                          <p className="text-[10px] text-on-surface-variant/70 font-mono">Reviews you left on your favorite spots</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMyReviewsModal(false)}
                        className="p-1.5 rounded-full hover:bg-surface-container active:scale-90 transition-colors border border-outline-variant/10"
                      >
                        <X size={16} className="text-on-surface-variant" />
                      </button>
                    </div>

                    {/* List of reviews */}
                    <div className="space-y-4 overflow-y-auto pr-1 pb-4 flex-1">
                      {reviewsList.length === 0 ? (
                        <div className="text-center py-10 px-4 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
                          <Coffee className="mx-auto text-on-surface-variant/40 mb-3" size={32} />
                          <p className="text-xs font-bold text-on-surface-variant">No reviews left yet</p>
                          <p className="text-[10px] text-on-surface-variant/60 mt-1">Explore coffee shops around you and rate the experience!</p>
                        </div>
                      ) : (
                        reviewsList.map((review) => (
                          <div 
                            key={review.id} 
                            onClick={() => {
                              setShowMyReviewsModal(false);
                              setActiveTab('explore');
                              const shopData = STATIC_SHOPS.find(s => s.id === review.shopId) || discoveredShops.find(s => s.id === review.shopId);
                              if (shopData) {
                                setSelectedShopDetail(shopData);
                                setIsDetailExpanded(true);
                              }
                            }}
                            className="bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/65 rounded-2xl p-4 transition-all hover:scale-[1.01] hover:shadow-sm cursor-pointer text-left block"
                          >
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-headline font-bold text-xs text-primary hover:underline line-clamp-1">{review.shopName}</h4>
                                <span className="text-[10px] text-on-surface-variant/60 font-mono">{review.time || 'Reviewed'}</span>
                              </div>
                              <div className="bg-secondary/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Star size={9} className="fill-secondary text-secondary" />
                                <span className="text-[10px] font-black text-secondary">
                                  {review.rating.toFixed(1)} - {getRatingLabel(review.rating)}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-on-surface italic line-clamp-3">
                              "{review.comment}"
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
    </>
  );
}
