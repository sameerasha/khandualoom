export type LanguageCode = 'en' | 'or' | 'hi';

export interface Translations {
  brandTagline: string;
  collections: string;
  shopSarees: string;
  newArrivals: string;
  ourHeritage: string;
  whyKhandua: string;
  searchPlaceholder: string;
  signIn: string;
  account: string;
  myProfile: string;
  myOrders: string;
  adminDashboard: string;
  signOut: string;
  wishlist: string;
  cart: string;
  addToCart: string;
  inCart: string;
  goToCart: string;
  quickView: string;
  freeShipping: string;
  silkMarkCertified: string;
  giCertified: string;
  buyNow: string;
  proceedToCheckout: string;
  outOfStock: string;
  inStock: string;
  reservationTimerNotice: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    brandTagline: 'Traditional Handloom Sarees of Odisha',
    collections: 'Our Collections',
    shopSarees: 'View Products',
    newArrivals: 'New Arrivals',
    ourHeritage: 'Our Story',
    whyKhandua: 'Why Us',
    searchPlaceholder: 'Search sarees, fabrics, colors...',
    signIn: 'Sign In',
    account: 'Account',
    myProfile: 'My Profile',
    myOrders: 'My Orders',
    adminDashboard: 'Admin',
    signOut: 'Sign Out',
    wishlist: 'Wishlist',
    cart: 'Bag',
    addToCart: 'Add to Bag',
    inCart: 'In Bag',
    goToCart: 'View Bag',
    quickView: 'View Details',
    freeShipping: 'Free Delivery',
    silkMarkCertified: 'Silk Mark Certified',
    giCertified: 'GI Tag Certified',
    buyNow: 'Buy Now',
    proceedToCheckout: 'Proceed to Checkout',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    reservationTimerNotice: 'Reserved in your bag',
  },
  or: {
    brandTagline: 'ପରମ୍ପରାରେ ବୁଣା, ଶୋଭାରେ ମଣ୍ଡିତ।',
    collections: 'ସଂଗ୍ରହ',
    shopSarees: 'ସମ୍ବଲପୁରୀ ଓ ଖଣ୍ଡୁଆ',
    newArrivals: 'ନୂତନ ସମ୍ଭାର',
    ourHeritage: 'ଆମ ଐତିହ୍ୟ',
    whyKhandua: 'ଖଣ୍ଡୁଆ କାହିଁକି?',
    searchPlaceholder: 'ଖଣ୍ଡୁଆ, ସମ୍ବଲପୁରୀ, ବୋମକାଇ ଖୋଜନ୍ତୁ...',
    signIn: 'ପ୍ରବେଶ କରନ୍ତୁ',
    account: 'ଖାତା',
    myProfile: 'ମୋର ପ୍ରୋଫାଇଲ୍ ଏବଂ ଅର୍ଡର',
    myOrders: 'ମୋର ଅର୍ଡର',
    adminDashboard: 'ପ୍ରଶାସକ ଡ୍ୟାସବୋର୍ଡ',
    signOut: 'ପ୍ରସ୍ଥାନ',
    wishlist: 'ପସନ୍ଦ ତାଲିକା',
    cart: 'ମୁଣା',
    addToCart: 'ମୁଣାରେ ଯୋଡ଼ନ୍ତୁ',
    inCart: 'ମୁଣାରେ ଅଛି',
    goToCart: 'ମୁଣା ଦେଖନ୍ତୁ',
    quickView: 'ଶୀଘ୍ର ଦେଖନ୍ତୁ',
    freeShipping: 'ମାଗଣା ବିମାଯୁକ୍ତ ସିପିଂ',
    silkMarkCertified: 'ସିଲ୍କ ମାର୍କ ପ୍ରମାଣିତ',
    giCertified: 'ଜି.ଆଇ. ଟ୍ୟାଗ୍ ସ୍ୱୀକୃତ',
    buyNow: 'ସୁରକ୍ଷିତ କିଣନ୍ତୁ',
    proceedToCheckout: 'ଅର୍ଡର ପୂରଣ କରନ୍ତୁ',
    outOfStock: 'ଶେଷ ହୋଇଯାଇଛି',
    inStock: 'ମହଜୁଦ ଅଛି',
    reservationTimerNotice: 'ତନ୍ତ ସଂରକ୍ଷଣ ସମୟ',
  },
  hi: {
    brandTagline: 'परंपरा में बुना, शोभा में सजा।',
    collections: 'कलेक्शंस',
    shopSarees: 'साड़ियाँ देखें',
    newArrivals: 'नवीनतम संग्रह',
    ourHeritage: 'हमारी विरासत',
    whyKhandua: 'खंडुआ क्यों?',
    searchPlaceholder: 'खंडुआ, संबलपुरी, बोमकाई खोजें...',
    signIn: 'साइन इन',
    account: 'खाता',
    myProfile: 'प्रोफ़ाइल एवं ऑर्डर',
    myOrders: 'मेरे ऑर्डर',
    adminDashboard: 'एडमिन डैशबोर्ड',
    signOut: 'साइन आउट',
    wishlist: 'विशलिस्ट',
    cart: 'थैला',
    addToCart: 'थैले में जोड़ें',
    inCart: 'थैले में मौजूद',
    goToCart: 'थैला देखें',
    quickView: 'त्वरित विवरण',
    freeShipping: 'निःशुल्क सुरक्षित डिलीवरी',
    silkMarkCertified: 'सिल्क मार्क प्रमाणित',
    giCertified: 'जी.आई. टैग प्रमाणित',
    buyNow: 'सुरक्षित चेकआउट करें',
    proceedToCheckout: 'ऑर्डर पूरा करें',
    outOfStock: 'स्टॉक समाप्त',
    inStock: 'उपलब्ध एवं भेजने हेतु तैयार',
    reservationTimerNotice: 'हथकरघा रिज़र्वेशन समय',
  },
};

export const LANGUAGE_OPTIONS: { code: LanguageCode; label: string; nativeName: string }[] = [
  { code: 'en', label: 'English', nativeName: 'EN' },
  { code: 'or', label: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
];
