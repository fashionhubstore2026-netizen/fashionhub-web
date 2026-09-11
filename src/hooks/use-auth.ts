'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export type AuthUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export function useAuth() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await api.get<AuthUser>('/customer/me');
        return res.data ?? null;
      } catch {
        return null;
      }
    },
    retry: false,
  });
}
