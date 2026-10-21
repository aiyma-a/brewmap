# Brewmap — Project Development Handoff & Mindmap (v1.0.9)
# Date: May 24, 2026

## 1. Core Concept & Identity
* **App Name:** Brewmap (BrewSpot)
* **Description:** An artisanal specialty coffee roaster locator and interactive community platform for coffee lovers in Kyrgyzstan (including Bishkek).
* **Vibe:** Swiss/Modern, light/dark themes, warm artisanal brown (`#6F4E37`) and clean green (`#306a34`) highlight accents, high-contrast display typography paired with JetBrains Mono.

## 2. File Directory & Key Layers
* `/src/screens/ExploreScreen.tsx`: The primary map dashboard. Contains the Google Maps viewport, coffee roasters catalog lists, community explore, saved spots tabs, active profile, and the primary application settings interface.
* `/src/screens/BrewlogScreen.tsx`: Community reviews, articles, custom user brewlogs, and coffee logs. Synchronizes user-selected translation languages and display modes.
* `/src/screens/DetailScreen.tsx`: Coffee roaster detail view, showing hours, seating, amenities (WiFi, power plugs), artisanal roasting equipment details, menu highlights, and location pins.
* `/src/screens/AuthScreen.tsx`: Comprehensive authorization screen supporting fast creation of local-centric profiles, login/registration prompts, and forgot password instructions.
* `/src/lib/i18n.ts`: Localized translation dictionaries accommodating English (EN), Russian (РУ), and Kyrgyz (КЫР) languages.
* `/src/data.ts`: Structural database of local specialty roasters, coordinates, tasting profiles, and historical information.

## 3. Key Completed Updates & Polish
* **Clickable Coffee Shop Pins**: Fixed a map gesture/click-collision issue by adding robust event listeners (`stopPropagation` on click, dblclick, mousedown, pointerdown, and touchstart) and utilizing `google.maps.OverlayView.preventMapHitsFrom(container)` to ensure coffee shops on the map are responsive, clickable, and reliably toggle their respective detailed info sheet.
* **Green Terrain & Landscape Presets**: Expanded the map customizer's range of landscape styling by introducing fresh, vibrant green terrain coloring options (including **Pistachio Cream 🟢**, **Fern Leaf 🟢**, **Lush Mint 🟢**, **Vibrant Meadow 🟢**, and **Forest Deep 🟢**).
* **Thematic Custom Blends Saving**: Added a powerful custom blend storage generator in the Map Customizer dashboard that allows users to save, name, visual-preview, and load their bespoke color configurations locally (`localStorage` persistence). Included interactive horizontal multi-segment color preview bars showing road, landscape, park, and water colors, a name creation panel, quick loading, and deleting actions, preconfigured with 3 beautiful sample reference blends (**Pistachio Espresso ☕️**, **Sweet Berry Brew 🍒**, and **Iced Mint Foam 🌿**).
* **Profile Link Removal**: Removed the redundant, clunky "Profile Link" copy block from the "Share via" section to keep the share layout perfectly streamlined, minimalist and focused entirely on interactive external message/social icons.
* **Cozy Coffee-Mug Avatars**: Migrated the mock user profile registry (`SEARCHABLE_USERS` & `FRIENDS`) and list renderings to use high-fidelity, color-customized "Coffee Mug" SVG vector avatars (utilizing the `Coffee` icon from Lucide-React with clean background capsules) in the Recommended Profiles sidebar.
* **Interactive Favorites List in Filters**: Tapping "View More" (or "View Less") under the Filter screen's favorite section dynamically expands/collapses the saved spot list.
* **Remove Favorites from Filter Panel**: Provided a dedicated tap action on the Heart icons next to favorite items so users can instantly delete/untoggle saved coffee shops from local storage state.
* **Multi-City Filter Engine**: Upgraded the city selection from single-select to robust multi-select (including Bishkek, Tokmok, Kemin, Kant, and Kara-Balta simultaneously).
* **Universal Search Radius Refinement**: Restructured the search radius computation. Instead of defaulting strictly to Bishkek coordinates, the radius is now calculated from the centers of the chosen active cities (or GPS location if loaded), allowing Kemin and Tokmok shops to be queried perfectly.
* **Bishkek as Default**: Set Bishkek as the standard default chosen city upon loading and clearing filters.
* **Filter Label Polish**: Simplified labels by changing "FREE WI-FI" to "WI-FI", and removed the unnecessary, crowded "Unavailable" (under Wi-Fi when false) and "Limited" (under Outlets when false) indicators on the settings screen.
* **Streamlined City Selections**: Removed the redundant "Nearby" item from the geographical city selection list to prevent visual profile overlap.
* **Auto map-centering on chosen cities**: Automatically centers and pans the map to the first selected city's geographical coordinates whenever filters are updated.
* **Authorization Screen:** Added a beautiful onboarding gate with animated tab options for Login, Sign Up, and Forgot Password, equipped with avatar customizations and dynamic validation.
* **Refined Nearby Radius:** Calibrated the "Nearby" button filter to explicitly target a 2 km radius relative to the user's GPS/fallback coordinate bounds.
* **Map Connection Removal:** Removed external user connections (friend markers) from the live map canvas view to preserve spatial focus.
* **Streamlined Header Menus:** Cleaned up unneeded "Add Favorite Spot" link entries from top-right action menus in both map & logs pages.
* **State Synchronization:** Configured high-reliability global window event listeners (`theme_changed`, `language_changed`) to ensure instant client-side refreshes without full-page reloads.
* **Full-Screen Social, Saved, and Profile Views**: Refined the screen sheets so that tapping the bottom Social, Saved, or Profile tabs brings up premium, immersive screens that beautifully fill the entire screen viewport.
* **Contextual Header Back Arrow**: Integrated a clean back-navigation arrow button on the top-left of the main header, enabling instant, intuitive transition back to the main interactive coffee map (Explore view).
* **Collapsible Inline Profile Sections**: Replaced the redirect actions for "Visited Spots" and "Connections" metrics inside the Profile tab with clean, expandable and closable inline panels. Users can instantly inspect their saved cafes or coffee circle, unfriend users, toggle favorites, and fly back to the map view—remaining fully inside the Profile screen context.
* **Header Logo Alignment**: Refined the `#app-logo` header wrapper to utilize `items-center` alignment and `leading-none` on the text, vertically centering the coffee mug SVG icon with the "BREWMAP" title text using pure flexbox alignment.
* **Pruning Business Map Markers & Thematic Presets**: Integrated custom style array attributes into all four map themes (`Earthy Roast`, `Nordic Brew`, `Midnight`, and `Retro Sepia`) that explicitly hide all native point of interest markers, third-party businesses (`poi.business`), lodging and hotels (`poi.business.lodging`), attractions and cinemas (`poi.attraction`), medical and health facilities (`poi.medical`), governmental/public facilities (`poi.government`), and public transit details (`transit`), as well as all building footprints (`building`) from Google Maps. This creates a pristine, highly focused discovery interface, perfectly highlighting specialized cafe spots, designated search circles, and user locations without layout clutter.

## 4. Run Protocols
* **Launch command:** `npm run dev` (Runs on Port 3000)
* **Linter validation:** `npm run lint`
* **Production Build:** `npm run build`
