import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Map as MapIcon, Users, Bookmark, User, Navigation2, Coffee, AlertCircle, RefreshCcw, Info, Loader2, Menu, X, UserPlus, PlusCircle, Settings, MessageSquare, Trash2, Compass, UserCheck, Star, Heart, PenLine, Check, CheckSquare, CheckCircle2, Share2, Copy, Mail, Send, Moon, Sun, Globe, Lock, ShieldAlert, Key, Eye, EyeOff, MapPin, Wifi, LogOut, ArrowLeft, Layers, Palette, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { CITIES, FRIENDS, COFFEE_SHOPS as STATIC_SHOPS, FriendMarker } from '../data';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback, FormEvent, useMemo, useRef } from 'react';
import { translations, getLanguage, setLanguage, getThemeMode, setThemeMode, Language } from '../lib/i18n';

const getRatingLabel = (val: number): string => {
  if (val <= 1.5) return "Pod";
  if (val <= 2.5) return "Drip";
  if (val <= 3.5) return "Medium";
  if (val <= 4.5) return "Pour-Over";
  return "Ristretto";
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

const renderInteractiveStars = (
  rating: number,
  setRating: (val: number) => void,
  hoverRating: number | null,
  setHoverRating: (val: number | null) => void
) => {
  const activeRating = hoverRating !== null ? hoverRating : rating;
  return (
    <div className="flex items-center justify-center gap-1.5" onMouseLeave={() => setHoverRating(null)}>
      {[0, 1, 2, 3, 4].map((j) => {
        const starValLeft = j + 0.5;
        const starValRight = j + 1.0;
        
        let starFillType: 'none' | 'half' | 'full' = 'none';
        if (activeRating >= starValRight) {
          starFillType = 'full';
        } else if (activeRating === starValLeft) {
          starFillType = 'half';
        }
        
        return (
          <div key={j} className="relative w-8 h-8 select-none">
            {/* Background empty star */}
            <Star 
              size={32} 
              className="text-outline-variant absolute inset-0 pointer-events-none" 
            />
            {/* Foreground filled/half star */}
            {starFillType === 'full' && (
              <Star 
                size={32} 
                className="fill-secondary text-secondary drop-shadow-[0_0_6px_rgba(235,178,96,0.5)] absolute inset-0 pointer-events-none" 
              />
            )}
            {starFillType === 'half' && (
              <div className="absolute inset-y-0 left-0 overflow-hidden w-1/2 pointer-events-none">
                <Star 
                  size={32} 
                  className="fill-secondary text-secondary drop-shadow-[0_0_6px_rgba(235,178,96,0.5)]" 
                  style={{ maxWidth: 'none' }}
                />
              </div>
            )}
            
            {/* Left and Right half click areas */}
            <div 
              onMouseEnter={() => setHoverRating(starValLeft)}
              onClick={() => setRating(starValLeft)}
              className="absolute left-0 top-0 bottom-0 w-1/2 cursor-pointer z-10"
              title={`${starValLeft} Stars`}
            />
            <div 
              onMouseEnter={() => setHoverRating(starValRight)}
              onClick={() => setRating(starValRight)}
              className="absolute right-0 top-0 bottom-0 w-1/2 cursor-pointer z-10"
              title={`${starValRight} Stars`}
            />
          </div>
        );
      })}
    </div>
  );
};

const API_KEY = (
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  ''
).replace(/^["']|["']$/g, '').trim();

const hasValidKey = 
  Boolean(API_KEY) && 
  API_KEY.startsWith('AIza') &&
  API_KEY.length > 20;

const MAP_STYLES_PRESETS = {
  earthy: [
    {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#faf8f5" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#2e1c16" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#faf8f5" }, { "weight": 2.5 }]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f0e6" }]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [{ "color": "#d2e5ca" }]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#7a5a4a" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#ecdccf" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#422015" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#cedad6" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#2a1b18" }]
    }
  ],
  nordic: [
    {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#f5faf6" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#1b321e" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#f5faf6" }, { "weight": 2.5 }]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{ "color": "#e8f3ec" }]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [{ "color": "#b6dbc3" }]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#134421" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#f5faf6" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#1b321e" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#a9dcc9" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#1b321e" }]
    }
  ],
  espresso: [
    {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#1d120f" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#eedece" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#1d120f" }, { "weight": 2.5 }]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{ "color": "#2a1b18" }]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [{ "color": "#192d1c" }]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#dfcab5" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#3e241e" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#dfcab5" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#1e2a2a" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#dfcab5" }]
    }
  ],
  retro: [
    {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#fffdf5" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#4e3629" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#fffdf5" }, { "weight": 2.5 }]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{ "color": "#faf0df" }]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [{ "color": "#ccd9b3" }]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#8b4513" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#fffdf5" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#4e3629" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#acc2c4" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#4e3629" }]
    }
  ]
};

interface OverlayProps {
  position: { lat: number; lng: number };
  children: any;
  key?: any;
}

function OverlayView({ position, children }: OverlayProps) {
  const map = useMap();
  const [container] = useState(() => {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.transform = 'translate(-50%, -50%)'; // Automatically centers custom overlays
    return el;
  });

  useEffect(() => {
    const googleObj = (window as any).google;
    if (!googleObj || !googleObj.maps || !map) return;

    // Prevent map hit gestures and clicks on this overlay container DOM element
    if (googleObj.maps.OverlayView && googleObj.maps.OverlayView.preventMapHitsFrom) {
      try {
        googleObj.maps.OverlayView.preventMapHitsFrom(container);
      } catch (err) {
        console.warn('preventMapHitsFrom failed, fallback to manual stopPropagation', err);
      }
    }

    // Manual fallback for event stopPropagation to ensure clicks/touches never trigger map handlers
    const stopPropagation = (e: Event) => {
      e.stopPropagation();
    };

    container.addEventListener('click', stopPropagation);
    container.addEventListener('dblclick', stopPropagation);
    container.addEventListener('mousedown', stopPropagation);
    container.addEventListener('pointerdown', stopPropagation);
    container.addEventListener('touchstart', stopPropagation, { passive: true });

    class GoogleMapOverlay extends googleObj.maps.OverlayView {
      onAdd() {
        const panes = this.getPanes();
        panes?.overlayMouseTarget.appendChild(container);
      }

      draw() {
        const projection = this.getProjection();
        if (!projection) return;

        const latLng = new googleObj.maps.LatLng(position.lat, position.lng);
        const pixel = projection.fromLatLngToDivPixel(latLng);

        if (pixel) {
          container.style.left = `${pixel.x}px`;
          container.style.top = `${pixel.y}px`;
        }
      }

      onRemove() {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }
    }

    const overlay = new GoogleMapOverlay();
    overlay.setMap(map);

    return () => {
      overlay.setMap(null);
      container.removeEventListener('click', stopPropagation);
      container.removeEventListener('dblclick', stopPropagation);
      container.removeEventListener('mousedown', stopPropagation);
      container.removeEventListener('pointerdown', stopPropagation);
      container.removeEventListener('touchstart', stopPropagation);
    };
  }, [map, container, position.lat, position.lng]);

  return createPortal(children, container);
}

function MapContent({ 
  onSearch, 
  isSearching, 
  shops, 
  friends, 
  cities,
  searchQuery,
  triggerSearch,
  moveToLocation,
  currentUserLocation,
  onShowShopDetail,
  pointedLocation,
  pointedRadius = 3,
  onMapClick,
  mapStyleId = 'earthy',
  customRoadColor = '#745853',
  customLandscapeColor = '#faf8f5',
  customParkColor = '#e0ecd6',
  customWaterColor = '#d4e6e6',
  showFriendsOnMap = true,
  showRadiusGuide = true,
  showShopNames = true,
  onMapStyleChange,
  onToggleFriends,
  onToggleRadius,
  onToggleShopNames,
  filterOpenNow = false
}: { 
  onSearch: (places: any[]) => void, 
  isSearching: boolean,
  shops: any[],
  friends: any[],
  cities: any[],
  searchQuery: string,
  triggerSearch: number,
  moveToLocation?: { lat: number, lng: number } | null,
  currentUserLocation?: { lat: number, lng: number } | null,
  onShowShopDetail: (shop: any) => void,
  pointedLocation?: { lat: number, lng: number } | null,
  pointedRadius?: number,
  onMapClick?: (latLng: { lat: number, lng: number }) => void,
  mapStyleId?: 'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom',
  customRoadColor?: string,
  customLandscapeColor?: string,
  customParkColor?: string,
  customWaterColor?: string,
  showFriendsOnMap?: boolean,
  showRadiusGuide?: boolean,
  showShopNames?: boolean,
  onMapStyleChange: (id: 'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom') => void,
  onToggleFriends: () => void,
  onToggleRadius: () => void,
  onToggleShopNames: () => void,
  filterOpenNow?: boolean
}) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [mapMoved, setMapMoved] = useState(false);
  const initialFetchDone = useRef(false);
  const lastTriggerSearch = useRef(0);

  // Definition of map refitter
  const fitMapToMarkers = useCallback(() => {
    if (!map || !shops || shops.length === 0) return;
    const google = (window as any).google;
    if (!google) return;
    
    const bounds = new google.maps.LatLngBounds();
    let hasValidCoords = false;
    
    shops.forEach((shop: any) => {
      if (shop.location && typeof shop.location.lat === 'number' && typeof shop.location.lng === 'number') {
        bounds.extend(shop.location);
        hasValidCoords = true;
      }
    });
    
    if (hasValidCoords) {
      map.fitBounds(bounds, {
        top: 140,
        bottom: 140,
        left: 60,
        right: 60
      });
      
      // Limit zoom depth for single items
      const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom()! > 16) {
          map.setZoom(16);
        }
      });
    }
  }, [map, shops]);

  // Autofit bounds whenever list of shops gets updated (searched/filtered)
  const previousShopsLength = useRef(0);
  useEffect(() => {
    if (shops && shops.length > 0 && shops.length !== previousShopsLength.current) {
      previousShopsLength.current = shops.length;
      const timer = setTimeout(() => {
        fitMapToMarkers();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [shops, fitMapToMarkers]);

  // Pan to location when requested
  useEffect(() => {
    if (map && moveToLocation) {
      map.panTo(moveToLocation);
      map.setZoom(17);
    }
  }, [map, moveToLocation]);

  // Sync map styles when mapStyleId or custom colors change
  useEffect(() => {
    if (map && mapStyleId) {
      const styles = mapStyleId === 'custom' 
        ? [
            {
              "featureType": "all",
              "elementType": "labels.icon",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "all",
              "elementType": "geometry.fill",
              "stylers": [{ "color": customLandscapeColor }]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": customRoadColor }]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": customLandscapeColor }, { "weight": 2.5 }]
            },
            {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [{ "color": customLandscapeColor }]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "geometry",
              "stylers": [{ "color": customParkColor }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "color": customRoadColor }]
            },
            {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": customRoadColor === '#ffffff' ? '#dfcab5' : '#ffffff' }, { "weight": 0.5 }]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": customRoadColor === '#ffffff' ? '#271310' : '#ffffff' }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": customWaterColor }]
            }
          ]
        : (MAP_STYLES_PRESETS[mapStyleId] || MAP_STYLES_PRESETS.earthy);

      map.setOptions({ styles });
    }
  }, [map, mapStyleId, customRoadColor, customLandscapeColor, customParkColor, customWaterColor]);

  const performSearch = useCallback(async (query: string) => {
    if (!map || !placesLib) return;
    
    setMapMoved(false);
    try {
      const { places } = await placesLib.Place.searchByText({
        textQuery: query || 'coffee shop',
        locationBias: map.getCenter(),
        fields: ['id', 'displayName', 'location', 'rating', 'userRatingCount', 'formattedAddress', 'photos'],
        maxResultCount: 20,
      });
      
      if (places) {
        onSearch(places.map(p => ({
          id: p.id,
          name: p.displayName,
          location: { lat: p.location?.lat(), lng: p.location?.lng() },
          rating: p.rating,
          reviewCount: p.userRatingCount,
          address: p.formattedAddress,
          image: p.photos?.[0]?.getURI({ maxWidth: 400 }) || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop',
          status: 'Open Now'
        })));
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [map, placesLib, onSearch]);

  // Initial automatic load search when map and places library is loaded
  useEffect(() => {
    if (map && placesLib && !initialFetchDone.current) {
      initialFetchDone.current = true;
      performSearch('coffee shop in Bishkek');
    }
  }, [map, placesLib, performSearch]);

  // Listen for manual triggers from the search bar
  useEffect(() => {
    if (triggerSearch > 0 && triggerSearch !== lastTriggerSearch.current) {
      lastTriggerSearch.current = triggerSearch;
      performSearch(searchQuery);
    }
  }, [triggerSearch, searchQuery, performSearch]);

  const handleSearchArea = () => performSearch(searchQuery);

  const renderFriendAvatarOnMap = (avatarUrl: string, name: string) => {
    let matched = CUSTOM_VECTOR_AVATARS[0];
    if (avatarUrl && avatarUrl.startsWith('vector:')) {
      const vname = avatarUrl.substring(7);
      matched = CUSTOM_VECTOR_AVATARS.find(v => v.name === vname) || CUSTOM_VECTOR_AVATARS[0];
    } else if (avatarUrl) {
      const seed = avatarUrl.length;
      matched = CUSTOM_VECTOR_AVATARS[seed % CUSTOM_VECTOR_AVATARS.length];
    }
    const initial = name ? name.charAt(0).toUpperCase() : '☕';
    return (
      <div className={`w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center shrink-0 ${matched.bg} ${matched.text}`}>
        <span className="text-[11px] font-black">{initial}</span>
      </div>
    );
  };

  return (
    <>
      <Map
        defaultCenter={{ lat: 42.8746, lng: 74.6000 }}
        defaultZoom={14}
        styles={mapStyleId === 'custom'
          ? [
              {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [{ "visibility": "off" }]
              },
              {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{ "color": customLandscapeColor }]
              },
              {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": customRoadColor }]
              },
              {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": customLandscapeColor }, { "weight": 2.5 }]
              },
              {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{ "color": customLandscapeColor }]
              },
              {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [{ "color": customParkColor }]
              },
              {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{ "color": customRoadColor }]
              },
              {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{ "color": customRoadColor === '#ffffff' ? '#dfcab5' : '#ffffff' }, { "weight": 0.5 }]
              },
              {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": customRoadColor === '#ffffff' ? '#271310' : '#ffffff' }]
              },
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": customWaterColor }]
              }
            ]
          : (MAP_STYLES_PRESETS[mapStyleId] || MAP_STYLES_PRESETS.earthy)
        }
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full"
        disableDefaultUI={true}
        onCameraIdle={() => setMapMoved(true)}
        onClick={(ev) => {
          let latVal = 0;
          let lngVal = 0;
          if (ev.detail && ev.detail.latLng) {
            latVal = typeof ev.detail.latLng.lat === 'function' ? ev.detail.latLng.lat() : ev.detail.latLng.lat;
            lngVal = typeof ev.detail.latLng.lng === 'function' ? ev.detail.latLng.lng() : ev.detail.latLng.lng;
          } else if ((ev as any).latLng) {
            const ll = (ev as any).latLng;
            latVal = typeof ll.lat === 'function' ? ll.lat() : ll.lat;
            lngVal = typeof ll.lng === 'function' ? ll.lng() : ll.lng;
          } else {
            return;
          }
          onMapClick?.({ lat: latVal, lng: lngVal });
        }}
      >
        {/* Coffee Shop Pins */}
        {shops.map((shop) => (
          <OverlayView
            key={shop.id}
            position={shop.location}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                onShowShopDetail(shop);
              }}
              className="group text-left focus:outline-none block cursor-pointer z-10"
            >
              <div className="relative flex flex-col items-center">
                <div className={`${(filterOpenNow && shop.isOpen) ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-100' : 'bg-primary border-white'} text-white p-2 rounded-full shadow-lg z-10 ${(filterOpenNow && shop.isOpen) ? 'group-hover:bg-emerald-700' : 'group-hover:bg-primary-container'} transition-all active:scale-90 duration-150 border-2`}>
                  <Coffee size={18} fill="currentColor" />
                </div>
                {showShopNames && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-surface p-1 px-2 rounded-lg shadow-sm -mt-1 z-20 border border-outline-variant scale-75 group-hover:scale-90 transition-transform"
                  >
                    <p className="text-[10px] font-bold text-primary whitespace-nowrap">{shop.name}</p>
                    {shop.rating && (
                      <p className="text-[8px] text-on-surface-variant text-center">⭐ {shop.rating}</p>
                    )}
                  </motion.div>
                )}
               </div>
            </button>
          </OverlayView>
        ))}

        {/* Dynamic Friend Markers */}
        {showFriendsOnMap && friends.map((friend) => {
          if (!friend.location || typeof friend.location.lat !== 'number' || typeof friend.location.lng !== 'number') return null;
          return (
            <OverlayView
              key={`friend-${friend.id}`}
              position={friend.location}
            >
              <div className="relative flex flex-col items-center group cursor-pointer">
                {renderFriendAvatarOnMap(friend.image, friend.name)}
                <div className="bg-secondary text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow-md mt-1 scale-90 opacity-90 group-hover:scale-100 group-hover:opacity-100 transition-all border border-white whitespace-nowrap z-30">
                  {friend.name}
                </div>
              </div>
            </OverlayView>
          );
        })}

        {/* Custom Pointed Radius Search Center Marker */}
        {showRadiusGuide && pointedLocation && (
          <OverlayView
            position={pointedLocation}
          >
            <div className="relative flex items-center justify-center pointer-events-none">
              <div className="absolute w-28 h-28 bg-[#a55e2b]/10 rounded-full border border-[#a55e2b]/40 animate-[ping_2.5s_infinite] pointer-events-none" />
              <div className="absolute w-16 h-16 bg-[#a55e2b]/15 rounded-full border border-[#a55e2b]/50 pointer-events-none" />
              <div className="relative w-9 h-9 rounded-full bg-white border-2 border-[#a55e2b] text-[#a55e2b] flex items-center justify-center font-bold text-[10px] shadow-2xl z-20 font-mono">
                🎯 {pointedRadius}k
              </div>
            </div>
          </OverlayView>
        )}


        {/* Current User Location Marker */}
        {currentUserLocation && (
          <OverlayView
            position={currentUserLocation}
          >
            <div className="relative flex items-center justify-center">
              {/* Pulsing aura */}
              <div className="absolute w-8 h-8 bg-secondary/30 rounded-full animate-ping duration-1000" />
              {/* Solid border circle */}
              <div className="relative w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg border border-secondary/30">
                {/* Inner brand secondary green core */}
                <div className="w-2.5 h-2.5 bg-secondary rounded-full" />
              </div>
            </div>
          </OverlayView>
        )}

        {/* City/District Markers */}
        {cities.map((city) => (
          <OverlayView
            key={city.name}
            position={city.location}
          >
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg flex items-center gap-2 border border-surface-container">
              <MapIcon size={14} className="text-secondary" />
              <span className="text-xs font-semibold text-primary">{city.name}</span>
            </div>
          </OverlayView>
        ))}
      </Map>
      
      {/* Search this area button */}
      <AnimatePresence>
        {mapMoved && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-[160px] left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
          >
            <button 
              onClick={handleSearchArea}
              disabled={isSearching}
              className="bg-white text-primary px-6 py-2.5 rounded-full shadow-2xl border border-outline-variant/30 font-bold text-sm flex items-center gap-2 hover:bg-surface-container transition-colors active:scale-95 disabled:opacity-50"
            >
              {isSearching ? <Loader2 size={16} className="animate-spin text-secondary" /> : <RefreshCcw size={16} className="text-secondary" />}
              Search this area
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}

