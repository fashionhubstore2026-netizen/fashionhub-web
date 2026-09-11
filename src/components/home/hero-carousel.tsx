'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export interface CarouselSlide {
  id: string;
  title: string | null;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  mobileMediaType: 'IMAGE' | 'VIDEO' | null;
  mobileMediaUrl: string | null;
  keyword: string;
}

export function slideHref(keyword: string): string {
  const value = keyword.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return value;
  return `/search?q=${encodeURIComponent(value)}`;
}

function SlotMedia({
  url,
  type,
  active,
  className,
  onError,
}: {
  url: string;
  type: 'IMAGE' | 'VIDEO';
  active: boolean;
  className: string;
  onError?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active]);

  if (type === 'VIDEO') {
    return (
      <video
        ref={videoRef}
        src={url}
        className={className}
        muted
        playsInline
        loop
        onError={onError}
      />
    );
  }
  return <img src={url} alt="" className={className} onError={onError} />;
}

function SlideMedia({ slide, active }: { slide: CarouselSlide; active: boolean }) {
  const mobileUrl = slide.mobileMediaUrl || slide.mediaUrl;
  const mobileType = slide.mobileMediaType || slide.mediaType;
  const desktopUrl = slide.mediaUrl || mobileUrl;
  const desktopType = slide.mediaType || mobileType;
  const [desktopFailed, setDesktopFailed] = useState(false);
  const mediaClass = 'block h-auto w-full';

  return (
    <>
      <SlotMedia
        url={mobileUrl}
        type={mobileType}
        active={active}
        className={cn(mediaClass, 'md:hidden')}
      />
      <SlotMedia
        url={desktopFailed ? mobileUrl : desktopUrl}
        type={desktopFailed ? mobileType : desktopType}
        active={active}
        className={cn(mediaClass, 'hidden md:block')}
        onError={() => setDesktopFailed(true)}
      />
    </>
  );
}

function SlideLink({ slide, children }: { slide: CarouselSlide; children: ReactNode }) {
  const href = slideHref(slide.keyword);
  const className = 'relative block min-w-full max-w-full shrink-0 basis-full';

  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={slide.keyword}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={slide.keyword}>
      {children}
    </Link>
  );
}

export function HeroCarousel() {
  const { data, isLoading } = useQuery({
    queryKey: ['carousel'],
    queryFn: () => api.get<CarouselSlide[]>('/carousel'),
  });
  const slides = data?.data ?? [];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1 || index >= count) return;
    const timer = window.setTimeout(() => {
      setAnimate(true);
      setIndex((current) => current + 1);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [count, index]);

  const handleTransitionEnd = () => {
    if (count > 1 && index >= count) {
      setAnimate(false);
      setIndex(0);
    }
  };

  if (isLoading) {
    return <div className="h-[220px] w-full animate-pulse bg-neutral-200 md:h-[360px]" />;
  }

  if (slides.length === 0) {
    return (
      <section className="bg-brand-dark text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-center gap-6 px-4 py-24 sm:px-6 lg:py-32">
          <p className="text-sm uppercase tracking-[0.2em] text-brand">New Season</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Discover premium fashion from curated vendors
          </h1>
          <p className="max-w-xl text-lg text-brand-muted">
            Clothes, jewellery, shoes, watches, bags and more — all in one place.
          </p>
        </div>
      </section>
    );
  }

  const trackSlides = count > 1 ? [...slides, slides[0]] : slides;
  const activeDot = count > 0 ? index % count : 0;

  return (
    <section className="w-full overflow-hidden">
      <div className="relative w-full overflow-hidden bg-white">
        <div
          className={cn('flex w-full items-start', animate && 'transition-transform duration-700 ease-in-out')}
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {trackSlides.map((slide, i) => (
            <SlideLink key={`${slide.id}-${i}`} slide={slide}>
              <SlideMedia slide={slide} active={i === index || (index >= count && i === 0)} />
            </SlideLink>
          ))}
        </div>

        {count > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-1.5 sm:bottom-6 sm:gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeDot}
                className={cn(
                  'pointer-events-auto rounded-none transition-all duration-500 ease-out',
                  'h-[3px] sm:h-[4px]',
                  i === activeDot
                    ? 'w-[36px] bg-[#2b2b2b] sm:w-[48px]'
                    : 'w-[28px] bg-[#b4b4b4] hover:bg-[#8d8d8d] sm:w-[40px]',
                )}
                onClick={() => {
                  setAnimate(true);
                  setIndex(i);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
