import { motion, AnimatePresence } from 'motion/react';
import { Coffee } from 'lucide-react';
import { FormEvent } from 'react';
import { getRatingLabel, renderInteractiveStars } from '../../lib/rating';

export interface ReviewModalProps {
  handleSubmitReview: (e: FormEvent) => void;
  hoverRating: any;
  reviewComment: any;
  reviewRating: any;
  selectedShopForReview: any;
  setHoverRating: any;
  setReviewComment: any;
  setReviewRating: any;
  setSelectedShopForReview: any;
}

export function ReviewModal(props: ReviewModalProps) {
  const {
    handleSubmitReview,
    hoverRating,
    reviewComment,
    reviewRating,
    selectedShopForReview,
    setHoverRating,
    setReviewComment,
    setReviewRating,
    setSelectedShopForReview,
  } = props;

  return (
    <>
<AnimatePresence>
            {selectedShopForReview && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedShopForReview(null)}
                  className="fixed inset-0 bg-neutral-900 z-[100] pointer-events-auto cursor-pointer"
                />

                {/* Stars/Review Bottom Sheet Drawer */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-surface rounded-t-[32px] border-t border-outline-variant/30 z-[105] px-6 pt-5 pb-10 shadow-2xl overflow-y-auto pointer-events-auto"
                >
                  <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-6" />

                  <div className="max-w-md mx-auto">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                        <Coffee size={22} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-brand uppercase">Brew Rating</span>
                        <h3 className="text-lg font-black text-on-surface leading-snug">{selectedShopForReview.name}</h3>
                      </div>
                    </div>

                    <form onSubmit={handleSubmitReview} className="space-y-5">
                      {/* Interactive Stars */}
                      <div className="bg-surface-container rounded-2xl p-4 text-center border border-outline-variant/10">
                        <p className="text-xs font-bold text-on-surface-variant mb-2">Rate your sip!</p>
                        
                        {renderInteractiveStars(
                          reviewRating,
                          setReviewRating,
                          hoverRating,
                          setHoverRating
                        )}
                        
                        <p className="text-xs font-extrabold text-brand mt-2.5 uppercase tracking-widest font-mono flex items-center justify-center gap-1">
                          <span>☕</span>
                          <span>{getRatingLabel(reviewRating)}</span>
                          <span className="text-[10px] text-on-surface-variant/70">({reviewRating.toFixed(1)})</span>
                        </p>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider font-mono">Your Experience</label>
                        <textarea
                          required
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full min-h-[120px] bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 text-sm placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none outline-none leading-relaxed"
                          placeholder="What did you order? Mention manual drip roasts, acidity notes, baristas' service, or WiFi quality..."
                        />
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedShopForReview(null)}
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
    </>
  );
}
