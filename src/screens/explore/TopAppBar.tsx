import type { SavedBlend } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { MapCustomizerSheet } from './MapCustomizerSheet';
import { Coffee, Menu, X, Settings, Moon, Sun, Globe, ArrowLeft, Layers } from 'lucide-react';
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
                  {isMenuOpen && menuView !== 'customizer' && (
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

      <AnimatePresence>
        {isMenuOpen && menuView === 'customizer' && (
          <MapCustomizerSheet
            draftStyleId={draftStyleId}
            setDraftStyleId={setDraftStyleId}
            draftRoadColor={draftRoadColor}
            setDraftRoadColor={setDraftRoadColor}
            draftLandscapeColor={draftLandscapeColor}
            setDraftLandscapeColor={setDraftLandscapeColor}
            draftParkColor={draftParkColor}
            setDraftParkColor={setDraftParkColor}
            draftWaterColor={draftWaterColor}
            setDraftWaterColor={setDraftWaterColor}
            draftShowRadius={draftShowRadius}
            setDraftShowRadius={setDraftShowRadius}
            draftShowShopNames={draftShowShopNames}
            setDraftShowShopNames={setDraftShowShopNames}
            savedBlends={savedBlends}
            handleSelectSavedBlend={handleSelectSavedBlend}
            handleDeleteSavedBlend={handleDeleteSavedBlend}
            handleCreateNewBlend={handleCreateNewBlend}
            newBlendName={newBlendName}
            setNewBlendName={setNewBlendName}
            showSaveBlendForm={showSaveBlendForm}
            setShowSaveBlendForm={setShowSaveBlendForm}
            handleSaveSettings={handleSaveSettings}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            onClose={() => { setIsMenuOpen(false); setMenuView('main'); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
