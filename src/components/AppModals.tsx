'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { SearchModal } from './SearchModal';

export const AppModals: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isSearchOpen,
    setIsSearchOpen,
  } = useStore();

  return (
    <>
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
    </>
  );
};
