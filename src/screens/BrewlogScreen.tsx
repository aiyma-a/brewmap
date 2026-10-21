import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  BookOpen, 
  Star, 
  User, 
  Clock, 
  ChevronRight, 
  PenLine, 
  Coffee, 
  Menu, 
  X, 
  UserPlus, 
  PlusCircle, 
  Settings, 
  Moon, 
  Sun, 
  Globe,
  Info,
  Map as MapIcon,
  Users,
  Bookmark
} from 'lucide-react';
import { COFFEE_SHOPS } from '../data';
import { translations, getLanguage, setLanguage, getThemeMode, setThemeMode, Language } from '../lib/i18n';

const getRatingLabel = (val: number): string => {
  if (val <= 1.5) return "Pod";
  if (val <= 2.5) return "Drip";
  if (val <= 3.5) return "Medium";
  if (val <= 4.5) return "Pour-Over";
  return "Ristretto";
};

const CUSTOM_VECTOR_AVATARS = [
  { id: 'vec_espresso', name: 'Espresso', bg: 'bg-[#4B3621]', text: 'text-white' },
  { id: 'vec_latte', name: 'Latte', bg: 'bg-[#C2B280]', text: 'text-[#4B3621]' },
  { id: 'vec_mocha', name: 'Mocha', bg: 'bg-brand', text: 'text-white' },
  { id: 'vec_caramel', name: 'Caramel', bg: 'bg-[#C68E17]', text: 'text-white' },
  { id: 'vec_cream', name: 'Cream', bg: 'bg-[#F5F5DC]', text: 'text-brand' },
  { id: 'vec_black', name: 'Black', bg: 'bg-[#1A1A1A]', text: 'text-white' }
];

const STATIC_REVIEWS = [
  {
    id: 1,
    user: 'Alex Rivera',
    avatar: `${import.meta.env.BASE_URL}images/4eba7fa13f.jpg`,
    shopName: 'Sierra Roasters',
    rating: 5,
    comment: 'The v60 here is unmatched. Perfectly balanced fruity notes and excellent service.',
    time: '2h ago'
  },
  {
    id: 2,
    user: 'Sarah Chen',
    avatar: `${import.meta.env.BASE_URL}images/c5e750cf91.jpg`,
    shopName: 'Brew Haven',
    rating: 4.5,
    comment: 'Great atmosphere for working. The espresso is bold but smooth.',
    time: '5h ago'
  },
  {
    id: 3,
    user: 'Damir Begaliev',
    avatar: `${import.meta.env.BASE_URL}images/d85d39bb13.jpg`,
    shopName: 'Urban Coffee',
    rating: 4,
    comment: 'Best pastries in Bishkek! A bit crowded on weekends though.',
    time: 'Yesterday'
  }
];

const ARTICLES = [
  {
    id: 1,
    title: 'The Art of Light Roasting',
    author: 'Sierra Roasters',
    excerpt: 'Discover why we favor light roasts to bring out the unique terroir of our Central American beans...',
    image: `${import.meta.env.BASE_URL}images/cf27a0d8e8.jpg`,
    readTime: '5 min read',
    date: 'May 15, 2026'
  },
  {
    id: 2,
    title: 'Sustainable Sourcing in Tokmok',
    author: 'Eco Brew',
    excerpt: 'Our journey to find the most ethical farms in the region and how it impacts your daily cup...',
    image: `${import.meta.env.BASE_URL}images/d1617cace2.jpg`,
    readTime: '8 min read',
    date: 'May 12, 2026'
  },
  {
    id: 3,
    title: 'Espresso Machine Maintenance 101',
    author: 'Brew Haven',
    excerpt: 'Keep your shots consistent with these daily and weekly maintenance tips for your home setup...',
    image: `${import.meta.env.BASE_URL}images/da22111e81.jpg`,
    readTime: '4 min read',
    date: 'May 10, 2026'
  }
];

