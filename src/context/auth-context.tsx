'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { authApi } from '@/lib/api';
import type { User } from '@/lib/types';

const PUBLIC_PATHS = ['/auth/login', '/auth/forgot-password', '/auth/verify-email', '/auth/reset'];
// /profile/[id] is a public, unauthenticated share-preview page (see
// app/profile/[id]/page.tsx) — matched by prefix since the id is dynamic.
const isPublicPath = (pathname: string) => PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/profile/');

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      try {
        const me = await authApi.me();
        setUser(me);
      } catch {
        setUser(null);
        if (!isPublicPath(pathname)) router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    })();
    // Only re-check on first mount — subsequent navigation is guarded by
    // each protected layout, not by re-hitting the session endpoint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    router.replace('/auth/login');
  }, [router]);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
