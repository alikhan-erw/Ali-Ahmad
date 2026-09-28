'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { categories, navigate, language } = useStore();
  const isUrdu = language === 'ur';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${isUrdu ? 'rtl font-urdu' : 'ltr'}`}>
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
          {isUrdu ? 'شعبہ جات' : 'Artisanal Taxonomies'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-stone-950">
          {isUrdu ? 'مخصوص دستکار کیٹیگریز' : 'Explore by Craft Domain'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
          {isUrdu
            ? 'روایتی کاریگری اور مستند خام مال کے ساتھ تیار کردہ فن پارے'
            : 'Carefully curated disciplines honoring regional masters, ethical provenance, and enduring quality.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate('shop', { category: cat.name })}
            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-stone-200/90 shadow-xs aspect-4/5 flex flex-col justify-end p-6 bg-stone-900"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent" />

            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                {cat.itemCount} Curations Available
              </span>
              <h2 className="font-display text-2xl font-semibold leading-tight text-white group-hover:text-amber-300 transition-colors">
                {isUrdu ? cat.urduName : cat.name}
              </h2>
              <p className="text-xs text-stone-300 line-clamp-3 font-light leading-relaxed">
                {cat.description}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{isUrdu ? 'دیکھیں' : 'Explore Collection'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
