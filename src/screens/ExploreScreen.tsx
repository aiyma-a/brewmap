import type { SavedBlend } from './explore/types';
import { Search, Map as MapIcon, Users, Bookmark, User, Navigation2, Coffee, AlertCircle, RefreshCcw, Info, Loader2, Settings, MessageSquare, Check, Key } from 'lucide-react';
import { CITIES, FRIENDS, COFFEE_SHOPS as STATIC_SHOPS, FriendMarker } from '../data';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useEffect, useState, FormEvent, useMemo } from 'react';
import { API_KEY, hasValidKey } from '../lib/mapsKey';
import { signOutUser, useAuthUser } from '../lib/auth';
import { MapContent } from '../components/MapContent';
import { ProfileTab } from './explore/ProfileTab';
import { MyReviewsModal } from './explore/MyReviewsModal';
import { ShareShopModal } from './explore/ShareShopModal';
import { ShareProfileModal } from './explore/ShareProfileModal';
import { ReviewModal } from './explore/ReviewModal';
import { ShopDetailSheet } from './explore/ShopDetailSheet';
import { SocialTab } from './explore/SocialTab';
import { SearchOverlay } from './explore/SearchOverlay';
import { ShopListSheet } from './explore/ShopListSheet';
import { TopAppBar } from './explore/TopAppBar';
import { SEARCHABLE_USERS, CUSTOM_VECTOR_AVATARS } from '../lib/sampleUsers';
import { filterShops } from '../lib/shops';
import { translations, getLanguage, setLanguage, getThemeMode, setThemeMode, Language } from '../lib/i18n';


