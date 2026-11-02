'use client';

import { useEffect, useRef } from 'react';

// Decorative, muted, looping hero video. Some iOS browsers (Firefox for
// iPhone since a recent update) switch on native controls by themselves, so
// keep `controls` off whenever anything sets it, and never take taps.
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const strip = () => {
      if (video.controls) video.controls = false;
      if (video.hasAttribute('controls')) video.removeAttribute('controls');
    };
    strip();
    const observer = new MutationObserver(strip);
    observer.observe(video, { attributes: true, attributeFilter: ['controls'] });
    const events = ['loadedmetadata', 'play', 'playing', 'pause'] as const;
    events.forEach((e) => video.addEventListener(e, strip));
    return () => {
      observer.disconnect();
      events.forEach((e) => video.removeEventListener(e, strip));
    };
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload='auto'
      poster='/images/hero-poster.jpg'
      aria-label='Congress of Beauty studio'
      disablePictureInPicture
      disableRemotePlayback
      className='hero-video pointer-events-none h-[70vh] w-full object-cover sm:h-[80vh]'
    >
      {/* Phones get a lighter 720p file; H.264 before WebM so iOS uses
          hardware decoding. Color grading is baked into the files. */}
      <source
        src='/videos/hero-720.mp4'
        type='video/mp4'
        media='(max-width: 767px)'
      />
      <source src='/videos/hero-1080.mp4' type='video/mp4' />
      <source src='/videos/hero-1080.webm' type='video/webm' />
    </video>
  );
}
