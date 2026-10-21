import { motion, AnimatePresence } from 'motion/react';
import { Search, Map as MapIcon, User, Coffee, RefreshCcw, Loader2 } from 'lucide-react';
import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import { MAP_STYLES_PRESETS } from '../lib/mapStyles';
import { CUSTOM_VECTOR_AVATARS } from '../lib/sampleUsers';

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

export function MapContent({ 
  onSearch, 
  isSearching, 
  shops, 
  friends, 
  cities,
  searchQuery,
  triggerSearch,
  locationReady,
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
  locationReady: boolean,
  moveToLocation?: { lat: number, lng: number } | null,
  currentUserLocation?: { lat: number, lng: number } | null,
  onShowShopDetail: (shop: any) => void,
  pointedLocation?: { lat: number, lng: number } | null,
  pointedRadius?: number,
  onMapClick?: (latLng: { lat: number, lng: number }) => void,
  mapStyleId?: 'auto' | 'oat' | 'roast' | 'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom',
  customRoadColor?: string,
  customLandscapeColor?: string,
  customParkColor?: string,
  customWaterColor?: string,
  showFriendsOnMap?: boolean,
  showRadiusGuide?: boolean,
  showShopNames?: boolean,
  onMapStyleChange: (id: 'auto' | 'oat' | 'roast' | 'earthy' | 'nordic' | 'espresso' | 'retro' | 'custom') => void,
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
      // No typed query: list every cafe inside the visible map area.
      // Typed query (shop name, street, town): bias towards the map centre instead.
      const bounds = map.getBounds();
      const { places } = await placesLib.Place.searchByText({
        textQuery: query || 'coffee shop',
        includedType: 'cafe',
        ...(!query && bounds ? { locationRestriction: bounds } : { locationBias: map.getCenter() }),
        fields: ['id', 'displayName', 'location', 'rating', 'userRatingCount', 'formattedAddress', 'photos', 'regularOpeningHours'],
        maxResultCount: 20,
      });
      
      if (places) {
        const openStates = await Promise.all(places.map(p => p.isOpen().catch(() => undefined)));
        onSearch(places.map((p, i) => ({
          id: p.id,
          name: p.displayName,
          location: { lat: p.location?.lat(), lng: p.location?.lng() },
          rating: p.rating,
          reviewCount: p.userRatingCount,
          address: p.formattedAddress,
          image: p.photos?.[0]?.getURI({ maxWidth: 400 }) || `${import.meta.env.BASE_URL}images/5559035ebc.jpg`,
          // Real opening hours from Google; undefined means Google has none for this place
          status: openStates[i] === undefined ? 'Hours unknown' : openStates[i] ? 'Open Now' : 'Closed',
          fromGoogle: true
        })));
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [map, placesLib, onSearch]);

  // Initial automatic load: once the map is ready and the visitor's location is known (or refused)
  useEffect(() => {
    if (map && placesLib && locationReady && !initialFetchDone.current) {
      initialFetchDone.current = true;
      if (moveToLocation) {
        map.setCenter(moveToLocation);
        map.setZoom(15);
      }
      // Wait for the map to settle so the visible bounds match the new centre
      google.maps.event.addListenerOnce(map, 'idle', () => performSearch(''));
    }
  }, [map, placesLib, locationReady, moveToLocation, performSearch]);

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
                      <p className="text-[10px] text-on-surface-variant text-center">⭐ {shop.rating}</p>
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
                <div className="bg-secondary text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-md mt-1 scale-90 opacity-90 group-hover:scale-100 group-hover:opacity-100 transition-all border border-white whitespace-nowrap z-30">
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
