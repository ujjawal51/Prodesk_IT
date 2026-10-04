'use client';

import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import ProductCard from '../components/ProductCard';
import {
  Layers,
  BookOpen,
  Terminal,
  Sparkles,
  ShoppingBag,
  CheckCircle,
  ExternalLink,
  Code2,
  Cpu,
  ShieldCheck,
  Search,
  Lock,
  Download,
  ArrowRight
} from 'lucide-react';

export default function CatalogShowcase() {
  const [cartCount, setCartCount] = useState(0);
  const [lastAction, setLastAction] = useState('Catalog Initialized');
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordDemo, setPasswordDemo] = useState('enterprise_sprint12_secret');

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    setLastAction(`Added "${product.title}" to cart`);
  };

  const triggerLoading = () => {
    setLoadingDemo(true);
    setLastAction('Triggered Button loading state...');
    setTimeout(() => {
      setLoadingDemo(false);
      setLastAction('Loading state completed.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner */}
      <header className="glass-panel sticky top-0 z-50 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold tracking-tight text-white text-lg font-['Outfit']">
                  CORE<span className="text-indigo-400">DESIGN</span>
                </h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Track A: Storybook UI
                </span>
              </div>
              <p className="text-xs text-slate-400">Component Driven Development & Design System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Storybook CLI Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>npm run storybook</span>
              <span className="text-slate-500">(:6006)</span>
            </div>

            {/* Cart Counter */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <ShoppingBag className="w-4 h-4" />
              <span>Cart: {cartCount}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Intro */}
      <section className="max-w-7xl mx-auto w-full px-6 pt-10 pb-6">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise Component Isolation</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Isolated Component Architecture for Scalable Applications
            </h2>

            <p className="text-sm text-slate-400 leading-relaxed">
              In enterprise organizations (e.g., Spotify, Airbnb), UI components are engineered in strict isolation via <strong>Storybook</strong> prior to codebase integration. This catalog showcases the 3 core isolated modules: <span className="text-indigo-300 font-mono">Button</span>, <span className="text-cyan-300 font-mono">Input</span>, and <span className="text-emerald-300 font-mono">ProductCard</span>.
            </p>

            {/* Telemetry Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Tailwind CSS Decoupled (FAQ Q4)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Next.js Image Optimized (FAQ Q5)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Action Log: <span className="text-indigo-300 font-semibold">{lastAction}</span></span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Showcase */}
      <main className="max-w-7xl mx-auto w-full px-6 py-6 flex-1 space-y-12">
        {/* Module 1: Button Component Matrix */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <span>01. Core Button Matrix</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Button.stories.jsx
                </span>
              </h3>
              <p className="text-xs text-slate-400">Variants, dimensional scales, loading spinner states & icons</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
            {/* Variants */}
            <div>
              <span className="text-xs font-semibold uppercase text-slate-400 font-mono block mb-3">
                Visual Variants
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" onClick={() => setLastAction('Clicked Primary Button')}>
                  Primary Variant
                </Button>
                <Button variant="secondary" onClick={() => setLastAction('Clicked Secondary Button')}>
                  Secondary Variant
                </Button>
                <Button variant="outline" onClick={() => setLastAction('Clicked Outline Button')}>
                  Outline Variant
                </Button>
                <Button variant="danger" onClick={() => setLastAction('Clicked Danger Button')}>
                  Danger Variant
                </Button>
                <Button variant="ghost" onClick={() => setLastAction('Clicked Ghost Button')}>
                  Ghost Variant
                </Button>
              </div>
            </div>

            {/* Sizes & States */}
            <div className="pt-4 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 font-mono block mb-3">
                  Size Hierarchy
                </span>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="secondary">Small (sm)</Button>
                  <Button size="md" variant="primary">Medium (md)</Button>
                  <Button size="lg" variant="primary">Large (lg)</Button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 font-mono block mb-3">
                  States & Feedback
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    isLoading={loadingDemo}
                    onClick={triggerLoading}
                  >
                    {loadingDemo ? 'Simulating async...' : 'Click for Spinner'}
                  </Button>
                  <Button variant="secondary" disabled>
                    Disabled State
                  </Button>
                  <Button variant="primary" icon={Download}>
                    With Icon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Module 2: Input Component Matrix */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <span>02. Core Input Field Matrix</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Input.stories.jsx
                </span>
              </h3>
              <p className="text-xs text-slate-400">Search fields, password eye toggle, helper text, and validation states</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Default Text Input"
              placeholder="e.g. cluster-worker-node-1"
              helperText="Standard alphanumeric field identifier"
            />

            <Input
              label="Search Component"
              type="search"
              icon={Search}
              placeholder="Filter stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              helperText="Dynamic search input with prefix icon"
            />

            <Input
              label="Secure Password Field"
              type="password"
              icon={Lock}
              value={passwordDemo}
              onChange={(e) => setPasswordDemo(e.target.value)}
              helperText="Interactive reveal/hide password toggle"
            />

            <Input
              label="Validation Error State"
              value="invalid_port_999999"
              error="Socket port exceeds 16-bit range [1 - 65535]"
            />

            <Input
              label="Disabled Read-Only Node"
              value="node-04.prodesk.cluster.internal"
              disabled
              helperText="System protected - managed by DevOps daemon"
            />

            <Input
              label="Required API Key"
              placeholder="pk_live_..."
              required
              helperText="Required field marked with asterisk"
            />
          </div>
        </section>

        {/* Module 3: Product Card Showcase */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <span>03. Core Product Card Catalog</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  ProductCard.stories.jsx
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Showcasing real product photography (`headphones.jpg`, `smartwatch.jpg`), badges, pricing, and stock status
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Headphones */}
            <ProductCard
              title="AeroTune Pro ANC Wireless Headphones"
              category="Acoustics & Audio"
              imageSrc="/products/headphones.jpg"
              price={189.99}
              originalPrice={229.99}
              rating={4.9}
              reviewCount={246}
              badge="BESTSELLER"
              inStock={true}
              description="Precision engineered 45mm neodymium drivers delivering immersive spatial fidelity and hybrid active noise cancellation."
              features={['Spatial Audio', '40h Battery', 'USB-C Fast Charge']}
              onAddToCart={handleAddToCart}
            />

            {/* Card 2: Smartwatch */}
            <ProductCard
              title="Vanguard Chrono Titanium Smartwatch"
              category="Wearable Tech"
              imageSrc="/products/smartwatch.jpg"
              price={279.00}
              originalPrice={349.00}
              rating={4.8}
              reviewCount={189}
              badge="20% OFF"
              inStock={true}
              description="Military-grade titanium alloy casing with continuous biometric heart monitoring, GPS route tracking, and AMOLED display."
              features={['AMOLED 1.4"', 'ECG Sensor', '50m Water Resist']}
              onAddToCart={handleAddToCart}
            />

            {/* Card 3: Out of Stock Card */}
            <ProductCard
              title="AeroTune Studio Edition (Limited Run)"
              category="Collector Series"
              imageSrc="/products/headphones.jpg"
              price={349.99}
              originalPrice={null}
              rating={5.0}
              reviewCount={42}
              badge="COLLECTOR"
              inStock={false}
              description="Bespoke hand-assembled studio monitors with anodized aluminum arms and memory foam velvet pads."
              features={['Individually Numbered', 'Open-Back Architecture']}
              onAddToCart={handleAddToCart}
            />
          </div>
        </section>

        {/* Storybook CLI & Integration Instructions */}
        <section className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Storybook Execution Guide</span>
          </div>

          <h3 className="text-xl font-bold text-white font-['Outfit']">
            Launching the Localized Storybook Environment
          </h3>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Storybook launches on a decoupled port (<code className="text-indigo-300 font-mono">http://localhost:6006</code>) completely isolated from the Next.js runtime. Execute the commands below:
          </p>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-slate-200 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-[11px] pb-1 border-b border-slate-800">
              <span>BASH / POWERSHELL</span>
              <span>PORT 6006</span>
            </div>
            <p className="text-indigo-300"># 1. Navigate to Track A directory</p>
            <p className="text-slate-100">cd Sprint_12/track-a-storybook</p>
            <p className="text-indigo-300 mt-2"># 2. Launch Storybook development server</p>
            <p className="text-emerald-400 font-bold">npm run storybook</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500 font-mono">
        Sprint 12 Track A: Storybook Component Library • Prodesk IT Engineering Residency • Ujjawal Tiwari
      </footer>
    </div>
  );
}
