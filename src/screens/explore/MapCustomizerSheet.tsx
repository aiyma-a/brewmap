import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Check, ChevronDown, ChevronUp, Compass, Coffee, Loader2, Palette, PenLine, RotateCcw, X } from 'lucide-react';
import type { SavedBlend } from './types';

type StyleId = 'auto' | 'oat' | 'roast' | 'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom';

const ROAD_COLORS = [
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
];

const LAND_COLORS = [
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
];

const PARK_COLORS = [
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
];

const WATER_COLORS = [
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
];

interface Swatch { land: string; park: string; water: string; road: string }

/** Little map picture used on the preset cards */
const PRESETS: { id: StyleId; name: string; hint?: string; swatch?: Swatch }[] = [
  { id: 'auto', name: 'Automatic', hint: 'Follows light / dark' },
  { id: 'oat', name: 'Oat Milk', swatch: { land: '#F1E9DC', park: '#D9E3CB', water: '#BFD0D6', road: '#FFFDF8' } },
  { id: 'roast', name: 'Midnight Roast', swatch: { land: '#2B2623', park: '#2F3A2C', water: '#26333A', road: '#4A423C' } },
  { id: 'earthy', name: 'Matcha Cream', swatch: { land: '#faf8f5', park: '#d2e5ca', water: '#cedad6', road: '#7a5a4a' } },
  { id: 'nordic', name: 'Pistachio Mint', swatch: { land: '#f5faf6', park: '#b6dbc3', water: '#acc2c4', road: '#134421' } },
  { id: 'espresso', name: 'Rich Espresso', swatch: { land: '#1d120f', park: '#192d1c', water: '#1e2a2a', road: '#dfcab5' } },
  { id: 'retro', name: 'Vintage Mocha', swatch: { land: '#fffdf5', park: '#ccd9b3', water: '#cbb6a3', road: '#8b4513' } },
  { id: 'custom', name: 'Custom blend' },
];

function MiniMap({ land, park, water, road }: Swatch) {
  return (
    <svg viewBox="0 0 80 48" className="w-full h-full block" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="80" height="48" fill={land} />
      <rect x="46" y="4" width="26" height="16" rx="4" fill={park} />
      <path d="M0 36 Q20 30 38 38 T80 34 V48 H0Z" fill={water} />
      <g stroke={road} strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M-2 14 L82 22" />
        <path d="M30 -2 L40 50" />
      </g>
    </svg>
  );
}

export interface MapCustomizerSheetProps {
  draftStyleId: StyleId;
  setDraftStyleId: (id: StyleId) => void;
  draftRoadColor: string;
  setDraftRoadColor: (c: string) => void;
  draftLandscapeColor: string;
  setDraftLandscapeColor: (c: string) => void;
  draftParkColor: string;
  setDraftParkColor: (c: string) => void;
  draftWaterColor: string;
  setDraftWaterColor: (c: string) => void;
  draftShowRadius: boolean;
  setDraftShowRadius: (fn: (p: boolean) => boolean) => void;
  draftShowShopNames: boolean;
  setDraftShowShopNames: (fn: (p: boolean) => boolean) => void;
  savedBlends: SavedBlend[];
  handleSelectSavedBlend: (blend: SavedBlend) => void;
  handleDeleteSavedBlend: (id: string, e: any) => void;
  handleCreateNewBlend: (e: any) => void;
  newBlendName: string;
  setNewBlendName: (v: string) => void;
  showSaveBlendForm: boolean;
  setShowSaveBlendForm: (v: boolean) => void;
  handleSaveSettings: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  onClose: () => void;
}

/**
 * Map style picker as a bottom sheet. The map above it shows every change right away;
 * "Save" keeps the choice, closing without saving discards it.
 */
