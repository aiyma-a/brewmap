import { motion, AnimatePresence } from 'motion/react';
import { Coffee, X, MessageSquare, Check, Share2, Mail, Send } from 'lucide-react';

export interface ShareProfileModalProps {
  encodeURIComponent: (uriComponent: string | number | boolean) => string;
  isShareModalOpen: any;
  renderUserAvatar: (avatarUrl: string, className?: string, iconSize?: number) => any;
  setIsShareModalOpen: any;
  userProfile: any;
}

export function ShareProfileModal(props: ShareProfileModalProps) {
  const {
    encodeURIComponent,
    isShareModalOpen,
    renderUserAvatar,
    setIsShareModalOpen,
    userProfile,
  } = props;

  return (
    <>
<AnimatePresence>
            {isShareModalOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsShareModalOpen(false)}
                  className="fixed inset-0 bg-neutral-900 z-[100] pointer-events-auto cursor-pointer"
                />

                {/* Share Bottom Sheet Drawer */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-surface rounded-t-[32px] border-t border-outline-variant/30 z-[105] px-6 pt-5 pb-10 shadow-2xl overflow-y-auto pointer-events-auto"
                >
                  <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-6" />

                  <div className="max-w-md mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                          <Share2 size={20} />
                        </div>
                        <div>
                          <h3 className="font-headline font-black text-primary text-base">Share Coffee Profile</h3>
                          <p className="text-[10px] text-on-surface-variant/70 font-mono">Connect your profile with others</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsShareModalOpen(false)}
                        className="p-1.5 rounded-full hover:bg-surface-container active:scale-90 transition-colors border border-outline-variant/10"
                      >
                        <X size={16} className="text-on-surface-variant" />
                      </button>
                    </div>

                    {/* Minimal Profile Preview Card */}
                    <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 flex items-center gap-4 mb-6 shadow-sm">
                      {renderUserAvatar(userProfile.avatar, "w-14 h-14 border-2 border-primary/20 shadow-sm", 24)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline font-bold text-sm text-primary truncate">{userProfile.name}</h4>
                        <p className="text-[10px] text-on-surface-variant/70 font-mono">@{userProfile.username}</p>
                        <p className="text-xs text-secondary italic mt-1 line-clamp-1">"{userProfile.bio}"</p>
                      </div>
                    </div>

                    {/* Social networks & text messaging buttons */}
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 font-mono">Share via</h4>
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {/* SMS */}
                      <a
                        href={`sms:?body=${encodeURIComponent(`Check out my specialty coffee profile on BrewMap! ☕✨\n\n👤 ${userProfile.name} (@${userProfile.username})\nConnect with me here: ${window.location.origin}/?tab=social&username=${userProfile.username}`)}`}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-center group active:scale-95"
                      >
                        <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                          <MessageSquare size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant">Text Msg</span>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my specialty coffee profile on BrewMap! ☕✨\n\n👤 ${userProfile.name} (@${userProfile.username})\nConnect with me here: ${window.location.origin}/?tab=social&username=${userProfile.username}`)}`}
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
                        href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/?tab=social&username=${userProfile.username}`)}&text=${encodeURIComponent(`Check out my specialty coffee profile on BrewMap! ☕✨\n\n👤 ${userProfile.name} (@${userProfile.username})`)}`}
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
                        href={`mailto:?subject=${encodeURIComponent(`Fellow coffee lover ${userProfile.name} on BrewMap!`)}&body=${encodeURIComponent(`Check out my specialty coffee profile on BrewMap! ☕✨\n\n👤 ${userProfile.name} (@${userProfile.username})\n📖 "${userProfile.bio}"\n\nConnect with me here: ${window.location.origin}/?tab=social&username=${userProfile.username}`)}`}
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
