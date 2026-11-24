import type { Easing, Transition, Variants } from 'motion/react';

export const springs = {
  default: { type: 'spring', stiffness: 137, damping: 21.4, mass: 1 },
  slow: { type: 'spring', stiffness: 60, damping: 20, mass: 1 },
  soft: { type: 'spring', bounce: 0.15 },
} satisfies Record<string, Transition>;

export const easings = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} satisfies Record<string, Easing>;

export const variants = {
  item: {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  },
  container: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { when: 'beforeChildren', staggerChildren: 0.1, delay: 0.4 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  },
} satisfies Record<string, Variants>;

export type At = number | '<' | `+${number}` | `-${number}`;

export type Step<K extends string = string> = {
  duration: number;
  at?: At;
  after?: K;
};

export type Span = { start: number; duration: number; end: number };

export type Timeline<K extends string = string> = {
  steps: Record<K, Span>;
  end: number;
  transition: (key: K, base?: Transition) => Transition;
};

function resolveStart(at: At | undefined, anchor: Span): number {
  if (at === undefined) return anchor.end;
  if (at === '<') return anchor.start;
  if (typeof at === 'number') return at;
  return anchor.end + Number(at);
}

export function timeline<K extends string>(steps: Record<K, Step<NoInfer<K>>>): Timeline<K> {
  const spans = {} as Record<K, Span>;
  let previous: Span = { start: 0, duration: 0, end: 0 };

  for (const key of Object.keys(steps) as K[]) {
    const { duration, at, after } = steps[key];
    const anchor = after ? spans[after] : previous;
    if (!anchor)
      throw new Error(`Timeline step "${key}" refers to "${after}" before it is defined`);
    const start = Math.max(0, resolveStart(at, anchor));
    previous = spans[key] = { start, duration, end: start + duration };
  }

  const end = Math.max(0, ...Object.values<Span>(spans).map((span) => span.end));

  return {
    steps: spans,
    end,
    transition: (key, base = {}) => {
      const { start, duration } = spans[key];
      const isPhysicsSpring =
        base.type === 'spring' && ('stiffness' in base || 'damping' in base || 'mass' in base);
      if (isPhysicsSpring) return { ...base, delay: start };
      if (base.type === 'spring') return { ...base, delay: start, visualDuration: duration };
      return { ease: easings.out, ...base, delay: start, duration };
    },
  };
}

export function staggerDuration(count: number, each: number, itemDuration: number): number {
  return itemDuration + each * Math.max(0, count - 1);
}
