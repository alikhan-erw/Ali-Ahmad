import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '../src/context/StoreContext';
import { RoleSwitcherBar } from '../src/components/RoleSwitcherBar';
import { AppHeader } from '../src/components/AppHeader';
import { AppModals } from '../src/components/AppModals';
import { Footer } from '../src/components/Footer';

export const metadata: Metadata = {
  title: 'Zauq Luxury — E-Commerce & Business Management Platform',
  description:
    'A scalable, branded luxury e-commerce and retail enterprise platform featuring multi-role RBAC (Customer, Employee, Admin), real-time inventory management, order tracking, and localized checkout.',
  openGraph: {
    title: 'Zauq Luxury — E-Commerce & Business Management Platform',
    description:
      'A scalable, branded luxury e-commerce and retail enterprise platform featuring multi-role RBAC, real-time inventory management, and localized checkout.',
    siteName: 'Zauq Luxury',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zauq Luxury — E-Commerce & Business Management Platform',
    description:
      'A scalable, branded luxury e-commerce and retail enterprise platform featuring multi-role RBAC, real-time inventory management, and localized checkout.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F5] text-stone-900 antialiased selection:bg-stone-900 selection:text-white flex flex-col min-h-screen">
        <StoreProvider>
          <RoleSwitcherBar />
          <AppHeader />
          <main className="flex-1">{children}</main>
          <AppModals />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
