// Quiet map style built from a handful of colours: no shop/business icons, calm labels
export const makeMapStyle = (c: { land: string; park: string; water: string; road: string; roadEdge: string; text: string; halo: string }) => [
  { featureType: 'all', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { elementType: 'geometry', stylers: [{ color: c.land }] },
  { elementType: 'labels.text.fill', stylers: [{ color: c.text }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: c.halo }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: c.park }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: c.water }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: c.road }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: c.roadEdge }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: c.roadEdge }] },
];

export const MAP_STYLES_PRESETS: Record<string, any[]> = {
  // Follow the app theme by default: Oat Milk (light) / Midnight Roast (dark)
  oat: makeMapStyle({ land: '#F1E9DC', park: '#D9E3CB', water: '#BFD0D6', road: '#FFFDF8', roadEdge: '#E3D8C8', text: '#6B5B52', halo: '#F5EFE6' }),
  roast: makeMapStyle({ land: '#2B2623', park: '#2F3A2C', water: '#26333A', road: '#4A423C', roadEdge: '#38322D', text: '#B3A698', halo: '#1E1B19' }),
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
