'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import { authApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError('');
    try {
      await authApi.forgotPassword(email);
      // The API no-ops silently for unknown emails so this screen can't be
      // used to enumerate registered accounts — always show the same state.
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-accent-50 via-white to-accent-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500">
              <CheckGlyph />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Check your email</h1>
            <p className="mt-1 text-sm text-gray-500">
              If an account exists for <span className="font-medium text-gray-900">{email}</span>, we sent a link to reset your password.
            </p>
            <Link href="/auth/login" className="mt-6 inline-block w-full rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-xl font-semibold text-gray-900">Forgot password?</h1>
              <p className="mt-1 text-sm text-gray-500">Enter the email on your account and we&apos;ll send you a link to reset your password.</p>
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

              {error && <p className="text-xs font-medium text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !email}
                className="mt-2 rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent-200/50 transition hover:bg-accent-600 disabled:opacity-50"
              >
                {submitting ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-400">
              <Link href="/auth/login" className="font-medium text-accent-600 hover:text-accent-700">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
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
