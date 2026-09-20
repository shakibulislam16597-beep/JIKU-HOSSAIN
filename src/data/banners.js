import heroBannerImg from '../assets/hero-banner.jpg';
import { WHATSAPP_NUMBER } from '../config';

export { WHATSAPP_NUMBER };

export const ANNOUNCEMENT_MESSAGES = [
  'Free delivery on orders above ৳2000 across Bangladesh',
  'Cash on Delivery available in all 64 districts',
  'bKash / Nagad accepted with instant order confirmation'
];

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    badge: 'EXTROVAT EXCLUSIVE',
    headline: 'Discover your signature fragrance',
    subtext: 'Premium attars, perfumes, body sprays and gift sets',
    buttonText: 'Shop collection',
    image: heroBannerImg,
    alt: 'Extrovat perfume bottle display'
  },
  {
    id: 'slide-2',
    badge: 'SPECIAL OFFER',
    headline: 'Festival special: Flat 20% off',
    subtext: 'Exclusive attar collections & handcrafted lifestyle products',
    buttonText: 'Claim offer',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200',
    alt: 'Special fragrance collection display'
  },
  {
    id: 'slide-3',
    badge: 'EXPRESS DELIVERY',
    headline: 'Free delivery on orders over ৳2000',
    subtext: 'Fast and insured delivery across all 64 districts',
    buttonText: 'Order now',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200',
    alt: 'Extrovat package box'
  }
];

export const SCENT_QUIZ_QUESTIONS = [
  {
    id: 'occasion',
    question: '1. What is your primary occasion?',
    options: [
      { label: 'Daily wear & office', value: 'daily' },
      { label: 'Prayers & spiritual', value: 'prayer' },
      { label: 'Evening events & parties', value: 'evening' },
      { label: 'Gift for someone special', value: 'gift' }
    ]
  },
  {
    id: 'strength',
    question: '2. How strong do you prefer your scent?',
    options: [
      { label: 'Subtle & gentle', value: 'subtle' },
      { label: 'Moderate & balanced', value: 'moderate' },
      { label: 'Intense & long lasting', value: 'intense' }
    ]
  },
  {
    id: 'note',
    question: '3. What scent note appeals to you most?',
    options: [
      { label: 'Floral (Rose, Jasmine)', value: 'floral' },
      { label: 'Woody (Oud, Sandalwood)', value: 'woody' },
      { label: 'Sweet (Musk, Amber)', value: 'sweet' },
      { label: 'Fresh (Citrus, White Musk)', value: 'fresh' }
    ]
  }
];

export const FLASH_SALE_DATA = {
  badge: 'FLASH SALE',
  title: 'Limited time deals',
  subtext: 'Exclusive discounts on selected Extrovat fragrances',
  durationHours: 8
};

export const PROMO_BANNER_DATA = {
  badge: 'SPECIAL PROMO',
  title: 'Buy 2 attars, get 1 free',
  subtext: 'Add any 3 pure attars to your cart and the lowest priced item is free',
  buttonText: 'Shop attars'
};

export const WHATSAPP_BANNER_DATA = {
  title: 'Order on WhatsApp',
  subtext: 'Prefer ordering directly or need advice? Chat with our consultants 24/7.',
  buttonText: 'Order on WhatsApp',
  phoneNumber: WHATSAPP_NUMBER
};
