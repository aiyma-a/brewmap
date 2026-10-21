import { motion, AnimatePresence } from 'motion/react';
import { Coffee, X, MessageSquare, Star, Check, Mail, Send, MapPin } from 'lucide-react';

export interface ShareShopModalProps {
  encodeURIComponent: (uriComponent: string | number | boolean) => string;
  setShareShopData: any;
  shareShopData: any;
}

export function ShareShopModal(props: ShareShopModalProps) {
  const {
    encodeURIComponent,
    setShareShopData,
    shareShopData,
  } = props;

  return (
    <>
<AnimatePresence>
            {shareShopData && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShareShopData(null)}
                  className="fixed inset-0 bg-neutral-900 z-[100] pointer-events-auto cursor-pointer"
                />

                {/* Share Coffee Shop Bottom Sheet Drawer */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-surface rounded-t-[32px] border-t border-outline-variant/30 z-[105] px-6 pt-5 pb-10 shadow-2xl overflow-y-auto pointer-events-auto text-left"
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
                        onClick={() => setShareShopData(null)}
                        className="p-1.5 rounded-full hover:bg-surface-container active:scale-90 transition-colors border border-outline-variant/10"
                      >
                        <X size={16} className="text-on-surface-variant" />
                      </button>
                    </div>

                    {/* Coffee Shop Preview Card */}
                    <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 flex items-center gap-4 mb-6 shadow-sm">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-outline-variant/10 bg-surface-container-high">
                        <img 
                          src={shareShopData.image} 
                          alt={shareShopData.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline font-black text-primary text-sm uppercase tracking-tight truncate">{shareShopData.name}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={11} fill="currentColor" className="text-secondary fill-secondary" />
                          <span className="text-[11px] font-bold text-on-surface">{shareShopData.rating}</span>
                          <span className="text-[10px] text-on-surface-variant/80">({shareShopData.reviewCount || 120} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-on-surface-variant/80">
                          <MapPin size={10} className="text-brand shrink-0" />
                          <p className="text-[10px] truncate font-sans">{shareShopData.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Social networks & text messaging buttons */}
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 font-mono">Share via</h4>
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {/* SMS & Text Msg */}
                      <a
                        href={`sms:?body=${encodeURIComponent(`Check out this coffee shop on Brewmap! ☕✨\n\n🏠 ${shareShopData.name}\n📍 ${shareShopData.address}\n\nJoin the roaster community and discover more: ${window.location.origin}/shop/${shareShopData.id}`)}`}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-center group active:scale-95"
                      >
                        <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                          <MessageSquare size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant">Text Msg</span>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this specialty coffee shop on Brewmap! ☕✨\n\n🏠 *${shareShopData.name}*\n⭐️ ${shareShopData.rating} Rating\n📍 ${shareShopData.address}\n\nView details here: ${window.location.origin}/shop/${shareShopData.id}`)}`}
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
                        href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/shop/${shareShopData.id}`)}&text=${encodeURIComponent(`Check out this awesome specialty coffee shop, ${shareShopData.name}, on Brewmap! ☕✨\n\n⭐️ Rating: ${shareShopData.rating}\n🗺️ Address: ${shareShopData.address}`)}`}
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
                        href={`mailto:?subject=${encodeURIComponent(`Specialty Coffee Recommendation: ${shareShopData.name}`)}&body=${encodeURIComponent(`Hey! I wanted to recommend this coffee shop from Brewmap:\n\n🏠 ${shareShopData.name}\n⭐️ Rating: ${shareShopData.rating}\n📍 Address: ${shareShopData.address}\n\nCheck out reviews and details here: ${window.location.origin}/shop/${shareShopData.id}\n\nHappy brewing!`)}`}
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
    </>
  );
}
