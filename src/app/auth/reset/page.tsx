'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';

import { authApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords don’t match.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await authApi.resetPassword({ token, password });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <WarningGlyph />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">Invalid reset link</h1>
        <p className="mt-1 text-sm text-gray-500">This link is missing its token. Request a new one from the login page.</p>
        <Link href="/auth/forgot-password" className="mt-6 inline-block w-full rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600">
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500">
          <CheckGlyph />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">Password updated</h1>
        <p className="mt-1 text-sm text-gray-500">You can now log in with your new password.</p>
        <Link href="/auth/login" className="mt-6 inline-block w-full rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600">
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Set a new password</h1>
        <p className="mt-1 text-sm text-gray-500">Choose a new password for your account.</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-medium text-gray-500">
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent-500 focus:bg-white focus:ring-2 focus:ring-accent-100"
            placeholder="••••••••"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm" className="text-xs font-medium text-gray-500">
            Confirm new password
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent-500 focus:bg-white focus:ring-2 focus:ring-accent-100"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !password || !confirm}
          className="mt-2 rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent-200/50 transition hover:bg-accent-600 disabled:opacity-50"
        >
          {submitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-accent-50 via-white to-accent-50 px-4">
      <Suspense fallback={null}>
        <ResetPasswordContent />
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
