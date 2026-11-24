'use client';

import { useEffect, useState } from 'react';

const JANK_MS = 50;

type Stats = { fps: number; worst: number; janks: number };

export default function FpsMeter() {
  const [stats, setStats] = useState<Stats>({ fps: 0, worst: 0, janks: 0 });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let windowStart = last;
    let frames = 0;
    let worst = 0;
    let janks = 0;

    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      frames++;
      worst = Math.max(worst, delta);
      if (delta > JANK_MS) janks++;
      if (now - windowStart >= 1000) {
        const fps = Math.round((frames * 1000) / (now - windowStart));
        const windowWorst = Math.round(worst);
        const windowJanks = janks;
        setStats((s) => ({ fps, worst: windowWorst, janks: s.janks + windowJanks }));
        windowStart = now;
        frames = 0;
        worst = 0;
        janks = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-50 bg-black/80 px-[12px] py-[8px] font-mono text-[20px] leading-tight text-white">
      <div className={stats.fps < 50 ? 'text-red-400' : 'text-green-400'}>{stats.fps} fps</div>
      <div>værste frame {stats.worst} ms</div>
      <div>
        hak over {JANK_MS} ms: {stats.janks}
      </div>
    </div>
  );
}
