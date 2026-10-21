export interface CoffeeShop {
  id: string;
  /** Google Places ID: real photos are loaded from Google at runtime (never stored) */
  placeId?: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  wifi: string;
  outlets?: boolean;
  about: string;
  location: { lat: number; lng: number };
  openingHour: number; // 24h format, e.g., 8
  closingHour: number; // 24h format, e.g., 22
  status: 'Open Now' | 'Closed';
}

export const COFFEE_SHOPS: CoffeeShop[] = [
  {
    id: '1',
    placeId: 'ChIJiyzbTjG3njgRntyqzPogUJY',
    name: 'Bishkek Coffee Roasters',
    image: `${import.meta.env.BASE_URL}images/8279d3e8a6.jpg`,
    rating: 4.8,
    reviewCount: 120,
    distance: '0.4 km',
    address: 'Bokonbaev St 103, Bishkek',
    wifi: 'Free High-Speed',
    outlets: true,
    about: 'A boutique sanctuary for true coffee enthusiasts. BCR specializes in small-batch roasts and manual pour-overs, served in a space designed for focus and tranquility. Whether you\'re here to work or unwind, our Forest Green atmosphere and Espresso-scented air provide the perfect backdrop.',
    location: { lat: 42.8715, lng: 74.6052 },
    openingHour: 8,
    closingHour: 22,
    status: 'Open Now'
  },
  {
    id: '2',
    placeId: 'ChIJT3F9dCHInjgRBB8_T4bl3Zo',
    name: 'Sierra Coffee',
    image: `${import.meta.env.BASE_URL}images/3baea2be54.jpg`,
    rating: 4.6,
    reviewCount: 85,
    distance: '0.8 km',
    address: 'Manas Ave 57, Bishkek',
    wifi: 'Average',
    outlets: false,
    about: 'Specialists in intricate latte art designs and creamy textures.',
    location: { lat: 42.8746, lng: 74.5898 },
    openingHour: 7,
    closingHour: 23,
    status: 'Open Now'
  },
  {
    id: '3',
    placeId: 'ChIJyfj_Y7m3njgRSuCBGy1x_BU',
    name: 'Adriano Coffee',
    image: `${import.meta.env.BASE_URL}images/3baea2be54.jpg`,
    rating: 4.9,
    reviewCount: 210,
    distance: '1.2 km',
    address: 'Chuy Ave 115, Bishkek',
    wifi: 'Premium Paid',
    outlets: true,
    about: 'For the hardcore roaster. We bake our own beans daily in-house.',
    location: { lat: 42.8765, lng: 74.6123 },
    openingHour: 9,
    closingHour: 21,
    status: 'Open Now'
  },
  {
    id: '4',
    placeId: 'ChIJeYOqR863njgRoxlh-xX-5vA',
    name: 'Bellagio Coffee',
    image: `${import.meta.env.BASE_URL}images/44a9a055e1.jpg`,
    rating: 4.7,
    reviewCount: 160,
    distance: '0.5 km',
    address: 'Erkindik Blvd 9, Bishkek',
    wifi: 'Free High-Speed',
    outlets: true,
    about: 'Elegant, modern, and beautifully situated along the historic Erkindik boulevard. Excellent breakfasts and award-winning coffee.',
    location: { lat: 42.8722, lng: 74.6041 },
    openingHour: 8,
    closingHour: 23,
    status: 'Open Now'
  },
  {
    id: '5',
    placeId: 'ChIJy83dKt-3njgRhqg_qkmD8qg',
    name: 'Bublik Coffee',
    image: `${import.meta.env.BASE_URL}images/0a0c589f82.jpg`,
    rating: 4.5,
    reviewCount: 340,
    distance: '1.1 km',
    address: 'Chuy Ave 140, Bishkek',
    wifi: 'Free High-Speed',
    outlets: true,
    about: 'Lively atmosphere, artisan bakery, and sweet bagels paired with great filter coffee.',
    location: { lat: 42.8755, lng: 74.6074 },
    openingHour: 7,
    closingHour: 24,
    status: 'Open Now'
  },
  {
    id: '6',
    name: 'Coffee Craft',
    image: `${import.meta.env.BASE_URL}images/57df557051.jpg`,
    rating: 4.8,
    reviewCount: 95,
    distance: '0.6 km',
    address: 'Logvinenko St 12, Bishkek',
    wifi: 'Excellent',
    outlets: true,
    about: 'A tiny hidden gem known for absolute brewing precision, specialty Chemex, and friendly local service.',
    location: { lat: 42.8710, lng: 74.5982 },
    openingHour: 8,
    closingHour: 21,
    status: 'Open Now'
  },
  {
    id: '7',
    placeId: 'ChIJdY2Uydq3njgR7YpGcffWsI8',
    name: 'Navigator Coffee',
    image: `${import.meta.env.BASE_URL}images/9308a86d88.jpg`,
    rating: 4.7,
    reviewCount: 180,
    distance: '0.5 km',
    address: 'Moskovskaya St 103, Bishkek',
    wifi: 'Free',
    outlets: true,
    about: 'Comfortable cafe with a beautiful outdoor terrace and wonderful warm vibes.',
    location: { lat: 42.8735, lng: 74.6015 },
    openingHour: 8,
    closingHour: 22,
    status: 'Open Now'
  },
  {
    id: '8',
    placeId: 'ChIJwz2IoSfInjgRVRwnwVSPt7E',
    name: 'Vanilla Sky Coffee',
    image: `${import.meta.env.BASE_URL}images/7f569b76c9.jpg`,
    rating: 4.6,
    reviewCount: 140,
    distance: '1.3 km',
    address: 'Shopokov St 101, Bishkek',
    wifi: 'Unavailable',
    outlets: false,
    about: 'Cosy pastel design with a sweet tooth menu focus, digital detox atmosphere (No WiFi), and amazing craft lattes.',
    location: { lat: 42.8788, lng: 74.6152 },
    openingHour: 9,
    closingHour: 22,
    status: 'Open Now'
  },
  {
    id: '9',
    name: 'Tokmok Craft Roasters',
    image: `${import.meta.env.BASE_URL}images/057ed3a2bb.jpg`,
    rating: 4.7,
    reviewCount: 42,
    distance: '1.5 km',
    address: 'Lenin St 120, Tokmok',
    wifi: 'Free High-Speed',
    outlets: true,
    about: 'Expressive espresso profiles and freshly roasted micro-batches in the heart of Tokmok.',
    location: { lat: 42.8425, lng: 75.3010 },
    openingHour: 8,
    closingHour: 21,
    status: 'Open Now'
  },
  {
    id: '10',
    name: 'Kemin Alpine Brews',
    image: `${import.meta.env.BASE_URL}images/1128ce0ce1.jpg`,
    rating: 4.9,
    reviewCount: 31,
    distance: '2.3 km',
    address: 'Chuy St 45, Kemin',
    wifi: 'Free',
    outlets: true,
    about: 'A warmth-filled mountain sanctuary for explorers arriving in Kemin. Superb filter brews and scenic vistas.',
    location: { lat: 42.7880, lng: 75.6890 },
    openingHour: 7,
    closingHour: 20,
    status: 'Open Now'
  }
];

export interface FriendMarker {
  id: string;
  name: string;
  image: string;
  location: { lat: number; lng: number };
}

// Friends need real accounts; none until then.
export const FRIENDS: FriendMarker[] = [];

export interface City {
  name: string;
  location: { lat: number; lng: number };
}

export const CITIES: City[] = [
  { name: 'Bishkek', location: { lat: 42.8746, lng: 74.5898 } },
  { name: 'Tokmok', location: { lat: 42.8419, lng: 75.3015 } },
  { name: 'Kara-Balta', location: { lat: 42.8142, lng: 73.8481 } },
  { name: 'Kemin', location: { lat: 42.7875, lng: 75.6883 } },
  { name: 'Kant', location: { lat: 42.8911, lng: 74.8504 } },
];
