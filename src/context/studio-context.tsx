'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { studioApi } from '@/lib/api';
import type { Studio } from '@/lib/types';

interface StudioContextValue {
  studio: Studio | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const StudioContext = createContext<StudioContextValue | null>(null);

// Fetching /studio/me is what lazily provisions the Studio (+ owner role +
// implicit self Employee) server-side the first time a provider opens the
// dashboard — see justdance-api's StudioService.getOrCreateForUser.
export function StudioProvider({ children }: { children: ReactNode }) {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const s = await studioApi.me();
    setStudio(s);
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        await refresh();
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [refresh]);

  return <StudioContext.Provider value={{ studio, loading, refresh }}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within a StudioProvider');
  return ctx;
}
