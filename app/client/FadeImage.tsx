'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

// next/image that starts transparent and eases in once the file has loaded.
// Images already in the cache still fire onLoad on mount, so they fade too.
export function FadeImage({
  alt,
  className = '',
  onLoad,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={`${className} transition-opacity duration-700 ease-in motion-reduce:transition-none ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
