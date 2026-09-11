import type { Metadata } from 'next';
import { Outfit, Prata, Open_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AppShell } from '@/components/layout/app-shell';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const prata = Prata({ weight: '400', subsets: ['latin'], variable: '--font-prata' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans-loaded' });

export const metadata: Metadata = {
  title: { default: 'FashionHub — Premium Fashion Marketplace', template: '%s | FashionHub' },
  description: 'Shop clothes, jewellery, shoes, watches and more from top vendors.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${prata.variable} ${openSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        <QueryProvider>
          <AppShell>{children}</AppShell>
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
