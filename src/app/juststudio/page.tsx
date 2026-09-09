import { redirect } from 'next/navigation';

// Team is the ERP's home page per the client's reordering request — the
// stats dashboard moved to /juststudio/dashboard and is still fully intact,
// just no longer the default landing spot.
export default function JustStudioIndex() {
  redirect('/juststudio/team');
}
