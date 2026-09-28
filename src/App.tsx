import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { EmployeePanel } from './components/EmployeePanel';
import { ShopCatalog } from './components/ShopCatalog';
import { LegalPagesModal } from './components/LegalPagesModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { ArrowRight, Sparkles, Shield, Award, CheckCircle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeView,
    selectedProductSlug,
    products,
    categories,
    navigate,
    language,
    storeSettings,
    currentUser,
  } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isUrdu = language === 'ur';

  // Featured pieces for homepage
  const featuredProducts = products.filter((p) => p.isFeatured || p.rating >= 4.9).slice(0, 3);

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAF9F5] ${isUrdu ? 'rtl font-urdu' : 'ltr'}`}>
      {/* 1. Persistent Persona & RBAC Switcher Bar */}
      <RoleSwitcherBar />

      {/* 2. Top Banner Announcement */}
      {storeSettings.announcementText && (
        <div className="bg-stone-900 text-stone-200 text-center py-2 px-4 text-xs font-medium border-b border-stone-800">
          <span>{storeSettings.announcementText}</span>
        </div>
      )}

      {/* 3. Navigation Bar (Strict 3-zone contract) */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 4. Active View Content */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div className="space-y-16 lg:space-y-24">
            {/* Hero Section */}
            <Hero />

            {/* Featured Collection Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                    {isUrdu ? 'منتخب شاہکار' : 'Featured Selection'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-semibold text-stone-950 mt-1">
                    {isUrdu ? 'دستکار تخلیقات' : 'Artisanal Signatures'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {isUrdu
                      ? 'محدود دستکاری اور خالص مٹیریل کے ساتھ تیار کردہ'
                      : 'Small-batch pieces crafted with uncompromised natural provenance.'}
                  </p>
                </div>

                <button
                  onClick={() => navigate('shop')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-stone-700 underline underline-offset-4 group"
                >
                  <span>{isUrdu ? 'مکمل کیٹلاگ دیکھیں' : 'View Full Collection'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </section>

            {/* Artisanal Heritage / Atelier Story Spotlight */}
            <section className="bg-stone-900 text-stone-100 py-16 sm:py-24 border-y border-stone-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-6 space-y-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                      {isUrdu ? 'ہماری تاریخ و روایت' : 'Provenance & Discipline'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-display font-medium text-white leading-tight">
                      {isUrdu
                        ? 'معدوم ہوتی ہوئی دستکاری کا احیاء'
                        : 'Reviving Ancient Weaves & Rare Botanical Distillations'}
                    </h2>
                    <p className="text-sm text-stone-300 font-light leading-relaxed">
                      {isUrdu
                        ? 'ہمارے ہر فن پارے کے پیچھے کاریگروں کی نسل در نسل چلی آنے والی محنت ہے۔ ہم سستے متبادلات یا مصنوعی کیمیکلز کے بجائے قدرتی شہتوت کے ریشم، ہینڈ اسپن پشمینہ اون اور بارہ سال پرانے نایاب عود کو ترجیح دیتے ہیں۔'
                        : 'Every piece in the Zauq archive is born from patient discipline. We partner directly with master weavers in Lahore, coppersmiths in old bazaars, and traditional attar distillers to safeguard Pakistan’s living heritage.'}
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-800 text-xs">
                      <div>
                        <div className="text-amber-400 font-mono font-bold text-lg">100%</div>
                        <div className="text-stone-400 mt-1">Traceable raw materials without industrial fillers</div>
                      </div>
                      <div>
                        <div className="text-amber-400 font-mono font-bold text-lg">Zero</div>
                        <div className="text-stone-400 mt-1">Mass-produced fast fashion shortcuts</div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => navigate('shop')}
                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-3 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                      >
                        {isUrdu ? 'ہمارا کام دیکھیں' : 'Discover Our Works'}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="relative rounded-2xl overflow-hidden border border-stone-700 shadow-2xl aspect-4/3">
                      <img
                        src="/images/product_oud_fragrance_1790571640406.jpg"
                        alt="Artisanal Oud Distillation"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Categories Grid Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                  {isUrdu ? 'شعبہ جات' : 'Artisanal Taxonomies'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-semibold text-stone-950">
                  {isUrdu ? 'مخصوص دستکار کیٹیگریز' : 'Explore by Craft Domain'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => navigate('shop', { category: cat.name })}
                    className="group relative rounded-xl overflow-hidden cursor-pointer border border-stone-200/90 shadow-xs aspect-4/5 flex flex-col justify-end p-5 bg-stone-900"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
                    
                    <div className="relative z-10 space-y-1 text-white">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-stone-300">
                        {cat.itemCount} Curations
                      </span>
                      <h3 className="font-display text-lg font-semibold leading-tight text-white group-hover:text-amber-300 transition-colors">
                        {isUrdu ? cat.urduName : cat.name}
                      </h3>
                      <p className="text-[11px] text-stone-300 line-clamp-2 font-light">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Shop View */}
        {activeView === 'shop' && <ShopCatalog />}

        {/* Product Detail View */}
        {activeView === 'product' && selectedProductSlug && (
          <ProductDetailView
            slug={selectedProductSlug}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        )}

        {/* Customer Account Dashboard */}
        {activeView === 'account' && <CustomerDashboard />}

        {/* Admin Console */}
        {activeView === 'admin' && <AdminPanel />}

        {/* Employee Panel */}
        {activeView === 'employee' && <EmployeePanel />}

        {/* Legal Pages & FAQ */}
        {activeView === 'legal' && <LegalPagesModal />}
      </main>

      {/* 5. Drawers and Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
