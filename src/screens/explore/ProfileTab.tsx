import { motion, AnimatePresence } from 'motion/react';
import { Users, Coffee, X, Settings, Trash2, Compass, PenLine, Check, CheckSquare, Share2, Mail, Send, Moon, Sun, Globe, Lock, ShieldAlert, Eye, EyeOff, MapPin, Wifi, LogOut, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Map } from '@vis.gl/react-google-maps';
import { FormEvent } from 'react';
import { SEARCHABLE_USERS, CUSTOM_VECTOR_AVATARS } from '../../lib/sampleUsers';
import { statusLabel } from '../../lib/shops';
import { Language } from '../../lib/i18n';

export interface ProfileTabProps {
  activeSettingModal: any;
  activeTab: any;
  bgLocationTracking: any;
  confirmPasswordInput: any;
  contactEmail: any;
  contactMessage: any;
  contactName: any;
  contactSent: any;
  currentEmailInput: any;
  currentPasswordInput: any;
  Date: DateConstructor;
  editAvatar: any;
  editBio: any;
  editFavoriteCoffeeType: any;
  editFavoriteSpot: any;
  editName: any;
  editUsername: any;
  expandedProfileSection: any;
  expandedVisitedShopId: any;
  friendsList: any;
  getFavoriteCoffeeType: (avatarUrl: string) => string;
  handleDeleteAccountConfirm: () => void;
  handleLanguageChange: (newLanguage: Language) => void;
  handleThemeChange: (newTheme: "light" | "dark") => void;
  handleToggleVisited: (shop: any) => void;
  handleUpdateEmailAddress: (e: FormEvent) => void;
  handleUpdatePassword: (e: FormEvent) => void;
  handleUpdateProfile: (e: FormEvent) => void;
  isEditingProfile: any;
  language: any;
  newEmailInput: any;
  newPasswordInput: any;
  renderUserAvatar: (avatarUrl: string, className?: string, iconSize?: number) => any;
  reviewsList: any;
  setActiveSettingModal: any;
  setActiveTab: any;
  setAddNotification: any;
  setConfirmPasswordInput: any;
  setContactEmail: any;
  setContactMessage: any;
  setContactName: any;
  setContactSent: any;
  setCurrentEmailInput: any;
  setCurrentPasswordInput: any;
  setEditAvatar: any;
  setEditBio: any;
  setEditFavoriteCoffeeType: any;
  setEditFavoriteSpot: any;
  setEditName: any;
  setEditUsername: any;
  setExpandedProfileSection: any;
  setExpandedVisitedShopId: any;
  setFriendsList: any;
  setIsDetailExpanded: any;
  setIsEditingProfile: any;
  setIsShareModalOpen: any;
  setMoveToLocation: any;
  setNewEmailInput: any;
  setNewPasswordInput: any;
  setSelectedShopDetail: any;
  setShowMyReviewsModal: any;
  setShowPwdCurrent: any;
  setShowPwdNew: any;
  setShowSettingsModal: any;
  showPwdCurrent: any;
  showPwdNew: any;
  showSettingsModal: any;
  t: any;
  themeMode: any;
  toggleBackgroundTracking: () => void;
  userEmail: any;
  userProfile: any;
  visitedList: any;
}

