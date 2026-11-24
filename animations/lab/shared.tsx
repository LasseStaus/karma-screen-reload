import { easings } from '@/lib/motion';
import { cn } from '@/lib/utils';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type TargetAndTransition,
  type Variants,
} from 'motion/react';
import { useEffect, type ReactNode } from 'react';

export const exitFade = { opacity: 0, transition: { duration: 0.5, ease: easings.inOut } };

export const exitFadeAfter = (delay: number, duration = 0.6) => ({
  opacity: 0,
  transition: { delay, duration, ease: easings.inOut },
});

export const easeIn = [0.5, 0, 0.75, 0] as const;

export const FALL_DURATION = 1.1;
export const FALL_STAGGER = 0.14;

type FallOptions = {
  order?: number;
  delay?: number;
  x?: number;
  rotate?: number;
  distance?: number;
};

export const fallOut = ({
  order = 0,
  delay = 0,
  x = 0,
  rotate = 0,
  distance = 1600,
}: FallOptions = {}) => ({
  y: [0, -36, distance],
  x: [x, x, x * 1.5],
  rotate: [rotate, rotate - 1.5, rotate + 14 * Math.sign(rotate || 1)],
  transition: {
    duration: FALL_DURATION,
    times: [0, 0.28, 1],
    ease: ['easeOut', easeIn] as const,
    delay: delay + order * FALL_STAGGER,
  },
});

export const liftOut = ({
  order = 0,
  delay = 0,
  rotate = 0,
  distance = 1500,
}: FallOptions = {}) => ({
  y: [0, 24, -distance],
  rotate: [rotate, rotate + 1, rotate - 6],
  transition: {
    duration: FALL_DURATION,
    times: [0, 0.28, 1],
    ease: ['easeOut', easeIn] as const,
    delay: delay + order * FALL_STAGGER,
  },
});

export const fallExitEnd = (count: number) => FALL_DURATION + FALL_STAGGER * Math.max(0, count - 1);

type VotesProps = {
  votes: string[];
  start: number;
  stagger: number;
  itemDuration?: number;
  from?: TargetAndTransition;
  marker?: string;
  className?: string;
  itemClassName?: string;
  style?: React.CSSProperties;
};

export function Votes({
  votes,
  start,
  stagger,
  itemDuration = 0.5,
  from = { opacity: 0, y: 24 },
  marker,
  className,
  itemClassName,
  style,
}: VotesProps) {
  const list: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: start, staggerChildren: stagger } },
  };
  const item: Variants = {
    hidden: from,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: itemDuration, ease: easings.out },
    },
  };

  return (
    <motion.ul
      className={className}
      style={style}
      variants={list}
      initial="hidden"
      animate="visible"
    >
      {votes.map((vote, i) => (
        <motion.li
          key={i}
          variants={item}
          className={cn(marker && 'relative pl-[1.4em]', itemClassName)}
        >
          {marker && <span className="absolute left-0">{marker}</span>}
          {vote}
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function CountUp({ to, delay, duration }: { to: number; delay: number; duration: number }) {
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => String(Math.round(v)).padStart(2, '0'));

  useEffect(() => {
    const controls = animate(value, to, { delay, duration, ease: easings.out });
    return () => controls.stop();
  }, [value, to, delay, duration]);

  return <motion.span>{text}</motion.span>;
}

export function Typewriter({
  text,
  start,
  perChar,
  cursor = true,
  cursorClassName,
}: {
  text: string;
  start: number;
  perChar: number;
  cursor?: boolean;
  cursorClassName?: string;
}) {
  return (
    <>
      {[...text].map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: start + i * perChar, duration: 0 }}
        >
          {char}
        </motion.span>
      ))}
      {cursor && (
        <motion.span
          className={cn(
            'inline-block w-[0.5em] h-[0.9em] align-[-0.1em] ml-[0.1em] bg-current',
            cursorClassName,
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ delay: start, duration: 1, repeat: Infinity, times: [0, 0.1, 0.5, 0.6] }}
        />
      )}
    </>
  );
}

export const GLYPH_WIDTH = { mono: 0.62, grotesk: 0.58, hand: 0.42, serif: 0.52 };

type FitOptions = {
  max?: number;
  min?: number;
  glyph?: number;
  lineHeight?: number;
  gap?: number;
};

export function fitFontSize(
  texts: string[],
  box: { width: number; height: number },
  { max = 96, min = 24, glyph = GLYPH_WIDTH.grotesk, lineHeight = 1.25, gap = 0 }: FitOptions = {},
): number {
  for (let size = max; size > min; size -= 2) {
    const charsPerLine = Math.max(1, Math.floor(box.width / (size * glyph)));
    const lines = texts.reduce(
      (sum, text) => sum + Math.max(1, Math.ceil((text.length * 1.2) / charsPerLine)),
      0,
    );
    if (lines * size * lineHeight + gap * (texts.length - 1) <= box.height) return size;
  }
  return min;
}

