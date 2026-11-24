import { exitFade, fitFontSize, revealDuration, RevealText } from '@/animations/lab/shared';
import { Tag } from '@/animations/shared/Tag';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const PER_WORD = 0.08;
const HOLD = 5;
const VOTES_BOX = { width: 920, height: 680 };

const kenBurnsTimeline = (nominee: KarmaNominee) =>
  timeline({
    photo: { duration: 1.2 },
    meta: { at: '-0.4', duration: 0.4 },
    name: { at: '-0.1', duration: 0.5 },
    line: { at: '-0.2', duration: 0.6 },
    votes: { at: '-0.3', duration: revealDuration(nominee.votes, PER_WORD) },
  });

type Keys = keyof ReturnType<typeof kenBurnsTimeline>['steps'];

function KenBurnsCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const fontSize = fitFontSize(nominee.votes, VOTES_BOX, { max: 92, min: 32, gap: 28 });

  return (
    <motion.div className="relative h-full overflow-hidden bg-black text-white" exit={exitFade}>
      <motion.div
        className="absolute inset-x-0 top-0 h-[1160px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={tl.transition('photo')}
      >
        <motion.img
          src={nominee.avatar_url}
          alt={nominee.full_name}
          className="h-full w-full object-cover"
          initial={{ scale: 1.18, x: 30 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ duration: tl.end + HOLD, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black" />
      </motion.div>

      <div className="absolute inset-x-[80px] bottom-[96px] top-[880px] flex flex-col">
        <motion.div
          className="flex items-center justify-between font-mono text-[26px] uppercase tracking-[0.2em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tl.transition('meta')}
        >
          <Tag
            delay={tl.steps.meta.start}
            duration={0.6}
            className="rounded-[8px] bg-reload-primary px-[18px] py-[6px] text-black"
          >
            {nominee.title}
          </Tag>
          <span>Uge {nominee.week}</span>
        </motion.div>

        <motion.h1
          className="mt-[24px] font-grotesk text-[60px] font-bold leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tl.transition('name')}
        >
          {nominee.full_name}
        </motion.h1>

        <svg viewBox="0 0 400 24" className="mt-[8px] h-[20px] w-[300px]" fill="none">
          <motion.path
            d="M4 16 C 100 4, 220 4, 396 12"
            stroke="rgb(var(--reload-primary))"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={tl.transition('line', { ease: easings.inOut })}
          />
        </svg>

        <div className="flex flex-1 items-center">
          <RevealText
            texts={nominee.votes}
            start={tl.steps.votes.start}
            perWord={PER_WORD}
            className="space-y-[28px] font-grotesk font-medium leading-[1.2]"
            style={{ fontSize }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export const kenBurns = defineAnimation({
  id: 'lab-ken-burns',
  name: 'Ken Burns',
  group: 'Lab',
  timeline: kenBurnsTimeline,
  hold: HOLD,
  Component: KenBurnsCard,
});