const SEARCHABLE_USERS = [
  {
    id: 'u1',
    name: 'Meerim',
    username: 'meerim_coffee',
    image: 'vector:Espresso',
    bio: 'Artisanal coffee explorer. Seeking the perfect light roast pour-over.',
    location: { lat: 42.8720, lng: 74.5800 }
  },
  {
    id: 'u2',
    name: 'Erkin',
    username: 'erkin_roaster',
    image: 'vector:Black',
    bio: 'Micro-roast aficionado. Running on caffeine & clean designs.',
    location: { lat: 42.8800, lng: 74.6050 }
  },
  {
    id: 'u3',
    name: 'Begaim',
    username: 'begaim_latte',
    image: 'vector:Latte',
    bio: 'Latte art enthusiast. Let’s hunt for cozy outdoor spaces.',
    location: { lat: 42.8650, lng: 74.5900 }
  },
  {
    id: 'u4',
    name: 'Azat',
    username: 'azat_brew',
    image: 'vector:Mocha',
    bio: 'V60 geek & cold brew maker. Flat white is my daily morning driver.',
    location: { lat: 42.8790, lng: 74.5750 }
  },
  {
    id: 'u5',
    name: 'Jamil',
    username: 'jamil_espresso',
    image: 'vector:Caramel',
    bio: 'Decaf filter is a crime. Bishkek-based specialty coffee fan.',
    location: { lat: 42.8700, lng: 74.6150 }
  }
];

