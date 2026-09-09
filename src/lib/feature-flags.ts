// Facebook App setup (developers.facebook.com) isn't done yet — the
// /auth/facebook route and callback are fully wired and ready, just hidden
// from the login page (see src/app/auth/login/page.tsx) until there's a
// real App ID/Secret to configure. Flip this once that's done — no other
// code changes needed.
export const FACEBOOK_LOGIN_ENABLED = false;

// Same situation as Facebook above — Sign in with Apple's Services ID,
// domain/return URL config, and signing key aren't set up yet. The
// /auth/apple route and callback are fully wired, just hidden until
// APPLE_WEB_CLIENT_ID / APPLE_TEAM_ID / APPLE_KEY_ID / APPLE_PRIVATE_KEY are
// real values on the API. Flip this once that's done — no other code
// changes needed.
export const APPLE_LOGIN_ENABLED = false;
