import { exitFade, fitFontSize, Votes } from '@/animations/lab/shared';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, staggerDuration, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const LETTER_STAGGER = 0.04;
const VOTE_STAGGER = 0.12;
const TITLE_SPACE = 1776;
const GLYPH_RATIO = 0.62;

const posterTimeline = (nominee: KarmaNominee) =>
  timeline({
    photo: { duration: 0.9 },
    letters: {
      at: '-0.5',
      duration: staggerDuration(nominee.title.length, LETTER_STAGGER, 0.5),
    },
    name: { at: '-0.3', duration: 0.5 },
    meta: { at: '<', duration: 0.5 },
    votes: { at: '-0.1', duration: staggerDuration(nominee.votes.length, VOTE_STAGGER, 0.5) },
  });

type Keys = keyof ReturnType<typeof posterTimeline>['steps'];

function PosterCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const titleSize = Math.min(220, TITLE_SPACE / (nominee.title.length * GLYPH_RATIO));
  const titleColumn = titleSize * 1.15;
  const voteSize = fitFontSize(
    nominee.votes,
    { width: 1080 - titleColumn - 48 - 64 - 110, height: 640 },
    { max: 84, min: 28, gap: 24 },
  );

  return (
    <motion.div className="flex h-full bg-reload-secondary text-black" exit={exitFade}>
      <div
        className="mr-[48px] flex shrink-0 items-center justify-center bg-reload-primary py-[72px]"
        style={{ width: titleColumn }}
      >
        <h2
          className="rotate-180 whitespace-nowrap font-grotesk font-bold uppercase leading-none text-black [writing-mode:vertical-rl]"
          style={{ fontSize: titleSize }}
        >
          {[...nominee.title].map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: tl.steps.letters.start + i * LETTER_STAGGER,
                duration: 0.5,
                ease: easings.out,
              }}
            >
              {char}
            </motion.span>
          ))}
        </h2>
      </div>

      <div className="flex min-w-0 flex-1 flex-col pb-[72px] pr-[64px]">
        <div className="mt-[64px] h-[860px] shrink-0 overflow-hidden">
          <motion.img
            src={nominee.avatar_url}
            alt={nominee.full_name}
            className="h-full w-full object-cover"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={tl.transition('photo', { ease: easings.inOut })}
          />
        </div>

        <motion.p
          className="mt-[48px] font-mono text-[28px] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={tl.transition('meta')}
        >
          Uge {nominee.week} · kollegerne siger
        </motion.p>

        <motion.h1
          className="mt-[8px] font-grotesk text-[64px] font-bold leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tl.transition('name')}
        >
          {nominee.full_name}
        </motion.h1>

        <div className="flex flex-1 items-center">
          <Votes
            votes={nominee.votes}
            start={tl.steps.votes.start}
            stagger={VOTE_STAGGER}
            itemDuration={0.6}
            marker="—"
            from={{ opacity: 0, x: -40 }}
            className="space-y-[24px] font-grotesk font-medium leading-[1.2]"
            style={{ fontSize: voteSize }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export const poster = defineAnimation({
  id: 'lab-poster',
  name: 'Poster',
  group: 'Lab',
  timeline: posterTimeline,
  hold: 5,
  Component: PosterCard,
});
