'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { Navbar } from './Navbar';

export const AppHeader: React.FC = () => {
  const { storeSettings } = useStore();

  return (
    <>
      {storeSettings?.announcementText && (
        <div className="bg-stone-900 text-stone-200 text-center py-2 px-4 text-xs font-medium border-b border-stone-800">
          <span>{storeSettings.announcementText}</span>
        </div>
      )}
      <Navbar />
    </>
  );
};
