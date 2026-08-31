'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '@/context/auth-context';
import { ApiError } from '@/lib/api-fetch';
import { FACEBOOK_LOGIN_ENABLED } from '@/lib/feature-flags';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  no_account: 'No Just Dance account found for that account — sign up via the mobile app first.',
  use_password: 'This email is registered with a password — please sign in with your email and password instead.',
};

// useSearchParams() opts the whole subtree out of static prerendering unless
// isolated behind its own Suspense boundary — kept as a separate no-UI
// component for exactly that reason.
function OAuthErrorToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) toast.error(OAUTH_ERROR_MESSAGES[error] ?? 'Sign-in failed.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/juststudio');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-accent-50 via-white to-accent-50 px-4">
      <Suspense fallback={null}>
        <OAuthErrorToast />
      </Suspense>
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-black">
            <Image src="/logo-alt.png" alt="Just Dance" width={56} height={56} className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Just Dance Studio</h1>
            <p className="text-sm text-gray-500">Sign in to manage your studio</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-gray-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent-500 focus:bg-white focus:ring-2 focus:ring-accent-100"
              placeholder="you@studio.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-gray-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent-500 focus:bg-white focus:ring-2 focus:ring-accent-100"
              placeholder="••••••••"
            />
          </div>

          <Link href="/auth/forgot-password" className="-mt-1 self-end text-xs font-medium text-accent-600 hover:text-accent-700">
            Forgot password?
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent-200/50 transition hover:bg-accent-600 disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={`${API_URL}/auth/google`}
            className="flex items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <GoogleGlyph />
            Continue with Google
          </a>
          {FACEBOOK_LOGIN_ENABLED && (
            <a
              href={`${API_URL}/auth/facebook`}
              className="flex items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <FacebookGlyph />
              Continue with Facebook
            </a>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Only provider accounts have a studio dashboard. Use the same credentials as the Just Dance mobile app —
          Google only works if you already have an account.
        </p>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5c-2 1.4-4.6 2.3-7.5 2.3-5.2 0-9.6-3.3-11.3-7.9l-6.5 5c3.3 6.6 10.1 11.1 17.8 11.1z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41 35.9 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z"
      />
    </svg>
  );
}
