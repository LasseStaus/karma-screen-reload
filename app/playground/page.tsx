'use client';

import {
  animations,
  DEFAULT_ANIMATION_ID,
  getAnimation,
  groupAnimations,
} from '@/animations/registry';
import { SlidePlayer } from '@/app/components/Slideshow';
import TvCanvas, { TV_HEIGHT, TV_WIDTH } from '@/app/components/TvCanvas';
import { useNominees, type DataSource } from '@/lib/nominees';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

type AfterDone = 'replay' | 'next' | 'hold';

const STORAGE_KEY = 'karma-playground-animation';

const fieldClass =
  'w-full rounded-[6px] border border-neutral-700 bg-neutral-800 px-[10px] py-[6px] text-[14px] text-neutral-100';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-[6px]">
      <span className="block text-[12px] uppercase tracking-wide text-neutral-400">{label}</span>
      {children}
    </label>
  );
}

export default function Playground() {
  const [animationId, setAnimationId] = useState(DEFAULT_ANIMATION_ID);
  const [source, setSource] = useState<DataSource>('test');
  const [index, setIndex] = useState(0);
  const [afterDone, setAfterDone] = useState<AfterDone>('replay');
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAnimationId(stored);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, animationId);
    } catch {}
  }, [animationId]);

  const { nominees, error } = useNominees(source);
  const animation = getAnimation(animationId);
  const nominee = nominees?.length ? nominees[index % nominees.length] : null;
  const timeline = useMemo(
    () => (nominee ? animation.timeline(nominee) : null),
    [animation, nominee],
  );
  const slideKey = `${animation.id}-${source}-${index}-${replay}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLSelectElement) return;
      const step = (delta: number) => {
        const i = animations.findIndex((a) => a.id === animation.id);
        setAnimationId(animations[(i + delta + animations.length) % animations.length].id);
      };
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowDown') setIndex((i) => i + 1);
      else if (e.key === 'ArrowUp') setIndex((i) => Math.max(0, i - 1));
      else if (e.key === ' ' || e.key === 'r') setReplay((r) => r + 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [animation.id]);

  const onDone =
    afterDone === 'replay'
      ? () => setReplay((r) => r + 1)
      : afterDone === 'next'
        ? () => setIndex((i) => i + 1)
        : undefined;

  return (
    <main className="grid h-screen grid-cols-[320px_1fr] bg-neutral-950 text-neutral-100">
      <aside className="space-y-[20px] overflow-y-auto border-r border-neutral-800 p-[20px] text-[14px] leading-normal">
        <h1 className="text-[18px] font-bold">Karma playground</h1>

        <Field label="Animation">
          <select
            className={fieldClass}
            value={animation.id}
            onChange={(e) => setAnimationId(e.target.value)}
          >
            {groupAnimations().map(([group, list]) => (
              <optgroup key={group} label={group}>
                {list.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>

        <Field label="Data">
          <select
            className={fieldClass}
            value={source}
            onChange={(e) => {
              setSource(e.target.value as DataSource);
              setIndex(0);
            }}
          >
            <option value="test">Testdata</option>
            <option value="live">Live (latestKings)</option>
          </select>
        </Field>
        {error && <p className="text-[13px] text-red-400">Fejl: {error}</p>}

        <Field label="Nominee">
          <select
            className={fieldClass}
            value={nominees?.length ? index % nominees.length : 0}
            onChange={(e) => setIndex(Number(e.target.value))}
            disabled={!nominees?.length}
          >
            {nominees?.map((n, i) => (
              <option key={`${n.user_id}-${i}`} value={i}>
                {n.full_name} · uge {n.week} · {n.votes.length} stemmer
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-center gap-[12px]">
          <button
            className="rounded-[6px] bg-yellow-300 px-[14px] py-[6px] text-[14px] font-bold text-black hover:bg-yellow-200"
            onClick={() => setReplay((r) => r + 1)}
          >
            Replay
          </button>
          <select
            className={fieldClass}
            value={afterDone}
            onChange={(e) => setAfterDone(e.target.value as AfterDone)}
          >
            <option value="replay">Loop samme</option>
            <option value="next">Næste nominee</option>
            <option value="hold">Stop</option>
          </select>
        </div>
        <p className="text-[12px] text-neutral-500">
          ← → animation · ↑ ↓ nominee · mellemrum replay
        </p>

        {timeline && (
          <section className="space-y-[8px]">
            <div className="flex justify-between text-[12px] uppercase tracking-wide text-neutral-400">
              <span>Timeline</span>
              <span>
                {timeline.end.toFixed(2)}s + hold {animation.hold}s
              </span>
            </div>
            <div className="relative space-y-[4px]">
              {Object.entries(timeline.steps).map(([key, span]) => (
                <div key={key} className="grid grid-cols-[72px_1fr] items-center gap-[8px]">
                  <span className="truncate text-[12px] text-neutral-300">{key}</span>
                  <div className="relative h-[14px] rounded-[3px] bg-neutral-800">
                    <div
                      className="absolute inset-y-0 rounded-[3px] bg-yellow-300/80"
                      style={{
                        left: `${(span.start / timeline.end) * 100}%`,
                        width: `${Math.max((span.duration / timeline.end) * 100, 1)}%`,
                      }}
                      title={`${span.start.toFixed(2)}s → ${span.end.toFixed(2)}s`}
                    />
                  </div>
                </div>
              ))}
              <div className="pointer-events-none absolute inset-y-0 left-[80px] right-0">
                <motion.div
                  key={slideKey}
                  className="absolute inset-y-0 w-[2px] bg-white"
                  initial={{ left: '0%' }}
                  animate={{ left: '100%' }}
                  transition={{ duration: timeline.end, ease: 'linear' }}
                />
              </div>
            </div>
          </section>
        )}

        <p className="text-[12px] text-neutral-500">
          Lærred: {TV_WIDTH}×{TV_HEIGHT}. Prod kan vise en anden animation med{' '}
          <code>?animation={animation.id}</code>.
        </p>

        {nominee && (
          <details className="text-[12px]">
            <summary className="cursor-pointer text-neutral-400">Data</summary>
            <pre className="mt-[8px] whitespace-pre-wrap break-words text-neutral-300">
              {JSON.stringify(nominee, null, 2)}
            </pre>
          </details>
        )}
      </aside>

      <TvCanvas>
        {nominee && (
          <SlidePlayer
            slideKey={slideKey}
            animation={animation}
            nominee={nominee}
            onDone={onDone}
          />
        )}
      </TvCanvas>
    </main>
  );
}
