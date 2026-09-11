'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Search, X, Menu, ChevronLeft, Heart, ShoppingBag } from 'lucide-react';
import { BrandLogo } from '@/components/layout/brand-logo';
import { UserMenu } from '@/components/layout/user-menu';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'NEW', href: '/', match: (path: string) => path === '/' },
  { label: 'MEN', href: '/', match: () => false },
  { label: 'WOMEN', href: '/', match: () => false },
  { label: 'KIDS', href: '/', match: () => false },
  { label: 'HOME & LIVING', href: '/', match: () => false },
];

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className="group flex flex-col items-center gap-1">
      <span className="cursor-pointer font-sans text-base leading-6 text-gray-700 transition-colors group-hover:text-brand-dark">
        {label}
      </span>
      <span
        className={cn(
          'h-0.5 w-2/5 rounded-full bg-gray-700 transition-opacity duration-200',
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40',
        )}
      />
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: user } = useAuth();

  useEffect(() => {
    if (searchOpen) {
      const timer = window.setTimeout(() => searchInputRef.current?.focus(), 200);
      return () => window.clearTimeout(timer);
    }
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-[1000] bg-white shadow-sm">
      <div className="relative px-4 sm:px-[3vw]">
        <div className="flex items-center justify-between py-6 font-medium font-sans">
          <BrandLogo href="/" size="lg" className="relative z-10" />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 md:flex lg:gap-6">
            {navLinks.map((link) => (
              <NavItem
                key={link.label}
                href={link.href}
                label={link.label}
                active={link.match(pathname)}
              />
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-4 md:gap-6">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="cursor-pointer text-[#323232] transition-colors hover:text-brand-dark"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              <Search className="h-6 w-6" strokeWidth={1.5} />
            </button>

            <UserMenu user={user} />

            <Link
              href="/wishlist"
              className="cursor-pointer text-[#323232] transition-colors hover:text-brand-dark"
              aria-label="Wishlist"
            >
              <Heart className="h-6 w-6" strokeWidth={1.5} />
            </Link>

            <Link
              href="/cart"
              className="relative cursor-pointer text-[#323232] transition-colors hover:text-brand-dark"
              aria-label="Cart"
            >
              <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
              <span className="absolute -bottom-1 -right-1 flex aspect-square w-4 items-center justify-center rounded-full bg-black text-[8px] leading-none text-white">
                0
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="cursor-pointer text-[#323232] md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-[1000] bg-black/30 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}

        <div
          className={cn(
            'fixed top-0 right-0 bottom-0 z-[1001] overflow-hidden bg-white transition-[width] duration-300 md:hidden',
            mobileOpen ? 'w-full max-w-sm' : 'w-0',
          )}
        >
          <div className="flex h-full w-full min-w-[280px] flex-col bg-white text-brand-secondary">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex cursor-pointer items-center gap-4 p-3 text-brand-muted"
            >
              <ChevronLeft className="h-6 w-6" />
              Back
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'border-t border-border py-3 pl-6 font-sans text-base leading-6 text-gray-700',
                  link.match(pathname) && 'bg-surface font-medium',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        className={cn(
          'relative z-20 flex items-center justify-center overflow-hidden bg-gray-50 text-center transition-all duration-300',
          searchOpen
            ? 'pointer-events-auto max-h-24 scale-100 opacity-100'
            : 'pointer-events-none max-h-0 scale-95 opacity-0',
        )}
      >
        <div className="my-5 inline-flex w-3/4 items-center justify-center rounded-full border border-gray-400 px-5 py-2 sm:w-1/2">
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeSearch();
              if (e.key === 'Enter' && searchQuery.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                closeSearch();
              }
            }}
            placeholder="Search"
            className="flex-1 bg-inherit text-sm text-brand-dark outline-none placeholder:text-brand-muted"
          />
          <Search className="h-6 w-6 shrink-0 text-[#323232]" strokeWidth={1.5} />
        </div>

        <button
          type="button"
          onClick={closeSearch}
          className="absolute right-4 cursor-pointer text-[#323232] transition-colors hover:text-brand-dark sm:right-[3vw]"
          aria-label="Close search"
        >
          <X className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <BrandLogo href="/" size="sm" />
          <p className="mt-2 text-sm text-brand-secondary">Premium multi-vendor fashion marketplace.</p>
        </div>
        <p className="mt-8 text-center text-sm text-brand-muted">
          © {new Date().getFullYear()} FashionHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
