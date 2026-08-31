import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Just Dance',
  description: 'How Just Dance collects, uses, and protects your information.',
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: [Effective Date]</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Draft notice:</strong> this document reflects what the Just Dance app and ERP actually collect and
          do today. Set the effective date below before this is treated as final and linked from app store listings.
        </div>

        <div className="prose-legal mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-gray-700">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">1. Who we are</h2>
            <p>
              Just Dance (&ldquo;Just Dance,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the Just Dance mobile app and the Just Dance
              Studio ERP dashboard, a marketplace connecting dancers, dance schools, instructors, choreographers,
              dance groups, and clients looking for dance services. This Privacy Policy explains what information we
              collect, how we use it, and the choices you have.
            </p>
            <p className="mt-2">
              Contact: <strong>privacy@justdance.co</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">2. Information we collect</h2>
            <p className="font-medium text-gray-900">Account information</p>
            <p>
              Name, email address, and password (stored as a salted hash — we never store or can see your plain-text
              password) when you register directly. If you sign in with Google, we receive your name, email, and
              Google account identifier from Google instead.
            </p>
            <p className="mt-3 font-medium text-gray-900">Provider profile information</p>
            <p>
              If you register as a Service Provider, the profile(s) you create may include: your chosen category
              (Dancer, Dance School, Instructor, Choreographer, Dance Group, or Fordancer), a profile photo, up to 5
              gallery photos or videos, a cover photo, a text description, phone number, whether you&apos;re reachable on
              WhatsApp, Instagram/TikTok/YouTube handles, and dance style tags.
            </p>
            <p className="mt-3 font-medium text-gray-900">Location</p>
            <p>
              City and, optionally, a more detailed address (street, building number, postal code) that you enter
              through Google Places autocomplete, plus the resulting coordinates. This is used to show your location
              to clients and to power nearby/radius search. Location lookups are proxied through our own backend —
              your device never calls Google&apos;s Places API directly.
            </p>
            <p className="mt-3 font-medium text-gray-900">Photos and media</p>
            <p>
              Profile, cover, and gallery images you upload are stored on our cloud object storage (hosted with OVH
              Cloud) and served publicly at a stable URL so they can be displayed in the app.
            </p>
            <p className="mt-3 font-medium text-gray-900">Usage data</p>
            <p>
              We keep track of the provider profiles you favourite and recently viewed, so those lists can be shown
              back to you. We also log standard request metadata (endpoint, response status, timing) on our servers
              for operating and debugging the service.
            </p>
            <p className="mt-3">
              We do not currently use any third-party analytics or advertising SDKs in the app, and we don&apos;t sell
              your personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">3. How we use your information</h2>
            <ul className="list-disc pl-5">
              <li>To create and operate your account, and to authenticate you</li>
              <li>To display provider profiles to clients searching or browsing the app</li>
              <li>To power location-based and category/style search</li>
              <li>To let you save favourites and see recently viewed profiles</li>
              <li>To send account-related email (e.g. password reset)</li>
              <li>To operate the Just Dance Studio ERP for Service Provider accounts (client list, schedule,
                inventory, staff, tasks) using the same account</li>
              <li>To maintain the security and reliability of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">4. Sharing your information</h2>
            <p>We share information with the following categories of service providers, only as needed to run the app:</p>
            <ul className="list-disc pl-5">
              <li><strong>Google</strong> — for Google Sign-In, and for Places/Maps location lookups</li>
              <li><strong>Twilio SendGrid</strong> — to deliver transactional emails (e.g. password reset)</li>
              <li><strong>OVH Cloud</strong> — to store uploaded photos and videos</li>
            </ul>
            <p className="mt-2">
              A Service Provider&apos;s public profile information (name, category, city, description, photos, contact
              details, dance styles) is visible to anyone using the app, since that&apos;s the purpose of a public
              marketplace listing. We do not share your private account credentials or unpublished data with other
              users.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">5. Data retention</h2>
            <p>
              We retain your account and profile information for as long as your account is active. You can delete
              your account at any time from the app&apos;s Profile settings, which permanently removes your account and
              associated provider profile(s).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">6. Your rights</h2>
            <p>Depending on where you live, you may have the right to:</p>
            <ul className="list-disc pl-5">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data (directly, via your profile editor, for most fields)</li>
              <li>Request deletion of your data (via in-app account deletion, or by contacting us)</li>
              <li>Object to or restrict certain processing</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at <strong>privacy@justdance.co</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">7. Children&apos;s privacy</h2>
            <p>
              Just Dance is not directed at children under <strong>18</strong>, and we do not
              knowingly collect personal information from anyone under that age. If you believe a child has provided
              us with personal information, contact us and we will remove it.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">8. International data transfers</h2>
            <p>
              Our infrastructure and service providers may process data outside your country of residence. Where
              required, we rely on appropriate safeguards (such as standard contractual clauses) for these transfers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">9. Cookies</h2>
            <p>
              The Just Dance Studio ERP web dashboard uses a single essential, httpOnly session cookie to keep you
              signed in — it isn&apos;t used for tracking or advertising. The mobile app doesn&apos;t use cookies; it
              authenticates using a securely stored access token on your device.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">10. Security</h2>
            <p>
              We use industry-standard measures to protect your data, including encrypted password storage, HTTPS in
              transit, and rate limiting on our API. No method of transmission or storage is 100% secure, and we
              can&apos;t guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">11. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We&apos;ll update the &ldquo;Last updated&rdquo; date above, and
              for material changes we&apos;ll provide a more prominent notice.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">12. Contact us</h2>
            <p>
              Questions about this Privacy Policy or your data? Contact us at <strong>privacy@justdance.co</strong>.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6 text-sm text-gray-500">
          See also our <Link href="/terms" className="text-accent-600 hover:underline">Terms of Service</Link>.
        </div>
      </main>
    </div>
  );
}
