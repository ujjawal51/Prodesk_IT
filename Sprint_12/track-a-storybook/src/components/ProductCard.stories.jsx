import ProductCard from './ProductCard';

/**
 * Storybook Configuration for ProductCard Component
 * Tests image decoupling, pricing typography, badges, and stock variants
 */
export default {
  title: 'Design System/Core/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Product headline title' },
    category: { control: 'text', description: 'Product classification' },
    imageSrc: { control: 'text', description: 'URI or relative path to product image' },
    price: { control: 'number', description: 'Selling price' },
    originalPrice: { control: 'number', description: 'Original MSRP before discount' },
    rating: { control: { type: 'range', min: 1, max: 5, step: 0.1 } },
    reviewCount: { control: 'number' },
    badge: { control: 'text', description: 'Visual promotional ribbon tag' },
    inStock: { control: 'boolean', description: 'Inventory availability toggle' },
    onAddToCart: { action: 'addedToCart' }
  }
};

export const HeadphonesDefault = {
  args: {
    title: 'AeroTune Pro ANC Wireless Headphones',
    category: 'Acoustics & Audio',
    imageSrc: '/products/headphones.jpg',
    imageAlt: 'Matte Black Noise Cancelling Headphones',
    price: 189.99,
    originalPrice: 229.99,
    rating: 4.9,
    reviewCount: 246,
    badge: 'BESTSELLER',
    inStock: true,
    description: 'Precision engineered 45mm neodymium drivers delivering immersive spatial fidelity and hybrid active noise cancellation.',
    features: ['Spatial Audio', '40h Battery', 'USB-C Fast Charge']
  }
};

export const SmartwatchOnSale = {
  args: {
    title: 'Vanguard Chrono Titanium Smartwatch',
    category: 'Wearable Tech',
    imageSrc: '/products/smartwatch.jpg',
    imageAlt: 'Titanium Smartwatch on Dark Background',
    price: 279.00,
    originalPrice: 349.00,
    rating: 4.8,
    reviewCount: 189,
    badge: '20% OFF',
    inStock: true,
    description: 'Military-grade titanium alloy casing with continuous biometric heart monitoring, GPS route tracking, and AMOLED display.',
    features: ['AMOLED 1.4"', 'ECG Sensor', '50m Water Resist']
  }
};

export const OutOfStock = {
  args: {
    title: 'AeroTune Studio Edition (Limited Run)',
    category: 'Collector Series',
    imageSrc: '/products/headphones.jpg',
    price: 349.99,
    originalPrice: null,
    rating: 5.0,
    reviewCount: 38,
    badge: null,
    inStock: false,
    description: 'Bespoke hand-assembled studio monitors with anodized aluminum arms and memory foam velvet pads.',
    features: ['Individually Numbered', 'Open-Back Architecture']
  }
};

export const LimitedEdition = {
  args: {
    title: 'Vanguard Cyber Chrono Stealth Edition',
    category: 'Cyberpunk Wearables',
    imageSrc: '/products/smartwatch.jpg',
    price: 399.00,
    originalPrice: 450.00,
    rating: 4.95,
    reviewCount: 74,
    badge: 'LIMITED (50 UNITS)',
    inStock: true,
    description: 'Ultra-rare matte stealth carbon finish with sapphire crystal glass and custom haptic digital crown.',
    features: ['Sapphire Glass', 'Dual-Band GPS', 'Sub-Zero Resistant']
  }
};
