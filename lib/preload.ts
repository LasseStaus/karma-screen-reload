import { useEffect, useRef, useState } from 'react';

const PRELOAD_TIMEOUT = 8000;

const decode = (src: string, keep: HTMLImageElement[]) => {
  const img = new Image();
  img.src = src;
  keep.push(img);
  return img.decode().catch(() => undefined);
};

export function usePreloadedImages(urls: string[]) {
  const [ready, setReady] = useState(false);
  const keep = useRef<HTMLImageElement[]>([]);
  const key = urls.join('|');

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    const timeout = new Promise((resolve) => setTimeout(resolve, PRELOAD_TIMEOUT));
    const all = Promise.all(
      key
        .split('|')
        .filter(Boolean)
        .map((src) => decode(src, keep.current)),
    );
    Promise.race([all, timeout]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return ready;
}
