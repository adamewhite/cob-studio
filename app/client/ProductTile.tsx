'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export type TileImage = { src: string; alt: string };

export function ProductTile({
  href,
  title,
  medium,
  price,
  sold,
  images,
  width,
  thumbs,
}: {
  href: string;
  title: string;
  medium: string;
  price: string;
  sold?: boolean;
  images: TileImage[];
  width: number;
  thumbs: 'under' | 'side';
}) {
  const [active, setActive] = useState(0);
  const main = images[active];
  const side = thumbs === 'side';

  const strip = (
    <div
      className={side ? 'flex w-14 shrink-0 flex-col gap-2.5' : 'flex gap-2.5'}
    >
      {images.map((img, i) => (
        <button
          key={img.src}
          type='button'
          onClick={() => setActive(i)}
          aria-label={`Show ${img.alt}`}
          aria-pressed={i === active}
          className={`relative aspect-[4/5] cursor-pointer overflow-hidden bg-veil transition-opacity ${
            side ? 'w-full' : 'w-14'
          } ${i === active ? 'opacity-100' : 'opacity-45 hover:opacity-80'}`}
        >
          <Image
            src={img.src}
            alt=''
            fill
            sizes='56px'
            className='object-cover'
          />
        </button>
      ))}
    </div>
  );

  return (
    <figure
      className='m-0 max-w-full'
      style={{ width: side ? width + 66 : width }}
    >
      <div className={side ? 'flex gap-2.5' : 'flex flex-col gap-2.5'}>
        <Link
          href={href}
          className='relative block aspect-[4/5] min-w-0 flex-1 bg-white'
        >
          <Image
            key={main.src}
            src={main.src}
            alt={main.alt}
            fill
            sizes={`(min-width: ${width + 40}px) ${width}px, 100vw`}
            className='object-contain'
          />
        </Link>
        {strip}
      </div>
      <figcaption className='mt-2'>
        <Link href={href} className='text-black hover:underline'>
          {title}
        </Link>
        {' / '}
        {medium}
        {' / '}
        {sold ? 'sold' : price}
      </figcaption>
    </figure>
  );
}
