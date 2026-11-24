import { colors, snowScene } from '@/animations/christmas/shared';
import {
  fallOut,
  fitFontSize,
  GLYPH_WIDTH,
  revealDuration,
  RevealText,
} from '@/animations/lab/shared';
import { Tag } from '@/animations/shared/Tag';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, springs, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const PER_WORD = 0.08;
const TEXT_EXIT = 0.5;
const GLOBE = 820;
const GLOBE_TOP = 150;
const PHOTO_INSET = 70;
const FLAKES = 36;
const SETTLE = 6;
const VOTES_BOX = { width: 936, height: 470 };

const pseudoRandom = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const flakes = Array.from({ length: FLAKES }, (_, i) => ({
  x: 80 + pseudoRandom(i, 1) * (GLOBE - 160),
  y: 60 + pseudoRandom(i, 2) * (GLOBE * 0.55),
  drift: (pseudoRandom(i, 3) - 0.5) * 140,
  size: 8 + pseudoRandom(i, 4) * 12,
  fall: 0.75 + pseudoRandom(i, 5) * 0.25,
}));

const snekugleTimeline = (nominee: KarmaNominee) =>
  timeline({
    globe: { duration: 0.9 },
    shake: { at: '+0.1', duration: 1.1 },
    tag: { at: '-0.2', duration: 0.5 },
    name: { at: '-0.2', duration: 0.5 },
    votes: { at: '-0.1', duration: revealDuration(nominee.votes, PER_WORD) },
  });

type Keys = keyof ReturnType<typeof snekugleTimeline>['steps'];

function SnekugleCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const fontSize = fitFontSize(nominee.votes, VOTES_BOX, {
    max: 84,
    min: 30,
    glyph: GLYPH_WIDTH.serif,
    gap: 22,
  });
  const textExit = { opacity: 0, y: -24, transition: { duration: TEXT_EXIT, ease: easings.inOut } };
  const shakeStart = tl.steps.shake.start;

  return (
    <div className="relative h-full text-reload-secondary">
      <motion.div
        className="absolute left-1/2"
        style={{ top: GLOBE_TOP, width: GLOBE, marginLeft: -GLOBE / 2 }}
        initial={{ y: -1400 }}
        animate={{ y: 0 }}
        exit={fallOut({ delay: TEXT_EXIT * 0.6, rotate: 4 })}
        transition={tl.transition('globe', springs.soft)}
      >
        <motion.div
          className="origin-bottom"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -7, 6, -5, 3, 0] }}
          transition={{ delay: shakeStart, duration: tl.steps.shake.duration, ease: 'easeInOut' }}
        >
          <div
            className="relative overflow-hidden rounded-full border-[10px] border-white/60 bg-[#cfe3ea]"
            style={{ width: GLOBE, height: GLOBE }}
          >
            <div className="absolute overflow-hidden rounded-full" style={{ inset: PHOTO_INSET }}>
              <img
                src={nominee.avatar_url}
                alt={nominee.full_name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-[60px] left-1/2 h-[200px] w-[110%] -translate-x-1/2 rounded-[50%] bg-white" />
            {flakes.map((flake, i) => (
              <motion.div
                key={i}
                className="absolute left-0 top-0 rounded-full bg-white"
                style={{ width: flake.size, height: flake.size }}
                initial={{ x: flake.x, y: GLOBE - 120, opacity: 0 }}
                animate={{
                  x: [flake.x, flake.x + flake.drift, flake.x - flake.drift * 0.4],
                  y: [GLOBE - 120, flake.y, GLOBE * flake.fall],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  delay: shakeStart + 0.15,
                  duration: SETTLE,
                  times: [0, 0.12, 0.95, 1],
                  ease: ['easeOut', 'easeInOut'],
                }}
              />
            ))}
            <div className="pointer-events-none absolute left-[14%] top-[10%] h-[34%] w-[22%] -rotate-[30deg] rounded-[50%] bg-white/25" />
          </div>
          <div
            className="relative mx-auto -mt-[70px] h-[170px] w-[640px] bg-[#7a1a16]"
            style={{ clipPath: 'polygon(8% 0, 92% 0, 100% 100%, 0 100%)' }}
          >
            <div className="absolute inset-x-0 top-[70px] h-[14px] bg-reload-primary" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-x-[72px] bottom-[72px] top-[1170px] flex flex-col"
        exit={textExit}
      >
        <Tag
          delay={tl.steps.tag.start}
          duration={tl.steps.tag.duration}
          className="self-start rounded-[12px] bg-reload-primary px-[24px] py-[10px] font-mono text-[28px] uppercase text-black"
        >
          {nominee.title} · uge {nominee.week}
        </Tag>
        <motion.h1
          className="mt-[20px] font-serif text-[72px] font-semibold leading-[1.05]"
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
            className="space-y-[22px] font-serif leading-[1.2]"
            style={{ fontSize }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export const snekugle = defineAnimation({
  id: 'jul-snekugle',
  name: 'Snekugle',
  group: 'Jul',
  timeline: snekugleTimeline,
  hold: 5,
  Component: SnekugleCard,
  Scene: snowScene(colors.red),
});
