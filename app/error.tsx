'use client';

import React from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#FAF9F5]">
      <span className="text-xs uppercase font-semibold tracking-widest text-stone-500 mb-2">
        System Notice
      </span>
      <h1 className="text-4xl sm:text-5xl font-display font-semibold text-stone-950 mb-4">
        An Unexpected Error Occurred
      </h1>
      <p className="text-stone-600 text-sm max-w-md mb-8 leading-relaxed">
        We encountered an intermittent issue while rendering this artisanal page. Please try again or return home.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-medium text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-xs"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
