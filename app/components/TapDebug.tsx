'use client';

import { useEffect, useState } from 'react';

// Temporary on-device tap debugger. Only active with ?tapdebug in the URL:
// logs touch/pointer/mouse/click events (target, cancelled or not) in an
// on-screen panel so phone-only tap problems can be screenshotted.
const EVENTS = [
  'touchstart',
  'touchend',
  'touchcancel',
  'pointerdown',
  'pointerup',
  'pointercancel',
  'mousedown',
  'mouseup',
  'click',
] as const;

function describe(target: EventTarget | null): string {
  if (!(target instanceof Element)) return String(target);
  const el = target;
  const label =
    el.getAttribute('aria-label') ||
    el.getAttribute('alt') ||
    el.getAttribute('href') ||
    (el.className && typeof el.className === 'string'
      ? el.className.split(' ').slice(0, 2).join('.')
      : '');
  return `${el.tagName.toLowerCase()}${label ? ` [${label.slice(0, 28)}]` : ''}`;
}

export function TapDebug() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('tapdebug')) return;
    const t0 = performance.now();
    setTimeout(() => setLines(['ready — tap the logo']), 0);
    const log = (e: Event) => {
      const ms = Math.round(performance.now() - t0);
      const extra =
        e instanceof PointerEvent ? ` ${e.pointerType}` : '';
      // Read defaultPrevented after other handlers have run.
      setTimeout(() => {
        setLines((prev) =>
          [
            `${ms} ${e.type}${extra} → ${describe(e.target)}${e.defaultPrevented ? ' PREVENTED' : ''} y=${Math.round(window.scrollY)}`,
            ...prev,
          ].slice(0, 14),
        );
      }, 0);
    };
    EVENTS.forEach((t) =>
      document.addEventListener(t, log, { capture: true, passive: true }),
    );
    return () =>
      EVENTS.forEach((t) =>
        document.removeEventListener(t, log, { capture: true }),
      );
  }, []);

  if (lines.length === 0) return null;
  return (
    <div className='pointer-events-none fixed inset-x-2 bottom-2 z-[70] max-h-[45vh] overflow-hidden rounded bg-black/80 p-2 font-mono text-[10px] leading-tight text-white'>
      <div className='mb-1 text-yellow-300'>
        tap debug — {navigator.userAgent.match(/(FxiOS|CriOS|Version)\/[\d.]+/)?.[0] ?? 'browser'}
      </div>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}
