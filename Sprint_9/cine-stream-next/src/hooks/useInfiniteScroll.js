'use client';

import { useEffect, useRef } from 'react';

/**
 * Native IntersectionObserver Hook for Infinite Scroll
 * Listens for sentinel element intersection with the viewport
 */
export function useInfiniteScroll(onIntersect, options = { threshold: 0.1, rootMargin: '200px' }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry && entry.isIntersecting) {
        onIntersect();
      }
    }, options);

    observer.observe(sentinel);

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
    };
  }, [onIntersect, options]);

  return sentinelRef;
}
