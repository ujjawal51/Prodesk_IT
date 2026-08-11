import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(onFetch, loading, hasMore) {
  const observer = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onFetch();
          }
        },
        { root: null, rootMargin: '250px', threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onFetch]
  );

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return lastElementRef;
}
