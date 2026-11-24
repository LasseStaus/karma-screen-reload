import { exitFade, fitFontSize, revealDuration, RevealText } from '@/animations/lab/shared';
import { Tag } from '@/animations/shared/Tag';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, springs, timeline } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const COLS = 4;
const ROWS = 3;
const TILE = 1080 / COLS;
const PHOTO_HEIGHT = TILE * ROWS;
const TILE_STAGGER = 0.07;
const TILE_DURATION = 0.7;
const PER_WORD = 0.08;
const VOTE_GAP = 28;
const VOTES_BOX = { width: 936, height: 660 };

const pseudoRandom = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const tiles = Array.from({ length: COLS * ROWS }, (_, i) => ({
  row: Math.floor(i / COLS),
  col: i % COLS,
  isBadge: i === COLS * ROWS - 1,
}));

const order = tiles.map((_, i) => i).sort((a, b) => pseudoRandom(a, 1) - pseudoRandom(b, 1));

const mosaicTimeline = (nominee: KarmaNominee) =>
  timeline({
    tiles: { duration: TILE_DURATION + TILE_STAGGER * (tiles.length - 1) },
    badge: { at: '-0.1', duration: 0.6 },
    meta: { at: '-0.4', duration: 0.6 },
    name: { at: '<', duration: 0.5 },
    votes: { at: '-0.1', duration: revealDuration(nominee.votes, PER_WORD) },
  });

type Keys = keyof ReturnType<typeof mosaicTimeline>['steps'];

type Theme = {
  root: string;
  badge: string;
  chip: string;
  effect: 'flip' | 'mask';
};

const themes = {
  flip: {
    root: 'bg-reload-secondary text-black',
    badge: 'bg-reload-primary text-black',
    chip: 'bg-reload-primary text-black',
    effect: 'flip',
  },
  yellow: {
    root: 'bg-reload-primary text-black',
    badge: 'bg-black text-reload-primary',
    chip: 'bg-black text-reload-primary',
    effect: 'mask',
  },
} satisfies Record<string, Theme>;

function createMosaicCard(theme: Theme) {
  return function MosaicCard({ nominee, timeline: tl }: SlideProps<Keys>) {
    const fontSize = fitFontSize(nominee.votes, VOTES_BOX, { max: 96, min: 32, gap: VOTE_GAP });

    return (
      <motion.div className={cn('flex h-full flex-col', theme.root)} exit={exitFade}>
        <div className="relative shrink-0" style={{ height: PHOTO_HEIGHT, perspective: 1600 }}>
          {tiles.map(({ row, col, isBadge }, i) => {
            const rank = order.indexOf(i);
            return (
              <div
                key={i}
                className="absolute"
                style={{ left: col * TILE, top: row * TILE, width: TILE, height: TILE }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${nominee.avatar_url})`,
                    backgroundSize: '1080px 1080px',
                    backgroundPosition: `-${col * TILE}px -${row * TILE + (1080 - PHOTO_HEIGHT) / 2}px`,
                  }}
                  initial={{
                    opacity: 0,
                    x: (pseudoRandom(i, 2) - 0.5) * 1200,
                    y: (pseudoRandom(i, 3) - 0.5) * 1200,
                    rotate: (pseudoRandom(i, 4) - 0.5) * 120,
                    scale: 0.5,
                  }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1.005 }}
                  transition={{
                    ...springs.soft,
                    visualDuration: TILE_DURATION,
                    delay: tl.steps.tiles.start + rank * TILE_STAGGER,
                  }}
                />
                {isBadge && (
                  <motion.div
                    className={cn(
                      'absolute inset-0 flex flex-col items-center justify-center [backface-visibility:hidden]',
                      theme.badge,
                    )}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    transition={tl.transition('badge', { ease: easings.inOut })}
                  >
                    <span className="font-mono text-[28px] uppercase tracking-[0.3em]">Uge</span>
                    <span className="font-grotesk text-[150px] font-bold leading-none">
                      {nominee.week}
                    </span>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-1 flex-col px-[72px] pb-[72px] pt-[56px]">
          <Tag
            delay={tl.steps.meta.start}
            duration={tl.steps.meta.duration}
            className={cn(
              'self-start rounded-[12px] px-[24px] py-[10px] font-mono text-[28px] uppercase',
              theme.chip,
            )}
          >
            {nominee.title}
          </Tag>
          <motion.h1
            className="mt-[20px] font-grotesk text-[60px] font-bold leading-[1.1]"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={tl.transition('name')}
          >
            {nominee.full_name}
          </motion.h1>
          <div className="flex flex-1 items-center">
            <RevealText
              texts={nominee.votes}
              start={tl.steps.votes.start}
              perWord={PER_WORD}
              effect={theme.effect}
              className="space-y-[28px] font-grotesk font-medium leading-[1.2]"
              style={{ fontSize }}
            />
          </div>
        </div>
      </motion.div>
    );
  };
}

export const mosaicFlip = defineAnimation({
  id: 'lab-mosaic',
  name: 'Mosaic · flip',
  group: 'Lab · Mosaic',
  timeline: mosaicTimeline,
  hold: 5,
  Component: createMosaicCard(themes.flip),
});

export const mosaicYellow = defineAnimation({
  id: 'lab-mosaic-yellow',
  name: 'Mosaic · gul',
  group: 'Lab · Mosaic',
  timeline: mosaicTimeline,
  hold: 5,
  Component: createMosaicCard(themes.yellow),
});
