import { cn } from '@/lib/utils';
import type { CSSProperties, ReactNode } from 'react';

export const colors = {
  green: '#0f3b2b',
  red: '#a3201c',
  night: '#14181f',
};

const pseudoRandom = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type SnowLayer = {
  tile: number;
  flakes: number;
  size: [number, number];
  opacity: number;
  fall: number;
  sway: number;
  swayDuration: number;
  salt: number;
};

const LAYERS: Record<'back' | 'front', SnowLayer[]> = {
  back: [
    {
      tile: 420,
      flakes: 14,
      size: [2, 4],
      opacity: 0.45,
      fall: 26,
      sway: 14,
      swayDuration: 7,
      salt: 1,
    },
    {
      tile: 560,
      flakes: 10,
      size: [3, 6],
      opacity: 0.7,
      fall: 18,
      sway: 22,
      swayDuration: 9,
      salt: 2,
    },
  ],
  front: [
    {
      tile: 900,
      flakes: 6,
      size: [6, 10],
      opacity: 0.9,
      fall: 11,
      sway: 30,
      swayDuration: 6,
      salt: 3,
    },
  ],
};

const flakeGradients = ({ tile, flakes, size, opacity, salt }: SnowLayer) =>
  Array.from({ length: flakes }, (_, i) => {
    const x = Math.round(pseudoRandom(i, salt) * tile);
    const y = Math.round(pseudoRandom(i, salt + 10) * tile);
    const r = size[0] + pseudoRandom(i, salt + 20) * (size[1] - size[0]);
    return `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,${opacity}) 0 ${r.toFixed(1)}px, transparent ${(r + 1.5).toFixed(1)}px)`;
  }).join(',');

export function Snow({ layer = 'back' }: { layer?: keyof typeof LAYERS }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {LAYERS[layer].map((l) => (
        <div
          key={l.salt}
          className="absolute -inset-x-[60px] inset-y-0"
          style={
            {
              '--snow-sway': `${l.sway}px`,
              animation: `snow-sway ${l.swayDuration}s ease-in-out infinite alternate`,
            } as CSSProperties
          }
        >
          <div
            className="absolute inset-x-0 top-0 will-change-transform"
            style={
              {
                '--snow-tile': `${l.tile}px`,
                height: `calc(100% + ${l.tile}px)`,
                backgroundImage: flakeGradients(l),
                backgroundSize: `${l.tile}px ${l.tile}px`,
                animation: `snow-fall ${l.fall}s linear infinite`,
              } as CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
}

export function snowScene(background: string, { lights = false } = {}) {
  return function SnowScene({ children }: { children: ReactNode }) {
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ background }}>
        <Snow layer="back" />
        <div className="relative h-full w-full">{children}</div>
        <Snow layer="front" />
        {lights && <Lights className="absolute left-0 top-0" />}
      </div>
    );
  };
}

export function Swing({
  children,
  degrees = 1.5,
  duration = 4,
  className,
}: {
  children: ReactNode;
  degrees?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={cn('origin-top will-change-transform', className)}
      style={
        {
          '--swing': `${degrees}deg`,
          animation: `swing ${duration}s ease-in-out infinite alternate`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

const BULB_COLORS = ['#ffe500', '#e8412f', '#fdf9f0', '#3fa66b'];
const WIRE_SAG = 70;

const wireY = (t: number) => 24 + Math.sin(t * Math.PI * 2) ** 2 * WIRE_SAG;

export function Lights({ count = 10, className }: { count?: number; className?: string }) {
  const points = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    return `${(t * 1080).toFixed(0)},${wireY(t).toFixed(1)}`;
  }).join(' ');

  return (
    <div className={cn('pointer-events-none relative h-[160px] w-[1080px]', className)}>
      <svg viewBox="0 0 1080 160" className="absolute inset-0 h-full w-full" fill="none">
        <polyline points={points} stroke="#0a0a0a" strokeWidth="4" />
      </svg>
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count;
        return (
          <div
            key={i}
            className="absolute flex w-[28px] flex-col items-center"
            style={{ left: t * 1080 - 14, top: wireY(t) - 4 }}
          >
            <div className="h-[12px] w-[14px] rounded-[2px] bg-[#2a2a2a]" />
            <div
              className="h-[40px] w-[26px] rounded-[50%]"
              style={{
                background: BULB_COLORS[i % BULB_COLORS.length],
                animation: `twinkle ${2.4 + (i % 3) * 0.7}s ease-in-out ${((i * 0.37) % 2).toFixed(2)}s infinite`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
