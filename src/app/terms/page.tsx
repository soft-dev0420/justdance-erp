import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Just Dance',
  description: 'The terms that govern your use of Just Dance.',
};

export default function TermsOfServicePage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: [Effective Date]</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Draft notice:</strong> this document reflects how the Just Dance app and ERP actually work today.
          It follows the same minimal, no-formal-entity approach as our sibling OnlyMassage terms. Set the effective
          date below before this is treated as final and linked from app store listings.
        </div>

        <div className="mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-gray-700">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">1. Acceptance of these terms</h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Just Dance mobile app and the
              Just Dance Studio ERP dashboard (together, the &ldquo;Service&rdquo;), operated by{' '}
              Just Dance (&ldquo;we,&rdquo; &ldquo;us&rdquo;). By creating an account or using the
              Service, you agree to these Terms. If you don&apos;t agree, don&apos;t use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">2. What Just Dance is</h2>
            <p>
              Just Dance is a discovery marketplace that connects people looking for dance services with dance
              professionals — dancers, dance schools, instructors, choreographers, dance groups, and performers for
              hire (&ldquo;fordancers&rdquo;). Service Provider accounts get access to Just Dance Studio, a companion business
              dashboard for managing clients, staff, schedule, service pricing, inventory, and tasks, using the same
              login.
            </p>
            <p className="mt-2 font-medium text-gray-900">
              Just Dance is a discovery and contact platform only. We do not process bookings, payments, or
              contracts between Clients and Service Providers, and we are not a party to any agreement, transaction,
              or dispute between them.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">3. Accounts</h2>
            <p>
              You must provide accurate information when registering, and keep your login credentials confidential.
              You&apos;re responsible for all activity under your account. When you register, you choose an account type —
              <strong> Client</strong> or <strong>Service Provider</strong> — which determines what parts of the
              Service you can access; Service Provider accounts may additionally select one or more provider
              categories. You may sign up with an email and password, or with Google Sign-In.
            </p>
            <p className="mt-2">
              You must be at least <strong>18</strong> years old to create an account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">4. Provider profiles and content</h2>
            <p>
              If you create a Service Provider profile, you&apos;re responsible for the accuracy of the information you
              publish (description, location, contact details, dance styles, pricing shown in your service catalog,
              etc.) and for the photos or videos you upload. You confirm you own or have the rights to any content
              you upload, and you grant Just Dance a non-exclusive, worldwide license to host and display that
              content within the Service for the purpose of operating your public profile.
            </p>
            <p className="mt-2">
              You&apos;re solely responsible for your interactions and any arrangements you make with other users
              contacted through the Service, including verifying who you&apos;re dealing with, agreeing on pricing and
              terms, and any in-person conduct.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">5. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5">
              <li>Impersonate another person or misrepresent your affiliation with any person or entity</li>
              <li>Post false, misleading, or infringing content, or content you don&apos;t have the rights to use</li>
              <li>Use the Service for any unlawful, harassing, or fraudulent purpose</li>
              <li>Attempt to interfere with, disrupt, or gain unauthorized access to the Service or other accounts</li>
              <li>Scrape, harvest, or bulk-collect data from the Service outside its normal use</li>
              <li>Create multiple accounts to evade a suspension or restriction</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">6. Third-party sign-in</h2>
            <p>
              If you sign in with Google (or, once enabled, Facebook), your use of that provider is also governed by
              that provider&apos;s own terms and privacy policy. We only receive the profile information the provider
              shares with us to create or authenticate your account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">7. Intellectual property</h2>
            <p>
              The Just Dance name, logo, and app design are owned by Just Dance. Except
              for content you upload, nothing in these Terms grants you rights to our trademarks, branding, or
              software.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">8. Termination</h2>
            <p>
              You may delete your account at any time from the app&apos;s Profile settings. We may suspend or terminate
              access to the Service for accounts that violate these Terms, engage in fraudulent or harmful behavior,
              or where required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">9. Disclaimers</h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any kind. We don&apos;t guarantee
              the accuracy of any Service Provider&apos;s listing, availability, qualifications, or the quality of any
              service arranged through contact made via the app. Any dealings between Clients and Service Providers
              are strictly between them.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">10. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Just Dance will not be liable for
              any indirect, incidental, special, or consequential damages, or for any loss arising from interactions,
              transactions, or disputes between users of the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">11. Changes to these terms</h2>
            <p>
              We may update these Terms from time to time. We&apos;ll update the &ldquo;Last updated&rdquo; date above, and for
              material changes we&apos;ll provide a more prominent notice before they take effect.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">12. Governing law</h2>
            <p>
              These Terms are governed by the laws of <strong>Poland</strong>. Any disputes shall be resolved in the
              competent courts of Poland. For users outside Poland, mandatory local consumer protection laws may
              apply.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">13. Contact us</h2>
            <p>
              Questions about these Terms? Contact us at <strong>legal@justdance.co</strong>.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6 text-sm text-gray-500">
          See also our <Link href="/privacy" className="text-accent-600 hover:underline">Privacy Policy</Link>.
        </div>
      </main>
    </div>
  );
}