export function MapCustomizerSheet(p: MapCustomizerSheetProps) {
  const [advancedOpen, setAdvancedOpen] = useState(p.draftStyleId === 'custom');

  const customSwatch: Swatch = { land: p.draftLandscapeColor, park: p.draftParkColor, water: p.draftWaterColor, road: p.draftRoadColor };

  const pickColor = (setter: (c: string) => void) => (value: string) => {
    setter(value);
    p.setDraftStyleId('custom');   // choosing a colour means "custom blend"
  };

  const reset = () => {
    p.setDraftStyleId('auto');
    p.setDraftRoadColor('#7a5a4a');
    p.setDraftLandscapeColor('#faf8f5');
    p.setDraftParkColor('#d2e5ca');
    p.setDraftWaterColor('#cedad6');
    p.setDraftShowRadius(() => true);
    p.setDraftShowShopNames(() => true);
  };

  const colorRow = (title: string, list: { value: string; label: string }[], current: string, set: (c: string) => void) => (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-on-surface">{title}</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={title}>
        {list.map(c => (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={current === c.value}
            aria-label={c.label}
            title={c.label}
            onClick={() => pickColor(set)(c.value)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-transform active:scale-90 ${current === c.value ? 'ring-2 ring-offset-2 ring-brand ring-offset-surface border-transparent' : 'border-black/15'}`}
            style={{ backgroundColor: c.value }}
          >
            {current === c.value && <Check size={14} className="text-white mix-blend-difference" strokeWidth={3} />}
          </button>
        ))}
      </div>
    </div>
  );

  const toggle = (label: string, icon: ReactNode, on: boolean, flip: () => void) => (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={flip}
      className="flex items-center justify-between w-full min-h-[48px] px-3 rounded-xl hover:bg-surface-container/60 transition-colors text-left"
    >
      <span className="flex items-center gap-2.5 text-sm font-semibold text-on-surface">{icon}{label}</span>
      <span className={`w-11 h-6 rounded-full p-0.5 transition-colors ${on ? 'bg-secondary' : 'bg-outline-variant'}`}>
        <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        role="dialog"
        aria-label="Map style"
        className="pointer-events-auto absolute bottom-0 left-0 right-0 md:left-1/2 md:right-auto md:w-[28rem] md:-translate-x-1/2 max-h-[58vh] bg-surface rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.18)] border-t border-outline-variant/30 flex flex-col"
      >
        {/* Header */}
        <div className="px-4 pt-2.5 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-outline-variant/60 mx-auto mb-2" aria-hidden="true" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline font-black text-primary text-lg leading-tight">Map style</h2>
              <p className="text-[11px] text-on-surface-variant">Changes show on the map right away. Tap Save to keep them.</p>
            </div>
            <button type="button" onClick={p.onClose} aria-label="Close without saving" className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-4">
          {/* Presets */}
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Style presets">
            {PRESETS.map(preset => {
              const selected = p.draftStyleId === preset.id;
              const swatch = preset.id === 'custom' ? customSwatch : preset.swatch;
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => { p.setDraftStyleId(preset.id); if (preset.id === 'custom') setAdvancedOpen(true); }}
                  className={`relative rounded-xl border p-1.5 text-left transition-all active:scale-[0.97] ${selected ? 'border-brand ring-2 ring-brand/30 bg-brand/5' : 'border-outline-variant/30 bg-surface-container-low hover:border-outline-variant'}`}
                >
                  <div className="h-12 rounded-lg overflow-hidden border border-black/10 bg-surface-container flex items-center justify-center">
                    {swatch ? <MiniMap {...swatch} /> : (
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="w-4 h-4 rounded-full bg-[#F1E9DC] border border-black/10" /><span className="text-[11px] font-bold">/</span><span className="w-4 h-4 rounded-full bg-[#2B2623] border border-black/10" />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] font-bold text-on-surface leading-tight truncate">{preset.name}</p>
                  {preset.hint && <p className="text-[9px] text-on-surface-variant leading-tight truncate">{preset.hint}</p>}
                  {selected && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center shadow">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* On-map options */}
          <div className="border-t border-outline-variant/20 pt-1">
            {toggle('Show search radius', <Compass size={16} className="text-[#a55e2b]" />, p.draftShowRadius, () => p.setDraftShowRadius(v => !v))}
            {toggle('Show cafe names', <Coffee size={16} className="text-primary" />, p.draftShowShopNames, () => p.setDraftShowShopNames(v => !v))}
          </div>

          {/* Advanced: custom colours + saved blends */}
          <div className="border-t border-outline-variant/20 pt-1">
            <button
              type="button"
              aria-expanded={advancedOpen}
              onClick={() => setAdvancedOpen(o => !o)}
              className="flex items-center justify-between w-full min-h-[48px] px-3 rounded-xl hover:bg-surface-container/60 text-left"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-on-surface"><Palette size={16} className="text-brand" />Advanced: custom colors</span>
              {advancedOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {advancedOpen && (
              <div className="px-3 pt-2 pb-1 space-y-4">
                {colorRow('Roads', ROAD_COLORS, p.draftRoadColor, p.setDraftRoadColor)}
                {colorRow('Land', LAND_COLORS, p.draftLandscapeColor, p.setDraftLandscapeColor)}
                {colorRow('Parks', PARK_COLORS, p.draftParkColor, p.setDraftParkColor)}
                {colorRow('Water', WATER_COLORS, p.draftWaterColor, p.setDraftWaterColor)}

                {p.savedBlends.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-on-surface">My saved blends</p>
                    <div className="grid grid-cols-2 gap-2">
                      {p.savedBlends.map(blend => {
                        const active = p.draftStyleId === 'custom' && p.draftRoadColor === blend.roadColor && p.draftLandscapeColor === blend.landscapeColor && p.draftParkColor === blend.parkColor && p.draftWaterColor === blend.waterColor;
                        return (
                          <div key={blend.id} className={`relative rounded-xl border p-2 ${active ? 'border-brand ring-2 ring-brand/30 bg-brand/5' : 'border-outline-variant/30 bg-surface-container-low'}`}>
                            <button type="button" onClick={() => p.handleSelectSavedBlend(blend)} className="w-full text-left min-h-[44px]">
                              <div className="flex gap-0.5 h-3 rounded overflow-hidden mb-1.5 border border-black/10">
                                {[blend.roadColor, blend.landscapeColor, blend.parkColor, blend.waterColor].map((c, i) => <div key={i} className="flex-1" style={{ backgroundColor: c }} />)}
                              </div>
                              <span className="text-[11px] font-semibold text-on-surface truncate block pr-6">{blend.name}</span>
                            </button>
                            <button type="button" onClick={(e) => p.handleDeleteSavedBlend(blend.id, e)} aria-label={`Delete blend ${blend.name}`} className="absolute top-0.5 right-0.5 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error/15">
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!p.showSaveBlendForm ? (
                  <button type="button" onClick={() => p.setShowSaveBlendForm(true)} className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl border border-brand/30 text-brand text-xs font-bold hover:bg-brand/5">
                    <PenLine size={14} /> Save these colors as a blend
                  </button>
                ) : (
                  <form onSubmit={p.handleCreateNewBlend} className="space-y-2 p-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-low">
                    <label className="text-xs font-bold text-on-surface" htmlFor="blend-name">Blend name</label>
                    <div className="flex gap-2">
                      <input id="blend-name" type="text" autoFocus value={p.newBlendName} onChange={(e) => p.setNewBlendName(e.target.value)} placeholder="e.g. Warm Meadow" className="flex-1 min-w-0 min-h-[44px] bg-surface border border-outline-variant rounded-lg px-3 text-sm text-on-surface outline-none focus:border-brand" />
                      <button type="submit" className="min-h-[44px] px-4 bg-brand text-white text-xs font-bold rounded-lg">Save</button>
                      <button type="button" onClick={() => { p.setShowSaveBlendForm(false); p.setNewBlendName(''); }} className="min-h-[44px] px-3 text-xs font-medium rounded-lg text-on-surface-variant hover:bg-surface-container-high">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed action bar */}
        <div className="flex-shrink-0 flex gap-2 px-4 py-3 border-t border-outline-variant/20 bg-surface" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          <button type="button" onClick={reset} className="min-h-[48px] px-4 rounded-2xl border border-outline-variant text-on-surface-variant text-xs font-bold flex items-center gap-1.5 hover:bg-surface-container active:scale-[0.98]">
            <RotateCcw size={14} /> Reset
          </button>
          <button
            type="button"
            onClick={p.handleSaveSettings}
            disabled={p.isSaving || p.saveSuccess}
            className={`flex-1 min-h-[48px] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 text-white shadow-md transition-all active:scale-[0.99] ${p.saveSuccess ? 'bg-emerald-600' : 'bg-brand hover:brightness-110'}`}
          >
            {p.saveSuccess ? (<><Check size={16} /> Saved!</>) : p.isSaving ? (<><Loader2 size={14} className="animate-spin" /> Saving…</>) : 'Save'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
