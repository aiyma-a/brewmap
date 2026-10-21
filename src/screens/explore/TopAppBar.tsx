import type { SavedBlend } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Coffee, Loader2, Menu, X, Settings, Compass, PenLine, Check, Moon, Sun, Globe, ArrowLeft, Layers, Palette } from 'lucide-react';
import { Map } from '@vis.gl/react-google-maps';
import { Language } from '../../lib/i18n';

export interface TopAppBarProps {
  activeTab: any;
  bgLocationTracking: any;
  draftLandscapeColor: any;
  draftParkColor: any;
  draftRoadColor: any;
  draftShowFriends: any;
  draftShowRadius: any;
  draftShowShopNames: any;
  draftStyleId: any;
  draftWaterColor: any;
  handleCreateNewBlend: (e: any) => void;
  handleDeleteSavedBlend: (blendId: string, e: any) => void;
  handleLanguageChange: (newLanguage: Language) => void;
  handleSaveSettings: () => void;
  handleSelectSavedBlend: (blend: SavedBlend) => void;
  handleTabClick: (tab: "explore" | "social" | "saved" | "profile") => void;
  handleThemeChange: (newTheme: "light" | "dark") => void;
  isMenuOpen: any;
  isSaving: any;
  language: any;
  menuView: any;
  newBlendName: any;
  savedBlends: any;
  saveSuccess: any;
  setDraftLandscapeColor: any;
  setDraftParkColor: any;
  setDraftRoadColor: any;
  setDraftShowFriends: any;
  setDraftShowRadius: any;
  setDraftShowShopNames: any;
  setDraftStyleId: any;
  setDraftWaterColor: any;
  setIsMenuOpen: any;
  setMenuView: any;
  setNewBlendName: any;
  setShowSaveBlendForm: any;
  setShowSettingsModal: any;
  showSaveBlendForm: any;
  t: any;
  themeMode: any;
  toggleBackgroundTracking: () => void;
}

