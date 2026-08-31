'use client';

import { Loader2 } from 'lucide-react';

import { useAuth } from '@/context/auth-context';
import { StudioProvider, useStudio } from '@/context/studio-context';
import { Sidebar } from '@/components/juststudio/sidebar';

function CenteredSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-accent-500" size={28} />
    </div>
  );
}

function JustStudioShell({ children }: { children: React.ReactNode }) {
  const { loading: studioLoading } = useStudio();

  if (studioLoading) return <CenteredSpinner />;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default function JustStudioLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) return <CenteredSpinner />;
  if (!user) return <CenteredSpinner />; // AuthProvider is redirecting to /auth/login

  return (
    <StudioProvider>
      <JustStudioShell>{children}</JustStudioShell>
    </StudioProvider>
  );
}
