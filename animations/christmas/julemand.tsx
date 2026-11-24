import { colors, snowScene } from '@/animations/christmas/shared';
import { Sleigh } from '@/animations/christmas/Sleigh';
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
const FRAME = { left: 170, top: 390, size: 740 };
const SLEIGH = { width: 540, top: 20, hoverX: 270 };
const SACK = { x: 390, y: 95 };
const FLIGHT = 3.4;
const DUMP_AT = 1.05;
const CHUNKS = 22;
const VOTES_BOX = { width: 936, height: 430 };

const pseudoRandom = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const chunks = Array.from({ length: CHUNKS }, (_, i) => ({
  x: 80 + ((i + pseudoRandom(i, 1) * 0.8) / CHUNKS) * (FRAME.size - 160),
  y: 10 + pseudoRandom(i, 5) * 160,
  size: 22 + pseudoRandom(i, 2) * 24,
  lift: 80 + pseudoRandom(i, 3) * 160,
  delay: pseudoRandom(i, 4) * 0.45,
}));

const julemandTimeline = (nominee: KarmaNominee) =>
  timeline({
    frame: { duration: 0.7 },
    sleigh: { at: '+0.1', duration: FLIGHT },
    cap: { at: '-1.55', duration: 0.5 },
    tag: { at: '+0.2', duration: 0.5 },
    name: { at: '-0.2', duration: 0.5 },
    votes: { at: '-0.1', duration: revealDuration(nominee.votes, PER_WORD) },
  });

type Keys = keyof ReturnType<typeof julemandTimeline>['steps'];

function JulemandCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const fontSize = fitFontSize(nominee.votes, VOTES_BOX, {
    max: 84,
    min: 30,
    glyph: GLYPH_WIDTH.serif,
    gap: 22,
  });
  const dumpStart = tl.steps.sleigh.start + DUMP_AT;
  const sackX = SLEIGH.hoverX + SACK.x - FRAME.left;
  const sackY = SLEIGH.top + SACK.y - FRAME.top;
  const textExit = { opacity: 0, y: -24, transition: { duration: TEXT_EXIT, ease: easings.inOut } };

  return (
    <div className="relative h-full text-reload-secondary">
      <motion.div
        className="absolute"
        style={{ left: FRAME.left, top: FRAME.top, width: FRAME.size }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={fallOut({ delay: TEXT_EXIT * 0.6, rotate: -3 })}
        transition={tl.transition('frame', springs.soft)}
      >
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ delay: tl.steps.cap.start, duration: 0.45, ease: easings.out }}
        >
          <div
            className="overflow-hidden border-[20px] border-reload-secondary"
            style={{ height: FRAME.size }}
          >
            <img
              src={nominee.avatar_url}
              alt={nominee.full_name}
              className="h-full w-full object-cover"
            />
          </div>
          <motion.svg
            viewBox="0 0 740 90"
            className="absolute -top-[62px] left-[-14px] w-[768px] origin-bottom"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={tl.transition('cap', springs.soft)}
          >
            <path
              d="M0 86 Q0 40 40 44 Q60 8 110 26 Q150 -4 210 22 Q260 2 300 28 Q350 0 410 24 Q460 6 500 30 Q560 4 600 30 Q650 14 690 42 Q740 40 740 86 Z"
              fill="#ffffff"
            />
            <path d="M120 86 Q124 110 132 86 M460 86 Q466 116 474 86" fill="#ffffff" />
          </motion.svg>
          {chunks.map((chunk, i) => (
            <motion.div
              key={i}
              className="absolute left-0 top-0 rounded-full bg-white"
              style={{ width: chunk.size, height: chunk.size }}
              initial={{ x: sackX, y: sackY, opacity: 0, scale: 0.4 }}
              animate={{
                x: [sackX, (sackX + chunk.x) / 2, chunk.x],
                y: [sackY, sackY - chunk.lift, chunk.y],
                opacity: [0, 1, 1],
                scale: [0.4, 1, 1.25],
              }}
              transition={{
                delay: dumpStart + chunk.delay,
                duration: 0.9,
                times: [0, 0.35, 1],
                ease: 'easeIn',
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute left-0"
        style={{ top: SLEIGH.top, width: SLEIGH.width }}
        initial={{ x: 1200, y: -120, rotate: -8 }}
        animate={{
          x: [1200, SLEIGH.hoverX, SLEIGH.hoverX - 30, -900],
          y: [-120, 0, 12, -220],
          rotate: [-8, 0, 2, -10],
        }}
        transition={{
          delay: tl.steps.sleigh.start,
          duration: FLIGHT,
          times: [0, 0.3, 0.58, 1],
          ease: [easings.out, 'linear', [0.5, 0, 0.75, 0]],
        }}
      >
        <Sleigh className="w-full" />
      </motion.div>

      <motion.div
        className="absolute inset-x-[72px] bottom-[72px] top-[1190px] flex flex-col"
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

export const julemand = defineAnimation({
  id: 'jul-julemand',
  name: 'Julemanden',
  group: 'Jul',
  timeline: julemandTimeline,
  hold: 5,
  Component: JulemandCard,
  Scene: snowScene(colors.night),
});
