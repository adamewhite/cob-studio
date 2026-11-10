'use client';

import { usePathname } from 'next/navigation';

// Layout mockups under /client draw their own header, so the site's
// announcement bar, nav, and footer step aside there.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/client')) return null;
  return <>{children}</>;
}
