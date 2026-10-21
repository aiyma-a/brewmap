import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, Bookmark, Coffee, X, UserPlus, PlusCircle, Trash2, Compass, UserCheck, Star, Heart, PenLine, MapPin } from 'lucide-react';
import { COFFEE_SHOPS as STATIC_SHOPS } from '../../data';
import { Map } from '@vis.gl/react-google-maps';
import { getRatingLabel } from '../../lib/rating';
import { SEARCHABLE_USERS } from '../../lib/sampleUsers';
import { statusLabel } from '../../lib/shops';

export interface SocialTabProps {
  activeTab: any;
  addNotification: any;
  Date: DateConstructor;
  favoritesList: any;
  friendSearchQuery: any;
  friendsList: any;
  handleAddFriend: (user: { id: string; name: string; username: string; image: string; bio: string; location: { lat: number; lng: number; }; }) => void;
  handleDeleteReview: (shopId: string) => void;
  handleToggleFavorite: (shop: any) => void;
  renderUserAvatar: (avatarUrl: string, className?: string, iconSize?: number) => any;
  reviewsList: any;
  searchedUsers: any;
  setActiveTab: any;
  setFriendSearchQuery: any;
  setFriendsList: any;
  setIsDetailExpanded: any;
  setMoveToLocation: any;
  setReviewComment: any;
  setReviewRating: any;
  setSelectedShopDetail: any;
  setSelectedShopForReview: any;
  suggestedUsers: any;
}

