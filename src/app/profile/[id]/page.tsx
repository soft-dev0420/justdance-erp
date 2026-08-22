import type { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const CATEGORY_LABELS: Record<string, string> = {
  DANCER: 'Dancer',
  INSTRUCTOR: 'Instructor',
  CHOREOGRAPHER: 'Choreographer',
  DANCE_SCHOOL: 'Dance School',
  DANCE_GROUP: 'Dance Group',
  FORDANCER: 'Fordancer',
};

interface PublicProviderProfile {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  coverPhotoUrl: string | null;
  avatarUrl: string | null;
}

// This page exists purely so a plain https link can be shared (WhatsApp,
// iMessage, etc.) with a rich preview card — apps like WhatsApp only crawl
// http(s) URLs for og:title/og:image, never custom schemes like
// justdance://, which is what profile/[id].tsx in the mobile app shares.
async function getProfile(id: string): Promise<PublicProviderProfile | null> {
  try {
    const res = await fetch(`${API_URL}/provider-profiles/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps<'/profile/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) return { title: 'Just Dance' };

  const label = CATEGORY_LABELS[profile.category] ?? profile.category;
  const title = `${profile.name} — ${label} | Just Dance`;
  const description = profile.description || `${profile.name} is on Just Dance in ${profile.city}.`;
  const image = profile.coverPhotoUrl ?? profile.avatarUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps<'/profile/[id]'>) {
  const { id } = await params;
  const profile = await getProfile(id);

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-sm text-gray-500">This profile couldn&apos;t be found.</p>
      </div>
    );
  }

  const label = CATEGORY_LABELS[profile.category] ?? profile.category;
  const image = profile.coverPhotoUrl ?? profile.avatarUrl;

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-accent-50 via-white to-accent-50 px-4 py-12">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element -- external, unoptimized profile photo
          <img src={image} alt={profile.name} className="h-56 w-full object-cover" />
        )}
        <div className="p-6 text-center">
          <h1 className="text-lg font-semibold text-gray-900">{profile.name}</h1>
          <p className="mt-1 text-sm text-accent-600">
            {label} · {profile.city}
          </p>
          {profile.description && <p className="mt-4 text-sm leading-relaxed text-gray-600">{profile.description}</p>}
          <a
            href={`justdance://profile/${profile.id}`}
            className="mt-6 inline-block w-full rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600"
          >
            Open in Just Dance app
          </a>
        </div>
      </div>
    </div>
  );
}