export function ProfileTab(props: ProfileTabProps) {
  const {
    activeSettingModal,
    activeTab,
    bgLocationTracking,
    confirmPasswordInput,
    contactEmail,
    contactMessage,
    contactName,
    contactSent,
    currentEmailInput,
    currentPasswordInput,
    Date,
    editAvatar,
    editBio,
    editFavoriteCoffeeType,
    editFavoriteSpot,
    editName,
    editUsername,
    expandedProfileSection,
    expandedVisitedShopId,
    friendsList,
    getFavoriteCoffeeType,
    handleDeleteAccountConfirm,
    handleLanguageChange,
    handleThemeChange,
    handleToggleVisited,
    handleUpdateEmailAddress,
    handleUpdatePassword,
    handleUpdateProfile,
    isEditingProfile,
    language,
    newEmailInput,
    newPasswordInput,
    renderUserAvatar,
    reviewsList,
    setActiveSettingModal,
    setActiveTab,
    setAddNotification,
    setConfirmPasswordInput,
    setContactEmail,
    setContactMessage,
    setContactName,
    setContactSent,
    setCurrentEmailInput,
    setCurrentPasswordInput,
    setEditAvatar,
    setEditBio,
    setEditFavoriteCoffeeType,
    setEditFavoriteSpot,
    setEditName,
    setEditUsername,
    setExpandedProfileSection,
    setExpandedVisitedShopId,
    setFriendsList,
    setIsDetailExpanded,
    setIsEditingProfile,
    setIsShareModalOpen,
    setMoveToLocation,
    setNewEmailInput,
    setNewPasswordInput,
    setSelectedShopDetail,
    setShowMyReviewsModal,
    setShowPwdCurrent,
    setShowPwdNew,
    setShowSettingsModal,
    showPwdCurrent,
    showPwdNew,
    showSettingsModal,
    t,
    themeMode,
    toggleBackgroundTracking,
    userEmail,
    userProfile,
    visitedList,
  } = props;

  return (
    <>
<AnimatePresence>
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-0 top-0 bottom-0 bg-surface dark:bg-[#161412] z-40 pt-20 pb-32 px-6 overflow-y-auto flex flex-col hide-scrollbar"
              >
                <div className="max-w-md mx-auto w-full pb-8">
                  {isEditingProfile ? (
                    <form onSubmit={handleUpdateProfile} className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-soft mb-6 mt-2 space-y-4">
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-primary uppercase tracking-wider font-mono mb-1">Edit Brew Profile</h4>
                      </div>

                      {/* Coffee Mug Avatar Selector */}
                      <div className="text-left space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 font-mono">Coffee Mug Avatar</label>
                          <p className="text-[10px] text-brand mb-2 font-medium">☕ Choose your mug logo. Personal picture uploads are disabled.</p>
                        </div>

                        {/* Coloured Mug Logos Section */}
                        <div>
                          <div className="grid grid-cols-3 gap-2">
                            {CUSTOM_VECTOR_AVATARS.map((option) => {
                              const vectorValue = `vector:${option.name}`;
                              const isSelected = editAvatar === vectorValue;
                              return (
                                <button
                                  type="button"
                                  key={option.id}
                                  onClick={() => setEditAvatar(vectorValue)}
                                  className={`relative rounded-xl p-2 border-2 transition-all flex flex-col items-center justify-center bg-surface hover:scale-[1.02] ${
                                    isSelected 
                                      ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' 
                                      : 'border-outline-variant/35 hover:border-outline-variant/75'
                                  }`}
                                >
                                  <div className={`w-10 h-10 rounded-full ${option.bg} ${option.text} flex items-center justify-center shadow-md`}>
                                    <Coffee size={20} fill="currentColor" />
                                  </div>
                                  <span className="text-[10px] font-bold text-center mt-1.5 truncate w-full text-on-surface-variant">{option.name}</span>
                                  {isSelected && (
                                    <div className="absolute top-1 right-1 bg-primary text-on-primary rounded-full p-0.5 shadow-sm z-10">
                                      <Check size={8} className="stroke-[3]" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Name input */}
                      <div className="text-left">
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 font-mono">Name</label>
                        <input 
                          type="text" 
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-surface p-3 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                          placeholder="Your Display Name"
                        />
                      </div>

                      {/* Username input */}
                      <div className="text-left">
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 font-mono">Username</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-xs text-on-surface-variant/60 font-mono">@</span>
                          <input 
                            type="text" 
                            required
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value.replace(/\s+/g, ''))} // No spaces in usernames
                            className="w-full bg-surface pl-7 pr-3 p-3 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                            placeholder="username"
                          />
                        </div>
                      </div>

                      {/* Bio text area */}
                      <div className="text-left">
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 font-mono">Bio</label>
                        <textarea 
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          maxLength={120}
                          className="w-full bg-surface p-3 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none min-h-[60px] leading-relaxed"
                          placeholder="A short description about your brewing love..."
                        />
                        <p className="text-[10px] text-on-surface-variant/60 text-right mt-1 font-mono">{editBio.length}/120 characters</p>
                      </div>

                      {/* Favorite Coffee Spot (Brew Spot) */}
                      <div className="text-left">
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 font-mono">{t.favoriteSpot || "Favorite Spot"}</label>
                        <input 
                          type="text" 
                          required
                          value={editFavoriteSpot}
                          onChange={(e) => setEditFavoriteSpot(e.target.value)}
                          className="w-full bg-surface p-3 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                          placeholder="E.g., Bishkek Coffee Roasters"
                        />
                      </div>

                      {/* Favorite Coffee Type (Brew Preference) */}
                      <div className="text-left">
                        <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 font-mono">{t.avgRating || "Favorite Coffee Type"}</label>
                        <select
                          value={editFavoriteCoffeeType}
                          onChange={(e) => setEditFavoriteCoffeeType(e.target.value)}
                          className="w-full bg-surface p-3 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none text-on-surface"
                        >
                          <option value="Espresso">Espresso</option>
                          <option value="V60 Pour Over">V60 Pour Over</option>
                          <option value="Flat White">Flat White</option>
                          <option value="Cappuccino">Cappuccino</option>
                          <option value="Latte">Latte</option>
                          <option value="Aeropress">Aeropress</option>
                          <option value="Cold Brew">Cold Brew</option>
                          <option value="Chemex">Chemex</option>
                          <option value="Turkish Coffee">Turkish Coffee</option>
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2 font-sans">
                        <button
                          type="button"
                          onClick={() => {
                            setEditName(userProfile.name);
                            setEditUsername(userProfile.username);
                            setEditBio(userProfile.bio);
                            setEditAvatar(userProfile.avatar);
                            setEditFavoriteSpot(userProfile.favoriteSpot || 'Bishkek Coffee Roasters');
                            setEditFavoriteCoffeeType(userProfile.favoriteCoffeeType || 'Espresso');
                            setIsEditingProfile(false);
                          }}
                          className="py-2.5 border border-outline-variant text-[11px] font-bold rounded-xl hover:bg-surface-container text-on-surface"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="py-2.5 bg-primary hover:brightness-110 text-on-primary text-[11px] font-bold rounded-xl shadow-soft"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 text-center shadow-soft mb-6 mt-2 relative overflow-hidden flex flex-col items-center justify-center">
                      <div className="mb-3">
                        {renderUserAvatar(userProfile.avatar, "w-16 h-16 border-3 border-primary/20 shadow-sm", 28)}
                      </div>
                      <h3 className="text-lg font-headline font-black text-primary">{userProfile.name}</h3>
                      <p className="text-[11px] text-on-surface-variant font-mono">@{userProfile.username}</p>
                      <p className="text-[11px] text-secondary mt-1.5 font-medium italic max-w-xs leading-relaxed">"{userProfile.bio}"</p>
 
                      <div className="mt-3.5 pt-3.5 border-t border-outline-variant/10 flex justify-center gap-1.5 w-full flex-wrap">
                        <button
                          onClick={() => {
                            setEditName(userProfile.name);
                            setEditUsername(userProfile.username);
                            setEditBio(userProfile.bio);
                            setEditAvatar(userProfile.avatar);
                            setEditFavoriteSpot(userProfile.favoriteSpot || 'Bishkek Coffee Roasters');
                            setEditFavoriteCoffeeType(userProfile.favoriteCoffeeType || 'Espresso');
                            setIsEditingProfile(true);
                          }}
                          className="py-1.5 px-2.5 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-lg text-[11.5px] font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          <PenLine size={10} />
                          Edit Profile
                        </button>
                        <button
                          onClick={() => setIsShareModalOpen(true)}
                          className="py-1.5 px-2.5 bg-secondary/20 hover:bg-secondary/35 text-[#5c3e21] border border-secondary/30 rounded-lg text-[11.5px] font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          <Share2 size={10} className="stroke-[2.5]" />
                          Share
                        </button>
                        <button
                          onClick={() => {
                            localStorage.removeItem('brewmap_authorised');
                            window.dispatchEvent(new CustomEvent('auth_state_changed'));
                            setAddNotification("Signed out successfully!");
                            setTimeout(() => {
                              window.location.reload();
                            }, 400);
                          }}
                          className="py-1.5 px-2.5 bg-red-500/10 hover:bg-red-500/25 text-[#FF4B4B] border border-red-500/15 rounded-lg text-[11.5px] font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          <LogOut size={10} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}

                  {!isEditingProfile && (
                    <>
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <button
                          type="button"
                          onClick={() => setExpandedProfileSection(prev => prev === 'visited' ? null : 'visited')}
                          className={`p-3 rounded-2xl text-center border transition-all cursor-pointer shadow-sm active:scale-95 w-full block ${
                            expandedProfileSection === 'visited'
                              ? 'bg-primary-container/40 border-primary text-primary'
                              : 'bg-surface-container/60 border-outline-variant/10 text-on-surface hover:bg-surface-container-high hover:border-outline-variant'
                          }`}
                        >
                          <p className="text-lg font-headline font-black text-primary">{visitedList.length}</p>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80">{t.visitedSpots}</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedProfileSection(prev => prev === 'connections' ? null : 'connections')}
                          className={`p-3 rounded-2xl text-center border transition-all cursor-pointer shadow-sm active:scale-95 w-full block ${
                            expandedProfileSection === 'connections'
                              ? 'bg-primary-container/40 border-primary text-primary'
                              : 'bg-surface-container/60 border-outline-variant/10 text-on-surface hover:bg-surface-container-high hover:border-outline-variant'
                          }`}
                        >
                          <p className="text-lg font-headline font-black text-primary">{friendsList.length}</p>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80">{t.connections}</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMyReviewsModal(true)}
                          className="bg-surface-container/60 p-3 rounded-2xl text-center border border-outline-variant/10 hover:bg-surface-container-high hover:border-outline-variant transition-all cursor-pointer shadow-sm active:scale-95 w-full block"
                        >
                          <p className="text-lg font-headline font-black text-primary">{reviewsList.length}</p>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80">{t.reviews}</p>
                        </button>
                      </div>

                      {/* Expandable/Closable Inline Sections with custom transitions */}
                      <AnimatePresence initial={false}>
                        {expandedProfileSection === 'visited' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="bg-surface-container/50 border border-outline-variant/15 rounded-2xl p-4 flex flex-col">
                              <div className="flex items-center justify-between mb-3 border-b border-outline-variant/10 pb-2">
                                <h5 className="font-headline font-black text-xs text-primary flex items-center gap-1.5 uppercase">
                                  <CheckSquare size={14} className="text-primary" />
                                  {t.visitedSpots} ({visitedList.length})
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => setExpandedProfileSection(null)}
                                  className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-all pr-1 cursor-pointer"
                                >
                                  {t.close || 'Close'}
                                </button>
                              </div>

                              {visitedList.length > 0 ? (
                                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 select-none hide-scrollbar">
                                  {visitedList.map(shop => {
                                    const currentHour = new Date().getHours();
                                    const isOpen = shop.openingHour !== undefined && shop.closingHour !== undefined
                                      ? currentHour >= shop.openingHour && currentHour < shop.closingHour
                                      : shop.status === 'Open Now';
                                    const isExpandedInline = expandedVisitedShopId === shop.id;

                                    return (
                                      <div 
                                        key={shop.id}
                                        className="bg-surface/90 dark:bg-zinc-900/40 border border-outline-variant/10 rounded-2xl flex flex-col hover:border-brand/30 transition-all duration-300 overflow-hidden shadow-sm"
                                      >
                                        {/* Header Row (Clickable to Toggle Expansion) */}
                                        <div 
                                          className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-surface-container/50 transition-colors select-none"
                                          onClick={() => setExpandedVisitedShopId(isExpandedInline ? null : shop.id)}
                                        >
                                          {/* Clickable Image to Open Full Cafe Profile directly */}
                                          <div 
                                            className="relative group cursor-pointer flex-shrink-0"
                                            onClick={(e) => {
                                              e.stopPropagation(); // Stop expansion toggle when clicking image
                                              setSelectedShopDetail(shop);
                                              setIsDetailExpanded(false);
                                            }}
                                            title="Click to view shop profile"
                                          >
                                            <img 
                                              src={shop.image} 
                                              alt={shop.name} 
                                              className="w-12 h-12 rounded-xl object-cover border border-outline-variant/10 shadow-sm group-hover:brightness-95 transition-all" 
                                            />
                                            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
                                              <ExternalLink size={10} className="text-white" />
                                            </div>
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <h6 className="text-xs font-black font-headline text-on-surface leading-tight truncate hover:text-brand transition-colors">
                                                {shop.name}
                                              </h6>
                                              <span className="flex-shrink-0 text-[10px] text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5 uppercase tracking-wide">
                                                <Check size={9} className="stroke-[3]" /> Visited
                                              </span>
                                            </div>
                                            <p className="text-[10px] text-on-surface-variant truncate mt-0.5 font-sans">{shop.address || 'Specialty Cafe'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isOpen ? 'text-secondary bg-secondary/5' : 'text-on-surface-variant/40 bg-on-surface-variant/5'}`}>
                                                {statusLabel(isOpen, shop.status, 'Open Now')}
                                              </span>
                                              <span className="text-[10px] font-bold text-primary flex items-center gap-0.5 font-sans">
                                                <span>{shop.rating}</span>
                                                <span className="text-[10px]">⭐</span>
                                              </span>
                                            </div>
                                          </div>

                                          {/* Toggle Arrow & Quick Trash */}
                                          <div className="flex items-center gap-1 flex-shrink-0">
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleVisited(shop);
                                              }}
                                              className="p-1.5 text-on-surface-variant/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                              title="Remove visit check-in"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                            <div className="p-1 text-on-surface-variant/60">
                                              {isExpandedInline ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Animated Expandable Body */}
                                        <AnimatePresence>
                                          {isExpandedInline && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: 'auto', opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.2, ease: 'easeOut' }}
                                              className="border-t border-outline-variant/10 bg-surface-container/20 overflow-hidden"
                                            >
                                              <div className="p-3.5 space-y-3 text-left">
                                                {/* About Text */}
                                                <div>
                                                  <p className="text-[10px] uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1 font-headline">Atmosphere & Specialty</p>
                                                  <p className="text-[11px] text-on-surface-variant/90 leading-relaxed font-sans italic">
                                                    "{shop.about || 'A highly recommended specialty coffee spot offering premium single-origin pour-overs and meticulous custom espresso profiles in a wonderful atmosphere.'}"
                                                  </p>
                                                </div>

                                                {/* Amenities quick-glance */}
                                                <div className="grid grid-cols-2 gap-2 bg-surface-container-low/40 p-2 rounded-xl border border-outline-variant/5">
                                                  <div className="text-left">
                                                    <span className="text-[10px] font-bold text-on-surface-variant/60 block uppercase">Wifi Setup</span>
                                                    <span className="text-[11px] font-bold text-on-surface font-sans">{shop.wifi || 'Free Connection'}</span>
                                                  </div>
                                                  <div className="text-left">
                                                    <span className="text-[10px] font-bold text-on-surface-variant/60 block uppercase">Power Outlets</span>
                                                    <span className="text-[11px] font-bold text-on-surface font-sans">{shop.outlets ? 'Available 🔌' : 'Limited out'}</span>
                                                  </div>
                                                </div>

                                                {/* Action utilities */}
                                                <div className="flex gap-2 pt-1.5 border-t border-outline-variant/10">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setSelectedShopDetail(shop);
                                                      setIsDetailExpanded(true); // Open detail and fully expand
                                                    }}
                                                    className="flex-1 py-1.5 bg-brand hover:bg-brand-deep text-white rounded-xl text-[10.5px] font-black transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer shadow-sm uppercase tracking-wide"
                                                  >
                                                    <ExternalLink size={12} />
                                                    View Cafe Profile
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setMoveToLocation(shop.location);
                                                      setActiveTab('explore');
                                                    }}
                                                    className="px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-[10.5px] font-extrabold transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer border border-primary/10"
                                                    title="Center on Map"
                                                  >
                                                    <MapPin size={12} />
                                                    Map
                                                  </button>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-center text-xs text-on-surface-variant/70 py-4 font-sans">No visited spots yet.</p>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {expandedProfileSection === 'connections' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="bg-surface-container/50 border border-outline-variant/15 rounded-2xl p-4 flex flex-col">
                              <div className="flex items-center justify-between mb-3 border-b border-outline-variant/10 pb-2">
                                <h5 className="font-headline font-black text-xs text-primary flex items-center gap-1.5 uppercase">
                                  <Users size={14} className="text-secondary" />
                                  {t.connections} ({friendsList.length})
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => setExpandedProfileSection(null)}
                                  className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-all pr-1 cursor-pointer"
                                >
                                  {t.close || 'Close'}
                                </button>
                              </div>

                              {friendsList.length > 0 ? (
                                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 select-none hide-scrollbar">
                                  {friendsList.map(friend => {
                                    const originalUser = SEARCHABLE_USERS.find(u => u.id === friend.id);
                                    return (
                                      <div 
                                        key={friend.id}
                                        className="bg-surface/80 p-3 border border-outline-variant/10 rounded-xl flex items-center gap-3 hover:bg-surface-container-high transition-all"
                                      >
                                        <div className="relative flex-shrink-0">
                                          {renderUserAvatar(friend.image, "w-9 h-9", 16)}
                                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border border-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h6 className="text-[11.5px] font-black text-on-surface leading-snug truncate">{friend.name}</h6>
                                          <p className="text-[10px] text-on-surface-variant truncate">@{originalUser?.username || friend.name.toLowerCase()}</p>
                                        </div>
                                        <div className="flex gap-1.5 flex-shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setMoveToLocation(friend.location);
                                              setActiveTab('explore');
                                            }}
                                            className="p-1.5 bg-primary/5 hover:bg-primary text-primary hover:text-on-primary rounded-lg transition-all"
                                            title="Spot on Map"
                                          >
                                            <Compass size={12} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setFriendsList(prev => prev.filter(f => f.id !== friend.id));
                                            }}
                                            className="p-1.5 bg-error/5 hover:bg-error-container text-error rounded-lg transition-all"
                                            title="Unfriend"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-center text-xs text-on-surface-variant/70 py-4 font-sans">Your coffee circle is empty.</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/20 mb-6 font-sans">
                        <h4 className="font-headline font-bold text-primary text-sm mb-3 text-left">{t.favoriteDrink}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs border-b border-outline-variant/10 pb-2">
                            <span className="text-on-surface-variant">{t.favoriteSpot}</span>
                            <span className="font-bold text-primary">{userProfile.favoriteSpot || "Bishkek Coffee Roasters"}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-on-surface-variant">{t.avgRating}</span>
                            <span className="font-bold text-primary">
                              {userProfile.favoriteCoffeeType || getFavoriteCoffeeType(userProfile.avatar)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-8"></div>
                </div>

                {/* Settings Overlays / Modals */}
                <AnimatePresence>
                  {showSettingsModal && (
                    <motion.div
                      key="main-settings-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4 font-sans"
                    >
                      <motion.div
                        key="main-settings-modal-content"
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 15 }}
                        className="bg-surface text-on-surface rounded-3xl w-full max-w-sm p-6 border border-outline-variant/20 shadow-2xl relative max-h-[85vh] overflow-y-auto"
                      >
                        <button
                          onClick={() => setShowSettingsModal(false)}
                          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-all"
                        >
                          <X size={15} />
                        </button>

                        <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3 mb-4 text-left">
                          <Settings size={18} className="text-primary animate-spin-[linear_16s_infinite]" />
                          <h3 className="font-headline font-black text-primary text-sm uppercase tracking-wider">{t.settingsTitle}</h3>
                        </div>

                        {/* Theme & Language Card */}
                        <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/15 space-y-3 shadow-soft mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {themeMode === 'dark' ? <Moon size={15} className="text-primary" /> : <Sun size={15} className="text-[#a55e2b]" />}
                              <span className="text-xs font-bold text-on-surface">{t.modeLabel}</span>
                            </div>
                            <div className="flex items-center gap-0.5 bg-surface rounded-xl p-0.5 border border-outline-variant/20">
                              <button
                                onClick={() => handleThemeChange('light')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${themeMode === 'light' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                              >
                                {t.modeLight ? t.modeLight.split(' ')[0] : 'Light'}
                              </button>
                              <button
                                onClick={() => handleThemeChange('dark')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${themeMode === 'dark' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                              >
                                {t.modeDark ? t.modeDark.split(' ')[0] : 'Dark'}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3">
                            <div className="flex items-center gap-2">
                              <Globe size={15} className="text-open" />
                              <span className="text-xs font-bold text-on-surface">{t.langLabel}</span>
                            </div>
                            <div className="flex items-center gap-0.5 bg-surface rounded-xl p-0.5 border border-outline-variant/20">
                              <button
                                onClick={() => handleLanguageChange('en')}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${language === 'en' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                              >
                                EN
                              </button>
                              <button
                                onClick={() => handleLanguageChange('ru')}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${language === 'ru' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                              >
                                РУ
                              </button>
                              <button
                                onClick={() => handleLanguageChange('ky')}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${language === 'ky' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                              >
                                КЫР
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Privacy & Security Card */}
                        <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/15 space-y-2.5 shadow-soft text-left mb-4">
                          <div>
                            <h5 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono mb-2">{t.privacyTitle}</h5>
                          </div>

                          <div className="flex items-center justify-between py-1 border-b border-outline-variant/5">
                            <span className="text-xs text-on-surface">{t.backgroundTracking}</span>
                            <button
                              type="button"
                              onClick={toggleBackgroundTracking}
                              role="switch"
                              aria-checked={bgLocationTracking}
                              aria-label={t.backgroundTracking}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none ${bgLocationTracking ? 'bg-open' : 'bg-outline-variant'}`}
                            >
                              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform duration-200 ${bgLocationTracking ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              setCurrentPasswordInput('');
                              setNewPasswordInput('');
                              setConfirmPasswordInput('');
                              setActiveSettingModal('password');
                            }}
                            className="flex items-center justify-between w-full text-left py-1.5 border-b border-outline-variant/5 hover:text-primary transition-colors text-xs text-on-surface"
                          >
                            <span>{t.changePassword}</span>
                            <span className="text-on-surface-variant/70 font-mono">&rarr;</span>
                          </button>

                          <button
                            onClick={() => {
                              setCurrentEmailInput('');
                              setNewEmailInput('');
                              setActiveSettingModal('email');
                            }}
                            className="flex items-center justify-between w-full text-left py-1.5 border-b border-outline-variant/5 hover:text-primary transition-colors text-xs text-on-surface"
                          >
                            <span>{t.updateEmail}</span>
                            <span className="text-on-surface-variant/70 font-mono">&rarr;</span>
                          </button>

                          <button
                            onClick={() => setActiveSettingModal('delete')}
                            className="flex items-center justify-between w-full text-left py-1.5 text-error font-semibold hover:brightness-110 transition-colors text-xs"
                          >
                            <span>{t.deleteAccount}</span>
                            <span className="font-mono">&rarr;</span>
                          </button>
                        </div>

                        {/* Legal Resources Card */}
                        <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/15 space-y-1.5 shadow-soft text-left">
                          <div>
                            <h5 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono mb-2">{t.legalTitle}</h5>
                          </div>
                          
                          <button
                            onClick={() => setActiveSettingModal('privacy_policy')}
                            className="flex items-center justify-between w-full text-left py-1.5 border-b border-outline-variant/5 text-xs text-on-surface hover:text-primary"
                          >
                            <span>{t.privacyPolicy}</span>
                            <span className="text-on-surface-variant/50">&rarr;</span>
                          </button>

                          <button
                            onClick={() => setActiveSettingModal('community_guidelines')}
                            className="flex items-center justify-between w-full text-left py-1.5 border-b border-outline-variant/5 text-xs text-on-surface hover:text-primary"
                          >
                            <span>{t.communityGuidelines}</span>
                            <span className="text-on-surface-variant/50">&rarr;</span>
                          </button>

                          <button
                            onClick={() => {
                              setContactName('');
                              setContactEmail(userEmail);
                              setContactMessage('');
                              setContactSent(false);
                              setActiveSettingModal('contact');
                            }}
                            className="flex items-center justify-between w-full text-left py-1.5 border-b border-outline-variant/5 text-xs text-on-surface hover:text-primary"
                          >
                            <span>{t.contactUs}</span>
                            <span className="text-on-surface-variant/50">&rarr;</span>
                          </button>

                          <button
                            onClick={() => setActiveSettingModal('about_us')}
                            className="flex items-center justify-between w-full text-left py-1.5 border-b border-outline-variant/5 text-xs text-on-surface hover:text-primary"
                          >
                            <span>{t.aboutUs}</span>
                            <span className="text-on-surface-variant/50">&rarr;</span>
                          </button>

                          <button
                            onClick={() => setActiveSettingModal('terms')}
                            className="flex items-center justify-between w-full text-left py-1 text-xs text-on-surface hover:text-primary"
                          >
                            <span>{t.termsOfService}</span>
                            <span className="text-on-surface-variant/50">&rarr;</span>
                          </button>
                        </div>

                        <button
                          onClick={() => setShowSettingsModal(false)}
                          className="w-full mt-5 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-2xl text-xs font-bold transition-all border border-outline-variant/20 shadow-sm"
                        >
                          Close Settings
                        </button>
                      </motion.div>
                    </motion.div>
                  )}

                  {activeSettingModal && (
                    <motion.div
                      key="settings-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4 font-sans"
                    >
                      <motion.div
                        key="settings-modal-content"
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 15 }}
                        className="bg-surface text-on-surface rounded-3xl w-full max-w-sm p-5 border border-outline-variant/20 shadow-2xl relative max-h-[80vh] overflow-y-auto"
                      >
                        <button
                          onClick={() => {
                            setActiveSettingModal(null);
                            setContactSent(false);
                          }}
                          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-all"
                        >
                          <X size={15} />
                        </button>

                        {activeSettingModal === 'password' && (
                          <form onSubmit={handleUpdatePassword} className="space-y-3.5 text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <Lock className="text-primary" size={18} />
                              <h3 className="font-headline font-black text-primary text-sm uppercase tracking-wider">{t.changePassword}</h3>
                            </div>
                            
                            <p className="text-[10px] text-on-surface-variant leading-relaxed">
                              Enter your current password and specify a strong new key.
                            </p>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Current Password</label>
                              <div className="relative">
                                <input
                                  type={showPwdCurrent ? "text" : "password"}
                                  required
                                  value={currentPasswordInput}
                                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                                  className="w-full bg-surface-container p-2.5 pr-9 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                                  placeholder="••••••••"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPwdCurrent(!showPwdCurrent)}
                                  className="absolute right-3 top-3 text-on-surface-variant/70 hover:text-on-surface"
                                >
                                  {showPwdCurrent ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">New Password</label>
                              <div className="relative">
                                <input
                                  type={showPwdNew ? "text" : "password"}
                                  required
                                  value={newPasswordInput}
                                  onChange={(e) => setNewPasswordInput(e.target.value)}
                                  className="w-full bg-surface-container p-2.5 pr-9 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                                  placeholder="New Password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPwdNew(!showPwdNew)}
                                  className="absolute right-3 top-3 text-on-surface-variant/70 hover:text-on-surface"
                                >
                                  {showPwdNew ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Confirm New Password</label>
                              <input
                                type="password"
                                required
                                value={confirmPasswordInput}
                                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                                className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                                placeholder="Confirm Password"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                              <button
                                type="button"
                                onClick={() => setActiveSettingModal(null)}
                                className="py-2.5 border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container font-boldCancel"
                              >
                                {t.cancel}
                              </button>
                              <button
                                type="submit"
                                className="py-2.5 bg-primary text-on-primary rounded-xl hover:brightness-110 shadow-soft font-bold"
                              >
                                {t.save}
                              </button>
                            </div>
                          </form>
                        )}

                        {activeSettingModal === 'email' && (
                          <form onSubmit={handleUpdateEmailAddress} className="space-y-3.5 text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <Mail className="text-primary" size={18} />
                              <h3 className="font-headline font-black text-primary text-sm uppercase tracking-wider">{t.updateEmail}</h3>
                            </div>
                            
                            <p className="text-[10px] text-on-surface-variant leading-relaxed">
                              Update your linked email address.
                            </p>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Current Email Address</label>
                              <input
                                type="email"
                                required
                                value={currentEmailInput}
                                onChange={(e) => setCurrentEmailInput(e.target.value)}
                                className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                                placeholder={userEmail}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">New Email Address</label>
                              <input
                                type="email"
                                required
                                value={newEmailInput}
                                onChange={(e) => setNewEmailInput(e.target.value)}
                                className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                                placeholder="new.email@example.com"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                              <button
                                type="button"
                                onClick={() => setActiveSettingModal(null)}
                                className="py-2.5 border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container font-bold"
                              >
                                {t.cancel}
                              </button>
                              <button
                                type="submit"
                                className="py-2.5 bg-primary text-on-primary rounded-xl hover:brightness-110 shadow-soft font-bold"
                              >
                                {t.save}
                              </button>
                            </div>
                          </form>
                        )}

                        {activeSettingModal === 'delete' && (
                          <div className="space-y-4 text-center">
                            <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
                              <ShieldAlert size={22} />
                            </div>
                            <h3 className="font-headline font-black text-error text-base uppercase tracking-wider">{t.deleteAccount}</h3>
                            
                            <p className="text-[11px] text-on-surface-variant leading-relaxed">
                              Are you absolutely sure you want to delete your BrewSpot coffee profile? This action is IRREVERSIBLE!
                            </p>
                            <div className="text-left bg-surface-container p-3 rounded-2xl text-[10px] text-on-surface-variant space-y-1 font-sans">
                              <p>• Erase all saved places & connections</p>
                              <p>• Erase your brewlog and comments</p>
                              <p>• Reset user state to default factory mode</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                              <button
                                type="button"
                                onClick={() => setActiveSettingModal(null)}
                                className="py-2.5 border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container font-bold"
                              >
                                {t.cancel}
                              </button>
                              <button
                                type="button"
                                onClick={handleDeleteAccountConfirm}
                                className="py-2.5 bg-error text-on-error rounded-xl hover:brightness-110 shadow-soft font-bold"
                              >
                                Yes, Delete
                              </button>
                            </div>
                          </div>
                        )}

                        {activeSettingModal === 'privacy_policy' && (
                          <div className="space-y-3 text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Coffee className="text-primary animate-pulse" size={18} />
                              <h3 className="font-headline font-black text-primary text-sm uppercase tracking-wider">{t.privacyPolicy}</h3>
                            </div>
                            <div className="max-h-[40vh] overflow-y-auto pr-1 text-[10px] text-on-surface-variant space-y-2 leading-relaxed font-sans bg-surface-container p-3 rounded-xl">
                              <p className="font-bold">Last updated: 21 October 2026</p>
                              <p>Your profile, saved shops and reviews stay in this browser. If you report how busy a shop is, that report (shop, answer, time, anonymous ID) is stored in Google Firebase and shown to everyone. Location is used only to centre the map and show distances. Map and shop data come from Google. We use no ads or tracking.</p>
                            </div>
                            <a href={`${import.meta.env.BASE_URL}privacy.html`} target="_blank" rel="noopener" className="block text-center text-xs font-bold text-brand underline">Read the full Privacy Policy</a>
                            <button
                              onClick={() => setActiveSettingModal(null)}
                              className="w-full py-2 bg-primary text-on-primary rounded-xl font-bold mt-2 text-xs"
                            >
                              Close
                            </button>
                          </div>
                        )}

                        {activeSettingModal === 'terms' && (
                          <div className="space-y-3 text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Coffee className="text-primary" size={18} />
                              <h3 className="font-headline font-black text-primary text-sm uppercase tracking-wider">{t.termsOfService}</h3>
                            </div>
                            <div className="max-h-[40vh] overflow-y-auto pr-1 text-[10px] text-on-surface-variant space-y-2 leading-relaxed font-sans bg-surface-container p-3 rounded-xl">
                              <p className="font-bold">Last updated: 21 October 2026</p>
                              <p>Brewmap is a free guide. Shop details come from Google and may be out of date. Be respectful, no spam. The app is provided as is.</p>
                            </div>
                            <a href={`${import.meta.env.BASE_URL}terms.html`} target="_blank" rel="noopener" className="block text-center text-xs font-bold text-brand underline">Read the full Terms of Service</a>
                            <button
                              onClick={() => setActiveSettingModal(null)}
                              className="w-full py-2 bg-primary text-on-primary rounded-xl font-bold mt-2 text-xs"
                            >
                              Close
                            </button>
                          </div>
                        )}

                        {activeSettingModal === 'community_guidelines' && (
                          <div className="space-y-3 text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Coffee className="text-primary" size={18} />
                              <h3 className="font-headline font-black text-primary text-sm uppercase tracking-wider">{t.communityGuidelines}</h3>
                            </div>
                            <div className="max-h-[40vh] overflow-y-auto pr-1 text-[10px] text-on-surface-variant space-y-2 leading-relaxed font-sans bg-surface-container p-3 rounded-xl">
                              <p className="font-bold text-brand">Code of Conduct</p>
                              <p>• Be Authentic: Write real reviews of the espresso and pour-over flavor notes.</p>
                              <p>• Be Respectful: Roast styles and coffee methods are highly subjective. Keep discussions gentle and welcoming.</p>
                              <p>• No Spam: Commercial posts about roasteries or hardware tools must only be shared if genuinely asked.</p>
                            </div>
                            <button
                              onClick={() => setActiveSettingModal(null)}
                              className="w-full py-2 bg-primary text-on-primary rounded-xl font-bold mt-2 text-xs"
                            >
                              Close
                            </button>
                          </div>
                        )}

                        {activeSettingModal === 'about_us' && (
                          <div className="space-y-3 text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Coffee className="text-primary" size={18} />
                              <h3 className="font-headline font-black text-primary text-sm uppercase tracking-wider">{t.aboutUs}</h3>
                            </div>
                            <div className="max-h-[40vh] overflow-y-auto pr-1 text-[10px] text-on-surface-variant space-y-2 leading-relaxed font-sans bg-surface-container p-3 rounded-xl">
                              <p className="font-semibold text-primary">BrewSpot Kyrgyzstan</p>
                              <p>We are a localized collective of manual brew hobbyists and programming fans based in Bishkek, Kyrgyzstan.</p>
                              <p>Our purpose is to help people index artisanal coffee shops, tracking internet connections, device tracking, and manual extraction levels.</p>
                            </div>
                            <button
                              onClick={() => setActiveSettingModal(null)}
                              className="w-full py-2 bg-primary text-on-primary rounded-xl font-bold mt-2 text-xs"
                            >
                              Close
                            </button>
                          </div>
                        )}

                        {activeSettingModal === 'contact' && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-0.5 text-left">
                              <Mail className="text-primary" size={18} />
                              <h3 className="font-headline font-black text-primary text-sm uppercase tracking-wider">{t.contactUs}</h3>
                            </div>
                            
                            {contactSent ? (
                              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-[11px] space-y-1.5 text-center">
                                <p className="text-base">🚀</p>
                                <p className="font-bold">Sent!</p>
                                <p className="leading-relaxed">
                                  Your message has been received! Our support roasters will inspect it and reply to <span className="font-bold">{contactEmail}</span> shortly.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContactSent(false);
                                    setActiveSettingModal(null);
                                  }}
                                  className="mt-2.5 px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
                                >
                                  OK
                                </button>
                              </div>
                            ) : (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  setContactSent(true);
                                }}
                                className="space-y-2.5 text-left text-xs"
                              >
                                <div>
                                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5 font-mono">Name</label>
                                  <input
                                    type="text"
                                    required
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                                    placeholder="Friend"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5 font-mono">Email</label>
                                  <input
                                    type="email"
                                    required
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                                    placeholder="friend@example.com"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5 font-mono">Inquiry</label>
                                  <textarea
                                    required
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none min-h-[70px] leading-relaxed"
                                    placeholder="Enter details..."
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setActiveSettingModal(null)}
                                    className="py-2 border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container font-bold"
                                  >
                                    {t.cancel}
                                  </button>
                                  <button
                                    type="submit"
                                    className="py-2 bg-primary text-on-primary rounded-xl hover:brightness-110 shadow-soft font-bold flex items-center justify-center gap-1"
                                  >
                                    <Send size={10} />
                                    Send
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
    </>
  );
}
