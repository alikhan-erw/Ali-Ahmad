import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#FAF9F5]">
      <span className="text-xs uppercase font-semibold tracking-widest text-stone-500 mb-2">
        404 · Not Found
      </span>
      <h1 className="text-4xl sm:text-5xl font-display font-semibold text-stone-950 mb-4">
        The Masterpiece Cannot Be Found
      </h1>
      <p className="text-stone-600 text-sm max-w-md mb-8 leading-relaxed">
        The artisanal piece or page you are looking for has been moved, archived, or does not exist in our current collection.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
        >
          Return Home
        </Link>
        <Link
          href="/shop"
          className="bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-medium text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-xs"
        >
          Explore Collection
        </Link>
      </div>
    </div>
  );
}
