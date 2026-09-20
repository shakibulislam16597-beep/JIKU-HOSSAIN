import heroBannerImg from '../assets/hero-banner.jpg';
import { WHATSAPP_NUMBER } from '../config';

export { WHATSAPP_NUMBER };

export const ANNOUNCEMENT_MESSAGES = [
  'Free delivery on orders above ৳2000',
  'Cash on Delivery available across Bangladesh',
  'bKash / Nagad accepted with instant confirmation'
];

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    badge: 'ATOR ALI EXCLUSIVE',
    headline: 'Discover Your Signature Scent',
    subtext: 'Premium attars, oud and perfumes',
    buttonText: 'Shop Now',
    image: heroBannerImg,
    alt: 'Perfume bottle with rose petals and oud wood'
  },
  {
    id: 'slide-2',
    badge: 'FESTIVAL SPECIAL',
    headline: 'Eid Special: Flat 20% OFF',
    subtext: 'Exclusive festival attar collection & luxury gift sets',
    buttonText: 'Claim Offer',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200',
    alt: 'Eid Special fragrance collection display'
  },
  {
    id: 'slide-3',
    badge: 'EXPRESS SHIPPING',
    headline: 'Free Delivery on orders above ৳2000',
    subtext: 'Fast & insured express shipping across all Bangladesh districts',
    buttonText: 'Order Today',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200',
    alt: 'Luxury perfume shipping box'
  },
  {
    id: 'slide-4',
    badge: 'NEW ARRIVAL',
    headline: 'New Arrival: Royal Oud Collection',
    subtext: 'Aged Cambodian & Assam pure concentrated oud oils',
    buttonText: 'Explore Oud',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1200',
    alt: 'Aged Royal Oud oil bottles and wood'
  }
];

export const SCENT_QUIZ_QUESTIONS = [
  {
    id: 'occasion',
    question: '1. What is your primary occasion?',
    options: [
      { label: 'Daily Wear & Office', value: 'daily' },
      { label: 'Jummah & Prayers', value: 'prayer' },
      { label: 'Weddings & Evening Events', value: 'evening' },
      { label: 'Gift for Someone Special', value: 'gift' }
    ]
  },
  {
    id: 'strength',
    question: '2. How strong do you like your perfume?',
    options: [
      { label: 'Subtle & Gentle', value: 'subtle' },
      { label: 'Moderate & Balanced', value: 'moderate' },
      { label: 'Intense & Long Lasting', value: 'intense' }
    ]
  },
  {
    id: 'note',
    question: '3. What is your preferred scent note?',
    options: [
      { label: 'Floral (Rose, Jasmine)', value: 'floral' },
      { label: 'Woody (Oud, Sandalwood)', value: 'woody' },
      { label: 'Sweet (Musk, Amber, Honey)', value: 'sweet' },
      { label: 'Fresh (Citrus, White Musk)', value: 'fresh' }
    ]
  }
];

export const FLASH_SALE_DATA = {
  badge: 'FLASH SALE',
  title: 'Limited time offers',
  subtext: 'Exclusive discounts on top-rated attars & perfumes',
  durationHours: 8
};

export const PROMO_BANNER_DATA = {
  badge: 'SPECIAL PROMO',
  title: 'Buy 2 Attars, Get 1 Free',
  subtext: 'Add any 3 pure attars to your cart and the lowest priced one is automatically FREE!',
  buttonText: 'Shop Attars Now'
};

export const WHATSAPP_BANNER_DATA = {
  title: 'Order on WhatsApp',
  subtext: 'Have questions or prefer ordering directly? Chat with our fragrance consultants 24/7.',
  buttonText: 'Order on WhatsApp',
  phoneNumber: WHATSAPP_NUMBER
};