export const wordCount = (texts: string[]) =>
  texts.reduce((sum, text) => sum + text.split(/\s+/).filter(Boolean).length, 0);

export function revealDuration(texts: string[], perWord: number, wordDuration = 0.5) {
  return wordDuration + perWord * Math.max(0, wordCount(texts) - 1);
}

export function RevealText({
  texts,
  start,
  perWord,
  className,
  itemClassName,
  style,
  effect = 'rise',
}: {
  texts: string[];
  start: number;
  perWord: number;
  className?: string;
  itemClassName?: string;
  style?: React.CSSProperties;
  effect?: 'rise' | 'flip' | 'mask';
}) {
  let index = 0;
  return (
    <div className={className} style={style}>
      {texts.map((text, t) => (
        <p key={t} className={cn(effect === 'flip' && '[perspective:900px]', itemClassName)}>
          {text
            .split(/\s+/)
            .filter(Boolean)
            .map((word, w) => {
              const delay = start + index++ * perWord;
              if (effect === 'mask') {
                return (
                  <span key={w} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      transition={{ delay, duration: 0.6, ease: easings.out }}
                    >
                      {word}
                    </motion.span>
                  </span>
                );
              }
              if (effect === 'flip') {
                return (
                  <motion.span
                    key={w}
                    className="mr-[0.25em] inline-block origin-top"
                    initial={{ opacity: 0, rotateX: -95 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    transition={{ delay, duration: 0.55, ease: easings.out }}
                  >
                    {word}
                  </motion.span>
                );
              }
              return (
                <motion.span
                  key={w}
                  className="mr-[0.25em] inline-block"
                  initial={{ opacity: 0, y: '0.4em' }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.5, ease: easings.out }}
                >
                  {word}
                </motion.span>
              );
            })}
        </p>
      ))}
    </div>
  );
}

export function Polaroid({
  src,
  alt,
  width,
  caption,
  captionClassName,
  className,
  children,
}: {
  src?: string;
  alt?: string;
  width: number;
  caption?: ReactNode;
  captionClassName?: string;
  className?: string;
  children?: ReactNode;
}) {
  const pad = Math.round(width * 0.035);
  return (
    <figure
      className={cn('bg-white shadow-[0_24px_60px_rgba(0,0,0,0.22)]', className)}
      style={{ width, padding: pad, paddingBottom: 0 }}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-200">
        {src && <img src={src} alt={alt ?? ''} className="h-full w-full object-cover" />}
        {children}
      </div>
      <figcaption
        className={cn('font-hand text-center leading-none text-black', captionClassName)}
        style={{
          fontSize: Math.round(width * 0.085),
          paddingBlock: Math.round(width * 0.045),
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

export function SlowZoom({
  src,
  alt,
  duration,
  from = 1.18,
  drift = 30,
  className,
}: {
  src: string;
  alt: string;
  duration: number;
  from?: number;
  drift?: number;
  className?: string;
}) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn('h-full w-full object-cover', className)}
      initial={{ scale: from, x: drift }}
      animate={{ scale: 1, x: 0 }}
      transition={{ duration, ease: 'linear' }}
    />
  );
}

export const quoteWords = (text: string) => text.split(/\s+/).filter(Boolean);

export function HighlightQuote({
  text,
  start,
  wordStagger,
  highlightStart,
  highlightStagger,
  className,
  style,
}: {
  text: string;
  start: number;
  wordStagger: number;
  highlightStart: number;
  highlightStagger: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p className={cn('isolate', className)} style={style}>
      {quoteWords(text).map((word, i) => (
        <motion.span
          key={i}
          className="relative mr-[0.25em] inline-block"
          initial={{ opacity: 0, y: '0.5em', rotate: 4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: start + i * wordStagger, duration: 0.5, ease: easings.out }}
        >
          <motion.span
            className="absolute -left-[0.08em] -right-[0.3em] bottom-[0.06em] -z-10 h-[0.42em] origin-left bg-reload-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: highlightStart + i * highlightStagger,
              duration: 0.3,
              ease: easings.inOut,
            }}
          />
          {word}
        </motion.span>
      ))}
    </p>
  );
}

export function Float({
  children,
  className,
  y = 10,
  rotate = 0,
  scale = 0,
  duration = 7,
  delay = 0,
}: {
  children?: ReactNode;
  className?: string;
  y?: number;
  rotate?: number;
  scale?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -y, 0], rotate: [0, rotate, 0], scale: [1, 1 + scale, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
