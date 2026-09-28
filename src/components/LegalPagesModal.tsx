'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, FileText, ArrowLeft, HelpCircle, Truck, RotateCcw, CreditCard } from 'lucide-react';

interface LegalPagesModalProps {
  initialTopic?: string;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({ initialTopic }) => {
  const { legalTopic: storeTopic, navigate, language } = useStore();
  const [localTopic, setLocalTopic] = React.useState<string>(initialTopic || storeTopic || 'terms');
  const legalTopic = initialTopic ? localTopic : storeTopic;
  const isUrdu = language === 'ur';

  const topics = [
    { id: 'terms', title: 'Terms & Conditions', urduTitle: 'شرائط و ضوابط', icon: FileText },
    { id: 'privacy', title: 'Privacy Policy', urduTitle: 'رازداری کی پالیسی', icon: Shield },
    { id: 'returns', title: 'Returns & Refunds', urduTitle: 'واپسی اور ریفنڈ', icon: RotateCcw },
    { id: 'shipping', title: 'Shipping & Delivery', urduTitle: 'ترسیل کی پالیسی', icon: Truck },
    { id: 'payment', title: 'Payment Policy', urduTitle: 'ادائیگی کی پالیسی', icon: CreditCard },
    { id: 'faq', title: 'Client FAQ', urduTitle: 'اکثر پوچھے گئے سوالات', icon: HelpCircle },
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back link */}
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-950 mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'واپس ہوم پیج' : 'Return to Home'}</span>
        </button>

        {/* Tab selection */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-stone-200 pb-4">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setLocalTopic(t.id);
                navigate('legal', t.id);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                legalTopic === t.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span>{isUrdu ? t.urduTitle : t.title}</span>
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-xs space-y-6 text-sm text-stone-700 leading-relaxed">
          
          {legalTopic === 'terms' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-display font-semibold text-stone-950">
                Terms & Conditions of Patronage
              </h1>
              <p className="text-xs text-stone-400">Effective Date: October 2026</p>
              <p>
                Welcome to Zauq Luxury. By accessing, placing an order, or commissioning an artisanal
                piece through our platform, you agree to be bound by the terms outlined below.
              </p>
              <h3 className="font-semibold text-stone-900 pt-2">1. Authenticity & Natural Variations</h3>
              <p>
                Our pieces are created by master artisans from unrefined natural materials—including raw
                mulberry silk, hand-beaten brass, and aged organic agarwood oud. Subtle slubs in the weave
                and slight hammer variations are intrinsic marks of artisanal authenticity, not flaws.
              </p>
              <h3 className="font-semibold text-stone-900 pt-2">2. Order Reservation & Verification</h3>
              <p>
                Orders paid via Bank Transfer or Mobile Wallets (JazzCash / Easypaisa) are placed in
                reserved stock for up to 24 hours awaiting verified transfer confirmation.
              </p>
            </div>
          )}

          {legalTopic === 'privacy' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-display font-semibold text-stone-950">
                Client Privacy & Data Protection Policy
              </h1>
              <p className="text-xs text-stone-400">Effective Date: October 2026</p>
              <p>
                Your privacy is paramount. Zauq Luxury maintains strict end-to-end encryption across all
                order records, customer addresses, and payment receipts.
              </p>
              <h3 className="font-semibold text-stone-900 pt-2">Data We Collect</h3>
              <p>
                We only retain information necessary to deliver your pieces: customer name, shipping
                coordinates, phone number for courier dispatch, and transaction reference numbers.
              </p>
            </div>
          )}

          {legalTopic === 'returns' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-display font-semibold text-stone-950">
                Return, Exchange & Refund Guarantee
              </h1>
              <p className="text-xs text-stone-400">7-Day Discretionary Window</p>
              <p>
                We offer a 7-day return policy on apparel and leather pieces in unwashed, unworn condition
                with seals attached.
              </p>
              <h3 className="font-semibold text-stone-900 pt-2">Fragrance & Pure Oud Policy</h3>
              <p>
                Due to the delicate botanical nature and luxury hygiene protocols, perfume flacons and attars
                cannot be returned once the protective exterior wax seal is broken.
              </p>
            </div>
          )}

          {legalTopic === 'shipping' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-display font-semibold text-stone-950">
                Insured Shipping & Courier Logistics
              </h1>
              <p>
                Every parcel is dispatched in a custom tamper-evident, sealed luxury presentation box.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
                <li>Complimentary Insured Courier on orders over PKR 10,000 nationwide.</li>
                <li>Lahore, Islamabad, Karachi: 24 to 48 hours delivery.</li>
                <li>All other cities: 2 to 4 business days via TCS / Leopards Express Air.</li>
              </ul>
            </div>
          )}

          {legalTopic === 'payment' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-display font-semibold text-stone-950">
                Payment Verification & Supported Methods
              </h1>
              <p>
                We accept Direct Bank Transfer (Meezan Bank Limited), JazzCash, Easypaisa, and Cash on
                Delivery (with courier phone confirmation).
              </p>
            </div>
          )}

          {legalTopic === 'faq' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-display font-semibold text-stone-950">
                Frequently Asked Inquiries (FAQ)
              </h1>
              <div className="space-y-3 pt-2">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-semibold text-stone-900 text-xs">How do I track my dispatched order?</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    You can visit the "Track Order" link in our header or access the Customer Portal. Each order provides a live tracking status bar from Placed to Delivered.
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-semibold text-stone-900 text-xs">Are your ouds 100% natural?</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Yes, our Oud Al-Layl and Taif attars are distilled from wild-harvested Cambodian agarwood and Taif mountain roses without synthetic diluents.
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-semibold text-stone-900 text-xs">Can I cancel an order after placing it?</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Yes, as long as the parcel has not yet transitioned to "Shipped" status, you can cancel it with 1 click in your portal, and the reserved pieces are automatically restocked into our inventory.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
