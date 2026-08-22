// Facebook App setup (developers.facebook.com) isn't done yet — the
// /auth/facebook route and callback are fully wired and ready, just hidden
// from the login page (see src/app/auth/login/page.tsx) until there's a
// real App ID/Secret to configure. Flip this once that's done — no other
// code changes needed.
export const FACEBOOK_LOGIN_ENABLED = false;
