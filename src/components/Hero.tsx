'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowUpRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, navigate } = useStore();
  const isUrdu = language === 'ur';

  return (
    <section className="relative overflow-hidden bg-[#FAF9F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text / Editorial Storytelling */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500">
              <span>{isUrdu ? 'دستکاری و نفاست' : 'Artisanal Provenance'}</span>
              <span aria-hidden="true">·</span>
              <span>{isUrdu ? 'موسمِ خزاں و بہار' : 'Heritage Edition 2026'}</span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-stone-950 leading-[1.1] ${
                isUrdu ? 'font-urdu leading-normal' : ''
              }`}
              style={{ textWrap: 'balance' }}
            >
              {isUrdu
                ? 'روایت کی خوشبو، کمال کی دستکاری اور ابدی نفاست'
                : 'Rare Raw Silks, Aged Agarwood Ouds & Bespoke Leathercraft'}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl font-light leading-relaxed">
              {isUrdu
                ? 'ہم پاکستان کے روایتی کاریگروں کی صدیوں پرانی مہارت اور معاصر ڈیزائن کو یکجا کرتے ہیں۔ ہر فن پارہ محدود تعداد میں اور مکمل باریک بینی سے تیار کیا جاتا ہے۔'
                : 'Rooted in multigenerational weaving and distillation ateliers. Pure changthangi cashmere, rare Cambodian agarwoods, and saddle-stitched vegetable-tanned leather.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('shop')}
                className="inline-flex items-center gap-2.5 bg-stone-950 text-white hover:bg-stone-800 px-6 py-3.5 rounded-lg text-sm font-semibold transition-all shadow-sm"
              >
                <span>{isUrdu ? 'کلیکشن دریافت کریں' : 'Explore The Collection'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('shop', { category: 'Niche Perfumes & Ouds' })}
                className="inline-flex items-center gap-2 border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-50 text-stone-900 px-6 py-3.5 rounded-lg text-sm font-medium transition-all"
              >
                <span>{isUrdu ? 'خالص عود و عطریات' : 'Olfactive Attars'}</span>
              </button>
            </div>

            {/* Adjacent Trust Proofs */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 text-stone-700">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>100% Provenance</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-tight">
                  {isUrdu ? 'خالص تصدیق شدہ میٹریل' : 'Ethically sourced rare botanicals & silks'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs">
                  <Truck className="w-4 h-4 text-amber-700" />
                  <span>Insured Transit</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-tight">
                  {isUrdu ? 'ملک بھر میں محفوظ ڈلیوری' : 'Complimentary shipping over PKR 10k'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Bespoke Care</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-tight">
                  {isUrdu ? 'مخصوص تحفہ پیکیجنگ' : 'Sealed luxury gift presentation'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Image Showcase */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200/80 bg-stone-100 group aspect-16/10">
              <img
                src="/images/hero_luxury_storefront_1790571626630.jpg"
                alt="Zauq Luxury Storefront Architectural Showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white space-y-1">
                  <p className="text-xs uppercase tracking-widest text-stone-300">
                    {isUrdu ? 'لاہور اسٹوڈیو نمائش' : 'Flagship Architectural Studio · Lahore'}
                  </p>
                  <p className="font-display text-xl sm:text-2xl text-stone-100">
                    {isUrdu ? 'روایتی دستکاری، عصرِ حاضر کے شایانِ شان' : 'Timeless Craftsmanship in Contemporary Form'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
