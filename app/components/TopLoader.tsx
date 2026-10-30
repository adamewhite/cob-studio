'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// Thin progress bar along the top of the window during page navigation.
// The App Router has no global navigation events, so this starts on clicks
// of internal links to a different page and finishes when the pathname
// changes. It creeps toward 90% meanwhile and gives up after a few seconds
// if no navigation lands (e.g. a link that resolves to the same page).
export function TopLoader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    if (trickle.current) clearInterval(trickle.current);
    trickle.current = null;
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const finish = useCallback(() => {
    clearTimers();
    setProgress(100);
    timers.current.push(
      setTimeout(() => setVisible(false), 250),
      setTimeout(() => setProgress(0), 500),
    );
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setVisible(true);
    setProgress(12);
    trickle.current = setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.1 : p));
    }, 200);
    timers.current.push(setTimeout(finish, 8000));
  }, [finish]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const link = (e.target as Element | null)?.closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) {
        return;
      }
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      start();
    };
    // Capture phase: next/link calls preventDefault on the bubbling click to
    // take over navigation, so a bubbling listener would never see it.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [start]);

  // A new pathname means the navigation landed.
  useEffect(() => {
    if (trickle.current) finish();
  }, [pathname, finish]);

  useEffect(() => clearTimers, []);

  return (
    <div
      aria-hidden
      className='pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]'
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 250ms ease',
      }}
    >
      <div
        className='h-full bg-[#FF2323]'
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? 'none' : 'width 200ms ease-out',
        }}
      />
    </div>
  );
}
