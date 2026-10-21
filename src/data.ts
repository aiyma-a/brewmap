export interface CoffeeShop {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  capacityNow: number;
  capacityMax: number;
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
    name: 'Bishkek Coffee Roasters',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc5NyboL7pNKph78Z5inicR0UsLmZ8-Clfla3mEXgEM-tqeDI2HpZo8NBDDOEEmEwdbgC4DOogg-Vgv78D6R_ekUlQWbc_3paHn2DDjPcqZGomptvpG6k50yHePfPl15Aw5BGaDOGczBXVdOeApc5_Fd46Ycw3hYvysLKsaSRtF2VgNa8pdoMWAW3RwewdBHHsrQaEn9l93y9pvDC6tqMp-ZchFCq0Roo1Uicct8K6-Pdv6HOSYP_1b1hloprFMdbFuKngo5axf-37',
    rating: 4.8,
    reviewCount: 120,
    distance: '0.4 km',
    address: 'Bokonbaev St 103, Bishkek',
    capacityNow: 45,
    capacityMax: 60,
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
    name: 'Sierra Coffee',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRre4a8SbRjVCXwgOqtc2GQZCvAmpyKFy3EewdhbcfMpSggKUHalEboOXGXod9W4U4-B3SsgGzkOaBhRLTnKi6NVVEjRn3sNc81noP_xoF0V9TCxs9TCpXiyfIROIGOUP3pRvrc9m60XIYIOhz4KIBnVoKd5Q23sCtNNF1AJ6YjH8xk2dT1rr-0mgaZhvMg-FveqOX4s0UMnimDksOuRO0DDV73IdwhPpa_lMrA0fsYFF11EnUXqJiSSR557Tg7G0aqPNr9zqZFDJd',
    rating: 4.6,
    reviewCount: 85,
    distance: '0.8 km',
    address: 'Manas Ave 57, Bishkek',
    capacityNow: 20,
    capacityMax: 30,
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
    name: 'Adriano Coffee',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRre4a8SbRjVCXwgOqtc2GQZCvAmpyKFy3EewdhbcfMpSggKUHalEboOXGXod9W4U4-B3SsgGzkOaBhRLTnKi6NVVEjRn3sNc81noP_xoF0V9TCxs9TCpXiyfIROIGOUP3pRvrc9m60XIYIOhz4KIBnVoKd5Q23sCtNNF1AJ6YjH8xk2dT1rr-0mgaZhvMg-FveqOX4s0UMnimDksOuRO0DDV73IdwhPpa_lMrA0fsYFF11EnUXqJiSSR557Tg7G0aqPNr9zqZFDJd',
    rating: 4.9,
    reviewCount: 210,
    distance: '1.2 km',
    address: 'Chuy Ave 115, Bishkek',
    capacityNow: 55,
    capacityMax: 55,
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
    name: 'Bellagio Coffee',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 160,
    distance: '0.5 km',
    address: 'Erkindik Blvd 9, Bishkek',
    capacityNow: 35,
    capacityMax: 50,
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
    name: 'Bublik Coffee',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 340,
    distance: '1.1 km',
    address: 'Chuy Ave 140, Bishkek',
    capacityNow: 42,
    capacityMax: 60,
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
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=400&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 95,
    distance: '0.6 km',
    address: 'Logvinenko St 12, Bishkek',
    capacityNow: 15,
    capacityMax: 25,
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
    name: 'Navigator Coffee',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=400&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 180,
    distance: '0.5 km',
    address: 'Moskovskaya St 103, Bishkek',
    capacityNow: 22,
    capacityMax: 40,
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
    name: 'Vanilla Sky Coffee',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=400&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 140,
    distance: '1.3 km',
    address: 'Shopokov St 101, Bishkek',
    capacityNow: 18,
    capacityMax: 35,
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
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=400&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 42,
    distance: '1.5 km',
    address: 'Lenin St 120, Tokmok',
    capacityNow: 12,
    capacityMax: 20,
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
    image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=400&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 31,
    distance: '2.3 km',
    address: 'Chuy St 45, Kemin',
    capacityNow: 8,
    capacityMax: 15,
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

export const FRIENDS: FriendMarker[] = [
  {
    id: 'f1',
    name: 'Aigerim',
    image: 'vector:Cream',
    location: { lat: 42.8750, lng: 74.6000 }
  },
  {
    id: 'f2',
    name: 'Daniar',
    image: 'vector:Caramel',
    location: { lat: 42.8680, lng: 74.5950 }
  }
];

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
