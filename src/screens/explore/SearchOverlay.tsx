import type { SetURLSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Navigation2, Coffee, RefreshCcw, Loader2, X, Compass, Check, MapPin, Wifi } from 'lucide-react';
import { CITIES } from '../../data';
import { FormEvent } from 'react';
import { statusLabel } from '../../lib/shops';

export interface SearchOverlayProps {
  activeTab: any;
  Boolean: BooleanConstructor;
  Date: DateConstructor;
  filterCities: any;
  filteredShops: any;
  filterNearby: any;
  filterOpenNow: boolean;
  filterOutlets: boolean;
  filterWifi: boolean;
  handleNearby: () => void;
  handleSearchChange: (val: string, immediate?: boolean) => void;
  handleSelectShop: (shop: any) => void;
  isInlineFilterOpen: any;
  isLocating: any;
  isSearching: any;
  localSearchInput: any;
  onSearchSubmit: (e: FormEvent) => void;
  parseInt: (string: string, radix?: number) => number;
  searchParams: URLSearchParams;
  setFilterNearby: any;
  setIsInlineFilterOpen: any;
  setSearchParams: SetURLSearchParams;
  setShowSearchDropdown: any;
  showSearchDropdown: any;
  toggleOpenNow: () => void;
}

export function SearchOverlay(props: SearchOverlayProps) {
  const {
    activeTab,
    Boolean,
    Date,
    filterCities,
    filteredShops,
    filterNearby,
    filterOpenNow,
    filterOutlets,
    filterWifi,
    handleNearby,
    handleSearchChange,
    handleSelectShop,
    isInlineFilterOpen,
    isLocating,
    isSearching,
    localSearchInput,
    onSearchSubmit,
    parseInt,
    searchParams,
    setFilterNearby,
    setIsInlineFilterOpen,
    setSearchParams,
    setShowSearchDropdown,
    showSearchDropdown,
    toggleOpenNow,
  } = props;

  return (
    <>
{activeTab === 'explore' && (() => {
            const activeFiltersCount = [
              filterWifi,
              filterOutlets,
              filterOpenNow,
              filterNearby,
              searchParams.get('radius') !== null,
              filterCities.length > 1 || (filterCities.length === 1 && filterCities[0] !== 'Bishkek' && filterCities[0] !== 'all')
            ].filter(Boolean).length;

            const currentRadiusFilter = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : 15;

            return (
              <div className="absolute top-[88px] left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 space-y-3 pointer-events-none">
                <div className="pointer-events-auto space-y-2">
                  <form 
                    onSubmit={onSearchSubmit}
                    className="bg-surface/95 backdrop-blur-md shadow-xl rounded-2xl flex items-center p-3.5 gap-3 border border-outline-variant/20 transition-all hover:bg-surface focus-within:ring-2 focus-within:ring-primary/20"
                  >
                    <Search size={20} className="text-on-surface-variant/70 flex-shrink-0" />
                    <input
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-on-surface-variant/50 outline-none text-on-surface font-sans"
                      placeholder="Search cafes"
                      type="text"
                      value={localSearchInput}
                      onFocus={() => localSearchInput && setShowSearchDropdown(true)}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {localSearchInput && (
                        <button
                          type="button"
                          onClick={() => handleSearchChange('')}
                          className="text-on-surface-variant/40 hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container"
                          title="Clear search text"
                        >
                          <X size={15} />
                        </button>
                      )}
                      {isSearching && <Loader2 size={16} className="animate-spin text-brand" />}
                      <div className="w-px h-5 bg-outline-variant/20" />
                      
                      {/* Interactive Drawer Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setIsInlineFilterOpen(!isInlineFilterOpen)}
                        className={`relative text-on-surface-variant hover:text-primary transition-all p-2 rounded-xl active:scale-95 ${
                          isInlineFilterOpen 
                            ? 'bg-primary/10 text-primary rotate-90 scale-105' 
                            : 'hover:bg-surface-container'
                        }`}
                        title="Toggle Interactive Filters"
                        id="btn-filter-toggle"
                      >
                        <SlidersHorizontal size={19} />
                        <AnimatePresence>
                          {activeFiltersCount > 0 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute -top-1 -right-1 bg-brand text-white font-extrabold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-md"
                            >
                              {activeFiltersCount}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </form>

                  {/* High Quality Inline Filters Drawer */}
                  <AnimatePresence>
                    {isInlineFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.98 }}
                        className="bg-surface/95 backdrop-blur-md shadow-2xl rounded-2xl border border-outline-variant/30 p-4.5 text-left font-sans space-y-4"
                      >
                        {/* City Fast Selection Row */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Select City Context</span>
                          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                            {CITIES.map((city) => {
                              const isSelected = filterCities.includes(city.name);
                              return (
                                <button
                                  key={city.name}
                                  type="button"
                                  onClick={() => {
                                    const params = new URLSearchParams(searchParams);
                                    let next: string[];
                                    if (isSelected) {
                                      next = filterCities.filter(c => c !== city.name);
                                    } else {
                                      next = [...filterCities.filter(c => c !== 'all'), city.name];
                                    }
                                    if (next.length === 0) {
                                      params.set('city', 'all');
                                    } else {
                                      params.set('city', next.join(','));
                                    }
                                    setSearchParams(params, { replace: true });
                                  }}
                                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 flex items-center gap-1 ${
                                    isSelected
                                      ? 'bg-brand text-white border-brand shadow-sm'
                                      : 'bg-surface text-on-surface-variant border-outline-variant/25 hover:bg-surface-container'
                                  }`}
                                >
                                  <MapPin size={10} />
                                  <span>{city.name}</span>
                                </button>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set('city', 'all');
                                setSearchParams(params, { replace: true });
                              }}
                              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 flex items-center gap-1 ${
                                filterCities.length === 0 || filterCities.includes('all') || filterCities.includes('All Cities')
                                  ? 'bg-brand text-white border-brand shadow-sm'
                                  : 'bg-surface text-on-surface-variant border-outline-variant/25 hover:bg-surface-container'
                              }`}
                            >
                              <Compass size={10} />
                              <span>All Spots</span>
                            </button>
                          </div>
                        </div>

                        {/* Search Radius Slider */}
                        <div className="space-y-1.5 pt-1 border-t border-outline-variant/10">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono flex items-center gap-1">
                              <Compass size={11} className="text-[#a55e2b]" />
                              Search Reach Radius
                            </span>
                            <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{currentRadiusFilter} km</span>
                          </div>
                          <div className="flex items-center gap-3 max-w-[160px]">
                            <span className="text-[10px] font-bold text-on-surface-variant/50">1k</span>
                            <input
                              type="range"
                              min="1"
                              max="30"
                              value={currentRadiusFilter}
                              onChange={(e) => {
                                const params = new URLSearchParams(searchParams);
                                params.set('radius', e.target.value);
                                setSearchParams(params, { replace: true });
                              }}
                              className="flex-1 accent-brand cursor-pointer h-[2px] bg-[#e7e2db] dark:bg-[#3e2723] rounded-full appearance-none"
                            />
                            <span className="text-[10px] font-bold text-on-surface-variant/50">30k</span>
                          </div>
                        </div>

                        {/* Facilities Checklist / Toggles */}
                        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-outline-variant/10">
                          {/* WiFi availability filter */}
                          <button
                            type="button"
                            onClick={() => {
                              const params = new URLSearchParams(searchParams);
                              if (filterWifi) {
                                params.delete('wifi');
                              } else {
                                params.set('wifi', 'true');
                              }
                              setSearchParams(params, { replace: true });
                            }}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-left cursor-pointer transition-all active:scale-95 ${
                              filterWifi 
                                ? 'bg-brand/10 border-brand text-brand font-bold' 
                                : 'bg-surface/50 border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'
                            }`}
                          >
                            <Wifi size={13} />
                            <div className="leading-none">
                              <p className="text-[10.5px]">High-speed Wi-Fi</p>
                              <p className="text-[10px] opacity-75 mt-0.5">{filterWifi ? 'Active' : 'Any Internet'}</p>
                            </div>
                          </button>

                          {/* Power outlets filter */}
                          <button
                            type="button"
                            onClick={() => {
                              const params = new URLSearchParams(searchParams);
                              if (filterOutlets) {
                                params.delete('outlets');
                              } else {
                                params.set('outlets', 'true');
                              }
                              setSearchParams(params, { replace: true });
                            }}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-left cursor-pointer transition-all active:scale-95 ${
                              filterOutlets 
                                ? 'bg-brand/10 border-brand text-brand font-bold' 
                                : 'bg-surface/50 border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'
                            }`}
                          >
                            <Coffee size={13} />
                            <div className="leading-none">
                              <p className="text-[10.5px]">Power Outlets</p>
                              <p className="text-[10px] opacity-75 mt-0.5">{filterOutlets ? 'Available' : 'Any seats'}</p>
                            </div>
                          </button>
                        </div>

                        {/* Action buttons footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/15 mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const params = new URLSearchParams(searchParams);
                              params.delete('wifi');
                              params.delete('outlets');
                              params.delete('open');
                              params.delete('radius');
                              params.set('city', 'Bishkek');
                              setSearchParams(params, { replace: true });
                              setFilterNearby(false);
                            }}
                            className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 hover:text-red-500 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-red-500/5 cursor-pointer"
                          >
                            <RefreshCcw size={11} />
                            Reset filters
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsInlineFilterOpen(false)}
                            className="bg-brand hover:bg-[#5a3f2c] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1 active:scale-95 transition-all text-right"
                          >
                            <Check size={12} />
                            Apply Changes
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showSearchDropdown && filteredShops.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto pointer-events-auto"
                    >
                      {filteredShops.map((shop) => (
                        <button
                          key={shop.id}
                          onClick={() => handleSelectShop(shop)}
                          className="w-full flex items-center gap-4 p-4 hover:bg-surface-container transition-colors text-left border-b border-outline-variant/10 last:border-0"
                        >
                          <div className="bg-primary-container p-2 rounded-lg text-primary">
                            <Coffee size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-on-surface truncate">{shop.name}</p>
                            <p className="text-[10px] text-on-surface-variant truncate">{shop.address || 'Local Coffee Shop'}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            {shop.rating && (
                              <div className="flex items-center gap-0.5 text-xs font-bold text-primary">
                                <span>{shop.rating}</span>
                                <span className="text-[10px]">⭐</span>
                              </div>
                            )}
                            {(() => {
                              const currentHour = new Date().getHours();
                              const isOpen = (shop.openingHour !== undefined && shop.closingHour !== undefined)
                                ? (currentHour >= shop.openingHour && currentHour < shop.closingHour)
                                : shop.status === 'Open Now';
                              
                              return (
                                <span className={`text-[10px] font-medium ${isOpen ? 'text-secondary' : 'text-on-surface-variant/40'}`}>
                                  {statusLabel(isOpen, shop.status, 'Open')}
                                </span>
                              );
                            })()}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!localSearchInput && (
                  <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar pointer-events-auto">
                    <button
                      onClick={handleNearby}
                      disabled={isLocating}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full font-semibold text-xs border transition-colors flex items-center gap-1.5 active:scale-95 disabled:opacity-75 ${filterNearby
                        ? 'bg-primary text-on-primary border-primary hover:brightness-110'
                        : 'bg-surface/80 backdrop-blur-md text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                        }`}
                    >
                      {isLocating ? (
                        <Loader2 size={12} className="animate-spin text-primary" />
                      ) : (
                        <Navigation2 size={12} className="fill-current" />
                      )}
                      {isLocating ? 'Locating...' : 'Nearby'}
                    </button>
                    <button
                      onClick={toggleOpenNow}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full font-semibold text-xs border transition-colors flex items-center gap-1.5 active:scale-95 ${filterOpenNow
                        ? 'bg-primary text-on-primary border-primary hover:brightness-110'
                        : 'bg-surface/80 backdrop-blur-md text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                        }`}
                    >
                      Open now
                    </button>

                    {/* Active Selected City Filter Chips */}
                    {filterCities.map(cityName => (
                      <button
                        key={cityName}
                        onClick={() => {
                          const updated = filterCities.filter(c => c !== cityName);
                          const params = new URLSearchParams(searchParams);
                          if (updated.length > 0) {
                            params.set('city', updated.join(','));
                          } else {
                            params.set('city', 'all');
                          }
                          setSearchParams(params);
                        }}
                        className="flex-shrink-0 px-4 py-1.5 rounded-full font-semibold text-xs border transition-colors flex items-center gap-1.5 active:scale-95 bg-secondary text-white border-secondary hover:brightness-110"
                      >
                        <MapPin size={12} fill="currentColor" />
                        <span>{cityName}</span>
                        <span className="text-[10px] opacity-75 ml-0.5 font-bold">×</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
    </>
  );
}
