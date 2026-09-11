'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import type { AuthUser } from '@/hooks/use-auth';

type UserMenuProps = {
  user: AuthUser | null | undefined;
};

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post('/customer/logout');
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      setOpen(false);
      toast.success('Logged out');
      router.push('/');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Logout failed');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer text-[#323232] transition-colors hover:text-brand-dark"
        aria-label={user ? 'Account menu' : 'Sign in'}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <User className="h-6 w-6" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[1002] pt-4" role="menu">
          <div className="flex w-40 flex-col gap-2 rounded border-2 border-border bg-white px-5 py-5 text-gray-500 shadow-2xl">
            {!user && (
              <Link
                href="/auth/login"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-center gap-2 text-sm transition-colors hover:text-black"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
                Sign In
              </Link>
            )}

            {user && (
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex cursor-pointer items-center gap-2 text-left text-sm transition-colors hover:text-black disabled:opacity-60"
              >
                <LogOut className="h-5 w-5" strokeWidth={1.5} />
                {loggingOut ? 'Logging out…' : 'Logout'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
