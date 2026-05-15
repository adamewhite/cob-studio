/** Canonical production origin for the site. Used for metadata, sitemap,
 *  robots, and absolute URLs in share links. Keep this as the single source
 *  of truth — do not hardcode the domain elsewhere. */
export const SITE_ORIGIN = 'https://www.cob-studio.com';

/** Build an absolute URL from a root-relative path (e.g. '/artwork/...'). */
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
