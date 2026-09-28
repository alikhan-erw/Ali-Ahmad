'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, navigate } = useStore();
  const isUrdu = language === 'ur';

  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribedEmail.trim()) return;
    setSubscribedSuccess(true);
    setSubscribedEmail('');
    setTimeout(() => setSubscribedSuccess(false), 5000);
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <span className={`text-2xl font-display font-semibold tracking-wider text-white ${isUrdu ? 'font-urdu' : ''}`}>
              {isUrdu ? 'ذوق لگژری' : 'ZAUQ LUXURY'}
            </span>
            <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm">
              {isUrdu
                ? 'پاکستان کی دستکاری، خالص شہتوت کے ریشم، ہمالیائی پشمینہ اور بارہ سال پرانے نایاب عود کا معتبر اور محفوظ برانڈڈ پلیٹ فارم۔'
                : 'Curators of artisanal raw silk tunics, wild-harvested Cambodian ouds, and full-grain vegetable-tanned leathercraft. Master ateliers across Lahore & Peshawar.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Full-Stack Next.js + Supabase Architecture</span>
            </div>
          </div>

          {/* Curated Collections */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">
              {isUrdu ? 'مجموعہ جات' : 'Artisanal Lines'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigate('shop', { category: 'Artisanal Apparel & Shawls' })}
                  className="hover:text-white transition-colors"
                >
                  Raw Mulberry Silks & Shawls
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('shop', { category: 'Niche Perfumes & Ouds' })}
                  className="hover:text-white transition-colors"
                >
                  Oud Al-Layl & Taif Attars
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('shop', { category: 'Full-Grain Leather Goods' })}
                  className="hover:text-white transition-colors"
                >
                  Handcrafted Saddle-Leather Totes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('shop', { category: 'Living & Sculptural Decor' })}
                  className="hover:text-white transition-colors"
                >
                  Hand-Beaten Solid Brass Vessels
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge & Policies */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">
              {isUrdu ? 'رہنمائی و خدمات' : 'Client Care'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigate('account', { tab: 'orders' })}
                  className="hover:text-white transition-colors"
                >
                  Track Existing Parcel
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('legal', 'returns')}
                  className="hover:text-white transition-colors"
                >
                  7-Day Returns Window
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('legal', 'shipping')}
                  className="hover:text-white transition-colors"
                >
                  Insured Express Transit
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('legal', 'faq')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('legal', 'privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy & Data Security
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Private Invitations */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">
              {isUrdu ? 'پرائیویٹ ممبرشپ' : 'Heritage Gazettes'}
            </h4>
            <p className="text-xs text-stone-400">
              Receive private invitations to limited-edition changthangi cashmere and oud harvest drops.
            </p>

            {subscribedSuccess ? (
              <div className="p-2.5 bg-stone-900 border border-emerald-600/50 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span>You are invited to the Heritage Gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    className="flex-1 bg-stone-900 border border-stone-800 rounded-l-lg px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-hidden focus:border-stone-600"
                  />
                  <button
                    type="submit"
                    className="bg-stone-800 hover:bg-stone-700 text-white px-3 py-2 rounded-r-lg text-xs font-semibold transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 text-[11px] text-stone-500">
              Payment Integrations: JazzCash · Easypaisa · Meezan Bank · COD
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Quiet Affordances */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Zauq Luxury Holdings. All Rights Reserved. Artisanal Provenance Guaranteed.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('legal', 'terms')}
              className="hover:text-stone-300 transition-colors"
            >
              Terms of Patronage
            </button>
            <span>·</span>
            <button
              onClick={() => navigate('legal', 'privacy')}
              className="hover:text-stone-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => navigate('legal', 'shipping')}
              className="hover:text-stone-300 transition-colors"
            >
              Transit Insurance
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