export default function ExploreScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: authUser } = useAuthUser();
  const [authError, setAuthError] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const [language, setLanguageState] = useState<Language>(getLanguage);
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(getThemeMode);
  
  const t = useMemo(() => translations[language], [language]);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSettingModal, setActiveSettingModal] = useState<'password' | 'email' | 'delete' | 'privacy_policy' | 'community_guidelines' | 'contact' | 'about_us' | 'terms' | null>(null);
  const [bgLocationTracking, setBgLocationTracking] = useState<boolean>(() => {
    return localStorage.getItem('brewspot_bg_location_tracking') === 'true';
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('brewmap_user_email') || '';
  });
  const [userPassword, setUserPassword] = useState(() => {
    return localStorage.getItem('brewmap_user_password') || '';
  });

  // Modal temporary inputs
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPwdCurrent, setShowPwdCurrent] = useState(false);
  const [showPwdNew, setShowPwdNew] = useState(false);
  
  const [currentEmailInput, setCurrentEmailInput] = useState('');
  const [newEmailInput, setNewEmailInput] = useState('');

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setLanguage(newLanguage);
    setAddNotification(newLanguage === 'ru' ? 'Язык изменен на русский' : newLanguage === 'ky' ? 'Тил кыргызчага өзгөртүлдү' : 'Language changed to English');
    setTimeout(() => setAddNotification(null), 3000);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setThemeModeState(newTheme);
    setThemeMode(newTheme);
    setAddNotification(newTheme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled');
    setTimeout(() => setAddNotification(null), 3000);
  };

  const toggleBackgroundTracking = () => {
    const nextVal = !bgLocationTracking;
    setBgLocationTracking(nextVal);
    localStorage.setItem('brewspot_bg_location_tracking', String(nextVal));
    setAddNotification(nextVal ? "Background tracking enabled" : "Background tracking disabled");
    setTimeout(() => setAddNotification(null), 3000);
  };

  const handleUpdatePassword = (e: FormEvent) => {
    e.preventDefault();
    if (currentPasswordInput !== userPassword) {
      alert(language === 'ru' ? 'Неверный текущий пароль!' : language === 'ky' ? 'Учурдагы сыр сөз ката!' : 'Current password is incorrect!');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      alert(language === 'ru' ? 'Пароли не совпадают!' : language === 'ky' ? 'Сыр сөздөр дал келген жок!' : 'Passwords do not match!');
      return;
    }
    setUserPassword(newPasswordInput);
    localStorage.setItem('brewmap_user_password', newPasswordInput);
    setAddNotification(language === 'ru' ? 'Пароль успешно изменен!' : language === 'ky' ? 'Сыр сөз ийгиликтүү өзгөртүлдү!' : 'Password changed successfully!');
    setTimeout(() => setAddNotification(null), 3000);
    setActiveSettingModal(null);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  const handleUpdateEmailAddress = (e: FormEvent) => {
    e.preventDefault();
    if (currentEmailInput !== userEmail) {
      alert(language === 'ru' ? 'Неверный текущий адрес эл. почты!' : language === 'ky' ? 'Учурдагы электрондук дарек ката!' : 'Current email is incorrect!');
      return;
    }
    setUserEmail(newEmailInput);
    localStorage.setItem('brewmap_user_email', newEmailInput);
    setAddNotification(language === 'ru' ? 'Адрес эл. почты успешно обновлен!' : language === 'ky' ? 'Электрондук дарек ийгиликтүү жаңыланды!' : 'Email updated successfully!');
    setTimeout(() => setAddNotification(null), 3000);
    setActiveSettingModal(null);
    setCurrentEmailInput('');
    setNewEmailInput('');
  };

  const handleDeleteAccountConfirm = () => {
    localStorage.clear();
    setAddNotification(language === 'ru' ? 'Аккаунт удален. Приложение сброшено.' : language === 'ky' ? 'Аккаунт өчүрүлдү. Тиркеме баштапкы абалга келтирилди.' : 'Account deleted. Resetting app...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  const [discoveredShops, setDiscoveredShops] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'settings' | 'customizer'>('main');
  const [triggerSearch, setTriggerSearch] = useState(0);
  const [locationReady, setLocationReady] = useState(false);

  // On open, centre on the visitor (Bishkek, Kant, anywhere). Fall back to Bishkek if refused.
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationReady(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCurrentUserLocation(coords);
        setMoveToLocation(coords);
        setLocationReady(true);
      },
      () => setLocationReady(true),
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
    );
  }, []);
  const [moveToLocation, setMoveToLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [currentUserLocation, setCurrentUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [filterNearby, setFilterNearby] = useState(false);
  const [pointedLocation, setPointedLocation] = useState<{ lat: number; lng: number } | null>(() => {
    const latStr = searchParams.get('plat');
    const lngStr = searchParams.get('plng');
    return (latStr && lngStr) ? { lat: parseFloat(latStr), lng: parseFloat(lngStr) } : null;
  });
  const [pointedRadius, setPointedRadius] = useState<number>(() => {
    return parseInt(searchParams.get('pradius') || '3');
  });
  const [isListViewOpen, setIsListViewOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'explore' | 'social' | 'saved' | 'profile'>(() => {
    return (localStorage.getItem('brewmap_active_tab') as any) || 'explore';
  });
  const [expandedProfileSection, setExpandedProfileSection] = useState<'visited' | 'connections' | null>(null);
  const [isInlineFilterOpen, setIsInlineFilterOpen] = useState(false);

  const [mapStyleId, setMapStyleId] = useState<'auto' | 'oat' | 'roast' | 'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom'>(() => {
    return (localStorage.getItem('brewmap_map_style_id') as any) || 'auto';
  });
  const [showFriendsOnMap, setShowFriendsOnMap] = useState<boolean>(() => {
    const val = localStorage.getItem('brewmap_show_friends');
    return val === null ? true : val === 'true';
  });
  const [showRadiusGuide, setShowRadiusGuide] = useState<boolean>(() => {
    const val = localStorage.getItem('brewmap_show_radius_guide');
    return val === null ? true : val === 'true';
  });
  const [showShopNames, setShowShopNames] = useState<boolean>(() => {
    const val = localStorage.getItem('brewmap_show_shop_names');
    return val === null ? true : val === 'true';
  });
  const [customRoadColor, setCustomRoadColor] = useState<string>(() => {
    return localStorage.getItem('brewmap_custom_road_color') || '#7a5a4a';
  });
  const [customLandscapeColor, setCustomLandscapeColor] = useState<string>(() => {
    return localStorage.getItem('brewmap_custom_landscape_color') || '#faf8f5';
  });
  const [customParkColor, setCustomParkColor] = useState<string>(() => {
    return localStorage.getItem('brewmap_custom_park_color') || '#d2e5ca';
  });
  const [customWaterColor, setCustomWaterColor] = useState<string>(() => {
    return localStorage.getItem('brewmap_custom_water_color') || '#cedad6';
  });

  const handleMapStyleChange = (id: 'auto' | 'oat' | 'roast' | 'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom') => {
    setMapStyleId(id);
    localStorage.setItem('brewmap_map_style_id', id);
  };
  const handleToggleFriendsOnMap = () => {
    setShowFriendsOnMap(prev => {
      const next = !prev;
      localStorage.setItem('brewmap_show_friends', String(next));
      return next;
    });
  };
  const handleToggleRadiusGuide = () => {
    setShowRadiusGuide(prev => {
      const next = !prev;
      localStorage.setItem('brewmap_show_radius_guide', String(next));
      return next;
    });
  };
  const handleToggleShopNames = () => {
    setShowShopNames(prev => {
      const next = !prev;
      localStorage.setItem('brewmap_show_shop_names', String(next));
      return next;
    });
  };

  // Map Customizer States
  const [draftStyleId, setDraftStyleId] = useState<'auto' | 'oat' | 'roast' | 'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom'>(mapStyleId);
  const [draftShowFriends, setDraftShowFriends] = useState<boolean>(showFriendsOnMap);
  const [draftShowRadius, setDraftShowRadius] = useState<boolean>(showRadiusGuide);
  const [draftShowShopNames, setDraftShowShopNames] = useState<boolean>(showShopNames);
  const [draftRoadColor, setDraftRoadColor] = useState<string>(customRoadColor);
  const [draftLandscapeColor, setDraftLandscapeColor] = useState<string>(customLandscapeColor);
  const [draftParkColor, setDraftParkColor] = useState<string>(customParkColor);
  const [draftWaterColor, setDraftWaterColor] = useState<string>(customWaterColor);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when customizer opens in menu
  useEffect(() => {
    if (menuView === 'customizer') {
      setDraftStyleId(mapStyleId);
      setDraftShowFriends(showFriendsOnMap);
      setDraftShowRadius(showRadiusGuide);
      setDraftShowShopNames(showShopNames);
      setDraftRoadColor(customRoadColor);
      setDraftLandscapeColor(customLandscapeColor);
      setDraftParkColor(customParkColor);
      setDraftWaterColor(customWaterColor);
      setSaveSuccess(false);
    }
  }, [menuView, mapStyleId, showFriendsOnMap, showRadiusGuide, showShopNames, customRoadColor, customLandscapeColor, customParkColor, customWaterColor]);

  // While the style sheet is open, the map shows the draft choices (live preview)
  const previewingMapStyle = isMenuOpen && menuView === 'customizer';

  const handleSaveSettings = () => {
    setIsSaving(true);
    if (draftStyleId !== mapStyleId) {
      handleMapStyleChange(draftStyleId);
    }
    if (draftShowFriends !== showFriendsOnMap) {
      handleToggleFriendsOnMap();
    }
    if (draftShowRadius !== showRadiusGuide) {
      handleToggleRadiusGuide();
    }
    if (draftShowShopNames !== showShopNames) {
      handleToggleShopNames();
    }
    // Save color customizations
    setCustomRoadColor(draftRoadColor);
    localStorage.setItem('brewmap_custom_road_color', draftRoadColor);
    setCustomLandscapeColor(draftLandscapeColor);
    localStorage.setItem('brewmap_custom_landscape_color', draftLandscapeColor);
    setCustomParkColor(draftParkColor);
    localStorage.setItem('brewmap_custom_park_color', draftParkColor);
    setCustomWaterColor(draftWaterColor);
    localStorage.setItem('brewmap_custom_water_color', draftWaterColor);

    setSaveSuccess(true);
    setIsSaving(false);

    // Provide delightful feedback then close
    setTimeout(() => {
      setIsMenuOpen(false);
      setSaveSuccess(false);
      setMenuView('main');
    }, 1200);
  };

  const handleTabClick = (tab: 'explore' | 'social' | 'saved' | 'profile') => {
    setActiveTab(tab);
    localStorage.setItem('brewmap_active_tab', tab);
    setIsListViewOpen(false);
    setSelectedShopDetail(null);
    setIsMenuOpen(false);
    setIsEditingProfile(false);
    setExpandedProfileSection(null);
  };
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareShopData, setShareShopData] = useState<any>(null);
  const [isShopCopied, setIsShopCopied] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showMyReviewsModal, setShowMyReviewsModal] = useState(false);

  const [userProfile, setUserProfile] = useState(() => {
    let profile = {
      name: 'Guest',
      username: 'guest',
      bio: '',
      avatar: 'vector:Espresso',
      favoriteSpot: 'Bishkek Coffee Roasters',
      favoriteCoffeeType: 'Espresso'
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

  const renderUserAvatar = (avatarUrl: string, className = "w-10 h-10", iconSize = 20) => {
    let matched = CUSTOM_VECTOR_AVATARS[0];
    if (avatarUrl && avatarUrl.startsWith('vector:')) {
      const name = avatarUrl.substring(7);
      matched = CUSTOM_VECTOR_AVATARS.find(v => v.name === name) || CUSTOM_VECTOR_AVATARS[0];
    } else if (avatarUrl) {
      const seed = avatarUrl.length;
      matched = CUSTOM_VECTOR_AVATARS[seed % CUSTOM_VECTOR_AVATARS.length];
    }
    return (
      <div className={`rounded-full flex items-center justify-center shrink-0 ${matched.bg} ${matched.text} ${className}`}>
        <Coffee size={iconSize} fill="currentColor" />
      </div>
    );
  };

  const getFavoriteCoffeeType = (avatarUrl: string) => {
    let matched = CUSTOM_VECTOR_AVATARS[0];
    if (avatarUrl && avatarUrl.startsWith('vector:')) {
      const name = avatarUrl.substring(7);
      matched = CUSTOM_VECTOR_AVATARS.find(v => v.name === name) || CUSTOM_VECTOR_AVATARS[0];
    } else if (avatarUrl) {
      const seed = avatarUrl.length;
      matched = CUSTOM_VECTOR_AVATARS[seed % CUSTOM_VECTOR_AVATARS.length];
    }
    return matched.name;
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editUsername, setEditUsername] = useState(userProfile.username);
  const [editBio, setEditBio] = useState(userProfile.bio);
  const [editAvatar, setEditAvatar] = useState(userProfile.avatar);
  const [editFavoriteSpot, setEditFavoriteSpot] = useState(userProfile.favoriteSpot || 'Bishkek Coffee Roasters');
  const [editFavoriteCoffeeType, setEditFavoriteCoffeeType] = useState(userProfile.favoriteCoffeeType || 'Espresso');

  const [friendsList, setFriendsList] = useState<FriendMarker[]>(() => {
    const saved = localStorage.getItem('brewmap_friends_v2');
    return saved ? JSON.parse(saved) : FRIENDS;
  });
  const [favoritesList, setFavoritesList] = useState<any[]>(() => {
    const saved = localStorage.getItem('brewmap_saved_spots');
    return saved ? JSON.parse(saved) : STATIC_SHOPS;
  });
  const [visitedList, setVisitedList] = useState<any[]>(() => {
    const saved = localStorage.getItem('brewmap_visited_spots');
    return saved ? JSON.parse(saved) : [STATIC_SHOPS[0], STATIC_SHOPS[1]];
  });
  const [reviewsList, setReviewsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('brewmap_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [friendSearchQuery, setFriendSearchQuery] = useState('');


  const [savedBlends, setSavedBlends] = useState<SavedBlend[]>(() => {
    try {
      const val = localStorage.getItem('brewmap_saved_blends');
      if (val) return JSON.parse(val);
      const initialSeed: SavedBlend[] = [
        {
          id: 'seed-pistachio-espresso',
          name: 'Pistachio Espresso ☕️',
          roadColor: '#3e2723',
          landscapeColor: '#d5ead3',
          parkColor: '#2a4e33',
          waterColor: '#acc2c4'
        },
        {
          id: 'seed-berry-cacao',
          name: 'Sweet Berry Brew 🍒',
          roadColor: '#9e5927',
          landscapeColor: '#faf2f2',
          parkColor: '#d2e5ca',
          waterColor: '#4a2c3a'
        },
        {
          id: 'seed-emerald-mint',
          name: 'Iced Mint Foam 🌿',
          roadColor: '#134421',
          landscapeColor: '#ebf2ed',
          parkColor: '#a3dfbe',
          waterColor: '#a9dcc9'
        }
      ];
      localStorage.setItem('brewmap_saved_blends', JSON.stringify(initialSeed));
      return initialSeed;
    } catch (e) {
      return [];
    }
  });

  const [newBlendName, setNewBlendName] = useState('');
  const [showSaveBlendForm, setShowSaveBlendForm] = useState(false);

  const handleSelectSavedBlend = (blend: SavedBlend) => {
    setDraftStyleId('custom');
    setDraftRoadColor(blend.roadColor);
    setDraftLandscapeColor(blend.landscapeColor);
    setDraftParkColor(blend.parkColor);
    setDraftWaterColor(blend.waterColor);
    
    setAddNotification(`Loaded blend: "${blend.name}"`);
    setTimeout(() => setAddNotification(null), 2500);
  };

  const handleDeleteSavedBlend = (blendId: string, e: any) => {
    e.stopPropagation();
    const updated = savedBlends.filter(b => b.id !== blendId);
    setSavedBlends(updated);
    localStorage.setItem('brewmap_saved_blends', JSON.stringify(updated));
    setAddNotification("Blend deleted");
    setTimeout(() => setAddNotification(null), 2000);
  };

  const handleCreateNewBlend = (e: any) => {
    e.preventDefault();
    const name = newBlendName.trim() || `My Blend #${savedBlends.length + 1}`;
    const newBlend: SavedBlend = {
      id: Date.now().toString(),
      name,
      roadColor: draftRoadColor,
      landscapeColor: draftLandscapeColor,
      parkColor: draftParkColor,
      waterColor: draftWaterColor
    };
    const updated = [...savedBlends, newBlend];
    setSavedBlends(updated);
    localStorage.setItem('brewmap_saved_blends', JSON.stringify(updated));
    setNewBlendName('');
    setShowSaveBlendForm(false);
    
    setDraftStyleId('custom');
    
    setAddNotification(`Saved and selected blend "${name}"!`);
    setTimeout(() => setAddNotification(null), 3000);
  };

  const [addNotification, setAddNotification] = useState<string | null>(null);

  const [selectedShopForReview, setSelectedShopForReview] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedShopDetail, setSelectedShopDetail] = useState<any | null>(null);
  const [isDetailExpanded, setIsDetailExpanded] = useState<boolean>(false);
  const [expandedVisitedShopId, setExpandedVisitedShopId] = useState<number | null>(null);

  const [isEditingInlineExplore, setIsEditingInlineExplore] = useState(false);
  const [inlineRatingExplore, setInlineRatingExplore] = useState(5);
  const [inlineCommentExplore, setInlineCommentExplore] = useState('');
  const [inlineHoverRatingExplore, setInlineHoverRatingExplore] = useState<number | null>(null);

  useEffect(() => {
    if (selectedShopDetail) {
      const userReview = reviewsList.find(r => r.shopId === selectedShopDetail.id);
      if (userReview) {
        setInlineRatingExplore(userReview.rating);
        setInlineCommentExplore(userReview.comment);
        setIsEditingInlineExplore(false);
      } else {
        setInlineRatingExplore(5);
        setInlineCommentExplore('');
        setIsEditingInlineExplore(false);
      }
    }
  }, [selectedShopDetail?.id]);

  useEffect(() => {
    localStorage.setItem('brewmap_friends_v2', JSON.stringify(friendsList));
  }, [friendsList]);

  useEffect(() => {
    localStorage.setItem('brewmap_saved_spots', JSON.stringify(favoritesList));
  }, [favoritesList]);

  useEffect(() => {
    localStorage.setItem('brewmap_visited_spots', JSON.stringify(visitedList));
  }, [visitedList]);

  useEffect(() => {
    localStorage.setItem('brewmap_reviews', JSON.stringify(reviewsList));
  }, [reviewsList]);

  useEffect(() => {
    localStorage.setItem('brewmap_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Signed in on a device without a saved profile: fill it from the account
  useEffect(() => {
    if (authUser && userProfile.name === 'Guest') {
      const name = authUser.displayName || (authUser.email || '').split('@')[0] || 'Coffee fan';
      setUserProfile(prev => ({ ...prev, name, username: name.replace(/\s+/g, '').toLowerCase() }));
    }
  }, [authUser]);

  const handleSignOut = async () => {
    try { await signOutUser(); } catch {}
    localStorage.removeItem('brewmap_user_profile');
    window.location.reload();
  };

  const handleUpdateProfile = (e: FormEvent) => {
    e.preventDefault();
    const updated = {
      name: editName.trim() || 'Guest',
      username: editUsername.trim().replace(/^@/, '') || 'guest',
      bio: editBio.trim() || 'Specialty coffee connoisseur / Manual brew fanatic',
      avatar: editAvatar,
      favoriteSpot: editFavoriteSpot.trim() || 'Bishkek Coffee Roasters',
      favoriteCoffeeType: editFavoriteCoffeeType.trim() || 'Espresso'
    };
    setUserProfile(updated);
    setIsEditingProfile(false);
    setAddNotification("Profile updated successfully!");
    setTimeout(() => setAddNotification(null), 3000);
  };

  const handleToggleFavorite = (shop: any) => {
    setFavoritesList(prev => {
      const exists = prev.some(f => f.id === shop.id);
      if (exists) {
        return prev.filter(f => f.id !== shop.id);
      } else {
        return [...prev, shop];
      }
    });
    setAddNotification(`${shop.name} ${favoritesList.some(f => f.id === shop.id) ? 'removed from' : 'saved to'} favorites!`);
    setTimeout(() => setAddNotification(null), 3000);
  };

  const handleToggleVisited = (shop: any) => {
    const exists = visitedList.some(v => v.id === shop.id);
    setVisitedList(prev => {
      if (exists) {
        return prev.filter(v => v.id !== shop.id);
      } else {
        return [...prev, shop];
      }
    });
    setAddNotification(`${shop.name} ${exists ? 'removed from' : 'added to'} visited spots!`);
    setTimeout(() => setAddNotification(null), 3000);
  };

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedShopForReview) return;

    const newReview = {
      id: `rev_${Date.now()}`,
      shopId: selectedShopForReview.id,
      shopName: selectedShopForReview.name,
      user: userProfile.name,
      avatar: userProfile.avatar,
      rating: reviewRating,
      comment: reviewComment,
      time: 'Just now'
    };

    setReviewsList(prev => {
      // Remove previous review of this same user on this user-saved shop if any
      const filtered = prev.filter(r => r.shopId !== selectedShopForReview.id);
      return [newReview, ...filtered];
    });

    setAddNotification(`Review for ${selectedShopForReview.name} submitted successfully!`);
    setTimeout(() => setAddNotification(null), 3500);

    setSelectedShopForReview(null);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleDeleteReview = (shopId: string) => {
    setReviewsList(prev => prev.filter(r => r.shopId !== shopId));
    setAddNotification(`Review removed.`);
    setTimeout(() => setAddNotification(null), 3000);
  };

  // Friend search filtering logic
  const searchedUsers = useMemo(() => {
    if (!friendSearchQuery.trim()) return [];
    const q = friendSearchQuery.toLowerCase().trim();
    return SEARCHABLE_USERS.filter(u => 
      u.username.toLowerCase().includes(q) || 
      u.name.toLowerCase().includes(q)
    );
  }, [friendSearchQuery]);

  const suggestedUsers = useMemo(() => {
    return SEARCHABLE_USERS.filter(u => !friendsList.some(f => f.id === u.id));
  }, [friendsList]);

  const handleAddFriend = (user: { id: string; name: string; username: string; image: string; bio: string; location: { lat: number; lng: number } }) => {
    if (friendsList.some(f => f.id === user.id)) return;
    const newFriend: FriendMarker = {
      id: user.id,
      name: user.name,
      image: user.image,
      location: user.location
    };
    setFriendsList(prev => [...prev, newFriend]);
    setAddNotification(`Successfully added ${user.name} to your Coffee Circle!`);
    setTimeout(() => setAddNotification(null), 3500);
  };

  const searchQuery = searchParams.get('q') || '';
  const [localSearchInput, setLocalSearchInput] = useState(() => searchQuery);

  // Keep local input in sync if URL changes externally (initial load, navigation, clear)
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    setLocalSearchInput(currentQ);
  }, [searchParams]);

  // Debounce syncing local input to URL search parameters
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get('q') || '';
      if (localSearchInput !== currentQ) {
        const params = new URLSearchParams(searchParams);
        if (localSearchInput) {
          params.set('q', localSearchInput);
        } else {
          params.delete('q');
        }
        setSearchParams(params, { replace: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchInput, searchParams, setSearchParams]);

  // Sync pointedLocation and pointedRadius from search params when they change externally (like returning from Filter screen)
  useEffect(() => {
    const platVal = searchParams.get('plat');
    const plngVal = searchParams.get('plng');
    const pradiusVal = searchParams.get('pradius');
    if (platVal && plngVal) {
      setPointedLocation({ lat: parseFloat(platVal), lng: parseFloat(plngVal) });
    } else {
      setPointedLocation(null);
    }
    if (pradiusVal) {
      setPointedRadius(parseInt(pradiusVal));
    }
  }, [searchParams]);
  
  const filterCities = useMemo(() => {
    const cityParam = searchParams.get('city');
    if (cityParam === 'all') {
      return [];
    }
    return cityParam ? cityParam.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const filterWifi = searchParams.get('wifi') === 'true';
  const filterOutlets = searchParams.get('outlets') === 'true';
  const filterOpenNow = searchParams.get('open') === 'true';

  // Automatically center map on the first selected city when city filter changes
  useEffect(() => {
    if (filterCities.length > 0) {
      const firstCityName = filterCities[0];
      const foundCity = CITIES.find(c => c.name.toLowerCase() === firstCityName.toLowerCase());
      if (foundCity) {
        setMoveToLocation({ ...foundCity.location });
      }
    }
  }, [filterCities]);

  // Combine static and discovered shops, avoiding duplicates by ID
  const allShops = useMemo(() => {
    const shops = [...STATIC_SHOPS];
    discoveredShops.forEach(ds => {
      if (!shops.find(s => s.id === ds.id)) {
        shops.push(ds);
      }
    });
    return shops;
  }, [discoveredShops]);

  // Local filtering based on search query and filters
  const filteredShops = useMemo(() => {
    const radiusParam = searchParams.get('radius');
    return filterShops(allShops, {
      searchQuery,
      cities: filterCities,
      openNow: filterOpenNow,
      wifi: filterWifi,
      outlets: filterOutlets,
      nearby: filterNearby,
      radiusKm: radiusParam ? parseInt(radiusParam) : null,
      userLocation: currentUserLocation,
      pointedLocation,
      pointedRadiusKm: pointedRadius,
      cityCenters: CITIES,
      currentHour: new Date().getHours(),
    });
  }, [allShops, searchQuery, filterCities, filterOpenNow, filterNearby, filterWifi, filterOutlets, currentUserLocation, searchParams, pointedLocation, pointedRadius]);

  useEffect(() => {
    (window as any).gm_authFailure = () => {
      console.error('Google Maps authentication failure detected');
      setAuthError(true);
    };
    return () => { (window as any).gm_authFailure = undefined; };
  }, []);

  const handleDiscoveredShops = (places: any[]) => {
    setDiscoveredShops(places);
    setIsSearching(false);
  };

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = localSearchInput.trim();
    if (!query) return;

    // Immediately update URL parameter on explicit submit to avoid latency beforePlaces search
    const params = new URLSearchParams(searchParams);
    params.set('q', query);
    setSearchParams(params, { replace: true });

    setIsSearching(true);
    setTriggerSearch(prev => prev + 1);
  };

  const handleSearchChange = (val: string, immediate = false) => {
    setLocalSearchInput(val);
    if (val) {
      setShowSearchDropdown(true);
      if (immediate) {
        const params = new URLSearchParams(searchParams);
        params.set('q', val);
        setSearchParams(params, { replace: true });
      }
    } else {
      setShowSearchDropdown(false);
      //snappily clear search parameter immediately if users completely delete
      const params = new URLSearchParams(searchParams);
      params.delete('q');
      setSearchParams(params, { replace: true });
    }
  };

  const handleSelectShop = (shop: any) => {
    setMoveToLocation({ ...shop.location });
    setShowSearchDropdown(false);
    // Clear the search text query so other cafes remain visible on the map
    handleSearchChange('', true);
    setSelectedShopDetail(shop);
    setIsDetailExpanded(false);
  };

  const handleGPSLocate = () => {
    if (!navigator.geolocation) {
      setAddNotification("Geolocation is not supported by your browser. Centered on Bishkek.");
      const fallbackLocation = { lat: 42.8755, lng: 74.5905 };
      setCurrentUserLocation(fallbackLocation);
      setMoveToLocation(fallbackLocation);
      setTimeout(() => setAddNotification(null), 3000);
      return;
    }

    setIsLocating(true);
    setAddNotification("Finding your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setAddNotification("Location identified! Centered on your position.");
        
        setCurrentUserLocation(coords);
        setMoveToLocation(coords);
        setIsLocating(false);
        setTimeout(() => setAddNotification(null), 2500);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLocating(false);
        let errorMsg = "Unable to find your location. Centered on Bishkek.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Centered on Bishkek.";
        }
        setAddNotification(errorMsg);
        setTimeout(() => setAddNotification(null), 3500);
        
        const fallbackLocation = { lat: 42.8755, lng: 74.5905 };
        setCurrentUserLocation(fallbackLocation);
        setMoveToLocation(fallbackLocation);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleNearby = () => {
    if (filterNearby) {
      setFilterNearby(false);
      setAddNotification("Showing all specialty coffee shops.");
      setTimeout(() => setAddNotification(null), 2500);
      return;
    }

    if (!navigator.geolocation) {
      setAddNotification("Geolocation is not supported by your browser. Using simulated position.");
      const fallbackLocation = { lat: 42.8755, lng: 74.5905 };
      setCurrentUserLocation(fallbackLocation);
      setMoveToLocation(fallbackLocation);
      setFilterNearby(true);
      setTimeout(() => setAddNotification(null), 3000);
      return;
    }

    setIsLocating(true);
    setAddNotification("Locating artisanal coffee nearby (2 km)...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setAddNotification("Location identified! Showing shops within 2 km.");
        
        setCurrentUserLocation(coords);
        setMoveToLocation(coords);
        setIsLocating(false);
        setFilterNearby(true);
        setTimeout(() => setAddNotification(null), 3500);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLocating(false);
        let errorMsg = "Unable to find your location. Using simulated position.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Using simulated location in Bishkek.";
        }
        setAddNotification(errorMsg);
        setTimeout(() => setAddNotification(null), 3500);
        
        // Fallback to beautiful simulated current location in Bishkek
        const fallbackLocation = { lat: 42.8755, lng: 74.5905 };
        setCurrentUserLocation(fallbackLocation);
        setMoveToLocation(fallbackLocation);
        setFilterNearby(true);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const toggleOpenNow = () => {
    const params = new URLSearchParams(searchParams);
    if (filterOpenNow) {
      params.delete('open');
      setFilterNearby(false);
    } else {
      params.set('open', 'true');
    }
    setSearchParams(params, { replace: true });
  };

  const handleMapClick = (latLng: { lat: number; lng: number }) => {
    // Dismiss selected coffee shop details when picking a new location on the map
    setSelectedShopDetail(null);
    setIsDetailExpanded(false);

    setPointedLocation(latLng);
    const params = new URLSearchParams(searchParams);
    params.set('plat', latLng.lat.toString());
    params.set('plng', latLng.lng.toString());
    params.set('pradius', pointedRadius.toString());
    setSearchParams(params, { replace: true });
    setAddNotification(`Search center set! Filtering cafes within ${pointedRadius} km`);
    setTimeout(() => setAddNotification(null), 3500);
  };

  if (!hasValidKey || authError) {
    // ... (Keep existing splash screen logic)
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface p-6 font-sans overflow-y-auto">
        <div className="text-center max-w-lg bg-surface-container p-8 rounded-3xl shadow-xl border border-outline-variant my-8">
          <div className="flex justify-center mb-6">
            <div className="bg-error-container p-4 rounded-full">
              <AlertCircle className="text-error w-10 h-10" />
            </div>
          </div>
          
          <h2 className="text-2xl font-headline text-primary mb-4">
            {authError ? "Google Maps Error" : "Google Maps Key Required"}
          </h2>
          
          <p className="text-on-surface-variant mb-6">
            {authError 
              ? "Google rejected your API key. This usually happens if the API is not enabled or billing is missing." 
              : "A valid Google Maps API Key is required to view the interactive map."}
          </p>

          <div className="space-y-6 text-left mb-8">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <p className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <AlertCircle size={16} /> 
                How to fix this error:
              </p>
              <ol className="text-sm text-amber-800 space-y-3 list-decimal pl-5">
                <li>
                  Click the button below and ensure <strong>"Maps JavaScript API"</strong> shows an <span className="text-green-700 font-bold">Enabled</span> status.
                </li>
                <li>
                  Ensure your Google Cloud project has an <strong>active billing account</strong> attached.
                </li>
              </ol>
              <a 
                href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?utm_campaign=gmp-code-assist-ais" 
                target="_blank" 
                rel="noopener" 
                className="mt-4 w-full flex items-center justify-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors"
              >
                Enable Maps JavaScript API
              </a>
            </div>

            <div>
              <p className="font-bold text-primary mb-2">Check your AI Studio Secret:</p>
              <ul className="text-sm text-on-surface-variant space-y-2 list-disc pl-5">
                <li>Open <strong>Settings</strong> (⚙️) → <strong>Secrets</strong></li>
                <li>Ensure <code>GOOGLE_MAPS_PLATFORM_KEY</code> matches your key.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href="https://console.cloud.google.com/google/maps-apis/credentials?utm_campaign=gmp-code-assist-ais" 
              target="_blank" 
              rel="noopener" 
              className="w-full flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors"
            >
              Go to Cloud Console
            </a>
            
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-on-surface-variant/60 hover:text-on-surface underline p-2"
            >
              {showDebug ? "Hide Debug Info" : "Show Loaded Key (Masked)"}
            </button>
            
            {showDebug && (
              <div className="mt-2 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant text-[10px] font-mono break-all text-left">
                Key: {API_KEY.substring(0, 8)}...{API_KEY.substring(API_KEY.length - 4)}
                <br />
                Length: {API_KEY.length}
              </div>
            )}
          </div>
          
          <p className="text-sm text-on-surface-variant italic mt-8 border-t border-outline-variant/30 pt-4 flex items-center justify-center gap-2">
            <RefreshCcw size={14} /> The app rebuilds automatically after changes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-surface">
      <APIProvider apiKey={API_KEY} version="weekly">
        {/* Top AppBar */}
        <TopAppBar
          activeTab={activeTab}
          bgLocationTracking={bgLocationTracking}
          draftLandscapeColor={draftLandscapeColor}
          draftParkColor={draftParkColor}
          draftRoadColor={draftRoadColor}
          draftShowFriends={draftShowFriends}
          draftShowRadius={draftShowRadius}
          draftShowShopNames={draftShowShopNames}
          draftStyleId={draftStyleId}
          draftWaterColor={draftWaterColor}
          handleCreateNewBlend={handleCreateNewBlend}
          handleDeleteSavedBlend={handleDeleteSavedBlend}
          handleLanguageChange={handleLanguageChange}
          handleSaveSettings={handleSaveSettings}
          handleSelectSavedBlend={handleSelectSavedBlend}
          handleTabClick={handleTabClick}
          handleThemeChange={handleThemeChange}
          isMenuOpen={isMenuOpen}
          isSaving={isSaving}
          language={language}
          menuView={menuView}
          newBlendName={newBlendName}
          savedBlends={savedBlends}
          saveSuccess={saveSuccess}
          setDraftLandscapeColor={setDraftLandscapeColor}
          setDraftParkColor={setDraftParkColor}
          setDraftRoadColor={setDraftRoadColor}
          setDraftShowFriends={setDraftShowFriends}
          setDraftShowRadius={setDraftShowRadius}
          setDraftShowShopNames={setDraftShowShopNames}
          setDraftStyleId={setDraftStyleId}
          setDraftWaterColor={setDraftWaterColor}
          setIsMenuOpen={setIsMenuOpen}
          setMenuView={setMenuView}
          setNewBlendName={setNewBlendName}
          setShowSaveBlendForm={setShowSaveBlendForm}
          setShowSettingsModal={setShowSettingsModal}
          showSaveBlendForm={showSaveBlendForm}
          t={t}
          themeMode={themeMode}
          toggleBackgroundTracking={toggleBackgroundTracking}
        />

        {/* Map Canvas */}
        <main className="relative h-full w-full">
          <MapContent 
            onSearch={handleDiscoveredShops} 
            isSearching={isSearching}
            shops={filteredShops}
            friends={friendsList}
            cities={CITIES}
            searchQuery={searchQuery}
            triggerSearch={triggerSearch}
            locationReady={locationReady}
            moveToLocation={moveToLocation}
            currentUserLocation={currentUserLocation}
            onShowShopDetail={(shop) => {
              setSelectedShopDetail(shop);
              setIsDetailExpanded(false);
            }}
            pointedLocation={pointedLocation}
            pointedRadius={pointedRadius}
            onMapClick={handleMapClick}
            mapStyleId={(() => { const id = previewingMapStyle ? draftStyleId : mapStyleId; return id === 'auto' ? (themeMode === 'dark' ? 'roast' : 'oat') : id; })()}
            customRoadColor={previewingMapStyle ? draftRoadColor : customRoadColor}
            customLandscapeColor={previewingMapStyle ? draftLandscapeColor : customLandscapeColor}
            customParkColor={previewingMapStyle ? draftParkColor : customParkColor}
            customWaterColor={previewingMapStyle ? draftWaterColor : customWaterColor}
            showFriendsOnMap={showFriendsOnMap}
            showRadiusGuide={previewingMapStyle ? draftShowRadius : showRadiusGuide}
            showShopNames={previewingMapStyle ? draftShowShopNames : showShopNames}
            onMapStyleChange={handleMapStyleChange}
            onToggleFriends={handleToggleFriendsOnMap}
            onToggleRadius={handleToggleRadiusGuide}
            onToggleShopNames={handleToggleShopNames}
            filterOpenNow={filterOpenNow}
          />
        </main>
 
          {/* FAB: Current Location */}
          {activeTab === 'explore' && (
            <button 
              onClick={handleGPSLocate}
              aria-label="Show my location"
              disabled={isLocating}
              className="absolute bottom-[112px] right-4 md:right-6 z-40 bg-primary text-white p-3 rounded-xl shadow-md active:scale-95 transition-all duration-200 disabled:opacity-85 flex items-center justify-center"
            >
              {isLocating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Navigation2 size={18} className="fill-current" />
              )}
            </button>
          )}

          {/* Specialty Coffee Shop List Bottom Sheet */}
          <ShopListSheet
          currentUserLocation={currentUserLocation}
          Date={Date}
          filteredShops={filteredShops}
          isListViewOpen={isListViewOpen}
          pointedLocation={pointedLocation}
          pointedRadius={pointedRadius}
          setIsDetailExpanded={setIsDetailExpanded}
          setIsListViewOpen={setIsListViewOpen}
          setMoveToLocation={setMoveToLocation}
          setSelectedShopDetail={setSelectedShopDetail}
        />

          {/* Search & Chips Overlay */}
          <SearchOverlay
          activeTab={activeTab}
          Boolean={Boolean}
          Date={Date}
          filterCities={filterCities}
          filteredShops={filteredShops}
          filterNearby={filterNearby}
          filterOpenNow={filterOpenNow}
          filterOutlets={filterOutlets}
          filterWifi={filterWifi}
          handleNearby={handleNearby}
          handleSearchChange={handleSearchChange}
          handleSelectShop={handleSelectShop}
          isInlineFilterOpen={isInlineFilterOpen}
          isLocating={isLocating}
          isSearching={isSearching}
          localSearchInput={localSearchInput}
          onSearchSubmit={onSearchSubmit}
          parseInt={parseInt}
          searchParams={searchParams}
          setFilterNearby={setFilterNearby}
          setIsInlineFilterOpen={setIsInlineFilterOpen}
          setSearchParams={setSearchParams}
          setShowSearchDropdown={setShowSearchDropdown}
          showSearchDropdown={showSearchDropdown}
          toggleOpenNow={toggleOpenNow}
        />

          {/* Social Tab Overlay Screen */}
          <SocialTab
          activeTab={activeTab}
          addNotification={addNotification}
          Date={Date}
          favoritesList={favoritesList}
          friendSearchQuery={friendSearchQuery}
          friendsList={friendsList}
          handleAddFriend={handleAddFriend}
          handleDeleteReview={handleDeleteReview}
          handleToggleFavorite={handleToggleFavorite}
          renderUserAvatar={renderUserAvatar}
          reviewsList={reviewsList}
          searchedUsers={searchedUsers}
          setActiveTab={setActiveTab}
          setFriendSearchQuery={setFriendSearchQuery}
          setFriendsList={setFriendsList}
          setIsDetailExpanded={setIsDetailExpanded}
          setMoveToLocation={setMoveToLocation}
          setReviewComment={setReviewComment}
          setReviewRating={setReviewRating}
          setSelectedShopDetail={setSelectedShopDetail}
          setSelectedShopForReview={setSelectedShopForReview}
          suggestedUsers={suggestedUsers}
        />

          {/* Expandable Café Detail Pop-up Overlay */}
          <ShopDetailSheet
          Date={Date}
          favoritesList={favoritesList}
          handleToggleFavorite={handleToggleFavorite}
          handleToggleVisited={handleToggleVisited}
          inlineCommentExplore={inlineCommentExplore}
          inlineHoverRatingExplore={inlineHoverRatingExplore}
          inlineRatingExplore={inlineRatingExplore}
          isDetailExpanded={isDetailExpanded}
          isEditingInlineExplore={isEditingInlineExplore}
          reviewsList={reviewsList}
          selectedShopDetail={selectedShopDetail}
          setAddNotification={setAddNotification}
          setInlineCommentExplore={setInlineCommentExplore}
          setInlineHoverRatingExplore={setInlineHoverRatingExplore}
          setInlineRatingExplore={setInlineRatingExplore}
          setIsDetailExpanded={setIsDetailExpanded}
          setIsEditingInlineExplore={setIsEditingInlineExplore}
          setReviewComment={setReviewComment}
          setReviewRating={setReviewRating}
          setReviewsList={setReviewsList}
          setSelectedShopDetail={setSelectedShopDetail}
          setSelectedShopForReview={setSelectedShopForReview}
          setShareShopData={setShareShopData}
          String={String}
          userProfile={userProfile}
          visitedList={visitedList}
        />

          {/* Review Modal Backdrop & Drawer overlay */}
          <ReviewModal
          handleSubmitReview={handleSubmitReview}
          hoverRating={hoverRating}
          reviewComment={reviewComment}
          reviewRating={reviewRating}
          selectedShopForReview={selectedShopForReview}
          setHoverRating={setHoverRating}
          setReviewComment={setReviewComment}
          setReviewRating={setReviewRating}
          setSelectedShopForReview={setSelectedShopForReview}
        />

          {/* Share Profile Modal Backdrop & Drawer overlay */}
          <ShareProfileModal
          encodeURIComponent={encodeURIComponent}
          isShareModalOpen={isShareModalOpen}
          renderUserAvatar={renderUserAvatar}
          setIsShareModalOpen={setIsShareModalOpen}
          userProfile={userProfile}
        />

          {/* Share Coffee Shop Modal Backdrop & Drawer overlay */}
          <ShareShopModal
          encodeURIComponent={encodeURIComponent}
          setShareShopData={setShareShopData}
          shareShopData={shareShopData}
        />

          {/* My Reviews Modal Backdrop & Sheet */}
          <MyReviewsModal
          discoveredShops={discoveredShops}
          reviewsList={reviewsList}
          setActiveTab={setActiveTab}
          setIsDetailExpanded={setIsDetailExpanded}
          setSelectedShopDetail={setSelectedShopDetail}
          setShowMyReviewsModal={setShowMyReviewsModal}
          showMyReviewsModal={showMyReviewsModal}
        />

          {/* Profile Tab Overlay Screen */}
          <ProfileTab
          isSignedIn={Boolean(authUser)}
          onSignOut={handleSignOut}
          activeSettingModal={activeSettingModal}
          activeTab={activeTab}
          bgLocationTracking={bgLocationTracking}
          confirmPasswordInput={confirmPasswordInput}
          contactEmail={contactEmail}
          contactMessage={contactMessage}
          contactName={contactName}
          contactSent={contactSent}
          currentEmailInput={currentEmailInput}
          currentPasswordInput={currentPasswordInput}
          Date={Date}
          editAvatar={editAvatar}
          editBio={editBio}
          editFavoriteCoffeeType={editFavoriteCoffeeType}
          editFavoriteSpot={editFavoriteSpot}
          editName={editName}
          editUsername={editUsername}
          expandedProfileSection={expandedProfileSection}
          expandedVisitedShopId={expandedVisitedShopId}
          friendsList={friendsList}
          getFavoriteCoffeeType={getFavoriteCoffeeType}
          handleDeleteAccountConfirm={handleDeleteAccountConfirm}
          handleLanguageChange={handleLanguageChange}
          handleThemeChange={handleThemeChange}
          handleToggleVisited={handleToggleVisited}
          handleUpdateEmailAddress={handleUpdateEmailAddress}
          handleUpdatePassword={handleUpdatePassword}
          handleUpdateProfile={handleUpdateProfile}
          isEditingProfile={isEditingProfile}
          language={language}
          newEmailInput={newEmailInput}
          newPasswordInput={newPasswordInput}
          renderUserAvatar={renderUserAvatar}
          reviewsList={reviewsList}
          setActiveSettingModal={setActiveSettingModal}
          setActiveTab={setActiveTab}
          setAddNotification={setAddNotification}
          setConfirmPasswordInput={setConfirmPasswordInput}
          setContactEmail={setContactEmail}
          setContactMessage={setContactMessage}
          setContactName={setContactName}
          setContactSent={setContactSent}
          setCurrentEmailInput={setCurrentEmailInput}
          setCurrentPasswordInput={setCurrentPasswordInput}
          setEditAvatar={setEditAvatar}
          setEditBio={setEditBio}
          setEditFavoriteCoffeeType={setEditFavoriteCoffeeType}
          setEditFavoriteSpot={setEditFavoriteSpot}
          setEditName={setEditName}
          setEditUsername={setEditUsername}
          setExpandedProfileSection={setExpandedProfileSection}
          setExpandedVisitedShopId={setExpandedVisitedShopId}
          setFriendsList={setFriendsList}
          setIsDetailExpanded={setIsDetailExpanded}
          setIsEditingProfile={setIsEditingProfile}
          setIsShareModalOpen={setIsShareModalOpen}
          setMoveToLocation={setMoveToLocation}
          setNewEmailInput={setNewEmailInput}
          setNewPasswordInput={setNewPasswordInput}
          setSelectedShopDetail={setSelectedShopDetail}
          setShowMyReviewsModal={setShowMyReviewsModal}
          setShowPwdCurrent={setShowPwdCurrent}
          setShowPwdNew={setShowPwdNew}
          setShowSettingsModal={setShowSettingsModal}
          showPwdCurrent={showPwdCurrent}
          showPwdNew={showPwdNew}
          showSettingsModal={showSettingsModal}
          t={t}
          themeMode={themeMode}
          toggleBackgroundTracking={toggleBackgroundTracking}
          userEmail={userEmail}
          userProfile={userProfile}
          visitedList={visitedList}
        />

        {/* Bottom Navigation */}
        <nav className="fixed bottom-6 left-4 right-4 z-50 flex justify-around items-center px-3 py-2 bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl border border-surface-container/50 max-w-md mx-auto">
          <button 
            type="button"
            onClick={() => handleTabClick('explore')}
            className={`flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 transition-all duration-200 outline-none ${activeTab === 'explore' ? 'bg-secondary-container/30 text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high/45'}`}
          >
            <MapIcon size={20} fill={activeTab === 'explore' ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-bold mt-0.5">Explore</span>
          </button>
          <button 
            type="button"
            onClick={() => handleTabClick('social')}
            className={`flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 transition-all duration-200 outline-none ${activeTab === 'social' ? 'bg-secondary-container/30 text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high/45'}`}
          >
            <Users size={20} fill={activeTab === 'social' ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-bold mt-0.5">Social</span>
          </button>
          <button 
            type="button"
            onClick={() => handleTabClick('saved')}
            className={`flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 transition-all duration-200 outline-none ${activeTab === 'saved' ? 'bg-secondary-container/30 text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high/45'}`}
          >
            <Bookmark size={20} fill={activeTab === 'saved' ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-bold mt-0.5">Saved</span>
          </button>
          <Link 
            to="/brewlog"
            className="flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 transition-all duration-200 outline-none text-on-surface-variant hover:bg-surface-container-high/45 active:scale-95"
          >
            <MessageSquare size={20} fill="none" />
            <span className="text-[10px] font-bold mt-0.5">
              {language === 'ru' ? 'Блог' : language === 'ky' ? 'Блог' : 'Brewlog'}
            </span>
          </Link>
          <button 
            type="button"
            onClick={() => handleTabClick('profile')}
            className={`flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 transition-all duration-200 outline-none ${activeTab === 'profile' ? 'bg-secondary-container/30 text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high/45'}`}
          >
            <User size={20} fill={activeTab === 'profile' ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-bold mt-0.5">Profile</span>
          </button>
        </nav>
      </APIProvider>
    </div>
  );
}
