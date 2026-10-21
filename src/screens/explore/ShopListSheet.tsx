import { motion, AnimatePresence } from 'motion/react';
import { ShopPhoto } from '../../components/ShopPhoto';
import { Navigation2, Coffee, X, Star } from 'lucide-react';
import { getDistanceInKm } from '../../lib/geo';
import { statusLabel } from '../../lib/shops';

export interface ShopListSheetProps {
  currentUserLocation: any;
  Date: DateConstructor;
  filteredShops: any;
  isListViewOpen: any;
  pointedLocation: any;
  pointedRadius: any;
  setIsDetailExpanded: any;
  setIsListViewOpen: any;
  setMoveToLocation: any;
  setSelectedShopDetail: any;
}

export function ShopListSheet(props: ShopListSheetProps) {
  const {
    currentUserLocation,
    Date,
    filteredShops,
    isListViewOpen,
    pointedLocation,
    pointedRadius,
    setIsDetailExpanded,
    setIsListViewOpen,
    setMoveToLocation,
    setSelectedShopDetail,
  } = props;

  return (
    <>
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
                                <ShopPhoto 
                                  shop={shop} 
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
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                    isOpen ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant/40'
                                  }`}>
                                    {statusLabel(isOpen, shop.status, 'Open Now')}
                                  </span>

                                  {/* Distance text */}
                                  {distanceText && (
                                    <span className="text-[10px] font-bold text-[#a55e2b] font-mono leading-none bg-[#a55e2b]/10 px-1.5 py-0.5 rounded-md shrink-0">
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
    </>
  );
}
