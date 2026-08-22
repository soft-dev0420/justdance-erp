'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { authApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';

type VerifyState = 'verifying' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<VerifyState>(token ? 'verifying' : 'error');
  const [error, setError] = useState(token ? '' : 'Missing verification token.');

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        await authApi.verifyEmail(token);
        setState('success');
      } catch (err) {
        setState('error');
        setError(err instanceof ApiError ? err.message : 'Something went wrong.');
      }
    })();
    // token comes from the URL once per page load — not something that
    // legitimately changes while this page is up.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg">
      {state === 'verifying' && (
        <>
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-accent-200 border-t-accent-500" />
          <h1 className="text-lg font-semibold text-gray-900">Verifying your email…</h1>
        </>
      )}
      {state === 'success' && (
        <>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500">
            <CheckGlyph />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Email verified!</h1>
          <p className="mt-1 text-sm text-gray-500">Your account is ready to go.</p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block w-full rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600"
          >
            Continue to sign in
          </Link>
        </>
      )}
      {state === 'error' && (
        <>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <WarningGlyph />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Couldn&apos;t verify email</h1>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Go to sign in
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-accent-50 via-white to-accent-50 px-4">
      <Suspense fallback={null}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}

function CheckGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#DC2626" strokeWidth={2} />
      <path d="M12 8v5" stroke="#DC2626" strokeWidth={2} strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="#DC2626" />
    </svg>
  );
}
