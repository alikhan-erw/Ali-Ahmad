import type { Metadata } from 'next';
import { AuthLoginView } from '../../../src/components/AuthLoginView';

export const metadata: Metadata = {
  title: 'Patron Authentication & Portal | Zauq Luxury',
  description: 'Sign in to access personal order archives, saved pieces, and customer service.',
};

export default function LoginPage() {
  return <AuthLoginView />;
}
