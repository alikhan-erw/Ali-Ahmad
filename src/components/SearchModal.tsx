'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowRight, Tag } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { products, language, navigate } = useStore();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const isUrdu = language === 'ur';

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.urduName.includes(query) ||
          p.sku.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            autoFocus
            placeholder={
              isUrdu
                ? 'نام، عود، ریشم، یا SKU سے تلاش کریں...'
                : 'Search by piece name, notes (oud, silk), or SKU code...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none focus:outline-hidden text-stone-900 placeholder:text-stone-400"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div className="py-6 text-center space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {isUrdu ? 'مقبول ترین تلاش' : 'Popular Curated Enquiries'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Raw Silk Kurta', 'Oud Al-Layl', 'Saddle Tote', 'Pashmina Shawl', 'Brass Vessel'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-xs text-stone-700 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              No artisanal pieces matched your query "{query}".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onClose();
                  navigate('product', item.slug);
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      (Array.isArray(item.images) && item.images[0]) ||
                      (item as any).image ||
                      '/images/product_silk_apparel_1790571652578.jpg'
                    }
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/product_silk_apparel_1790571652578.jpg';
                    }}
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900 group-hover:underline">
                      {isUrdu ? item.urduName : item.name}
                    </h4>
                    <div className="text-[11px] text-stone-500 font-mono">
                      {item.brand} · SKU: {item.sku}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-stone-950 text-xs">
                    PKR {(item.salePrice || item.price).toLocaleString()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
