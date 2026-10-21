export type Language = 'en' | 'ru' | 'ky';

export interface TranslationDictionary {
  appName: string;
  searchPlaceholder: string;
  nearby: string;
  openNow: string;
  locating: string;
  exploreTab: string;
  socialTab: string;
  savedTab: string;
  profileTab: string;
  editProfile: string;
  shareProfile: string;
  visitedSpots: string;
  connections: string;
  reviews: string;
  favoriteDrink: string;
  favoriteSpot: string;
  avgRating: string;
  settingsTitle: string;
  appSettings: string;
  privacyTitle: string;
  legalTitle: string;
  modeLabel: string;
  modeLight: string;
  modeDark: string;
  langLabel: string;
  changePassword: string;
  updateEmail: string;
  deleteAccount: string;
  backgroundTracking: string;
  privacyPolicy: string;
  communityGuidelines: string;
  contactUs: string;
  aboutUs: string;
  termsOfService: string;
  cancel: string;
  save: string;
  none: string;
  savedSpot: string;
  saveSpot: string;
  getDirections: string;
  aboutCafe: string;
  leaveReview: string;
  editReview: string;
  readCommunityReviews: string;
  capacity: string;
  wifi: string;
  location: string;
  open: string;
  closed: string;
  reviewsTitle: string;
  ratingLabel: string;
  commentPlaceholder: string;
  addReviewBtn: string;
  noReviewsYet: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "BrewSpot",
    searchPlaceholder: "Search coffee shops",
    nearby: "Nearby",
    openNow: "Open now",
    locating: "Locating...",
    exploreTab: "Explore",
    socialTab: "Social",
    savedTab: "Saved",
    profileTab: "Profile",
    editProfile: "Edit Profile",
    shareProfile: "Share Profile",
    visitedSpots: "Visited Spots",
    connections: "Connections",
    reviews: "Reviews",
    favoriteDrink: "Brew Profile",
    favoriteSpot: "Favorite Spot",
    avgRating: "Favorite Coffee Type",
    settingsTitle: "Settings",
    appSettings: "App settings",
    privacyTitle: "Privacy & security",
    legalTitle: "Legal & Information",
    modeLabel: "Theme Mode",
    modeLight: "Light Theme",
    modeDark: "Dark Theme",
    langLabel: "Language",
    changePassword: "Change Password",
    updateEmail: "Update Email Address",
    deleteAccount: "Delete Account",
    backgroundTracking: "Background Location Tracking",
    privacyPolicy: "Privacy Policy",
    communityGuidelines: "Community Guidelines",
    contactUs: "Contact",
    aboutUs: "About Us",
    termsOfService: "Terms of Service",
    cancel: "Cancel",
    save: "Save",
    none: "None",
    savedSpot: "Saved Spot",
    saveSpot: "Save Spot",
    getDirections: "Get Directions",
    aboutCafe: "About the Cafe",
    leaveReview: "Leave a Review",
    editReview: "Edit Review",
    readCommunityReviews: "Read Community Reviews",
    capacity: "Capacity",
    wifi: "WiFi",
    location: "Location",
    open: "Open Now",
    closed: "Closed",
    reviewsTitle: "Reviews",
    ratingLabel: "Rating",
    commentPlaceholder: "Share your coffee experience...",
    addReviewBtn: "Post Review",
    noReviewsYet: "No reviews yet. Be the first to add one!"
  },
  ru: {
    appName: "BrewSpot",
    searchPlaceholder: "Поиск кофеен",
    nearby: "Рядом",
    openNow: "Открыто сейчас",
    locating: "Определение...",
    exploreTab: "Карта",
    socialTab: "Общение",
    savedTab: "Сохранено",
    profileTab: "Профиль",
    editProfile: "Редактировать",
    shareProfile: "Поделиться",
    visitedSpots: "Посещено",
    connections: "Связи",
    reviews: "Отзывы",
    favoriteDrink: "Профиль дегустатора",
    favoriteSpot: "Любимое место",
    avgRating: "Любимый вид кофе",
    settingsTitle: "Настройки",
    appSettings: "Настройки приложения",
    privacyTitle: "Конфиденциальность",
    legalTitle: "Правовая информация",
    modeLabel: "Цветовая тема",
    modeLight: "Светлая тема",
    modeDark: "Темная тема",
    langLabel: "Язык / Тили",
    changePassword: "Сменить пароль",
    updateEmail: "Обновить эл. почту",
    deleteAccount: "Удалить аккаунт",
    backgroundTracking: "Фоновое отслеживание локации",
    privacyPolicy: "Политика конфиденциальности",
    communityGuidelines: "Правила сообщества",
    contactUs: "Контакты",
    aboutUs: "О нас",
    termsOfService: "Условия использования",
    cancel: "Отмена",
    save: "Сохранить",
    none: "Нет",
    savedSpot: "В избранном",
    saveSpot: "В избранное",
    getDirections: "Маршрут",
    aboutCafe: "О кофейне",
    leaveReview: "Оставить отзыв",
    editReview: "Редактировать отзыв",
    readCommunityReviews: "Все отзывы сообщества",
    capacity: "Вместимость",
    wifi: "Интернет",
    location: "Адрес",
    open: "Открыто",
    closed: "Закрыто",
    reviewsTitle: "Отзывы",
    ratingLabel: "Оценка",
    commentPlaceholder: "Поделитесь впечатлениями о кофе...",
    addReviewBtn: "Опубликовать",
    noReviewsYet: "Отзывов ещё нет. Добавьте первый!"
  },
  ky: {
    appName: "BrewSpot",
    searchPlaceholder: "Кофейняларды издөө",
    nearby: "Жакын жерде",
    openNow: "Азыр ачык",
    locating: "Аныкталууда...",
    exploreTab: "Карап чыгуу",
    socialTab: "Социалдык",
    savedTab: "Сакталган",
    profileTab: "Профиль",
    editProfile: "Профилди өзгөртүү",
    shareProfile: "Бөлүшүү",
    visitedSpots: "Барылган жерлер",
    connections: "Байланыштар",
    reviews: "Пикирлер",
    favoriteDrink: "Демдөө профили",
    favoriteSpot: "Сүйүктүү кофейня",
    avgRating: "Сүйүктүү кофе түрү",
    settingsTitle: "Орнотуулар",
    appSettings: "Тиркеме орнотуулары",
    privacyTitle: "Купуялык жана коопсуздук",
    legalTitle: "Укуктук маалыматтар",
    modeLabel: "Теманын режими",
    modeLight: "Жарык тема",
    modeDark: "Караңгы тема",
    langLabel: "Тилди тандоо",
    changePassword: "Сыр сөздү өзгөртүү",
    updateEmail: "Эл. даректи жаңылоо",
    deleteAccount: "Аккаунтту өчүрүү",
    backgroundTracking: "Локацияны фондо көзөмөлдөө",
    privacyPolicy: "Купуялык саясаты",
    communityGuidelines: "Коомчулук эрежелери",
    contactUs: "Байланышуу",
    aboutUs: "Биз жөнүндө",
    termsOfService: "Тейлөө шарттары",
    cancel: "Жокко чыгаруу",
    save: "Сактоо",
    none: "Жок",
    savedSpot: "Сакталган кофейня",
    saveSpot: "Сактоо",
    getDirections: "Багыттарды алуу",
    aboutCafe: "Кофейня жөнүндө",
    leaveReview: "Пикир калтыруу",
    editReview: "Пикирди түзөтүү",
    readCommunityReviews: "Баардык пикирлерди окуу",
    capacity: "Сыйымдуулугу",
    wifi: "Интернеттин абалы",
    location: "Дареги",
    open: "Азыр ачык",
    closed: "Жабык",
    reviewsTitle: "Пикирлер",
    ratingLabel: "Баалоо",
    commentPlaceholder: "Кофе тууралуу пикириңиз менен бөлүшүңүз...",
    addReviewBtn: "Пикирди жөнөтүү",
    noReviewsYet: "Азырынча пикирлер жок. Биринчи болуп калтырыңыз!"
  }
};

export function getLanguage(): Language {
  const saved = localStorage.getItem('app_language');
  if (saved === 'ru' || saved === 'en' || saved === 'ky') {
    return saved;
  }
  return 'en'; // Default fallback
}

export function setLanguage(lang: Language): void {
  localStorage.setItem('app_language', lang);
  window.dispatchEvent(new Event('language_changed'));
}

export function getThemeMode(): 'light' | 'dark' {
  const saved = localStorage.getItem('app_theme');
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  // No saved choice: follow the phone/computer setting
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setThemeMode(theme: 'light' | 'dark'): void {
  localStorage.setItem('app_theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  window.dispatchEvent(new Event('theme_changed'));
}
