'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  CheckCircle2,
  Lock,
  Truck,
  Copy,
  Upload,
  Check,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Printer,
} from 'lucide-react';
import { PaymentMethod, ShippingAddress, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isPage?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose = () => {},
  isPage = false,
}) => {
  const { cart, cartTotals, createOrder, storeSettings, currentUser, language, navigate } =
    useStore();

  const isUrdu = language === 'ur';

  // Step state (1: Info, 2: Address, 3: Delivery, 4: Payment, 5: Confirmed)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || 'Ali Ahmed',
    phone: currentUser?.phone || '+92 300 1234567',
    email: currentUser?.email || 'ali.ali.ahmad987789@gmail.com',
    address: 'House 42-B, Street 9, Sector F-7/2',
    city: 'Islamabad',
    area: 'F-7 Sector',
    postalCode: '44000',
    deliveryMethod: 'standard', // 'standard' | 'express'
    paymentMethod: 'bank_transfer' as PaymentMethod,
    transactionRef: '',
    paymentProofUrl: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleCopyIban = () => {
    navigator.clipboard.writeText(storeSettings.bankIban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          paymentProofUrl: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const shippingAddress: ShippingAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        area: formData.area,
        postalCode: formData.postalCode,
      };

      const order = await createOrder({
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        transactionRef: formData.transactionRef,
        paymentProofUrl: formData.paymentProofUrl,
        notes: formData.notes,
      });

      setConfirmedOrder(order);
      setCurrentStep(5); // Success step
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header with security lock indicator */}
        <div className="bg-[#FAF9F5] p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-display font-semibold text-stone-900">
              {isUrdu ? 'محفوظ آرڈر چیک آؤٹ' : 'Encrypted Artisanal Checkout'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 p-1.5 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="grid grid-cols-4 border-b border-stone-200 text-xs font-medium text-center bg-stone-50">
            {[
              { num: 1, title: isUrdu ? 'رابطہ' : '1. Contact' },
              { num: 2, title: isUrdu ? 'پتہ' : '2. Address' },
              { num: 3, title: isUrdu ? 'ترسیل' : '3. Delivery' },
              { num: 4, title: isUrdu ? 'ادائیگی' : '4. Payment' },
            ].map(({ num, title }) => (
              <button
                key={num}
                onClick={() => num < currentStep && setCurrentStep(num)}
                disabled={num > currentStep}
                className={`py-3 transition-colors ${
                  currentStep === num
                    ? 'border-b-2 border-stone-950 text-stone-950 font-bold bg-white'
                    : currentStep > num
                    ? 'text-emerald-700 hover:bg-stone-100'
                    : 'text-stone-400 cursor-not-allowed'
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* STEP 1: Customer Contact Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-700" />
                <span>Customer Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Mobile Phone (For Courier Verification)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-stone-900 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Email Address (For Order Tracking & E-Receipt)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-xs"
                >
                  Continue to Address
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Address */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-700" />
                <span>Shipping Address & Destination</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Street Address / House / Villa / Plaza
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House 42-B, Street 9, Sector F-7/2"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    City / Division
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-stone-900 focus:outline-hidden bg-white"
                  >
                    {[
                      'Lahore',
                      'Islamabad',
                      'Karachi',
                      'Rawalpindi',
                      'Faisalabad',
                      'Multan',
                      'Peshawar',
                      'Quetta',
                      'Sialkot',
                      'Gujranwala',
                      'Other Cities (Nationwide)',
                    ].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Neighborhood / Area / Phase
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DHA, Gulberg, Clifton, Bahria"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-stone-900 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-xs"
                >
                  Continue to Delivery Method
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Delivery Options */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-stone-700" />
                <span>Select Courier & Shipping Method</span>
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setFormData({ ...formData, deliveryMethod: 'standard' })}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.deliveryMethod === 'standard'
                      ? 'border-stone-900 bg-stone-50/80 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-stone-900 text-sm">
                      Standard Insured Courier (TCS / Leopards Air)
                    </div>
                    <p className="text-xs text-stone-500">
                      Dispatched within 24 hours. Transit: 2–3 business days.
                    </p>
                  </div>
                  <div className="text-xs font-mono font-bold text-stone-900">
                    {cartTotals.shippingFee === 0 ? 'Complimentary' : `PKR ${cartTotals.shippingFee}`}
                  </div>
                </label>

                <label
                  onClick={() => setFormData({ ...formData, deliveryMethod: 'express' })}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.deliveryMethod === 'express'
                      ? 'border-stone-900 bg-stone-50/80 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-stone-900 text-sm">
                      Same-Day / Next-Day Priority VIP Dispatch
                    </div>
                    <p className="text-xs text-stone-500">
                      Hand-delivered in velvet sleeve across Lahore, Islamabad, and Karachi.
                    </p>
                  </div>
                  <div className="text-xs font-mono font-bold text-stone-900">
                    PKR {storeSettings.expressShippingFee.toLocaleString()}
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Delivery Notes / Gate Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Leave with security guard at Gate 2, call before arrival..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-stone-900 focus:outline-hidden"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-xs"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Selection */}
          {currentStep === 4 && (
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-stone-700" />
                <span>Select Payment Method</span>
              </h3>

              {/* Payment Method Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bank_transfer', label: 'Bank Transfer' },
                  { id: 'jazzcash', label: 'JazzCash' },
                  { id: 'easypaisa', label: 'Easypaisa' },
                  { id: 'cod', label: 'Cash on Delivery' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: pm.id as PaymentMethod })
                    }
                    className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                      formData.paymentMethod === pm.id
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* Contextual payment instruction boxes */}
              {formData.paymentMethod === 'bank_transfer' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                  <div className="font-semibold text-stone-900 flex items-center justify-between">
                    <span>Direct Bank Account Details:</span>
                    <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Fast Corporate Verification
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600 bg-white p-3 rounded-lg border border-stone-200 font-mono">
                    <div>Bank: {storeSettings.bankName}</div>
                    <div>Title: {storeSettings.bankTitle}</div>
                    <div className="sm:col-span-2 flex items-center justify-between">
                      <span>IBAN: {storeSettings.bankIban}</span>
                      <button
                        type="button"
                        onClick={handleCopyIban}
                        className="text-stone-900 hover:text-amber-700 flex items-center gap-1 font-sans text-xs underline"
                      >
                        {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIban ? 'Copied' : 'Copy IBAN'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">
                        Bank Transaction Reference / Transfer ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. FT-90182471 or MCB-20491"
                        value={formData.transactionRef}
                        onChange={(e) =>
                          setFormData({ ...formData, transactionRef: e.target.value })
                        }
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">
                        Upload Payment Proof / Receipt Screenshot (Optional)
                      </label>
                      <label className="flex items-center gap-2 border border-dashed border-stone-300 bg-white p-3 rounded-lg cursor-pointer hover:bg-stone-50">
                        <Upload className="w-4 h-4 text-stone-500" />
                        <span className="text-stone-600">
                          {formData.paymentProofUrl
                            ? 'Receipt image attached (Click to change)'
                            : 'Click to upload transfer screenshot (PNG, JPG)'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'jazzcash' && (
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                  <div className="font-semibold text-stone-900">JazzCash Merchant Transfer:</div>
                  <p className="text-stone-600">
                    Send amount <strong>PKR {cartTotals.total.toLocaleString()}</strong> to JazzCash Mobile Account:
                  </p>
                  <div className="bg-white p-2.5 rounded-lg border border-amber-200 font-mono text-stone-900 font-semibold">
                    Account: {storeSettings.jazzCashAccount} · Title: {storeSettings.jazzCashTitle}
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1 font-medium">
                      JazzCash Transaction ID (TID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 0928172948"
                      value={formData.transactionRef}
                      onChange={(e) =>
                        setFormData({ ...formData, transactionRef: e.target.value })
                      }
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'easypaisa' && (
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2 text-xs">
                  <div className="font-semibold text-stone-900">Easypaisa Wallet Transfer:</div>
                  <p className="text-stone-600">
                    Send <strong>PKR {cartTotals.total.toLocaleString()}</strong> to:
                  </p>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200 font-mono text-stone-900 font-semibold">
                    Account: {storeSettings.easypaisaAccount} · Title: {storeSettings.easypaisaTitle}
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1 font-medium">
                      Easypaisa TRX ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 192847192"
                      value={formData.transactionRef}
                      onChange={(e) =>
                        setFormData({ ...formData, transactionRef: e.target.value })
                      }
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'cod' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-600">
                  <div className="font-semibold text-stone-900">Cash on Delivery (COD):</div>
                  <p>
                    Please have exact cash amount <strong>PKR {cartTotals.total.toLocaleString()}</strong> available upon delivery.
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Our logistics concierge will place a brief verification call to <strong>{formData.phone}</strong> before dispatching the sealed box.
                  </p>
                </div>
              )}

              {/* Order Final Summary */}
              <div className="p-3 bg-stone-100 rounded-lg flex justify-between items-center text-xs">
                <span className="text-stone-600">Total Due:</span>
                <span className="text-base font-mono font-bold text-stone-950">
                  PKR {cartTotals.total.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-xs flex items-center gap-2 disabled:bg-stone-400"
                >
                  {isSubmitting ? (
                    <span>Securing Order...</span>
                  ) : (
                    <>
                      <span>{isUrdu ? 'آرڈر مکمل کریں' : 'Confirm & Place Order'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Order Placed Successfully & E-Receipt */}
          {currentStep === 5 && confirmedOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-display font-semibold text-stone-950">
                  {isUrdu ? 'آپ کا آرڈر کامیابی سے موصول ہو گیا ہے' : 'Artisanal Order Confirmed'}
                </h3>
                <p className="text-sm font-mono text-stone-600">
                  Order Number: <strong className="text-stone-950">{confirmedOrder.orderNumber}</strong>
                </p>
                <p className="text-xs text-stone-500">
                  A detailed confirmation and tracking receipt has been dispatched to{' '}
                  <strong>{confirmedOrder.customerEmail}</strong>.
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-5 text-left text-xs space-y-3">
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <span className="font-semibold text-stone-900">Purchased Artifacts:</span>
                  <span className="text-stone-500">{confirmedOrder.items.length} items</span>
                </div>

                <div className="space-y-2">
                  {confirmedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-stone-800">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-mono font-semibold text-stone-900">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200 pt-2 space-y-1 text-stone-600">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="uppercase font-semibold text-stone-900">
                      {confirmedOrder.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Address:</span>
                    <span className="text-stone-900 truncate max-w-xs">
                      {confirmedOrder.shippingAddress.address}, {confirmedOrder.shippingAddress.city}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-950 font-bold text-sm pt-1">
                    <span>Total Paid / Payable:</span>
                    <span className="font-mono">PKR {confirmedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    navigate('account', { tab: 'orders', orderId: confirmedOrder.id });
                  }}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-xs"
                >
                  Track in Customer Portal
                </button>

                <button
                  onClick={() => window.print()}
                  className="border border-stone-300 hover:border-stone-900 bg-white text-stone-800 text-xs font-medium px-4 py-2.5 rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate('shop');
                  }}
                  className="text-stone-600 hover:text-stone-950 text-xs font-medium px-3 py-2"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
