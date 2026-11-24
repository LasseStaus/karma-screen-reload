import { colors, snowScene } from '@/animations/christmas/shared';
import {
  fallOut,
  fitFontSize,
  GLYPH_WIDTH,
  revealDuration,
  RevealText,
} from '@/animations/lab/shared';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, springs, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const PER_WORD = 0.08;
const TEXT_EXIT = 0.5;
const BOX = { width: 700, top: 860, height: 380 };
const PHOTO = 600;
const PHOTO_TOP = 230;
const CONFETTI = 26;
const CONFETTI_COLORS = ['#ffe500', '#fdf9f0', '#e8412f', '#ffffff'];
const VOTES_BOX = { width: 936, height: 440 };

const pseudoRandom = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const confetti = Array.from({ length: CONFETTI }, (_, i) => ({
  x: (pseudoRandom(i, 1) - 0.5) * 1000,
  peak: 300 + pseudoRandom(i, 2) * 500,
  fall: 200 + pseudoRandom(i, 3) * 700,
  rotate: (pseudoRandom(i, 4) - 0.5) * 900,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  wide: pseudoRandom(i, 5) > 0.5,
}));

const pakkeTimeline = (nominee: KarmaNominee) =>
  timeline({
    box: { duration: 0.8 },
    wiggle: { at: '+0.1', duration: 0.9 },
    lid: { duration: 0.7 },
    photo: { at: '-0.45', duration: 0.8 },
    name: { at: '-0.2', duration: 0.5 },
    votes: { at: '-0.1', duration: revealDuration(nominee.votes, PER_WORD) },
  });

type Keys = keyof ReturnType<typeof pakkeTimeline>['steps'];

function PakkeCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const fontSize = fitFontSize(nominee.votes, VOTES_BOX, {
    max: 80,
    min: 28,
    glyph: GLYPH_WIDTH.serif,
    gap: 20,
  });
  const textExit = { opacity: 0, y: -24, transition: { duration: TEXT_EXIT, ease: easings.inOut } };
  const boxLeft = (1080 - BOX.width) / 2;

  return (
    <div className="relative h-full text-reload-secondary">
      <motion.div
        className="absolute inset-x-0 top-0"
        style={{ height: BOX.top + BOX.height }}
        exit={fallOut({ delay: TEXT_EXIT * 0.6, distance: 1800 })}
      >
        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: BOX.top + 40 }}>
          <motion.div
            className="absolute left-1/2 overflow-hidden rounded-[24px] border-[16px] border-reload-secondary"
            style={{ top: PHOTO_TOP, width: PHOTO, height: PHOTO, marginLeft: -PHOTO / 2 }}
            initial={{ y: BOX.top + 40 - PHOTO_TOP, rotate: 0 }}
            animate={{ y: 0, rotate: -2 }}
            transition={tl.transition('photo', springs.soft)}
          >
            <img
              src={nominee.avatar_url}
              alt={nominee.full_name}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>

        {confetti.map((c, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-0"
            style={{
              width: c.wide ? 26 : 14,
              height: c.wide ? 12 : 22,
              background: c.color,
              marginLeft: -7,
            }}
            initial={{ x: 0, y: BOX.top, opacity: 0 }}
            animate={{
              x: [0, c.x * 0.7, c.x],
              y: [BOX.top, BOX.top - c.peak, BOX.top - c.peak + c.fall],
              rotate: [0, c.rotate * 0.5, c.rotate],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              delay: tl.steps.lid.start + 0.05,
              duration: 1.8,
              times: [0, 0.35, 0.85, 1],
              ease: ['easeOut', 'easeIn'],
            }}
          />
        ))}

        <motion.div
          className="absolute origin-bottom"
          style={{ left: boxLeft, top: BOX.top - 120, width: BOX.width, height: BOX.height + 120 }}
          initial={{ y: -1500 }}
          animate={{ y: 0 }}
          transition={tl.transition('box', springs.soft)}
        >
          <motion.div
            className="relative h-full w-full origin-bottom"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -4, 4, -3, 2, 0] }}
            transition={{ delay: tl.steps.wiggle.start, duration: tl.steps.wiggle.duration }}
          >
            <div
              className="absolute inset-x-0 bottom-0"
              style={{ height: BOX.height, background: colors.red }}
            >
              <div className="absolute inset-y-0 left-1/2 w-[90px] -translate-x-1/2 bg-reload-primary" />
              <div className="absolute bottom-[56px] right-[48px] rotate-[4deg] bg-reload-secondary px-[22px] py-[12px] font-mono text-[24px] uppercase text-black">
                {nominee.title} · uge {nominee.week}
              </div>
            </div>
            <motion.div
              className="absolute -left-[30px] -right-[30px] top-[40px] h-[90px] bg-[#8e1b17]"
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: 260, y: -900, rotate: 28, opacity: 0 }}
              transition={tl.transition('lid', { ease: [0.3, 0, 0.6, 1] })}
            >
              <div className="absolute inset-y-0 left-1/2 w-[90px] -translate-x-1/2 bg-reload-primary" />
              <div className="absolute -top-[70px] left-1/2 h-[80px] w-[200px] -translate-x-1/2">
                <div className="absolute left-0 top-[10px] h-[70px] w-[100px] -rotate-[20deg] rounded-[50%] border-[18px] border-reload-primary" />
                <div className="absolute right-0 top-[10px] h-[70px] w-[100px] rotate-[20deg] rounded-[50%] border-[18px] border-reload-primary" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-x-[72px] bottom-[72px] top-[1290px] flex flex-col"
        exit={textExit}
      >
        <motion.h1
          className="font-serif text-[68px] font-semibold leading-[1.05]"
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
            className="space-y-[20px] font-serif leading-[1.2]"
            style={{ fontSize }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export const pakke = defineAnimation({
  id: 'jul-pakke',
  name: 'Gavepakke',
  group: 'Jul',
  timeline: pakkeTimeline,
  hold: 5,
  Component: PakkeCard,
  Scene: snowScene(colors.green),
});
