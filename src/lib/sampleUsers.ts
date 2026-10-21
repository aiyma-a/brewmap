// People search needs real accounts; empty until then.
export const SEARCHABLE_USERS: { id: string; name: string; username: string; image: string; bio: string; location: { lat: number; lng: number } }[] = [];

export const CUSTOM_VECTOR_AVATARS = [
  { id: 'vec_espresso', name: 'Espresso', bg: 'bg-[#4B3621]', text: 'text-white' },
  { id: 'vec_latte', name: 'Latte', bg: 'bg-[#C2B280]', text: 'text-[#4B3621]' },
  { id: 'vec_mocha', name: 'Mocha', bg: 'bg-brand', text: 'text-white' },
  { id: 'vec_caramel', name: 'Caramel', bg: 'bg-[#C68E17]', text: 'text-white' },
  { id: 'vec_cream', name: 'Cream', bg: 'bg-[#F5F5DC]', text: 'text-brand' },
  { id: 'vec_black', name: 'Black', bg: 'bg-[#1A1A1A]', text: 'text-white' }
];
