import { ArrowLeft, SlidersHorizontal, Search, Trash2, Wifi, Coffee, Zap, Heart, MapPin, Star } from 'lucide-react';
import { ShopPhoto } from '../components/ShopPhoto';
import { motion } from 'motion/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CITIES, COFFEE_SHOPS } from '../data';

export default function FilterScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Sync local state with search params
  const [radius, setRadius] = useState(parseInt(searchParams.get('radius') || '15'));
  const [wifi, setWifi] = useState(searchParams.get('wifi') === 'true');
  const [outlets, setOutlets] = useState(searchParams.get('outlets') === 'true');
  const [selectedCities, setSelectedCities] = useState<string[]>(() => {
    const cityParam = searchParams.get('city');
    if (cityParam === 'all') return [];
    return cityParam ? cityParam.split(',').filter(Boolean) : ['Bishkek'];
  });
  const [searchFilter, setSearchFilter] = useState(searchParams.get('q') || '');
  
  // Pointed location filter params
  const [plat, setPlat] = useState<string | null>(searchParams.get('plat'));
  const [plng, setPlng] = useState<string | null>(searchParams.get('plng'));
  const [pointedRadius, setPointedRadius] = useState<number>(parseInt(searchParams.get('pradius') || '3'));

  const [favorites, setFavorites] = useState<any[]>(() => {
    const saved = localStorage.getItem('brewmap_saved_spots');
    return saved ? JSON.parse(saved) : COFFEE_SHOPS;
  });
  const [showAllFavorites, setShowAllFavorites] = useState(false);

  const filteredFavorites = favorites.filter(shop => 
    shop.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const toggleFavorite = (shopId: string) => {
    const updated = favorites.filter(shop => shop.id !== shopId);
    setFavorites(updated);
    localStorage.setItem('brewmap_saved_spots', JSON.stringify(updated));
  };

  const getDistanceInKm = (loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }) => {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;
    const lat1 = loc1.lat;
    const lon1 = loc1.lng;
    const lat2 = loc2.lat;
    const lon2 = loc2.lng;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a));
  };

  const matchingShopsCount = (() => {
    if (!plat || !plng) return 0;
    const pLoc = { lat: parseFloat(plat), lng: parseFloat(plng) };
    return COFFEE_SHOPS.filter(shop => {
      const matchSearch = shop.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchFilter.toLowerCase());
      
      const matchCity = selectedCities.length === 0 || 
        selectedCities.some(c => shop.address.toLowerCase().includes(c.toLowerCase()));
      
      const matchWifi = !wifi || !!(shop.wifi && shop.wifi.toLowerCase() !== 'none' && shop.wifi.toLowerCase() !== 'unavailable');
      const matchOutlets = !outlets || shop.outlets !== false;
      
      const dist = getDistanceInKm(pLoc, shop.location);
      const matchPointed = dist <= pointedRadius;

      return matchSearch && matchCity && matchWifi && matchOutlets && matchPointed;
    }).length;
  })();

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchFilter) params.set('q', searchFilter);
    if (selectedCities.length > 0) {
      params.set('city', selectedCities.join(','));
    } else {
      params.set('city', 'all');
    }
    if (wifi) params.set('wifi', 'true');
    if (outlets) params.set('outlets', 'true');
    params.set('radius', radius.toString());
    
    // Save map pointed values if they are active
    if (plat && plng) {
      params.set('plat', plat);
      params.set('plng', plng);
      params.set('pradius', pointedRadius.toString());
    }
    
    setSearchParams(params);
    navigate('/');
  };

  const clearFilters = () => {
    setSearchFilter('');
    setSelectedCities(['Bishkek']);
    setWifi(false);
    setOutlets(false);
    setRadius(15);
    setPlat(null);
    setPlng(null);
    setPointedRadius(3);
    // Instantly navigate back home with no query parameters so everything is clean and cleared!
    navigate('/');
  };

  return (
    <div className="bg-background min-h-screen text-on-background">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-container-margin py-4 bg-surface/90 backdrop-blur-md shadow-sm rounded-b-xl">
        <button 
          onClick={() => navigate(-1)}
          className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors active:scale-95 relative z-10"
          id="btn-back"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2" id="filter-logo">
          <h1 className="font-headline text-2xl text-primary tracking-tighter uppercase font-black">Brewmap</h1>
          <Coffee className="text-brand" size={26} fill="currentColor" />
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="pt-24 pb-32 px-container-margin max-w-2xl mx-auto space-y-6">
        {/* Search */}
        <section>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={20} />
            <input 
              className="w-full pl-12 pr-4 py-4 bg-primary/5 border-none focus:ring-2 focus:ring-primary/20 rounded-xl font-medium transition-all placeholder:text-on-surface-variant/60 outline-none" 
              placeholder="Search coffee shops by name..." 
              type="text" 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </section>

        {/* Grid Filter Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City Selection */}
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm md:col-span-2">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">
              City Selection (Multi-Select)
            </label>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              <button 
                type="button"
                onClick={() => setSelectedCities([])}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 border ${
                  selectedCities.length === 0 
                  ? 'bg-brand text-white border-brand shadow-sm' 
                  : 'bg-surface-variant text-on-surface-variant border-transparent hover:bg-surface-container-high'
                }`}
              >
                All Cities
              </button>
              {CITIES.map((city) => {
                const isSelected = selectedCities.includes(city.name);
                return (
                  <button 
                    key={city.name}
                    type="button"
                    onClick={() => {
                      setSelectedCities(prev => {
                        if (prev.includes(city.name)) {
                          // Filter out
                          return prev.filter(c => c !== city.name);
                        } else {
                          // Clear 'All' (implicit since we select a specific one)
                          return [...prev, city.name];
                        }
                      });
                    }}
                    className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 border ${
                      isSelected 
                      ? 'bg-brand text-white border-brand shadow-sm' 
                      : 'bg-surface-variant text-on-surface-variant border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    {city.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* WiFi Toggle */}
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <Wifi size={20} className={wifi ? 'fill-current' : ''} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Wi-Fi</label>
                <span className="text-xs text-on-surface-variant/80">{wifi ? 'Available' : ''}</span>
              </div>
            </div>
            <button 
              onClick={() => setWifi(!wifi)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${wifi ? 'bg-secondary' : 'bg-outline-variant'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${wifi ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Outlets Toggle */}
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                <Zap size={20} className={outlets ? 'fill-current' : ''} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Outlets</label>
                <span className="text-xs text-on-surface-variant/80">{outlets ? 'Available' : ''}</span>
              </div>
            </div>
            <button 
              onClick={() => setOutlets(!outlets)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${outlets ? 'bg-primary' : 'bg-outline-variant'}`}
              id="toggle-outlets"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${outlets ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Radius Slider */}
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm md:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Search Radius</label>
              <span className="text-xs font-bold text-primary">{radius} km</span>
            </div>
            <div className="py-2 max-w-[200px]">
              <input 
                max="50" min="1" type="range" 
                className="w-full h-[2px] bg-surface-variant dark:bg-[#3e2723] rounded-full appearance-none cursor-pointer accent-brand"
                value={radius} 
                onChange={(e) => setRadius(parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Map Pointer Filter */}
          {plat && plng && (
            <div className="bg-surface-container-low p-4 rounded-xl shadow-sm md:col-span-2 border border-[#a55e2b]/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-[#a55e2b]/10 p-2 rounded-xl text-[#a55e2b]">
                    <Coffee size={16} className="fill-current text-brand" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black font-headline tracking-tight uppercase text-primary">Map Pointer Filter</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium">Custom radius analysis</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPlat(null);
                    setPlng(null);
                  }}
                  className="text-[10px] font-bold text-on-surface-variant/70 hover:text-error hover:bg-error/10 bg-surface-container px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
                >
                  Clear Pointer
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] bg-surface-container-low p-2 rounded-xl border border-outline-variant/10 mb-3">
                <span className="font-medium text-on-surface-variant">Tap center on map:</span>
                <span className="font-mono text-[10px] font-bold text-[#a55e2b] bg-[#a55e2b]/10 px-1.5 py-0.5 rounded-md">
                  {parseFloat(plat).toFixed(4)}, {parseFloat(plng).toFixed(4)}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Radius Range:</span>
                  <span className="text-xs font-black text-primary font-mono">{pointedRadius} km</span>
                </div>
                
                {/* Radius quick-selector pill buttons */}
                <div className="grid grid-cols-4 gap-1.5 bg-surface-container rounded-xl p-1 border border-outline-variant/10">
                  {[1, 2, 3, 5].map((rValue) => (
                    <button
                      key={rValue}
                      type="button"
                      onClick={() => setPointedRadius(rValue)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        pointedRadius === rValue
                          ? 'bg-primary text-on-primary shadow-sm scale-[1.02]'
                          : 'text-on-surface-variant hover:bg-surface-container-high/40'
                      }`}
                    >
                      {rValue} km
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/15 mt-3 font-sans">
                <span className="text-[10px] text-on-surface-variant font-medium">Matching artisanal cafes:</span>
                <span className="text-xs font-black text-open bg-open/15 px-2.5 py-1 rounded-full">
                  {matchingShopsCount} spots
                </span>
              </div>
            </div>
          )}

          {/* Favorites Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-headline text-lg flex items-center gap-2">
                <Heart className="text-destructive fill-destructive" size={20} />
                Favorites
              </h3>
              {filteredFavorites.length > 4 && (
                <button 
                  type="button"
                  onClick={() => setShowAllFavorites(!showAllFavorites)}
                  className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline active:scale-95 transition-all"
                >
                  {showAllFavorites ? 'View Less' : 'View More'}
                </button>
              )}
            </div>
            <div className="grid gap-3">
              {filteredFavorites.length > 0 ? (
                (showAllFavorites ? filteredFavorites : filteredFavorites.slice(0, 4)).map((shop) => (
                  <div key={shop.id} className="bg-surface border border-outline-variant/30 rounded-2xl p-3 flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <ShopPhoto shop={shop} alt={shop.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{shop.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-on-surface-variant mt-1">
                        <div className="flex items-center gap-0.5">
                          <Star size={10} className="fill-yellow-400 text-yellow-400" />
                          <span>{shop.rating}</span>
                        </div>
                        <span className="opacity-40">•</span>
                        <div className="flex items-center gap-0.5">
                          <MapPin size={10} />
                          <span>{shop.address.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => toggleFavorite(shop.id)}
                      className="p-2 text-destructive hover:bg-destructive/5 rounded-full transition-colors active:scale-95"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
                  <p className="text-xs text-on-surface-variant">No shops matching "{searchFilter}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-surface shadow-[0_-4px_12px_rgba(39,19,16,0.06)] px-container-margin py-4 z-50 flex items-center gap-4 rounded-t-xl">
        <button 
          onClick={clearFilters}
          className="flex-1 py-4 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/5 rounded-lg transition-colors active:scale-95"
          id="btn-clear"
        >
          Clear
        </button>
        <button 
          onClick={applyFilters}
          className="flex-[2] py-4 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-lg shadow-md hover:brightness-110 transition-all active:scale-95"
          id="btn-apply"
        >
          Apply Filters
        </button>
      </footer>
    </div>
  );
}
