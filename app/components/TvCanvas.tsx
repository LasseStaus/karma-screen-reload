'use client';

import { cn } from '@/lib/utils';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

export const TV_WIDTH = 1080;
export const TV_HEIGHT = 1920;

type Props = {
  children: ReactNode;
  className?: string;
  fit?: 'contain' | 'width';
};

export default function TvCanvas({ children, className, fit = 'contain' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ scale: 0, height: TV_HEIGHT });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (fit === 'width') {
        const scale = w / TV_WIDTH;
        setSize({ scale, height: h / scale });
      } else {
        setSize({ scale: Math.min(w / TV_WIDTH, h / TV_HEIGHT), height: TV_HEIGHT });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fit]);

  return (
    <div ref={ref} className={cn('relative w-full h-full overflow-hidden bg-black', className)}>
      <div
        className="absolute left-1/2 top-1/2 overflow-hidden bg-reload-secondary"
        style={{
          width: TV_WIDTH,
          height: size.height,
          transform: `translate(-50%, -50%) scale(${size.scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
