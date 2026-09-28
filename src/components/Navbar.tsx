'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, Heart, User, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenSearch }) => {
  const { language, activeView, navigate, cartTotals, wishlist, currentUser, setIsCartOpen, setIsSearchOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenCart = onOpenCart || (() => setIsCartOpen(true));
  const handleOpenSearch = onOpenSearch || (() => setIsSearchOpen(true));

  const isUrdu = language === 'ur';

  return (
    <header className="sticky top-[31px] z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* ZONE 1: Single text element brand wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-950 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => navigate('home')}
              className="text-left group transition-transform focus:outline-hidden"
            >
              <span className={`text-2xl sm:text-3xl font-display font-semibold tracking-wider text-stone-950 ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? 'ذوق لگژری' : 'ZAUQ LUXURY'}
              </span>
            </button>
          </div>

          {/* ZONE 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-700">
            <button
              onClick={() => navigate('shop')}
              className={`hover:text-stone-950 transition-colors cursor-pointer ${
                activeView === 'shop' ? 'text-stone-950 font-semibold underline underline-offset-8' : ''
              }`}
            >
              {isUrdu ? 'تمام مصنوعات' : 'All Products'}
            </button>

            <button
              onClick={() => navigate('shop', { category: 'Artisanal Apparel & Shawls' })}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              {isUrdu ? 'ملبوسات و شالیں' : 'Artisanal Apparel'}
            </button>

            <button
              onClick={() => navigate('shop', { category: 'Niche Perfumes & Ouds' })}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              {isUrdu ? 'خالص عطریات و عود' : 'Niche Perfumes'}
            </button>

            <button
              onClick={() => navigate('shop', { category: 'Full-Grain Leather Goods' })}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              {isUrdu ? 'چمڑے کے سامان' : 'Leather Goods'}
            </button>

            <button
              onClick={() => navigate('account', { tab: 'orders' })}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              {isUrdu ? 'آرڈر ٹریکنگ' : 'Track Order'}
            </button>

            <button
              onClick={() => navigate('legal', 'faq')}
              className="hover:text-stone-950 transition-colors cursor-pointer text-stone-500 hover:text-stone-900"
            >
              {isUrdu ? 'رہنمائی و پالیسیاں' : 'Help & Policies'}
            </button>
          </nav>

          {/* ZONE 3: 1-2 primary actions (Search, Wishlist, Bag, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={handleOpenSearch}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors"
              title="Search products"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate('account', { tab: 'wishlist' })}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors relative"
              title="View Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-stone-100 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Customer Account or Admin jump */}
            <button
              onClick={() => {
                if (currentUser?.role === 'ADMIN') navigate('admin');
                else if (currentUser?.role === 'EMPLOYEE') navigate('employee');
                else navigate('account');
              }}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors relative"
              title={currentUser ? `Account: ${currentUser.name}` : 'Login / Register'}
              aria-label="Account details"
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-[#FAF9F5]" />
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={handleOpenCart}
              className="flex items-center gap-2 bg-stone-950 text-white hover:bg-stone-800 px-3.5 py-2 rounded-lg transition-colors shadow-xs ml-1"
              aria-label={`Shopping Bag, ${cartTotals.itemCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-semibold tabular-nums">
                {cartTotals.itemCount}
              </span>
              <span className="hidden sm:inline text-xs text-stone-300 font-mono">
                · PKR {cartTotals.subtotal.toLocaleString()}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FAF9F5] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2 text-sm font-medium text-stone-800">
            <button
              onClick={() => {
                navigate('shop');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-2 hover:bg-stone-200/60 rounded flex items-center justify-between"
            >
              <span>{isUrdu ? 'تمام کلیکشن' : 'All Collections'}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => {
                navigate('shop', { category: 'Artisanal Apparel & Shawls' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-2 hover:bg-stone-200/60 rounded flex items-center justify-between"
            >
              <span>{isUrdu ? 'ملبوسات و شالیں' : 'Artisanal Apparel & Shawls'}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => {
                navigate('shop', { category: 'Niche Perfumes & Ouds' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-2 hover:bg-stone-200/60 rounded flex items-center justify-between"
            >
              <span>{isUrdu ? 'خالص عطریات و عود' : 'Niche Perfumes & Ouds'}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => {
                navigate('shop', { category: 'Full-Grain Leather Goods' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-2 hover:bg-stone-200/60 rounded flex items-center justify-between"
            >
              <span>{isUrdu ? 'چمڑے کے سامان' : 'Full-Grain Leather Goods'}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => {
                navigate('account', { tab: 'orders' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-2 hover:bg-stone-200/60 rounded flex items-center justify-between"
            >
              <span>{isUrdu ? 'آرڈر کا سراغ لگائیں' : 'Track Existing Order'}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => {
                navigate('legal', 'faq');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-2 hover:bg-stone-200/60 rounded flex items-center justify-between text-stone-600"
            >
              <span>{isUrdu ? 'اکثر پوچھے گئے سوالات (FAQ)' : 'Customer Support & FAQ'}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
