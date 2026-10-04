import React, { useState } from 'react';
import { Star, ShoppingBag, Check, ShieldCheck, Zap } from 'lucide-react';
import Button from './Button';

/**
 * Enterprise Core Product Card Component
 * Engineered in strict isolation via Storybook (Track A)
 * Adheres to FAQ Q5 regarding Next.js Image handling in decoupled runtimes.
 */
export default function ProductCard({
  title = 'ProDesk SoundMaster ANC Headphones',
  category = 'Audio Equipment',
  imageSrc = '/products/headphones.jpg',
  imageAlt = 'Product Preview',
  price = 199.99,
  originalPrice = 249.99,
  rating = 4.8,
  reviewCount = 128,
  badge = '20% OFF',
  inStock = true,
  description = 'Studio-grade acoustic driver with active noise cancellation and 40h battery endurance.',
  features = ['Spatial Audio', '40h Battery', 'Bluetooth 5.3'],
  onAddToCart,
  className = ''
}) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock) return;
    setIsAdded(true);
    if (onAddToCart) onAddToCart({ title, price, imageSrc });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <div
      className={`glass-panel group relative flex flex-col rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 max-w-sm w-full bg-slate-900/60 ${className}`}
    >
      {/* Product Image Stage */}
      <div className="relative w-full h-56 bg-slate-950 overflow-hidden flex items-center justify-center">
        <img
          src={imageSrc}
          alt={imageAlt || title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback if path issues occur in headless environments
            e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-indigo-600 text-white shadow-md shadow-indigo-600/40">
              {badge}
            </span>
          )}
          {discountPercent && !badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-600 text-white shadow-md shadow-emerald-600/40">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
              inStock
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 backdrop-blur-md'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 backdrop-blur-md'
            }`}
          >
            {inStock ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-indigo-400 font-semibold">
              {category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-200">{rating}</span>
              <span className="text-slate-500 text-[11px]">({reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h4 className="font-['Outfit'] text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {title}
          </h4>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Feature Tags */}
          {features && features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {features.map((feat, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[10px] font-mono border border-slate-700/60"
                >
                  {feat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-white font-['Outfit']">
                ${price.toFixed(2)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-slate-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Taxes & shipping included</span>
          </div>

          <Button
            variant={isAdded ? 'secondary' : inStock ? 'primary' : 'ghost'}
            size="sm"
            disabled={!inStock}
            onClick={handleAddToCart}
            className={isAdded ? '!bg-emerald-600 !text-white' : ''}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Added</span>
              </>
            ) : inStock ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>Add</span>
              </>
            ) : (
              <span>Unavailable</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
