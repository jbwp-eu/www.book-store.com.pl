/** Canonical site origin for sitemap / robots (server-only, no trailing slash). */
export const SITE_URL = (
  process.env.SITE_URL ?? "https://www.book-store.com.pl"
).replace(/\/$/, "");
