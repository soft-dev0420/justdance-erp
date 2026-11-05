import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delete Your Account — Just Dance',
  description: 'How to delete your Just Dance account and what happens to your data.',
};

export default function AccountDeletionPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-black">
              <Image src="/logo-alt.png" alt="Just Dance" width={36} height={36} className="h-full w-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Just Dance</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Delete Your Account</h1>

        <div className="prose-legal mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-gray-700">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Delete from the app</h2>
            <p>You can permanently delete your Just Dance account yourself, in a few taps:</p>
            <ol className="list-decimal pl-5">
              <li>Open the Just Dance app and sign in</li>
              <li>Go to the <strong>Profile</strong> tab</li>
              <li>Scroll down and tap <strong>&ldquo;Delete Justdance account&rdquo;</strong></li>
              <li>Confirm when asked</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Don&apos;t have the app installed?</h2>
            <p>
              Email <strong>privacy@justdance.co</strong> from the address on your account and ask us to delete it.
              We&apos;ll verify it&apos;s you and delete the account on our end.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">What gets deleted</h2>
            <p>Deleting your account permanently removes, immediately and without a recovery period:</p>
            <ul className="list-disc pl-5">
              <li>Your login credentials and account record</li>
              <li>Any Service Provider profile(s) you created (photos, gallery, description, contact details)</li>
              <li>Your favourites and recently-viewed history</li>
            </ul>
            <p className="mt-2">This action cannot be undone.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Questions</h2>
            <p>
              See our full <Link href="/privacy" className="text-accent-600 hover:underline">Privacy Policy</Link> for
              more on what we collect and how it&apos;s used, or contact <strong>privacy@justdance.co</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