export function TopAppBar(props: TopAppBarProps) {
  const {
    activeTab,
    bgLocationTracking,
    draftLandscapeColor,
    draftParkColor,
    draftRoadColor,
    draftShowFriends,
    draftShowRadius,
    draftShowShopNames,
    draftStyleId,
    draftWaterColor,
    handleCreateNewBlend,
    handleDeleteSavedBlend,
    handleLanguageChange,
    handleSaveSettings,
    handleSelectSavedBlend,
    handleTabClick,
    handleThemeChange,
    isMenuOpen,
    isSaving,
    language,
    menuView,
    newBlendName,
    savedBlends,
    saveSuccess,
    setDraftLandscapeColor,
    setDraftParkColor,
    setDraftRoadColor,
    setDraftShowFriends,
    setDraftShowRadius,
    setDraftShowShopNames,
    setDraftStyleId,
    setDraftWaterColor,
    setIsMenuOpen,
    setMenuView,
    setNewBlendName,
    setShowSaveBlendForm,
    setShowSettingsModal,
    showSaveBlendForm,
    t,
    themeMode,
    toggleBackgroundTracking,
  } = props;

  return (
    <>
{(activeTab === 'explore' || activeTab === 'saved' || activeTab === 'social' || activeTab === 'profile') && (
          <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-6 py-4 bg-surface/90 backdrop-blur-md rounded-b-xl shadow-sm">
            <div className="w-10 flex items-center justify-start z-10">
              {activeTab !== 'explore' && (
                <button
                  type="button"
                  onClick={() => handleTabClick('explore')}
                  className="p-1.5 -ml-1 rounded-full hover:bg-surface-container active:scale-95 transition-all text-primary flex items-center justify-center cursor-pointer"
                  aria-label="Back to explore"
                >
                  <ArrowLeft size={22} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2" id="app-logo">
              <h1 className="font-headline text-2xl text-primary tracking-tighter uppercase font-black leading-none">Brewmap</h1>
              <Coffee className="text-brand" size={24} fill="currentColor" />
            </div>

            <div className="flex items-center gap-1.5">
              {/* General menu button */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    setMenuView('main');
                  }}
                  className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors active:scale-95"
                  id="btn-menu"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-72 bg-surface rounded-2xl shadow-2xl border border-outline-variant overflow-hidden z-[200] origin-top-right font-sans flex flex-col max-h-[calc(100vh-140px)] md:max-h-[75vh]"
                    >
                      {menuView === 'main' && (
                        <div className="p-2 space-y-1 overflow-y-auto flex-1">
                          {/* Map Customizer option inside Main Menu */}
                          <button 
                            onClick={() => {
                              setMenuView('customizer');
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container rounded-xl transition-colors text-left group"
                          >
                            <div className="bg-surface-container-high p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                              <Layers size={18} className="text-on-surface-variant group-hover:text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-on-surface">Map Customizer</p>
                              <p className="text-[10px] text-on-surface-variant">Themes, circles & radius overlay</p>
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

                          <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-on-surface-variant">
                            <a href={`${import.meta.env.BASE_URL}privacy.html`} target="_blank" rel="noopener" className="underline hover:text-brand">{t.privacyPolicy}</a>
                            <span aria-hidden="true">·</span>
                            <a href={`${import.meta.env.BASE_URL}terms.html`} target="_blank" rel="noopener" className="underline hover:text-brand">{t.termsOfService}</a>
                          </div>
                        </div>
                      )}

                      {menuView === 'settings' && (
                        <div className="p-3 space-y-3.5 overflow-y-auto flex-1 pb-4">
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
                                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${themeMode === 'light' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high/40'}`}
                              >
                                Light
                              </button>
                              <button
                                onClick={() => handleThemeChange('dark')}
                                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${themeMode === 'dark' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high/40'}`}
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
                                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${language === 'en' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high/40'}`}
                              >
                                EN
                              </button>
                              <button
                                onClick={() => handleLanguageChange('ru')}
                                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${language === 'ru' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high/40'}`}
                              >
                                РУ
                              </button>
                              <button
                                onClick={() => handleLanguageChange('ky')}
                                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${language === 'ky' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high/40'}`}
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
                              role="switch"
                              aria-checked={bgLocationTracking}
                              aria-label={t.backgroundTracking}
                              className={`w-8 h-4.5 rounded-full p-0.5 flex-shrink-0 transition-colors duration-200 outline-none ${bgLocationTracking ? 'bg-open' : 'bg-outline-variant'}`}
                            >
                              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform duration-200 ${bgLocationTracking ? 'translate-x-3.5' : 'translate-x-0'}`} />
                            </button>
                          </div>

                          {/* Button to open account & privacy sub-modal (if any other detailed item is needed) */}
                          <div className="border-t border-outline-variant/20 pt-2.5 flex flex-col gap-1.5">
                            <button 
                              onClick={() => {
                                setIsMenuOpen(false);
                                setShowSettingsModal(true);
                              }}
                              className="w-full text-center text-[10px] font-bold text-primary hover:underline bg-primary/5 py-1.5 rounded-lg"
                            >
                              Account, Security & Legal &rarr;
                            </button>
                          </div>
                        </div>
                      )}

                      {menuView === 'customizer' && (
                        <div className="p-3 space-y-3.5 overflow-y-auto flex-1 pb-4">
                          <button 
                            onClick={() => setMenuView('main')}
                            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg w-full text-left cursor-pointer"
                          >
                            <span>&larr;</span> Back to Menu
                          </button>

                          {/* Map Style Selector */}
                          <div className="space-y-2 mb-4 text-left">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Thematic Presets</span>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: 'earthy', name: 'Matcha Cream', colorBg: 'bg-[#faf8f5] border-[#d2e5ca]', indicator: 'bg-[#7a5a4a]', text: 'text-[#7a5a4a]' },
                                { id: 'nordic', name: 'Pistachio Mint', colorBg: 'bg-[#f5faf6] border-[#b6dbc3]', indicator: 'bg-[#134421]', text: 'text-[#1b321e]' },
                                { id: 'espresso', name: 'Rich Espresso', colorBg: 'bg-[#1d120f] border-[#192d1c]', indicator: 'bg-[#dfcab5]', text: 'text-[#eedece]' },
                                { id: 'retro', name: 'Vintage Mocha', colorBg: 'bg-[#fffdf5] border-[#ccd9b3]', indicator: 'bg-[#8b4513]', text: 'text-[#4e3629]' },
                                { id: 'custom', name: 'Custom Blend ⚙️', colorBg: 'bg-surface-container border-outline', indicator: 'bg-brand', text: 'text-brand' },
                              ].map(style => (
                                <button
                                  key={style.id}
                                  onClick={() => setDraftStyleId(style.id as any)}
                                  className={`flex flex-col p-2 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.98] ${
                                    draftStyleId === style.id 
                                      ? 'border-primary ring-2 ring-primary/25 bg-primary/5 font-extrabold shadow-sm' 
                                      : 'border-outline-variant/10 hover:border-outline-variant/40 bg-surface/50'
                                  }`}
                                >
                                  <div className={`w-full h-4 rounded-md mb-1.5 border flex items-center gap-1 px-1 justify-between ${style.colorBg}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${style.indicator}`} />
                                    <span className={`text-[10px] font-mono tracking-tighter opacity-70 ${style.text}`}>Aa</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-on-surface truncate leading-none">{style.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Saved Blends Section */}
                          {savedBlends.length > 0 && (
                            <div className="space-y-2 mb-4 text-left">
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">My Saved Blends</span>
                              <div className="grid grid-cols-2 gap-2">
                                {savedBlends.map(blend => {
                                  const isActive = draftStyleId === 'custom' && 
                                                  draftRoadColor === blend.roadColor && 
                                                  draftLandscapeColor === blend.landscapeColor && 
                                                  draftParkColor === blend.parkColor && 
                                                  draftWaterColor === blend.waterColor;
                                  
                                  return (
                                    <div
                                      key={blend.id}
                                      onClick={() => handleSelectSavedBlend(blend)}
                                      className={`flex flex-col p-2.5 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.98] group relative ${
                                        isActive 
                                          ? 'border-primary ring-2 ring-primary/25 bg-primary/5 font-extrabold shadow-sm' 
                                          : 'border-outline-variant/10 hover:border-outline-variant/40 bg-surface/50'
                                      }`}
                                    >
                                      {/* Quick Delete */}
                                      <button
                                        type="button"
                                        onClick={(e) => handleDeleteSavedBlend(blend.id, e)}
                                        className="absolute top-1 right-1 p-0.5 rounded-md opacity-20 group-hover:opacity-100 hover:bg-error/15 text-on-surface-variant hover:text-error transition-all"
                                        title="Delete blend"
                                      >
                                        <X size={10} />
                                      </button>

                                      {/* Color visualization segment bar */}
                                      <div className="flex gap-0.5 h-2.5 rounded overflow-hidden mb-1.5 border border-black/10">
                                        <div className="flex-1" style={{ backgroundColor: blend.roadColor }} />
                                        <div className="flex-1" style={{ backgroundColor: blend.landscapeColor }} />
                                        <div className="flex-1" style={{ backgroundColor: blend.parkColor }} />
                                        <div className="flex-1" style={{ backgroundColor: blend.waterColor }} />
                                      </div>

                                      <span className="text-[10px] font-semibold text-on-surface truncate pr-2 leading-none">{blend.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Dynamic Color Adjustments */}
                          {draftStyleId === 'custom' && (
                            <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10 space-y-3 mb-4 text-left">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono flex items-center gap-1">
                                <Palette size={11} /> Road & Land Customizer
                              </span>

                              {/* Road Colors */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Road Color</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    { value: '#7a5a4a', label: 'Chestnut Cacao' },
                                    { value: '#3e2723', label: 'Creamy Espresso' },
                                    { value: '#134421', label: 'Matcha Forest' },
                                    { value: '#8b4513', label: 'Vintage Amber' },
                                    { value: '#dfcab5', label: 'Toasted Latte' },
                                    { value: '#ffffff', label: 'Chalk White' },
                                    { value: '#2d2524', label: 'Charcoal Brew' },
                                    { value: '#1a2b4c', label: 'Royal Indigo' },
                                    { value: '#9e5927', label: 'Burnt Caramel' },
                                    { value: '#d99238', label: 'Mustard Ginger' },
                                    { value: '#d59a9a', label: 'Rose Macaron' },
                                    { value: '#607d8b', label: 'Slate Mist' },
                                  ].map(choice => (
                                    <button
                                      key={choice.value}
                                      onClick={() => setDraftRoadColor(choice.value)}
                                      className={`flex items-center gap-1 px-1.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                        draftRoadColor === choice.value
                                          ? 'border-primary ring-1 ring-primary/45 bg-surface text-on-surface'
                                          : 'border-outline-variant/30 hover:border-outline-variant/75 bg-surface/30 text-on-surface-variant'
                                      }`}
                                    >
                                      <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: choice.value }} />
                                      <span>{choice.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Landscape Color */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">General Landscape / Terrain</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    { value: '#faf8f5', label: 'Milk Latte' },
                                    { value: '#faf0df', label: 'Warm Oat' },
                                    { value: '#f5faf6', label: 'Soft Mint' },
                                    { value: '#d5ead3', label: 'Pistachio Cream 🟢' },
                                    { value: '#cbe2ca', label: 'Fern Leaf 🟢' },
                                    { value: '#e2f0d9', label: 'Lush Mint 🟢' },
                                    { value: '#b6e3b5', label: 'Vibrant Meadow 🟢' },
                                    { value: '#1a331e', label: 'Forest Deep 🟢' },
                                    { value: '#1d120f', label: 'Cacao Dark' },
                                    { value: '#efe8db', label: 'Sandstone Dust' },
                                    { value: '#0f0907', label: 'Espresso Black' },
                                    { value: '#faf2f2', label: 'Rose Quartz' },
                                    { value: '#ecf2f5', label: 'Steel Blue' },
                                    { value: '#f4f0f7', label: 'Lavender Haze' },
                                    { value: '#ebf2ed', label: 'Sage Tint' },
                                  ].map(choice => (
                                    <button
                                      key={choice.value}
                                      onClick={() => setDraftLandscapeColor(choice.value)}
                                      className={`flex items-center gap-1 px-1.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                        draftLandscapeColor === choice.value
                                          ? 'border-primary ring-1 ring-primary/45 bg-surface text-on-surface'
                                          : 'border-outline-variant/30 hover:border-outline-variant/75 bg-surface/30 text-on-surface-variant'
                                      }`}
                                    >
                                      <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: choice.value }} />
                                      <span>{choice.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Parks (Natural) Color */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Parks & Greenery</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    { value: '#d2e5ca', label: 'Matcha Sage' },
                                    { value: '#b6dbc3', label: 'Fresh Pistachio' },
                                    { value: '#ccd9b3', label: 'Autumn Olive' },
                                    { value: '#192d1c', label: 'Lush Pine' },
                                    { value: '#2a4e33', label: 'Forest Spruce' },
                                    { value: '#a3dfbe', label: 'Emerald Mint' },
                                    { value: '#e3efa2', label: 'Lime Verbena' },
                                    { value: '#e3dbb8', label: 'Golden Straw' },
                                    { value: '#cbd6c0', label: 'Pastel Sage' },
                                    { value: '#3b4528', label: 'Dark Olive' },
                                  ].map(choice => (
                                    <button
                                      key={choice.value}
                                      onClick={() => setDraftParkColor(choice.value)}
                                      className={`flex items-center gap-1 px-1.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                        draftParkColor === choice.value
                                          ? 'border-primary ring-1 ring-primary/45 bg-surface text-on-surface'
                                          : 'border-outline-variant/30 hover:border-outline-variant/75 bg-surface/30 text-on-surface-variant'
                                      }`}
                                    >
                                      <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: choice.value }} />
                                      <span>{choice.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Water Color */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Water & Rivers</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    { value: '#cedad6', label: 'Teal Mist' },
                                    { value: '#a9dcc9', label: 'Chilled Peppermint' },
                                    { value: '#acc2c4', label: 'Glacier Blue' },
                                    { value: '#1e2a2a', label: 'Chilled Brew' },
                                    { value: '#152e46', label: 'Deep Ocean' },
                                    { value: '#bce2ed', label: 'Sky Lagoon' },
                                    { value: '#cbb6a3', label: 'Coffee Splash' },
                                    { value: '#2c3b52', label: 'Indigo Wave' },
                                    { value: '#b1cccd', label: 'Sage Ocean' },
                                    { value: '#4a2c3a', label: 'Berry Wine' },
                                  ].map(choice => (
                                    <button
                                      key={choice.value}
                                      onClick={() => setDraftWaterColor(choice.value)}
                                      className={`flex items-center gap-1 px-1.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                        draftWaterColor === choice.value
                                          ? 'border-primary ring-1 ring-primary/45 bg-surface text-on-surface'
                                          : 'border-outline-variant/30 hover:border-outline-variant/75 bg-surface/30 text-on-surface-variant'
                                      }`}
                                    >
                                      <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: choice.value }} />
                                      <span>{choice.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Save Blend Quick Option */}
                              <div className="pt-2.5 mt-2.5 border-t border-outline-variant/10 space-y-2">
                                {!showSaveBlendForm ? (
                                  <button
                                    type="button"
                                    onClick={() => setShowSaveBlendForm(true)}
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-[10px] font-bold text-primary hover:bg-primary/10 border border-dashed border-primary/40 bg-primary/5 transition-all active:scale-[0.98] cursor-pointer"
                                  >
                                    <PenLine size={11} className="shrink-0 text-primary" />
                                    <span>Save Current Colors as Blend 💾</span>
                                  </button>
                                ) : (
                                  <form onSubmit={handleCreateNewBlend} className="space-y-2 p-2 bg-surface/80 backdrop-blur-sm rounded-xl border border-outline-variant/30 text-left">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Blend Name</span>
                                    <div className="flex gap-1.5">
                                      <input
                                        type="text"
                                        placeholder="e.g. Pistachio Latte, Warm Meadow"
                                        value={newBlendName}
                                        onChange={(e) => setNewBlendName(e.target.value)}
                                        className="flex-1 min-w-0 bg-surface border border-outline-variant rounded-lg px-2 py-1 text-[10px] text-on-surface leading-tight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                        autoFocus
                                      />
                                      <button
                                        type="submit"
                                        className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-lg cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowSaveBlendForm(false);
                                          setNewBlendName('');
                                        }}
                                        className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-medium rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </form>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Toggle Map Overlay Elements */}
                          <div className="space-y-2 pt-2 border-t border-outline-variant/10 mb-3 text-left">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Overlay Elements</span>
                            
                            <div className="space-y-2">
                              {/* Friends Toggle */}
                              <button
                                onClick={() => setDraftShowFriends(p => !p)}
                                className="flex items-center justify-between w-full hover:bg-surface-container/60 p-1 rounded-lg transition-colors cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-2">
                                  <Users size={12} className="text-secondary" />
                                  <span className="text-[10px] font-semibold text-on-surface">Coffee circle friends</span>
                                </div>
                                <div className={`w-7 h-4 rounded-full p-0.5 transition-colors ${draftShowFriends ? 'bg-secondary' : 'bg-outline-variant'}`}>
                                  <div className={`w-3 h-3 bg-white rounded-full transform transition-transform duration-200 ${draftShowFriends ? 'translate-x-3' : 'translate-x-0'}`} />
                                </div>
                              </button>

                              {/* Radius Guide Toggle */}
                              <button
                                onClick={() => setDraftShowRadius(p => !p)}
                                className="flex items-center justify-between w-full hover:bg-surface-container/60 p-1 rounded-lg transition-colors cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-2">
                                  <Compass size={12} className="text-[#a55e2b]" />
                                  <span className="text-[10px] font-semibold text-on-surface">Target search radius</span>
                                </div>
                                <div className={`w-7 h-4 rounded-full p-0.5 transition-colors ${draftShowRadius ? 'bg-secondary' : 'bg-outline-variant'}`}>
                                  <div className={`w-3 h-3 bg-white rounded-full transform transition-transform duration-200 ${draftShowRadius ? 'translate-x-3' : 'translate-x-0'}`} />
                                </div>
                              </button>

                              {/* Shop Names Toggle */}
                              <button
                                onClick={() => setDraftShowShopNames(p => !p)}
                                className="flex items-center justify-between w-full hover:bg-surface-container/60 p-1 rounded-lg transition-colors cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-2">
                                  <Coffee size={12} className="text-primary" />
                                  <span className="text-[10px] font-semibold text-on-surface">Cafe name text badges</span>
                                </div>
                                <div className={`w-7 h-4 rounded-full p-0.5 transition-colors ${draftShowShopNames ? 'bg-secondary' : 'bg-outline-variant'}`}>
                                  <div className={`w-3 h-3 bg-white rounded-full transform transition-transform duration-200 ${draftShowShopNames ? 'translate-x-3' : 'translate-x-0'}`} />
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Save & Apply Settings Button */}
                          <div className="pt-3 border-t border-outline-variant/10 text-left">
                            <button
                              type="button"
                              onClick={handleSaveSettings}
                              disabled={isSaving}
                              className={`w-full py-2 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all text-white shadow-md active:scale-[0.98] ${
                                saveSuccess
                                  ? 'bg-emerald-600 border-emerald-600'
                                  : 'bg-primary hover:bg-primary/95 border border-primary'
                              }`}
                            >
                              {saveSuccess ? (
                                <>
                                  <Check size={13} className="animate-bounce" />
                                  <span>Settings Applied!</span>
                                </>
                              ) : isSaving ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />
                                  <span>Applying...</span>
                                </>
                              ) : (
                                <span>Save</span>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="bg-surface-container-lowest p-3 border-t border-outline-variant/30">
                        <p className="text-[10px] text-on-surface-variant text-center font-medium font-mono">Brewmap v1.0.2</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>
        )}
    </>
  );
}