export function SocialTab(props: SocialTabProps) {
  const {
    activeTab,
    addNotification,
    Date,
    favoritesList,
    friendSearchQuery,
    friendsList,
    handleAddFriend,
    handleDeleteReview,
    handleToggleFavorite,
    renderUserAvatar,
    reviewsList,
    searchedUsers,
    setActiveTab,
    setFriendSearchQuery,
    setFriendsList,
    setIsDetailExpanded,
    setMoveToLocation,
    setReviewComment,
    setReviewRating,
    setSelectedShopDetail,
    setSelectedShopForReview,
    suggestedUsers,
  } = props;

  return (
    <>
<AnimatePresence>
            {activeTab === 'social' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute inset-x-0 top-0 bottom-0 bg-surface dark:bg-[#161412] z-40 pt-20 pb-32 px-4 sm:px-6 md:px-8 overflow-y-auto flex flex-col hide-scrollbar"
              >
                <div className="max-w-2xl mx-auto w-full pb-16">
                  <div className="mb-6 mt-2">
                    <h2 className="text-2xl font-headline font-black text-primary tracking-tight">COFFEE CIRCLES</h2>
                    <p className="text-xs text-on-surface-variant font-medium">Connect with fellow roaster hunters & specialty coffee enthusiasts.</p>
                  </div>

                  {/* Add Notification Banner */}
                  <AnimatePresence>
                    {addNotification && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-secondary-container/90 text-on-secondary-container p-3 rounded-xl text-xs font-semibold mb-4 border border-secondary/10 flex items-center gap-2 shadow-sm"
                      >
                        <UserCheck size={14} className="text-secondary" />
                        <span>{addNotification}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Search box for Social */}
                  <div className="bg-surface shadow-[0_4px_16px_rgba(0,0,0,0.04)] rounded-2xl flex items-center p-3.5 gap-3 border border-outline-variant/30 mb-6 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
                    <Search size={20} className="text-on-surface-variant/70 flex-shrink-0" />
                    <input
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-on-surface-variant/50 outline-none font-sans"
                      placeholder="Search username..."
                      type="text"
                      value={friendSearchQuery}
                      onChange={(e) => setFriendSearchQuery(e.target.value)}
                    />
                    {friendSearchQuery && (
                      <button 
                        onClick={() => setFriendSearchQuery('')} 
                        className="text-on-surface-variant/40 hover:text-on-surface p-1 rounded-full text-xs font-bold"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Search Results / suggestions */}
                  {friendSearchQuery.trim() ? (
                    <div className="mb-6">
                      <h3 className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider mb-3 font-mono">Search Results</h3>
                      {searchedUsers.length > 0 ? (
                        <div className="space-y-3">
                          {searchedUsers.map(user => {
                            const isAlreadyFriend = friendsList.some(f => f.id === user.id);
                            return (
                              <div key={user.id} className="bg-surface-container p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                  {renderUserAvatar(user.image, "w-11 h-11", 20)}
                                  <div>
                                    <h4 className="text-sm font-bold text-on-surface">{user.name}</h4>
                                    <p className="text-[10px] text-on-surface-variant font-medium">@{user.username}</p>
                                    <p className="text-[10px] text-on-surface-variant/85 mt-1 max-w-[200px] truncate">{user.bio}</p>
                                  </div>
                                </div>
                                {isAlreadyFriend ? (
                                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-secondary bg-secondary-container/20 px-3 py-1.5 rounded-full border border-secondary/10">
                                    <UserCheck size={12} />
                                    Friends
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleAddFriend(user)}
                                    className="bg-primary hover:brightness-110 text-on-primary px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                                  >
                                    <UserPlus size={12} />
                                    Add Friend
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center p-6 bg-surface-container/30 rounded-2xl border border-dashed border-outline-variant/50">
                          <p className="text-xs font-bold text-on-surface-variant mb-1">No user found</p>
                          <p className="text-[11px] text-on-surface-variant/70">
                            Finding friends will be available when accounts launch.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    suggestedUsers.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider mb-3 font-mono">Recommended Profiles</h3>
                        <div className="space-y-3">
                          {suggestedUsers.slice(0, 3).map(user => (
                            <div key={user.id} className="bg-surface-container/65 p-4 rounded-2xl border border-outline-variant/10 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3">
                                {renderUserAvatar(user.image, "w-11 h-11", 20)}
                                <div>
                                  <h4 className="text-sm font-bold text-on-surface">{user.name}</h4>
                                  <p className="text-[10px] text-on-surface-variant font-medium">@{user.username}</p>
                                  <p className="text-[10px] text-on-surface-variant/70 mt-0.5 max-w-[180px] truncate">{user.bio}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddFriend(user)}
                                className="bg-primary/5 hover:bg-primary-container text-primary px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                              >
                                <PlusCircle size={12} />
                                Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                  {/* Friends list */}
                  <div className="mt-2 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/30">
                      <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2">
                        <Users size={18} className="text-secondary" />
                        My Circle ({friendsList.length})
                      </h3>
                    </div>

                    {friendsList.length > 0 ? (
                      <div className="space-y-3">
                        {friendsList.map(friend => {
                          const originalUser = SEARCHABLE_USERS.find(u => u.id === friend.id);
                          return (
                            <div key={friend.id} className="bg-surface-container p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  {renderUserAvatar(friend.image, "w-12 h-12", 22)}
                                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border border-white" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-bold text-on-surface truncate">{friend.name}</h4>
                                  <p className="text-[10px] text-on-surface-variant font-medium">@{originalUser?.username || friend.name.toLowerCase()}</p>
                                  <p className="text-[10px] text-secondary mt-0.5 italic truncate max-w-[180px]">
                                    {originalUser?.bio || 'Lover of manual drip and strong espresso.'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    setMoveToLocation(friend.location);
                                    setActiveTab('explore');
                                  }}
                                  className="bg-primary/5 hover:bg-primary-container p-2 rounded-xl text-primary transition-all active:scale-95"
                                  title="View on Map"
                                >
                                  <Compass size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    setFriendsList(prev => prev.filter(f => f.id !== friend.id));
                                  }}
                                  className="bg-error/5 hover:bg-error-container p-2 rounded-xl text-error transition-all active:scale-95"
                                  title="Unfriend"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10 px-6 bg-surface-container/20 rounded-2xl border border-dashed border-outline-variant/50 my-auto flex flex-col items-center justify-center">
                        <Users size={32} className="text-on-surface-variant/40 mb-3" />
                        <p className="text-sm font-bold text-on-surface-variant">Your Coffee Circle is Empty</p>
                        <p className="text-[11px] text-on-surface-variant/70 mt-1 max-w-xs mx-auto text-center font-sans leading-relaxed">
                          Friends will show up here, and on your map, once accounts launch.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {activeTab === 'saved' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute inset-x-0 top-0 bottom-0 bg-surface dark:bg-[#161412] z-40 pt-20 pb-32 px-4 sm:px-6 md:px-8 overflow-y-auto flex flex-col hide-scrollbar"
              >
                <div className="max-w-2xl mx-auto w-full pb-8">
                  <div className="mb-6 mt-2 flex items-center gap-3 border-b border-outline-variant/15 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-outline-variant/5">
                      <Bookmark size={18} className="fill-current" />
                    </div>
                    <div>
                      <h2 className="text-lg font-headline font-black text-primary tracking-tight leading-tight uppercase">Saved Spots</h2>
                      <p className="text-[10px] text-on-surface-variant/80 font-medium">Your curated coffee circle in Bishkek</p>
                    </div>
                  </div>

                  {favoritesList.length > 0 ? (
                    <div className="space-y-4">
                      {favoritesList.map(shop => {
                        const currentHour = new Date().getHours();
                        const isOpen = shop.openingHour !== undefined && shop.closingHour !== undefined
                          ? currentHour >= shop.openingHour && currentHour < shop.closingHour
                          : shop.status === 'Open Now';
                        const userReview = reviewsList.find(r => r.shopId === shop.id);

                        return (
                          <div 
                            key={shop.id}
                            className="bg-surface-container/60 hover:bg-surface-container-high/90 border border-outline-variant/15 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden flex flex-col"
                          >
                            <div className="p-4 flex gap-4">
                              <img 
                                src={shop.image} 
                                alt={shop.name} 
                                className="w-16 h-16 rounded-xl object-cover cursor-pointer hover:brightness-90 transition-all flex-shrink-0 shadow-sm border border-outline-variant/10" 
                                onClick={() => {
                                  setSelectedShopDetail(shop);
                                  setIsDetailExpanded(false);
                                }}
                              />
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div className="cursor-pointer" onClick={() => {
                                  setSelectedShopDetail(shop);
                                  setIsDetailExpanded(false);
                                }}>
                                  <h4 className="text-xs font-black font-headline text-on-surface hover:text-primary transition-colors cursor-pointer leading-snug truncate">{shop.name}</h4>
                                  <p className="text-[10px] text-on-surface-variant truncate font-sans tracking-tight">{shop.address || 'Specialty Cafe'}</p>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`text-[10px] font-bold ${isOpen ? 'text-secondary bg-secondary/5 px-2 py-0.5 rounded-full' : 'text-on-surface-variant/40 bg-on-surface-variant/5 px-2 py-0.5 rounded-full'}`}>
                                    {statusLabel(isOpen, shop.status, 'Open now')}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <div className="flex items-center gap-0.5 text-xs font-bold text-primary">
                                      <span>{shop.rating}</span>
                                      <span className="text-[10px]">⭐</span>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setMoveToLocation(shop.location);
                                        setActiveTab('explore');
                                      }}
                                      className="bg-primary/5 hover:bg-primary text-primary hover:text-on-primary w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90 border border-outline-variant/10 cursor-pointer"
                                      title="Center on Map"
                                    >
                                      <MapPin size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleToggleFavorite(shop)}
                                      className="bg-red-500/5 hover:bg-red-500 text-[#FF4B4B] hover:text-white w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90 border border-red-500/10 cursor-pointer"
                                      title="Remove from saved"
                                    >
                                      <Heart size={13} fill="currentColor" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Review Section */}
                            <div className="px-4 pb-3.5 pt-2 border-t border-outline-variant/10 bg-surface-container-lowest/40">
                              {userReview ? (
                                <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-3 border border-primary/10 flex flex-col gap-1.5 shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-extrabold text-[#a55e2b] bg-[#a55e2b]/10 px-1.5 py-0.5 rounded-md tracking-wider font-mono">
                                        MY REVIEW ({getRatingLabel(userReview.rating)})
                                      </span>
                                      <div className="flex gap-0.5">
                                        {[0, 1, 2, 3, 4].map((j) => {
                                          const isFull = userReview.rating >= j + 1;
                                          const isHalf = userReview.rating === j + 0.5;
                                          return (
                                            <div key={j} className="relative w-2.5 h-2.5">
                                              <Star size={10} className="text-outline-variant absolute inset-0" />
                                              {isFull && <Star size={10} className="fill-secondary text-secondary absolute inset-0" />}
                                              {isHalf && (
                                                <div className="absolute inset-y-0 left-0 overflow-hidden w-1/2">
                                                  <Star size={10} className="fill-secondary text-secondary" style={{ maxWidth: 'none' }} />
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button 
                                        onClick={() => {
                                          setSelectedShopForReview(shop);
                                          setReviewRating(userReview.rating);
                                          setReviewComment(userReview.comment);
                                        }}
                                        className="text-on-surface-variant/60 hover:text-primary hover:bg-surface-container-high p-1 rounded-md transition-all active:scale-90 cursor-pointer"
                                        title="Edit Review"
                                      >
                                        <PenLine size={11} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteReview(shop.id)}
                                        className="text-on-surface-variant/60 hover:text-error hover:bg-error/5 p-1 rounded-md transition-all active:scale-90 cursor-pointer"
                                        title="Delete Review"
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-on-surface font-sans leading-relaxed italic antialiased px-1">
                                    "{userReview.comment}"
                                  </p>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setSelectedShopForReview(shop)}
                                  className="w-full py-2 bg-[#a55e2b]/5 hover:bg-[#a55e2b] hover:text-white text-[#a55e2b] rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-2 border border-[#a55e2b]/20 active:scale-[0.98] cursor-pointer"
                                >
                                  <PenLine size={11} />
                                  Write a Review
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-surface-container/60 p-5 rounded-3xl border border-outline-variant/15 text-center mb-6">
                        <div className="w-11 h-11 mx-auto rounded-2xl bg-[#a55e2b]/10 text-[#a55e2b] flex items-center justify-center mb-3 border border-[#a55e2b]/10 shadow-sm">
                          <Bookmark size={20} className="fill-current" />
                        </div>
                        <h3 className="font-headline font-black text-primary text-xs uppercase tracking-wider mb-1.5">No Saved spots yet</h3>
                        <p className="text-[10.5px] text-on-surface-variant/80 font-sans leading-relaxed px-1">
                          Build your personalized guide. Hover places on the map and tap the <Heart size={10} className="inline fill-current text-[#FF4B4B] mx-0.5" /> to pin them here. To start you off, check out these local favorites:
                        </p>
                      </div>

                      <div className="space-y-4">
                        {STATIC_SHOPS.map(shop => {
                          const currentHour = new Date().getHours();
                          const isOpen = shop.openingHour !== undefined && shop.closingHour !== undefined
                            ? currentHour >= shop.openingHour && currentHour < shop.closingHour
                            : shop.status === 'Open Now';

                          return (
                            <div 
                              key={shop.id}
                              className="bg-surface-container/60 hover:bg-surface-container-high/90 border border-outline-variant/15 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden flex flex-col"
                            >
                              <div className="p-4 flex gap-4">
                                <img 
                                  src={shop.image} 
                                  alt={shop.name} 
                                  className="w-16 h-16 rounded-xl object-cover cursor-pointer hover:brightness-90 transition-all flex-shrink-0 shadow-sm border border-outline-variant/10" 
                                  onClick={() => {
                                    setSelectedShopDetail(shop);
                                    setIsDetailExpanded(false);
                                  }}
                                />
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                  <div className="cursor-pointer" onClick={() => {
                                    setSelectedShopDetail(shop);
                                    setIsDetailExpanded(false);
                                  }}>
                                    <h4 className="text-xs font-black font-headline text-on-surface hover:text-primary transition-colors cursor-pointer leading-snug truncate">{shop.name}</h4>
                                    <p className="text-[10px] text-on-surface-variant truncate font-sans tracking-tight">{shop.address || 'Specialty Cafe'}</p>
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className={`text-[10px] font-bold ${isOpen ? 'text-secondary bg-secondary/5 px-2 py-0.5 rounded-full' : 'text-on-surface-variant/40 bg-on-surface-variant/5 px-2 py-0.5 rounded-full'}`}>
                                      {statusLabel(isOpen, shop.status, 'Open now')}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex items-center gap-0.5 text-xs font-bold text-primary">
                                        <span>{shop.rating}</span>
                                        <span className="text-[10px]">⭐</span>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setMoveToLocation(shop.location);
                                          setActiveTab('explore');
                                        }}
                                        className="bg-primary/5 hover:bg-primary text-primary hover:text-on-primary w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90 border border-outline-variant/10 cursor-pointer"
                                        title="Center on Map"
                                      >
                                        <MapPin size={13} />
                                      </button>
                                      <button
                                        onClick={() => handleToggleFavorite(shop)}
                                        className="bg-surface border border-outline-variant/25 hover:border-red-500 hover:bg-red-500/5 text-on-surface-variant/60 hover:text-[#FF4B4B] w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
                                        title="Save to Favorites"
                                      >
                                        <Heart size={13} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
    </>
  );
}