const CUSTOM_VECTOR_AVATARS = [
  { id: 'vec_espresso', name: 'Espresso', bg: 'bg-[#4B3621]', text: 'text-white' },
  { id: 'vec_latte', name: 'Latte', bg: 'bg-[#C2B280]', text: 'text-[#4B3621]' },
  { id: 'vec_mocha', name: 'Mocha', bg: 'bg-[#6F4E37]', text: 'text-white' },
  { id: 'vec_caramel', name: 'Caramel', bg: 'bg-[#C68E17]', text: 'text-white' },
  { id: 'vec_cream', name: 'Cream', bg: 'bg-[#F5F5DC]', text: 'text-[#6F4E37]' },
  { id: 'vec_black', name: 'Black', bg: 'bg-[#1A1A1A]', text: 'text-white' }
];

export default function ExploreScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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

  const [mapStyleId, setMapStyleId] = useState<'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom'>(() => {
    return (localStorage.getItem('brewmap_map_style_id') as any) || 'earthy';
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

  const handleMapStyleChange = (id: 'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom') => {
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
  const [draftStyleId, setDraftStyleId] = useState<'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom'>(mapStyleId);
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
      name: 'Aydana Temirova',
      username: 'aydana_brews',
      bio: 'Specialty coffee connoisseur / Manual brew fanatic',
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
    const saved = localStorage.getItem('brewmap_friends');
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

  interface SavedBlend {
    id: string;
    name: string;
    roadColor: string;
    landscapeColor: string;
    parkColor: string;
    waterColor: string;
  }

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
    localStorage.setItem('brewmap_friends', JSON.stringify(friendsList));
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

  const handleUpdateProfile = (e: FormEvent) => {
    e.preventDefault();
    const updated = {
      name: editName.trim() || 'Aydana Temirova',
      username: editUsername.trim().replace(/^@/, '') || 'aydana_brews',
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
    return cityParam ? cityParam.split(',').filter(Boolean) : ['Bishkek'];
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
    const currentHour = new Date().getHours();
    const filterRadius = searchParams.get('radius') ? parseInt(searchParams.get('radius') || '15') : null;

    return allShops.map(shop => {
      // Calculate open status based on hours if available, otherwise fallback to static status
      const isOpen = (shop.openingHour !== undefined && shop.closingHour !== undefined) 
        ? (currentHour >= shop.openingHour && currentHour < shop.closingHour)
        : shop.status === 'Open Now';
      return { ...shop, isOpen };
    }).filter(shop => {
      const matchSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (shop.address && shop.address.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchCity = filterCities.length === 0 || filterCities.includes('All Cities') || 
        filterCities.some(c => shop.address && shop.address.toLowerCase().includes(c.toLowerCase()));
      
      const matchOpen = !filterOpenNow || shop.isOpen;
      
      // Wifi availability filter
      const matchWifi = !filterWifi || (shop.wifi && shop.wifi.toLowerCase() !== 'none' && shop.wifi.toLowerCase() !== 'unavailable');
      
      // Outlets availability filter
      const matchOutlets = !filterOutlets || shop.outlets !== false;
      
      // Calculate distance for 2 km radius when nearby filter is active or custom radius from filter screen
      let matchNearby = true;
      if (filterNearby) {
        const userLoc = currentUserLocation || { lat: 42.8755, lng: 74.5905 };
        const lat2 = shop.location.lat;
        const lon2 = shop.location.lng;
        const p = 0.017453292519943295; // Math.PI / 180
        const c = Math.cos;
        const lat1 = userLoc.lat;
        const lon1 = userLoc.lng;
        const a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;
        const dist = 12742 * Math.asin(Math.sqrt(a));
        matchNearby = dist <= 2.0;
      } else {
        const radiusLimit = filterRadius !== null ? filterRadius : null;
        if (radiusLimit !== null) {
          // Determine reference centers to calculate distance from
          const referenceCenters: { lat: number, lng: number }[] = [];
          
          if (currentUserLocation) {
            referenceCenters.push(currentUserLocation);
          }
          
          if (filterCities.length > 0) {
            filterCities.forEach(cityName => {
              const foundCity = CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
              if (foundCity) {
                referenceCenters.push(foundCity.location);
              }
            });
          }
          
          // If we still don't have any specific reference center, fallback to default Bishkek
          if (referenceCenters.length === 0) {
            referenceCenters.push({ lat: 42.8746, lng: 74.5898 }); // Bishkek center from CITIES
          }
          
          // Find minimum distance to any of the reference centers
          const lat2 = shop.location.lat;
          const lon2 = shop.location.lng;
          const p = 0.017453292519943295; // Math.PI / 180
          const c = Math.cos;
          
          const minDistanceInKm = referenceCenters.reduce((minDist, center) => {
            const lat1 = center.lat;
            const lon1 = center.lng;
            const a = 0.5 - c((lat2 - lat1) * p)/2 + 
                    c(lat1 * p) * c(lat2 * p) * 
                    (1 - c((lon2 - lon1) * p))/2;
            const dist = 12742 * Math.asin(Math.sqrt(a));
            return Math.min(minDist, dist);
          }, Infinity);
          
          matchNearby = minDistanceInKm <= radiusLimit;
        }
      }
      
      // Pointed map location distance filtering
      let matchPointed = true;
      if (pointedLocation) {
        const lat2 = shop.location.lat;
        const lon2 = shop.location.lng;
        const p = 0.017453292519943295; // Math.PI / 180
        const c = Math.cos;
        
        const lat1 = pointedLocation.lat;
        const lon1 = pointedLocation.lng;
        const a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;
        const dist = 12742 * Math.asin(Math.sqrt(a));
        
        matchPointed = dist <= pointedRadius;
      }
      
      return matchSearch && matchCity && matchOpen && matchWifi && matchOutlets && matchNearby && matchPointed;
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
        let coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Check distance to Bishkek center to see if user is physically inside Bishkek
        const bishkekCenter = { lat: 42.8755, lng: 74.5905 };
        const distFromBishkek = getDistanceInKm(coords, bishkekCenter);
        
        if (distFromBishkek > 15) {
          coords = bishkekCenter;
          setAddNotification("Centered on Bishkek simulated location!");
        } else {
          setAddNotification("Location identified! Centered on your position.");
        }
        
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
        let coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Check distance to Bishkek center to see if user is physically inside Bishkek
        const bishkekCenter = { lat: 42.8755, lng: 74.5905 };
        const distFromBishkek = getDistanceInKm(coords, bishkekCenter);
        
        // If the user's browser location is more than 15 km away, fall back to simulated center 
        // to prevent all Bishkek coffee shops from being filtered out.
        if (distFromBishkek > 15) {
          coords = bishkekCenter;
          setAddNotification("Using simulated location in Bishkek (since your real location is too far)!");
        } else {
          setAddNotification("Location identified! Showing shops within 2 km.");
        }
        
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
              <Coffee className="text-[#6F4E37]" size={24} fill="currentColor" />
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
                              <Globe size={14} className="text-[#306a34]" />
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
                              className={`w-8 h-4.5 rounded-full p-0.5 flex-shrink-0 transition-colors duration-200 outline-none ${bgLocationTracking ? 'bg-[#306a34]' : 'bg-outline-variant'}`}
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
                                { id: 'custom', name: 'Custom Blend ⚙️', colorBg: 'bg-surface-container border-outline', indicator: 'bg-[#6F4E37]', text: 'text-[#6F4E37]' },
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
                                    <span className={`text-[7.5px] font-mono tracking-tighter opacity-70 ${style.text}`}>Aa</span>
                                  </div>
                                  <span className="text-[9.5px] font-bold text-on-surface truncate leading-none">{style.name}</span>
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

                                      <span className="text-[9px] font-semibold text-on-surface truncate pr-2 leading-none">{blend.name}</span>
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
                                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Road Color</span>
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
                                      className={`flex items-center gap-1 px-1.5 py-1 text-[8.5px] font-bold rounded-lg border transition-all cursor-pointer ${
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
                                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">General Landscape / Terrain</span>
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
                                      className={`flex items-center gap-1 px-1.5 py-1 text-[8.5px] font-bold rounded-lg border transition-all cursor-pointer ${
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
                                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Parks & Greenery</span>
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
                                      className={`flex items-center gap-1 px-1.5 py-1 text-[8.5px] font-bold rounded-lg border transition-all cursor-pointer ${
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
                                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Water & Rivers</span>
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
                                      className={`flex items-center gap-1 px-1.5 py-1 text-[8.5px] font-bold rounded-lg border transition-all cursor-pointer ${
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
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-[9px] font-bold text-primary hover:bg-primary/10 border border-dashed border-primary/40 bg-primary/5 transition-all active:scale-[0.98] cursor-pointer"
                                  >
                                    <PenLine size={11} className="shrink-0 text-primary" />
                                    <span>Save Current Colors as Blend 💾</span>
                                  </button>
                                ) : (
                                  <form onSubmit={handleCreateNewBlend} className="space-y-2 p-2 bg-surface/80 backdrop-blur-sm rounded-xl border border-outline-variant/30 text-left">
                                    <span className="text-[8.5px] font-bold text-on-surface-variant uppercase tracking-wider block">Blend Name</span>
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
                                        className="px-2.5 py-1 bg-primary text-white text-[9.5px] font-bold rounded-lg cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowSaveBlendForm(false);
                                          setNewBlendName('');
                                        }}
                                        className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-[9.5px] font-medium rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
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
            moveToLocation={moveToLocation}
            currentUserLocation={currentUserLocation}
            onShowShopDetail={(shop) => {
              setSelectedShopDetail(shop);
              setIsDetailExpanded(false);
            }}
            pointedLocation={pointedLocation}
            pointedRadius={pointedRadius}
            onMapClick={handleMapClick}
            mapStyleId={mapStyleId}
            customRoadColor={customRoadColor}
            customLandscapeColor={customLandscapeColor}
            customParkColor={customParkColor}
            customWaterColor={customWaterColor}
            showFriendsOnMap={showFriendsOnMap}
            showRadiusGuide={showRadiusGuide}
            showShopNames={showShopNames}
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
          <AnimatePresence>
            {isListViewOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsListViewOpen(false)}
                  className="fixed inset-0 bg-neutral-900 z-[190] pointer-events-auto cursor-pointer"
                />

                {/* Bottom Sheet Drawer */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="fixed inset-x-0 bottom-0 max-h-[80vh] bg-surface rounded-t-[32px] border-t border-outline-variant/30 z-[200] px-6 pt-5 pb-10 shadow-2xl overflow-y-auto pointer-events-auto text-left outline-none"
                >
                  {/* Drag bar indicator */}
                  <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-5 shrink-0" />

                  <div className="max-w-md mx-auto">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-headline font-black text-primary text-base uppercase">Matched Specialty Cafes</h3>
                        <p className="text-[10px] text-on-surface-variant font-medium">
                          {pointedLocation 
                            ? `Showing spots within ${pointedRadius} km of map pointer` 
                            : "Showing shops matching selected filters"}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsListViewOpen(false)}
                        className="p-1.5 rounded-full hover:bg-surface-container active:scale-90 transition-colors border border-outline-variant/10"
                      >
                        <X size={16} className="text-on-surface-variant" />
                      </button>
                    </div>

                    {/* List Container */}
                    {filteredShops.length > 0 ? (
                      <div className="space-y-3.5 pb-6">
                        {filteredShops.map((shop) => {
                          const currentHour = new Date().getHours();
                          const isOpen = (shop.openingHour !== undefined && shop.closingHour !== undefined)
                            ? (currentHour >= shop.openingHour && currentHour < shop.closingHour)
                            : shop.status === 'Open Now';

                          // Distance calculation if pointer is active or user location is active
                          let distanceText = "";
                          if (pointedLocation) {
                            const dist = getDistanceInKm(pointedLocation, shop.location);
                            distanceText = `${dist.toFixed(2)} km from pointer`;
                          } else if (currentUserLocation) {
                            const dist = getDistanceInKm(currentUserLocation, shop.location);
                            distanceText = `${dist.toFixed(2)} km away`;
                          }

                          return (
                            <div
                              key={shop.id}
                              className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-3.5 flex items-center gap-4 hover:bg-surface-container/80 transition-all shadow-sm group"
                            >
                              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-outline-variant/10 bg-surface-container-high relative">
                                <img 
                                  src={shop.image} 
                                  alt={shop.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                              </div>

                              <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                                <div>
                                  <h4 className="font-headline font-black text-primary text-sm tracking-tight truncate group-hover:text-secondary-container transition-colors uppercase leading-snug">{shop.name}</h4>
                                  
                                  <p className="text-[10px] text-on-surface-variant truncate font-sans tracking-tight">{shop.address || 'Specialty Cafe'}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                  {/* Rating badge */}
                                  <div className="flex items-center gap-0.5 bg-secondary-container/10 px-1.5 py-0.5 rounded-md">
                                    <Star size={10} fill="currentColor" className="text-secondary fill-secondary" />
                                    <span className="text-[10px] font-bold text-on-surface">{shop.rating || "N/A"}</span>
                                  </div>

                                  {/* Open badge */}
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                    isOpen ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant/40'
                                  }`}>
                                    {isOpen ? 'Open Now' : 'Closed'}
                                  </span>

                                  {/* Distance text */}
                                  {distanceText && (
                                    <span className="text-[9.5px] font-bold text-[#a55e2b] font-mono leading-none bg-[#a55e2b]/10 px-1.5 py-0.5 rounded-md shrink-0">
                                      {distanceText}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedShopDetail(shop);
                                  setIsDetailExpanded(false);
                                  setIsListViewOpen(false);
                                  if (shop.location) {
                                    setMoveToLocation({ ...shop.location });
                                  }
                                }}
                                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shrink-0"
                                title="View Spot Details"
                              >
                                <Navigation2 size={14} className="fill-current" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <div className="inline-flex p-3 bg-surface-container rounded-full text-on-surface-variant/40 mb-3 font-headline">
                          <Coffee size={24} />
                        </div>
                        <p className="text-[10.5px] font-bold text-on-surface">No specialty coffee shops matches your radius</p>
                        <p className="text-[10px] text-on-surface-variant mt-1 font-sans">Try tapping another location on the map, broadening your search circle radius, or clearing your active filters.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Search & Chips Overlay */}
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
                      {isSearching && <Loader2 size={16} className="animate-spin text-[#6F4E37]" />}
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
                              className="absolute -top-1 -right-1 bg-[#6F4E37] text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-md"
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
                                      ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm'
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
                                  ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm'
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
                              className="flex-1 accent-[#6F4E37] cursor-pointer h-[2px] bg-[#e7e2db] dark:bg-[#3e2723] rounded-full appearance-none"
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
                                ? 'bg-[#6F4E37]/10 border-[#6F4E37] text-[#6F4E37] font-bold' 
                                : 'bg-surface/50 border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'
                            }`}
                          >
                            <Wifi size={13} />
                            <div className="leading-none">
                              <p className="text-[10.5px]">High-speed Wi-Fi</p>
                              <p className="text-[8.5px] opacity-75 mt-0.5">{filterWifi ? 'Active' : 'Any Internet'}</p>
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
                                ? 'bg-[#6F4E37]/10 border-[#6F4E37] text-[#6F4E37] font-bold' 
                                : 'bg-surface/50 border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'
                            }`}
                          >
                            <Coffee size={13} />
                            <div className="leading-none">
                              <p className="text-[10.5px]">Power Outlets</p>
                              <p className="text-[8.5px] opacity-75 mt-0.5">{filterOutlets ? 'Available' : 'Any seats'}</p>
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
                            className="bg-[#6F4E37] hover:bg-[#5a3f2c] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1 active:scale-95 transition-all text-right"
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
                                  {isOpen ? 'Open' : 'Closed'}
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

          {/* Social Tab Overlay Screen */}
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
                      placeholder="Search username (e.g., meerim_coffee)..."
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
                            Try searching for <span className="font-mono text-primary font-bold">meerim_coffee</span>, <span className="font-mono text-primary font-bold">erkin_roaster</span>, or <span className="font-mono text-primary font-bold">begaim_latte</span>.
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
                          Search by username above (e.g., <span className="font-bold">meerim_coffee</span>) or use the suggestions list to add friends and spot them on your map.
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
                                    {isOpen ? 'Open now' : 'Closed'}
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
                                      <span className="text-[9px] font-extrabold text-[#a55e2b] bg-[#a55e2b]/10 px-1.5 py-0.5 rounded-md tracking-wider font-mono">
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
                                      {isOpen ? 'Open now' : 'Closed'}
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

          {/* Expandable Café Detail Pop-up Overlay */}
          <AnimatePresence>
            {selectedShopDetail && (
              <>
                {/* Backdrop overlay when expanded to focus user attention */}
                {isDetailExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setIsDetailExpanded(false);
                      setSelectedShopDetail(null);
                    }}
                    className="fixed inset-0 bg-neutral-900/60 z-45 md:hidden pointer-events-auto cursor-pointer"
                  />
                )}

                <motion.div
                  initial={{ y: '100%', opacity: 0.9 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    height: isDetailExpanded ? '80vh' : '330px' 
                  }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                  className="fixed bottom-[102px] left-0 right-0 md:left-4 md:right-auto md:top-[88px] md:bottom-auto md:w-[380px] md:h-[calc(100vh-210px)] md:max-h-[750px] bg-surface/98 dark:bg-[#161412]/98 backdrop-blur-md z-45 rounded-t-[32px] md:rounded-[24px] border border-[#ece3e1]/40 dark:border-[#4f4240]/40 shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in fade-in"
                >
                  {/* Top image header block */}
                  <div className="relative w-full h-[140px] shrink-0 overflow-hidden">
                    <img 
                      src={selectedShopDetail.image} 
                      alt={selectedShopDetail.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
                    
                    {/* Pull utility handle overlay for mobile (increased height and width for premium responsiveness) */}
                    <div 
                      onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                      className="absolute top-0 inset-x-0 h-7 flex items-center justify-center cursor-pointer z-20"
                      title="Toggle expand details"
                    >
                      <div className="w-16 h-1.5 bg-white/55 dark:bg-white/35 rounded-full hover:bg-white/80 transition-colors" />
                    </div>
                    
                    {/* Floating Header Actions inside picture */}
                    <div className="absolute top-5 left-3 right-3 flex justify-between items-center z-20">
                      <div className="flex gap-2">
                        {isDetailExpanded ? (
                          <>
                            {/* Collapse button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDetailExpanded(false);
                              }}
                              className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-[#a55e2b] hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-[#a55e2b]/20 cursor-pointer"
                              title="Collapse details"
                            >
                              <ChevronDown size={18} className="animate-pulse" />
                            </button>
                            {/* Completely Close button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedShopDetail(null);
                                setIsDetailExpanded(false);
                              }}
                              className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-on-surface hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-outline-variant/10 cursor-pointer"
                              title="Close details"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedShopDetail(null);
                              setIsDetailExpanded(false);
                            }}
                            className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-on-surface hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-outline-variant/10 cursor-pointer"
                            title="Close details"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {/* Share action */}
                        <button 
                          onClick={() => {
                            setShareShopData(selectedShopDetail);
                          }}
                          className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-primary hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-outline-variant/10 cursor-pointer"
                          title="Share Cafe"
                        >
                          <Share2 size={14} />
                        </button>

                        {/* Save to favorites toggle */}
                        {(() => {
                          const isFav = favoritesList.some(f => f.id === selectedShopDetail.id);
                          return (
                            <button 
                              onClick={() => handleToggleFavorite(selectedShopDetail)}
                              className="w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-outline-variant/10 cursor-pointer text-[#FF4B4B]"
                              title={isFav ? "Saved" : "Save"}
                            >
                              <Heart size={14} fill={isFav ? "currentColor" : "none"} className={isFav ? "scale-110 animate-pulse duration-500 text-[#FF4B4B]" : "text-on-surface-variant/75"} />
                            </button>
                          );
                        })()}

                        {/* Visited status toggle */}
                        {(() => {
                          const isVisited = visitedList.some(v => v.id === selectedShopDetail.id);
                          return (
                            <button 
                              onClick={() => handleToggleVisited(selectedShopDetail)}
                              className={`w-8 h-8 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg border border-outline-variant/10 cursor-pointer ${isVisited ? 'text-emerald-600 dark:text-emerald-400' : 'text-on-surface-variant/75'}`}
                              title={isVisited ? "Visited" : "Mark as Visited"}
                            >
                              <CheckCircle2 size={14} fill={isVisited ? "currentColor" : "none"} className={isVisited ? "scale-110 text-emerald-600 dark:text-emerald-400" : "text-on-surface-variant/75"} />
                            </button>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Shop title overlay */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-headline font-black text-sm uppercase tracking-tight line-clamp-1">{selectedShopDetail.name}</h3>
                      <p className="text-[10px] text-white/80 line-clamp-1 font-sans mt-0.5">{selectedShopDetail.address || 'Specialty Coffee, Bishkek'}</p>
                    </div>
                  </div>

                  {/* Scrollable pop-up details and reviews container */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 hide-scrollbar">
                    
                    {/* Basic visual parameters stats bar */}
                    <div className="flex items-center justify-between border-b border-outline-variant/10 pb-3 shrink-0">
                      <div className="flex items-center gap-2">
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 bg-surface-container/60 px-2.5 py-1 rounded-xl border border-outline-variant/5">
                          <Star size={13} className="fill-secondary text-secondary" />
                          <span className="text-xs font-black">{selectedShopDetail.rating || '4.8'}</span>
                          <span className="text-[10px] text-on-surface-variant/80">({selectedShopDetail.reviewCount || 10})</span>
                        </div>

                        {/* Store hours opening status */}
                        {(() => {
                          const currentHour = new Date().getHours();
                          const isOpen = selectedShopDetail.openingHour !== undefined && selectedShopDetail.closingHour !== undefined
                            ? currentHour >= selectedShopDetail.openingHour && currentHour < selectedShopDetail.closingHour
                            : selectedShopDetail.status === 'Open Now';
                          return (
                            <span className={`text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded-xl border ${
                              isOpen 
                                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/10' 
                                : 'text-on-surface-variant/40 bg-on-surface-variant/5 border-outline-variant/10'
                            }`}>
                              {isOpen ? 'Open Now' : 'Closed'}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Distance */}
                      {selectedShopDetail.distance && (
                        <div className="flex items-center gap-1 text-[11px] text-on-surface-variant/80 font-mono">
                          <Navigation2 size={11} className="rotate-45" />
                          <span>{selectedShopDetail.distance}</span>
                        </div>
                      )}
                    </div>

                    {/* Visited Status Indicator Card */}
                    {(() => {
                      const isVisited = visitedList.some(v => v.id === selectedShopDetail.id);
                      return (
                        <div className={`p-3 rounded-2xl border flex items-center justify-between transition-all select-none ${
                          isVisited 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-400' 
                            : 'bg-surface-container-low border-outline-variant/10 text-on-surface'
                        }`}>
                          <div className="flex items-center gap-2.5">
                            <span className={`p-2 rounded-xl flex items-center justify-center ${isVisited ? 'bg-emerald-555/5 text-emerald-600 dark:text-emerald-450' : 'bg-surface-variant text-on-surface-variant'}`}>
                              <Coffee size={14} className={isVisited ? "text-emerald-600 dark:text-emerald-400" : "text-on-surface-variant"} />
                            </span>
                            <div className="text-left">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/85">Visited Status</p>
                              <p className="text-xs font-bold">{isVisited ? "You've been here! Checked in." : "Haven't visited yet."}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleVisited(selectedShopDetail)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all active:scale-95 cursor-pointer uppercase ${
                              isVisited 
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm' 
                                : 'bg-[#6F4E37]/10 hover:bg-[#6F4E37]/15 text-[#6f4e37] border border-[#6f4e37]/15'
                            }`}
                          >
                            {isVisited ? 'Visited' : 'Check-In'}
                          </button>
                        </div>
                      );
                    })()}

                    {/* Features checklist: Wifi / outlets */}
                    <div className="grid grid-cols-2 gap-2 shrink-0">
                      <div className="bg-surface-container/40 p-2 rounded-2xl border border-outline-variant/5 flex flex-col items-center justify-center text-center">
                        <Wifi size={14} className="text-primary mb-1" />
                        <span className="text-[9px] font-bold text-on-surface-variant block truncate w-full">WiFi</span>
                        <span className={`text-[10px] font-black truncate w-full ${
                          selectedShopDetail.wifi && selectedShopDetail.wifi.toLowerCase() !== 'none' && selectedShopDetail.wifi.toLowerCase() !== 'unavailable'
                            ? 'text-emerald-600' 
                            : 'text-red-500'
                        }`}>
                          {selectedShopDetail.wifi && selectedShopDetail.wifi.toLowerCase() !== 'none' && selectedShopDetail.wifi.toLowerCase() !== 'unavailable'
                            ? 'WiFi Available' 
                            : 'WiFi Unavailable'}
                        </span>
                      </div>
                      <div className="bg-surface-container/40 p-2 rounded-2xl border border-outline-variant/5 flex flex-col items-center justify-center text-center">
                        <Compass size={14} className="text-primary mb-1" />
                        <span className="text-[9px] font-bold text-on-surface-variant block truncate w-full">Power Plugs</span>
                        <span className="text-[10px] font-black text-on-surface truncate w-full">{selectedShopDetail.outlets ? 'Available' : 'None'}</span>
                      </div>
                    </div>

                    {/* About paragraph block */}
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold text-[#a55e2b] uppercase tracking-wider">About Café</h4>
                      <p className="text-xs text-on-surface-variant/95 leading-relaxed font-sans">
                        {selectedShopDetail.about || 'Specialty artisanal beans harvested, processed, and extracted at maximum extraction yields with focus and love in Bishkek.'}
                      </p>
                    </div>

                    {/* Expand Detail toggle action */}
                    {!isDetailExpanded ? (
                      <button
                        onClick={() => setIsDetailExpanded(true)}
                        className="w-full py-3 mt-1.5 bg-[#a55e2b] hover:bg-[#a55e2b]/90 text-white rounded-2xl text-xs font-black shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 animate-pulse"
                      >
                        <MessageSquare size={14} />
                        Read Coffee Reviews & More
                      </button>
                    ) : (
                      <div className="space-y-4 pt-2 border-t border-outline-variant/15">
                        {/* Extended Coordinates info details */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold text-[#a55e2b] uppercase tracking-wider">Coordinates & Directions</h4>
                          <div className="bg-surface-container/40 p-3 rounded-2xl border border-outline-variant/5 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10.5px] font-bold text-on-surface truncate">{selectedShopDetail.address || 'Bishkek specialty location'}</p>
                              <p className="text-[9px] text-on-surface-variant font-mono mt-0.5">{selectedShopDetail.location.lat.toFixed(4)}°, {selectedShopDetail.location.lng.toFixed(4)}°</p>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedShopDetail.address || '');
                                setAddNotification("Address copied!");
                                setTimeout(() => setAddNotification(null), 2500);
                              }}
                              className="p-1 px-2.5 bg-[#a55e2b]/10 hover:bg-[#a55e2b] text-[#a55e2b] hover:text-white rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <Copy size={11} />
                              Copy
                            </button>
                          </div>
                        </div>

                        {/* Interactive customer feedback review engine inside pop-up */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-bold text-[#a55e2b] uppercase tracking-wider">Reviews Circle</h4>
                            <button
                              onClick={() => {
                                setSelectedShopForReview(selectedShopDetail);
                                setReviewRating(5);
                                setReviewComment('');
                              }}
                              className="text-[10px] text-[#a55e2b] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <PenLine size={10} />
                              Leave feedback
                            </button>
                          </div>

                          {/* Featured Inline "Your Experience" Editor Card */}
                          {(() => {
                            const userReviewForThisShop = reviewsList.find(r => r.shopId === selectedShopDetail.id);
                            return (
                              <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 shadow-sm shrink-0 transition-all duration-300">
                                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15 mb-3">
                                  <div className="flex items-center gap-1.5">
                                    <Coffee size={13} className="text-[#a55e2b]" />
                                    <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider font-mono">Your Experience</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isEditingInlineExplore ? (
                                      <div className="flex gap-1.5 items-center">
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            if (userReviewForThisShop) {
                                              setInlineRatingExplore(userReviewForThisShop.rating);
                                              setInlineCommentExplore(userReviewForThisShop.comment);
                                            } else {
                                              setInlineRatingExplore(5);
                                              setInlineCommentExplore('');
                                            }
                                            setIsEditingInlineExplore(false);
                                          }}
                                          className="bg-outline-variant/10 text-on-surface-variant text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider font-mono hover:bg-outline-variant/25 transition-all cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            if (!inlineCommentExplore.trim()) return;
                                            const newReview = {
                                              id: userReviewForThisShop?.id || `rev_${Date.now()}`,
                                              shopId: selectedShopDetail.id,
                                              shopName: selectedShopDetail.name,
                                              user: userProfile.name,
                                              avatar: userProfile.avatar,
                                              rating: inlineRatingExplore,
                                              comment: inlineCommentExplore,
                                              time: 'Just now'
                                            };
                                            setReviewsList(prev => {
                                              const filtered = prev.filter(r => r.shopId !== selectedShopDetail.id);
                                              return [newReview, ...filtered];
                                            });
                                            setAddNotification(userReviewForThisShop ? 'Review saved!' : 'Review posted!');
                                            setTimeout(() => setAddNotification(null), 2500);
                                            setIsEditingInlineExplore(false);
                                          }}
                                          className="bg-[#a55e2b] text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider font-mono hover:brightness-110 shadow-sm transition-all cursor-pointer"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex gap-2 items-center">
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            if (userReviewForThisShop) {
                                              setInlineRatingExplore(userReviewForThisShop.rating);
                                              setInlineCommentExplore(userReviewForThisShop.comment);
                                            } else {
                                              setInlineRatingExplore(5);
                                              setInlineCommentExplore('');
                                            }
                                            setIsEditingInlineExplore(true);
                                          }}
                                          className="bg-primary/5 text-primary text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider font-mono hover:bg-primary/15 transition-all cursor-pointer flex items-center gap-1"
                                        >
                                          <PenLine size={9} />
                                          {userReviewForThisShop ? 'Edit' : 'Write'}
                                        </button>
                                        {userReviewForThisShop && (
                                          <>
                                            <span className="text-outline-variant/30 text-[9px]">|</span>
                                            <button 
                                              type="button"
                                              onClick={() => {
                                                setReviewsList(prev => prev.filter(r => r.shopId !== selectedShopDetail.id));
                                                setAddNotification("Review deleted!");
                                                setTimeout(() => setAddNotification(null), 2500);
                                              }}
                                              className="text-error/80 hover:text-error text-[9px] font-extrabold uppercase tracking-wider font-mono hover:underline cursor-pointer"
                                            >
                                              Delete
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {isEditingInlineExplore ? (
                                  <div className="space-y-3">
                                    <div className="flex flex-col items-center py-2 px-1 bg-surface/40 rounded-xl border border-outline-variant/10">
                                      {renderInteractiveStars(
                                        inlineRatingExplore,
                                        setInlineRatingExplore,
                                        inlineHoverRatingExplore,
                                        setInlineHoverRatingExplore
                                      )}
                                      <p className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-widest mt-1.5 font-mono">
                                        ☕ {getRatingLabel(inlineRatingExplore)} ({inlineRatingExplore.toFixed(1)})
                                      </p>
                                    </div>
                                    
                                    <textarea
                                      value={inlineCommentExplore}
                                      onChange={(e) => setInlineCommentExplore(e.target.value)}
                                      placeholder="Rate your sip! Mention manual drip roasts, acidity notes, baristas' service, or WiFi quality..."
                                      className="w-full text-xs bg-surface/50 rounded-xl p-2.5 border border-outline-variant/30 min-h-[60px] outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary placeholder:text-on-surface-variant/40 text-on-surface leading-normal resize-none"
                                    />
                                    
                                    <div className="flex justify-end gap-2 pt-1 border-t border-outline-variant/5">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          if (userReviewForThisShop) {
                                            setInlineRatingExplore(userReviewForThisShop.rating);
                                            setInlineCommentExplore(userReviewForThisShop.comment);
                                          } else {
                                            setInlineRatingExplore(5);
                                            setInlineCommentExplore('');
                                          }
                                          setIsEditingInlineExplore(false);
                                        }}
                                        className="px-3 py-1.5 rounded-lg border border-outline-variant text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container transition-colors"
                                      >
                                        Cancel
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          if (!inlineCommentExplore.trim()) return;
                                          const newReview = {
                                            id: userReviewForThisShop?.id || `rev_${Date.now()}`,
                                            shopId: selectedShopDetail.id,
                                            shopName: selectedShopDetail.name,
                                            user: userProfile.name,
                                            avatar: userProfile.avatar,
                                            rating: inlineRatingExplore,
                                            comment: inlineCommentExplore,
                                            time: 'Just now'
                                          };
                                          setReviewsList(prev => {
                                            const filtered = prev.filter(r => r.shopId !== selectedShopDetail.id);
                                            return [newReview, ...filtered];
                                          });
                                          setAddNotification(userReviewForThisShop ? 'Review saved!' : 'Review posted!');
                                          setTimeout(() => setAddNotification(null), 2500);
                                          setIsEditingInlineExplore(false);
                                        }}
                                        className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-[10px] font-bold uppercase tracking-wider hover:brightness-110 shadow-sm transition-all"
                                      >
                                        Save Experience
                                      </button>
                                    </div>
                                  </div>
                                ) : userReviewForThisShop ? (
                                  <div className="bg-surface/55 rounded-xl p-3 border border-outline-variant/10">
                                    <div className="flex items-center justify-between mb-1.5">
                                      <div className="flex items-center gap-1">
                                        <div className="flex items-center gap-0.5">
                                          {[0, 1, 2, 3, 4].map((j) => {
                                            const isFull = userReviewForThisShop.rating >= j + 1;
                                            const isHalf = userReviewForThisShop.rating === j + 0.5;
                                            return (
                                              <div key={j} className="relative w-3 h-3">
                                                <Star size={12} className="text-outline-variant absolute inset-0" />
                                                {isFull && <Star size={12} className="fill-secondary text-secondary absolute inset-0" />}
                                                {isHalf && (
                                                  <div className="absolute inset-y-0 left-0 overflow-hidden w-1/2">
                                                    <Star size={12} className="fill-secondary text-secondary" style={{ maxWidth: 'none' }} />
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                        <span className="text-[9px] font-extrabold text-[#6F4E37] bg-[#6F4E37]/10 px-1.5 py-0.5 rounded font-mono tracking-wider uppercase ml-1.5">
                                          {getRatingLabel(userReviewForThisShop.rating)} ({userReviewForThisShop.rating.toFixed(1)})
                                        </span>
                                      </div>
                                      <span className="text-[9px] text-on-surface-variant font-medium">{userReviewForThisShop.time}</span>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant leading-relaxed italic animate-fade-in">
                                      "{userReviewForThisShop.comment}"
                                    </p>
                                  </div>
                                ) : (
                                  <div className="text-center py-4 px-2 bg-surface/30 rounded-xl border border-dashed border-outline-variant/20">
                                    <p className="text-[10px] font-bold text-on-surface-variant/75 font-sans">You haven't reviewed this coffee spot yet.</p>
                                    <p className="text-[9px] text-on-surface-variant/50 mt-0.5 mb-2 font-sans">Share your drip notes, wifi speed, and cozy vibes with the circle.</p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setInlineRatingExplore(5);
                                        setInlineCommentExplore('');
                                        setIsEditingInlineExplore(true);
                                      }}
                                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#a55e2b]/10 text-[#a55e2b] rounded-lg text-[9px] font-extrabold uppercase tracking-wider font-mono hover:bg-[#a55e2b]/20 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                                    >
                                      <PenLine size={9} />
                                      Write / Edit Review
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          <div className="space-y-3">
                            {(() => {
                              const shopReviews = reviewsList.filter(r => r.shopId === selectedShopDetail.id && r.user !== userProfile.name);
                              if (shopReviews.length === 0) {
                                return (
                                  <div className="text-center py-6 px-3 bg-surface-container/30 rounded-2xl border border-dashed border-outline-variant/10">
                                    <Coffee className="mx-auto text-on-surface-variant/30 mb-2" size={24} />
                                    <p className="text-[10px] font-bold text-on-surface-variant/80">No other customer reviews yet</p>
                                    <p className="text-[9px] text-on-surface-variant/60 mt-0.5">Be the first of your circle to rate your sip here!</p>
                                  </div>
                                );
                              }
                              return shopReviews.map(review => (
                                <div key={review.id} className="bg-surface-container/30 p-3 rounded-2xl border border-outline-variant/10 flex flex-col gap-1.5 shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-extrabold font-mono">
                                        {review.user?.substring(0, 2).toUpperCase() || 'CO'}
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-bold text-on-surface leading-tight">
                                          {review.user || 'Coffee Lover'} ({getRatingLabel(review.rating)})
                                        </p>
                                        <p className="text-[8px] text-on-surface-variant/60 mt-0.5">{review.time || 'Reviewed'}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                      {[0, 1, 2, 3, 4].map((j) => {
                                        const isFull = review.rating >= j + 1;
                                        const isHalf = review.rating === j + 0.5;
                                        return (
                                          <div key={j} className="relative w-2 h-2">
                                            <Star size={8} className="text-outline-variant absolute inset-0" />
                                            {isFull && <Star size={8} className="fill-secondary text-secondary absolute inset-0" />}
                                            {isHalf && (
                                              <div className="absolute inset-y-0 left-0 overflow-hidden w-1/2">
                                                <Star size={8} className="fill-secondary text-secondary" style={{ maxWidth: 'none' }} />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-on-surface leading-relaxed italic px-0.5">
                                    "{review.comment}"
                                  </p>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* Collapsing state button */}
                        <button
                          onClick={() => setIsDetailExpanded(false)}
                          className="w-full py-2.5 bg-surface border border-outline-variant/30 hover:bg-surface-container-low text-on-surface rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer text-center"
                        >
                          Show Less Details
                        </button>
                      </div>
                    )}

                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Review Modal Backdrop & Drawer overlay */}
          <AnimatePresence>
            {selectedShopForReview && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedShopForReview(null)}
                  className="fixed inset-0 bg-neutral-900 z-[100] pointer-events-auto cursor-pointer"
                />

                {/* Stars/Review Bottom Sheet Drawer */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-surface rounded-t-[32px] border-t border-outline-variant/30 z-[105] px-6 pt-5 pb-10 shadow-2xl overflow-y-auto pointer-events-auto"
                >
                  <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-6" />

                  <div className="max-w-md mx-auto">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                        <Coffee size={22} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-[#6F4E37] uppercase">Brew Rating</span>
                        <h3 className="text-lg font-black text-on-surface leading-snug">{selectedShopForReview.name}</h3>
                      </div>
                    </div>

                    <form onSubmit={handleSubmitReview} className="space-y-5">
                      {/* Interactive Stars */}
                      <div className="bg-surface-container rounded-2xl p-4 text-center border border-outline-variant/10">
                        <p className="text-xs font-bold text-on-surface-variant mb-2">Rate your sip!</p>
                        
                        {renderInteractiveStars(
                          reviewRating,
                          setReviewRating,
                          hoverRating,
                          setHoverRating
                        )}
                        
                        <p className="text-xs font-extrabold text-[#6F4E37] mt-2.5 uppercase tracking-widest font-mono flex items-center justify-center gap-1">
                          <span>☕</span>
                          <span>{getRatingLabel(reviewRating)}</span>
                          <span className="text-[10px] text-on-surface-variant/70">({reviewRating.toFixed(1)})</span>
                        </p>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider font-mono">Your Experience</label>
                        <textarea
                          required
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full min-h-[120px] bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 text-sm placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none outline-none leading-relaxed"
                          placeholder="What did you order? Mention manual drip roasts, acidity notes, baristas' service, or WiFi quality..."
                        />
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedShopForReview(null)}
                          className="py-3.5 border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="py-3.5 bg-primary hover:brightness-110 text-on-primary rounded-xl text-xs font-bold shadow-soft transition-all"
                        >
                          Save/Edit
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Share Profile Modal Backdrop & Drawer overlay */}
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
                        <div className="w-10 h-10 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
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
                        <div className="w-10 h-10 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
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

          {/* Share Coffee Shop Modal Backdrop & Drawer overlay */}
          <AnimatePresence>
            {shareShopData && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShareShopData(null)}
                  className="fixed inset-0 bg-neutral-900 z-[100] pointer-events-auto cursor-pointer"
                />

                {/* Share Coffee Shop Bottom Sheet Drawer */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-surface rounded-t-[32px] border-t border-outline-variant/30 z-[105] px-6 pt-5 pb-10 shadow-2xl overflow-y-auto pointer-events-auto text-left"
                >
                  <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-6 shrink-0" />

                  <div className="max-w-md mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center text-primary shrink-0 shadow-sm">
                          <Coffee size={30} className="fill-current text-[#6F4E37]" />
                        </div>
                        <div>
                          <h3 className="font-headline font-black text-primary text-base">Share Coffee Shop</h3>
                          <p className="text-[10px] text-on-surface-variant/70 font-mono">Recommend this specialty spot</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShareShopData(null)}
                        className="p-1.5 rounded-full hover:bg-surface-container active:scale-90 transition-colors border border-outline-variant/10"
                      >
                        <X size={16} className="text-on-surface-variant" />
                      </button>
                    </div>

                    {/* Coffee Shop Preview Card */}
                    <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 flex items-center gap-4 mb-6 shadow-sm">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-outline-variant/10 bg-surface-container-high">
                        <img 
                          src={shareShopData.image} 
                          alt={shareShopData.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline font-black text-primary text-sm uppercase tracking-tight truncate">{shareShopData.name}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={11} fill="currentColor" className="text-secondary fill-secondary" />
                          <span className="text-[11px] font-bold text-on-surface">{shareShopData.rating}</span>
                          <span className="text-[10px] text-on-surface-variant/80">({shareShopData.reviewCount || 120} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-on-surface-variant/80">
                          <MapPin size={10} className="text-[#6F4E37] shrink-0" />
                          <p className="text-[10px] truncate font-sans">{shareShopData.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Social networks & text messaging buttons */}
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 font-mono">Share via</h4>
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {/* SMS & Text Msg */}
                      <a
                        href={`sms:?body=${encodeURIComponent(`Check out this coffee shop on Brewmap! ☕✨\n\n🏠 ${shareShopData.name}\n📍 ${shareShopData.address}\n\nJoin the roaster community and discover more: ${window.location.origin}/shop/${shareShopData.id}`)}`}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-center group active:scale-95"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                          <MessageSquare size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant">Text Msg</span>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this specialty coffee shop on Brewmap! ☕✨\n\n🏠 *${shareShopData.name}*\n⭐️ ${shareShopData.rating} Rating\n📍 ${shareShopData.address}\n\nView details here: ${window.location.origin}/shop/${shareShopData.id}`)}`}
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
                        href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/shop/${shareShopData.id}`)}&text=${encodeURIComponent(`Check out this awesome specialty coffee shop, ${shareShopData.name}, on Brewmap! ☕✨\n\n⭐️ Rating: ${shareShopData.rating}\n🗺️ Address: ${shareShopData.address}`)}`}
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
                        href={`mailto:?subject=${encodeURIComponent(`Specialty Coffee Recommendation: ${shareShopData.name}`)}&body=${encodeURIComponent(`Hey! I wanted to recommend this coffee shop from Brewmap:\n\n🏠 ${shareShopData.name}\n⭐️ Rating: ${shareShopData.rating}\n📍 Address: ${shareShopData.address}\n\nCheck out reviews and details here: ${window.location.origin}/shop/${shareShopData.id}\n\nHappy brewing!`)}`}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-center group active:scale-95"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
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

          {/* My Reviews Modal Backdrop & Sheet */}
          <AnimatePresence>
            {showMyReviewsModal && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMyReviewsModal(false)}
                  className="fixed inset-0 bg-neutral-900 z-[100] pointer-events-auto cursor-pointer"
                />

                {/* My Reviews Bottom Sheet/Modal */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-surface rounded-t-[32px] border-t border-outline-variant/30 z-[105] px-6 pt-5 pb-10 shadow-2xl overflow-y-auto pointer-events-auto flex flex-col"
                >
                  <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-6 flex-shrink-0" />

                  <div className="max-w-md mx-auto w-full flex-1 flex flex-col min-h-0 text-left">
                    <div className="mb-6 flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-3 text-left">
                        <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                          <Star size={20} className="fill-current text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-headline font-black text-primary text-base">My Reviews</h3>
                          <p className="text-[10px] text-on-surface-variant/70 font-mono">Reviews you left on your favorite spots</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMyReviewsModal(false)}
                        className="p-1.5 rounded-full hover:bg-surface-container active:scale-90 transition-colors border border-outline-variant/10"
                      >
                        <X size={16} className="text-on-surface-variant" />
                      </button>
                    </div>

                    {/* List of reviews */}
                    <div className="space-y-4 overflow-y-auto pr-1 pb-4 flex-1">
                      {reviewsList.length === 0 ? (
                        <div className="text-center py-10 px-4 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
                          <Coffee className="mx-auto text-on-surface-variant/40 mb-3" size={32} />
                          <p className="text-xs font-bold text-on-surface-variant">No reviews left yet</p>
                          <p className="text-[10px] text-on-surface-variant/60 mt-1">Explore coffee shops around you and rate the experience!</p>
                        </div>
                      ) : (
                        reviewsList.map((review) => (
                          <div 
                            key={review.id} 
                            onClick={() => {
                              setShowMyReviewsModal(false);
                              setActiveTab('explore');
                              const shopData = STATIC_SHOPS.find(s => s.id === review.shopId) || discoveredShops.find(s => s.id === review.shopId);
                              if (shopData) {
                                setSelectedShopDetail(shopData);
                                setIsDetailExpanded(true);
                              }
                            }}
                            className="bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/65 rounded-2xl p-4 transition-all hover:scale-[1.01] hover:shadow-sm cursor-pointer text-left block"
                          >
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-headline font-bold text-xs text-primary hover:underline line-clamp-1">{review.shopName}</h4>
                                <span className="text-[9px] text-on-surface-variant/60 font-mono">{review.time || 'Reviewed'}</span>
                              </div>
                              <div className="bg-secondary/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Star size={9} className="fill-secondary text-secondary" />
                                <span className="text-[10px] font-black text-secondary">
                                  {review.rating.toFixed(1)} - {getRatingLabel(review.rating)}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-on-surface italic line-clamp-3">
                              "{review.comment}"
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Profile Tab Overlay Screen */}
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
                          <p className="text-[9px] text-[#6F4E37] mb-2 font-medium">☕ Choose your mug logo. Personal picture uploads are disabled.</p>
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
                                  <span className="text-[8px] font-bold text-center mt-1.5 truncate w-full text-on-surface-variant">{option.name}</span>
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
                        <p className="text-[9px] text-on-surface-variant/60 text-right mt-1 font-mono">{editBio.length}/120 characters</p>
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
                          <p className="text-[9px] uppercase tracking-wider font-bold text-on-surface-variant/80">{t.visitedSpots}</p>
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
                          <p className="text-[9px] uppercase tracking-wider font-bold text-on-surface-variant/80">{t.connections}</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMyReviewsModal(true)}
                          className="bg-surface-container/60 p-3 rounded-2xl text-center border border-outline-variant/10 hover:bg-surface-container-high hover:border-outline-variant transition-all cursor-pointer shadow-sm active:scale-95 w-full block"
                        >
                          <p className="text-lg font-headline font-black text-primary">{reviewsList.length}</p>
                          <p className="text-[9px] uppercase tracking-wider font-bold text-on-surface-variant/80">{t.reviews}</p>
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
                                        className="bg-surface/90 dark:bg-zinc-900/40 border border-outline-variant/10 rounded-2xl flex flex-col hover:border-[#6F4E37]/30 transition-all duration-300 overflow-hidden shadow-sm"
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
                                              <h6 className="text-xs font-black font-headline text-on-surface leading-tight truncate hover:text-[#6F4E37] transition-colors">
                                                {shop.name}
                                              </h6>
                                              <span className="flex-shrink-0 text-[8.5px] text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5 uppercase tracking-wide">
                                                <Check size={9} className="stroke-[3]" /> Visited
                                              </span>
                                            </div>
                                            <p className="text-[10px] text-on-surface-variant truncate mt-0.5 font-sans">{shop.address || 'Specialty Cafe'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full ${isOpen ? 'text-secondary bg-secondary/5' : 'text-on-surface-variant/40 bg-on-surface-variant/5'}`}>
                                                {isOpen ? 'Open Now' : 'Closed'}
                                              </span>
                                              <span className="text-[9px] font-bold text-primary flex items-center gap-0.5 font-sans">
                                                <span>{shop.rating}</span>
                                                <span className="text-[8px]">⭐</span>
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
                                                  <p className="text-[8px] uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1 font-headline">Atmosphere & Specialty</p>
                                                  <p className="text-[11px] text-on-surface-variant/90 leading-relaxed font-sans italic">
                                                    "{shop.about || 'A highly recommended specialty coffee spot offering premium single-origin pour-overs and meticulous custom espresso profiles in a wonderful atmosphere.'}"
                                                  </p>
                                                </div>

                                                {/* Amenities quick-glance */}
                                                <div className="grid grid-cols-2 gap-2 bg-surface-container-low/40 p-2 rounded-xl border border-outline-variant/5">
                                                  <div className="text-left">
                                                    <span className="text-[8px] font-bold text-on-surface-variant/60 block uppercase">Wifi Setup</span>
                                                    <span className="text-[11px] font-bold text-on-surface font-sans">{shop.wifi || 'Free Connection'}</span>
                                                  </div>
                                                  <div className="text-left">
                                                    <span className="text-[8px] font-bold text-on-surface-variant/60 block uppercase">Power Outlets</span>
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
                                                    className="flex-1 py-1.5 bg-[#6F4E37] hover:bg-[#5c4033] text-white rounded-xl text-[10.5px] font-black transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer shadow-sm uppercase tracking-wide"
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
                                          <p className="text-[9.5px] text-on-surface-variant truncate">@{originalUser?.username || friend.name.toLowerCase()}</p>
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
                              <Globe size={15} className="text-[#306a34]" />
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
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none ${bgLocationTracking ? 'bg-[#306a34]' : 'bg-outline-variant'}`}
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
                              <label className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Current Password</label>
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
                              <label className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">New Password</label>
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
                              <label className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Confirm New Password</label>
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
                              <label className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Current Email Address</label>
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
                              <label className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">New Email Address</label>
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
                              <p className="font-bold">Last Updated: May 2026</p>
                              <p>Welcome to BrewSpot! We respect your privacy and protect your personal coffee exploration data.</p>
                              <p className="font-bold text-primary">1. Information We Collect</p>
                              <p>We process your profile details, coffee scores, WiFi notes, and coordinates when choosing open coffee shops near Bishkek.</p>
                              <p className="font-bold text-primary">2. Background Location Tracking</p>
                              <p>When manually activated, location status can be computed locally to notify you of specialty cafes nearby, even when browsing background windows are minimized.</p>
                              <p className="font-bold text-primary">3. Sovereignty</p>
                              <p>All reviews are kept in your sandbox cache. Delete any time you wish inside the settings menu.</p>
                            </div>
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
                              <p className="font-bold">Last Updated: May 2026</p>
                              <p>We supply map guides for coffee shops representation in Kyrgyzstan. Calculations are processed locally and dynamically.</p>
                              <p className="font-bold text-primary">1. Community Use</p>
                              <p>You agree not to spam review lines with commercial ads, and provide authentic ratings of specialty pour-over experiences.</p>
                            </div>
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
                              <p className="font-bold text-[#6F4E37]">Code of Conduct</p>
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
                                  className="mt-2.5 px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[9px]"
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
                                  <label className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5 font-mono">Name</label>
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
                                  <label className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5 font-mono">Email</label>
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
                                  <label className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5 font-mono">Inquiry</label>
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