export default function BrewlogScreen() {
  const navigate = useNavigate();
  const handleTabClick = (tab: 'explore' | 'social' | 'saved' | 'profile') => {
    localStorage.setItem('brewmap_active_tab', tab);
    navigate('/');
  };
  const [activeTab, setActiveTab] = useState<'reviews' | 'articles'>('reviews');
  
  // Custom Reviews and Articles state
  const [customReviewsList, setCustomReviewsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('brewmap_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [customArticlesList, setCustomArticlesList] = useState<any[]>(() => {
    const saved = localStorage.getItem('brewmap_articles');
    return saved ? JSON.parse(saved) : [];
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'settings'>('main');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [language, setLanguageState] = useState<Language>(getLanguage);
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(getThemeMode);

  // Modal and custom article/review creation states
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'review' | 'article'>('review');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('brewmap_user_profile');
    return saved ? JSON.parse(saved) : { 
      name: 'Aydana Temirova', 
      username: 'aydana_brews', 
      avatar: 'vector:Espresso', 
      bio: 'Specialty coffee connoisseur / Manual brew fanatic',
      favoriteSpot: 'Bishkek Coffee Roasters',
      favoriteCoffeeType: 'Espresso'
    };
  });

  // Sync profile from localstorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('brewmap_user_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // State for Review Form
  const [newReviewShopId, setNewReviewShopId] = useState(COFFEE_SHOPS[0]?.id || 'custom');
  const [newReviewCustomShopName, setNewReviewCustomShopName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewHoverRating, setNewReviewHoverRating] = useState<number | null>(null);
  const [newReviewComment, setNewReviewComment] = useState('');

  // State for Article Form
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleExcerpt, setNewArticleExcerpt] = useState('');
  const [newArticleReadTime, setNewArticleReadTime] = useState('5 min read');
  const [newArticleImage, setNewArticleImage] = useState(`${import.meta.env.BASE_URL}images/d67e8215db.jpg`);

  const ARTICLE_IMAGE_PRESETS = [
    { url: `${import.meta.env.BASE_URL}images/d67e8215db.jpg`, label: 'Latte Art' },
    { url: `${import.meta.env.BASE_URL}images/5d5ba533d7.jpg`, label: 'Cozy Cafe' },
    { url: `${import.meta.env.BASE_URL}images/8c6a5473a0.jpg`, label: 'Coffee Beans' },
    { url: `${import.meta.env.BASE_URL}images/f171734371.jpg`, label: 'Pour-Over' }
  ];
  
  const [bgLocationTracking, setBgLocationTracking] = useState<boolean>(() => {
    return localStorage.getItem('brewspot_bg_location_tracking') === 'true';
  });

  const toggleBackgroundTracking = () => {
    const nextVal = !bgLocationTracking;
    setBgLocationTracking(nextVal);
    localStorage.setItem('brewspot_bg_location_tracking', String(nextVal));
  };

  const t = useMemo(() => translations[language], [language]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setLanguageState(newLang);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setThemeMode(newTheme);
    setThemeModeState(newTheme);
  };

  // Sync theme and language on events
  useEffect(() => {
    const handleTheme = () => setThemeModeState(getThemeMode());
    const handleLang = () => setLanguageState(getLanguage());
    window.addEventListener('theme_changed', handleTheme);
    window.addEventListener('language_changed', handleLang);
    return () => {
      window.removeEventListener('theme_changed', handleTheme);
      window.removeEventListener('language_changed', handleLang);
    };
  }, []);

  const handleAddArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle.trim() || !newArticleExcerpt.trim()) {
      setToastMessage("Please fill in title and story details!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const newArticle = {
      id: `art_${Date.now()}`,
      title: newArticleTitle,
      author: userProfile.name,
      excerpt: newArticleExcerpt,
      image: newArticleImage,
      readTime: newArticleReadTime || '5 min read',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [newArticle, ...customArticlesList];
    setCustomArticlesList(updated);
    localStorage.setItem('brewmap_articles', JSON.stringify(updated));

    // Reset fields
    setNewArticleTitle('');
    setNewArticleExcerpt('');
    setNewArticleReadTime('5 min read');
    setShowAddModal(false);

    setToastMessage("Article published successfully! ☕✨");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) {
      setToastMessage("Please enter review comments!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    let shopNameSelected = 'Custom Cafe';
    if (newReviewShopId === 'custom') {
      shopNameSelected = newReviewCustomShopName || 'Local Coffee Spot';
    } else {
      const found = COFFEE_SHOPS.find(s => s.id === newReviewShopId);
      if (found) shopNameSelected = found.name;
    }

    const newRev = {
      id: `rev_${Date.now()}`,
      shopId: newReviewShopId === 'custom' ? `custom_${Date.now()}` : newReviewShopId,
      shopName: shopNameSelected,
      user: userProfile.name,
      avatar: userProfile.avatar,
      rating: newReviewRating,
      comment: newReviewComment,
      time: 'Just now'
    };

    const updated = [newRev, ...customReviewsList];
    setCustomReviewsList(updated);
    localStorage.setItem('brewmap_reviews', JSON.stringify(updated));

    // Reset fields
    setNewReviewComment('');
    setNewReviewCustomShopName('');
    setNewReviewRating(5);
    setShowAddModal(false);

    setToastMessage("Brewlog review added successfully! ☕✨");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const allReviews = useMemo(() => {
    return [...customReviewsList, ...STATIC_REVIEWS];
  }, [customReviewsList]);

  const allArticles = useMemo(() => {
    return [...customArticlesList, ...ARTICLES];
  }, [customArticlesList]);

  return (
    <div className="bg-background min-h-screen pb-48">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-6 py-4 bg-surface/90 backdrop-blur-md shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors active:scale-95 relative z-10"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
          <h1 className="font-headline text-2xl text-primary tracking-tighter uppercase font-black">Brewmap</h1>
          <Coffee className="text-brand" size={26} fill="currentColor" />
        </div>

        <div className="flex items-center gap-1.5 relative z-20">
          <button 
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setMenuView('main');
            }}
            className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors active:scale-95"
            id="btn-menu-brewlog"
            title="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute right-0 top-full mt-4 w-72 bg-surface rounded-2xl shadow-2xl border border-outline-variant overflow-hidden z-50 origin-top-right font-sans"
              >
                {menuView === 'main' ? (
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 bg-surface-container rounded-xl transition-colors text-left group"
                    >
                      <div className="bg-tertiary-container/50 p-2 rounded-lg group-hover:bg-tertiary transition-colors">
                        <MessageSquare size={18} className="text-tertiary group-hover:text-on-tertiary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Brewlog & Articles</p>
                        <p className="text-[10px] text-on-surface-variant">Currently viewing</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setMenuView('settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container rounded-xl transition-colors text-left group"
                    >
                      <div className="bg-surface-container-high p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                        <Settings size={18} className="text-on-surface-variant group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{t.settingsTitle}</p>
                        <p className="text-[10px] text-on-surface-variant">Language, theme & options</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 space-y-3.5">
                    <button 
                      onClick={() => setMenuView('main')}
                      className="flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg w-full text-left"
                    >
                      <span>&larr;</span> Back to Menu
                    </button>
                    
                    {/* Theme Toggle option */}
                    <div className="space-y-1.5 pt-1 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                        {themeMode === 'dark' ? <Moon size={14} className="text-primary" /> : <Sun size={14} className="text-[#a55e2b]" />}
                        <span>{t.modeLabel}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 bg-surface-container rounded-xl p-0.5 border border-outline-variant/15">
                        <button
                          onClick={() => handleThemeChange('light')}
                          className={`py-1 rounded-lg text-[9px] font-bold transition-all ${themeMode === 'light' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high/40'}`}
                        >
                          Light
                        </button>
                        <button
                          onClick={() => handleThemeChange('dark')}
                          className={`py-1 rounded-lg text-[9px] font-bold transition-all ${themeMode === 'dark' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high/40'}`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>

                    {/* Language Selection option */}
                    <div className="space-y-1.5 border-t border-outline-variant/20 pt-2.5 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                        <Globe size={14} className="text-open" />
                        <span>{t.langLabel}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 bg-surface-container rounded-xl p-0.5 border border-outline-variant/15">
                        <button
                          onClick={() => handleLanguageChange('en')}
                          className={`py-1 rounded-lg text-[9px] font-bold transition-all ${language === 'en' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high/40'}`}
                        >
                          EN
                        </button>
                        <button
                          onClick={() => handleLanguageChange('ru')}
                          className={`py-1 rounded-lg text-[9px] font-bold transition-all ${language === 'ru' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high/40'}`}
                        >
                          РУ
                        </button>
                        <button
                          onClick={() => handleLanguageChange('ky')}
                          className={`py-1 rounded-lg text-[9px] font-bold transition-all ${language === 'ky' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high/40'}`}
                        >
                          КЫР
                        </button>
                      </div>
                    </div>

                    {/* Background location tracking switch */}
                    <div className="flex items-center justify-between border-t border-outline-variant/20 pt-2.5 text-left">
                      <span className="text-xs font-bold text-on-surface pr-1">{t.backgroundTracking}</span>
                      <button
                        type="button"
                        onClick={toggleBackgroundTracking}
                        className={`w-8 h-4.5 rounded-full p-0.5 flex-shrink-0 transition-colors duration-200 outline-none ${bgLocationTracking ? 'bg-open' : 'bg-outline-variant'}`}
                      >
                        <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform duration-200 ${bgLocationTracking ? 'translate-x-3.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-surface-container p-2.5 rounded-xl border border-outline-variant/15 flex items-start gap-2 shadow-soft text-left">
                      <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-[9px] text-on-surface-variant leading-relaxed">
                        Adjusting settings will instantly update all screens in real-time.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="pt-24 px-container-margin max-w-2xl mx-auto">
        {/* Tabs and Add CTA Group Inline */}
        <div className="flex items-center gap-3 mb-6">
          {/* Tabs */}
          <div className="flex-1 flex p-1 bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'reviews' 
                ? 'bg-surface shadow-sm text-primary font-black' 
                : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <MessageSquare size={15} />
              Brewlog
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'articles' 
                ? 'bg-surface shadow-sm text-primary font-black' 
                : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <BookOpen size={15} />
              Articles
            </button>
          </div>

          {/* Inline Action CTA */}
          <button
            onClick={() => {
              setModalType(activeTab === 'reviews' ? 'review' : 'article');
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-3 bg-[#a55e2b] hover:bg-[#8b4f24] text-white text-[11px] font-black rounded-2xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer border border-white/5 shrink-0"
          >
            <PenLine size={12} />
            <span>{activeTab === 'reviews' ? 'Add' : 'Add'}</span>
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'reviews' ? (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {allReviews.map((review) => (
                <div key={review.id} className="bg-surface rounded-2xl p-5 shadow-soft border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center shrink-0 border border-outline-variant/30 shadow-sm">
                        {(() => {
                          let matched = CUSTOM_VECTOR_AVATARS[0];
                          if (review.avatar && review.avatar.startsWith('vector:')) {
                            const name = review.avatar.substring(7);
                            matched = CUSTOM_VECTOR_AVATARS.find(v => v.name === name) || CUSTOM_VECTOR_AVATARS[0];
                          } else if (review.avatar) {
                            const seed = typeof review.avatar === 'string' ? review.avatar.length : 0;
                            matched = CUSTOM_VECTOR_AVATARS[seed % CUSTOM_VECTOR_AVATARS.length];
                          }
                          return (
                            <div className={`w-full h-full flex items-center justify-center ${matched.bg} ${matched.text}`}>
                              <Coffee size={18} fill="currentColor" />
                            </div>
                          );
                        })()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface">{review.user}</h4>
                        <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          <Clock size={10} />
                          {review.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary-container/30 px-2.5 py-1 rounded-lg">
                      <Star size={11} className="fill-secondary text-secondary" />
                      <span className="text-xs font-bold text-secondary">{review.rating.toFixed(1)} - {getRatingLabel(review.rating)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs font-bold text-primary mb-1 flex items-center gap-1">
                      <Coffee size={12} />
                      {review.shopName}
                    </p>
                    <p className="text-sm text-on-surface-variant leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="articles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6"
            >
              {allArticles.map((article) => (
                <div key={article.id} className="bg-surface rounded-2xl overflow-hidden shadow-soft border border-outline-variant/20 hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/95 backdrop-blur-md text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        {article.id.toString().startsWith('art_') ? 'User Post' : 'Partner Story'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-[#a55e2b] uppercase tracking-widest font-mono">{article.author}</p>
                      <p className="text-[10px] text-on-surface-variant font-mono">{article.date}</p>
                    </div>
                    <h3 className="font-headline text-lg text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                      <span className="text-[10px] text-on-surface-variant flex items-center gap-1 italic">
                        {article.readTime}
                      </span>
                      <button className="text-primary flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all">
                        Read Story
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 flex justify-around items-center px-3 py-2 bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl border border-surface-container/50 max-w-md mx-auto">
        <button 
          type="button"
          onClick={() => handleTabClick('explore')}
          className="flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 transition-all duration-200 outline-none text-on-surface-variant hover:bg-surface-container-high/45 active:scale-95"
        >
          <MapIcon size={20} fill="none" />
          <span className="text-[10px] font-bold mt-0.5">Explore</span>
        </button>
        <button 
          type="button"
          onClick={() => handleTabClick('social')}
          className="flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 transition-all duration-200 outline-none text-on-surface-variant hover:bg-surface-container-high/45 active:scale-95"
        >
          <Users size={20} fill="none" />
          <span className="text-[10px] font-bold mt-0.5">Social</span>
        </button>
        <button 
          type="button"
          onClick={() => handleTabClick('saved')}
          className="flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 transition-all duration-200 outline-none text-on-surface-variant hover:bg-surface-container-high/45 active:scale-95"
        >
          <Bookmark size={20} fill="none" />
          <span className="text-[10px] font-bold mt-0.5">Saved</span>
        </button>
        <Link 
          to="/brewlog"
          className="flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 transition-all duration-200 outline-none bg-secondary-container/30 text-on-secondary-container"
        >
          <MessageSquare size={20} fill="currentColor" />
          <span className="text-[10px] font-bold mt-0.5">
            {language === 'ru' ? 'Блог' : language === 'ky' ? 'Блог' : 'Brewlog'}
          </span>
        </Link>
        <button 
          type="button"
          onClick={() => handleTabClick('profile')}
          className="flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 transition-all duration-200 outline-none text-on-surface-variant hover:bg-surface-container-high/45 active:scale-95"
        >
          <User size={20} fill="none" />
          <span className="text-[10px] font-bold mt-0.5">Profile</span>
        </button>
      </nav>

      {/* Elegant Write/Publish Sheet Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            key="add-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4 font-sans"
          >
            <motion.div
              key="add-modal-container"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface text-on-surface rounded-3xl w-full max-w-md p-6 border border-outline-variant/25 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-all"
                type="button"
              >
                <X size={15} />
              </button>

              <div className="flex items-center gap-2 border-b border-outline-variant/15 pb-3 mb-4.5">
                <Coffee size={16} className="text-[#a55e2b]" />
                <h3 className="font-headline font-semibold text-primary text-sm uppercase tracking-wider">
                  {modalType === 'review' ? 'Add Brewlog Entry' : 'Publish Article'}
                </h3>
              </div>

              {modalType === 'review' ? (
                <form onSubmit={handleAddReviewSubmit} className="space-y-4 text-left">
                  {/* Shop selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-brand tracking-wider font-mono">Select Coffee Shop</label>
                    <select
                      value={newReviewShopId}
                      onChange={(e) => setNewReviewShopId(e.target.value)}
                      className="w-full text-xs bg-surface-container rounded-xl p-3 border border-outline-variant/30 outline-none focus:ring-1 focus:ring-[#a55e2b]/50 cursor-pointer"
                    >
                      {COFFEE_SHOPS.map((shop) => (
                        <option key={shop.id} value={shop.id}>{shop.name}</option>
                      ))}
                      <option value="custom">-- Custom/Other Coffee Shop --</option>
                    </select>
                  </div>

                  {newReviewShopId === 'custom' && (
                    <div className="space-y-1 animate-fade-in">
                      <label className="text-[10px] uppercase font-bold text-brand tracking-wider font-mono">Custom Shop Name</label>
                      <input
                        type="text"
                        placeholder="Enter the custom coffee shop name..."
                        required
                        value={newReviewCustomShopName}
                        onChange={(e) => setNewReviewCustomShopName(e.target.value)}
                        className="w-full text-xs bg-surface-container rounded-xl p-3 border border-outline-variant/30 outline-none focus:ring-1 focus:ring-[#a55e2b]/50"
                      />
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div className="space-y-1 flex flex-col items-center py-3 px-1 bg-surface-container/30 rounded-2xl border border-outline-variant/10">
                    <span className="text-[10px] uppercase font-bold text-brand tracking-wider font-mono mb-1.5">Rating Rating</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setNewReviewHoverRating(star)}
                          onMouseLeave={() => setNewReviewHoverRating(null)}
                          onClick={() => setNewReviewRating(star)}
                          className="text-2xl transition-transform hover:scale-115 active:scale-95 cursor-pointer"
                        >
                          <Star
                            size={22}
                            className={`${
                              star <= (newReviewHoverRating ?? newReviewRating)
                                ? 'fill-[#a55e2b] text-[#a55e2b]'
                                : 'text-outline-variant/40'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[9px] font-extrabold text-brand bg-brand/10 px-2.5 py-0.5 rounded-full font-mono tracking-wider uppercase mt-2">
                       {getRatingLabel(newReviewRating)} ({newReviewRating.toFixed(1)})
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-brand tracking-wider font-mono">Drip Notes & Coffee Experience</label>
                    <textarea
                      placeholder="Comment on flavor profiles, espresso machine calibration, wifi speed, working environment, or cozy vibes..."
                      required
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full text-xs bg-surface-container rounded-xl p-3 border border-outline-variant/30 min-h-[90px] outline-none focus:ring-1 focus:ring-[#a55e2b]/50 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container hover:bg-surface-container-high transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#a55e2b] text-white hover:brightness-110 shadow-md transition-all font-mono"
                    >
                      Post Brewlog
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddArticleSubmit} className="space-y-4 text-left">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-brand tracking-wider font-mono">Article Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Navigating Light Roasts in Tokmok"
                      required
                      value={newArticleTitle}
                      onChange={(e) => setNewArticleTitle(e.target.value)}
                      className="w-full text-xs bg-surface-container rounded-xl p-3 border border-outline-variant/30 outline-none focus:ring-1 focus:ring-[#a55e2b]/50"
                    />
                  </div>

                  {/* Read Time */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-brand tracking-wider font-mono">Read time</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 min read"
                      value={newArticleReadTime}
                      onChange={(e) => setNewArticleReadTime(e.target.value)}
                      className="w-full text-xs bg-surface-container rounded-xl p-3 border border-outline-variant/30 outline-none focus:ring-1 focus:ring-[#a55e2b]/50"
                    />
                  </div>

                  {/* Cover Image Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand tracking-wider font-mono block">Cover Graphic</label>
                    <div className="grid grid-cols-4 gap-2">
                      {ARTICLE_IMAGE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewArticleImage(preset.url)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            newArticleImage === preset.url ? 'border-[#a55e2b] scale-[1.03] shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Excerpt Content */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-brand tracking-wider font-mono">Full Article Story</label>
                    <textarea
                      placeholder="Share your technical barista instructions, light roast reviews, or brewing guides with the community..."
                      required
                      value={newArticleExcerpt}
                      onChange={(e) => setNewArticleExcerpt(e.target.value)}
                      className="w-full text-xs bg-surface-container rounded-xl p-3 border border-outline-variant/30 min-h-[140px] outline-none focus:ring-1 focus:ring-[#a55e2b]/50 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container hover:bg-surface-container-high transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#a55e2b] text-white hover:brightness-110 shadow-md transition-all font-mono"
                    >
                      Publish Article
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Toast Dialog */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -40, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[100] bg-secondary text-white px-5 py-3 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 border border-white/10 font-mono"
          >
            <Coffee size={14} className="animate-bounce" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            key="brewlog-settings-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4 font-sans"
          >
            <motion.div
              key="brewlog-settings-modal-content"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-surface text-on-surface rounded-3xl w-full max-w-sm p-6 border border-outline-variant/20 shadow-2xl relative max-h-[85vh] overflow-y-auto animate-fade-in"
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
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all ${themeMode === 'light' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                      {t.modeLight ? t.modeLight.split(' ')[0] : 'Light'}
                    </button>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all ${themeMode === 'dark' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
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
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${language === 'en' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => handleLanguageChange('ru')}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${language === 'ru' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                      РУ
                    </button>
                    <button
                      onClick={() => handleLanguageChange('ky')}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${language === 'ky' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                      КЫР
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/15 flex items-start gap-2.5 shadow-soft text-left">
                <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-on-surface">{t.appSettings || 'App Settings'}</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                    Custom roaster maps, friend sharing, and theme settings are loaded. Access from any screen!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full mt-4 bg-primary text-on-primary py-2.5 rounded-xl font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                Close Settings
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
