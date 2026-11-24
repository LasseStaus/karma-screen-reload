import {
  exitFadeAfter,
  fallExitEnd,
  fallOut,
  fitFontSize,
  GLYPH_WIDTH,
  Polaroid,
  revealDuration,
  RevealText,
} from '@/animations/lab/shared';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, springs, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const PER_WORD = 0.08;
const TEXT_EXIT = 0.5;
const CARD = 760;
const INNER = CARD * 0.93;
const TITLE_GLYPH = 0.8;
const TEXT_BOX = { width: 936, height: 580 };

const stackTimeline = (nominee: KarmaNominee) =>
  timeline({
    titleCard: { duration: 0.7 },
    weekCard: { at: '-0.4', duration: 0.7 },
    photoCard: { at: '-0.4', duration: 0.8 },
    heading: { at: '-0.2', duration: 0.4 },
    text: { at: '-0.1', duration: revealDuration(nominee.votes, PER_WORD) },
    scribble: { at: '+0.1', duration: 0.7 },
  });

type Keys = keyof ReturnType<typeof stackTimeline>['steps'];

function PolaroidStackCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const titleSize = Math.min(150, (INNER * 0.75) / (nominee.title.length * TITLE_GLYPH));
  const textSize = fitFontSize(nominee.votes, TEXT_BOX, {
    max: 170,
    min: 30,
    glyph: GLYPH_WIDTH.hand,
    lineHeight: 1.15,
    gap: 28,
  });

  const drop = (key: Keys, rotate: number, x: number, exitOrder: number) => ({
    initial: { opacity: 0, y: -900, rotate: rotate * 3, x },
    animate: { opacity: 1, y: 0, rotate, x },
    exit: fallOut({ order: exitOrder, delay: TEXT_EXIT * 0.6, x, rotate }),
    transition: tl.transition(key, springs.soft),
  });
  const textExit = { opacity: 0, y: -24, transition: { duration: TEXT_EXIT, ease: easings.inOut } };

  return (
    <motion.div
      className="relative h-full overflow-hidden bg-reload-secondary text-black"
      exit={exitFadeAfter(TEXT_EXIT * 0.6 + fallExitEnd(3) - 0.2)}
    >
      <div className="absolute left-1/2 top-[64px]" style={{ marginLeft: -CARD / 2 }}>
        <motion.div className="absolute" {...drop('titleCard', -9, -165, 2)}>
          <Polaroid width={CARD} caption="ugens titel">
            <div className="absolute inset-0 flex items-center justify-start bg-reload-primary pl-[28px]">
              <span
                className="rotate-180 font-grotesk font-bold uppercase leading-none [writing-mode:vertical-rl]"
                style={{ fontSize: titleSize }}
              >
                {nominee.title}
              </span>
            </div>
          </Polaroid>
        </motion.div>

        <motion.div className="absolute" {...drop('weekCard', 8, 165, 1)}>
          <Polaroid width={CARD} caption="uge">
            <div className="absolute inset-0 flex items-center justify-end bg-black pr-[28px]">
              <span className="rotate-180 whitespace-nowrap font-grotesk text-[104px] font-bold uppercase leading-none text-reload-primary [writing-mode:vertical-rl]">
                Uge {nominee.week}
              </span>
            </div>
          </Polaroid>
        </motion.div>

        <motion.div className="absolute" {...drop('photoCard', -2, 0, 0)}>
          <Polaroid
            src={nominee.avatar_url}
            alt={nominee.full_name}
            width={CARD}
            caption={nominee.full_name}
          />
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-x-[72px] bottom-[72px] top-[1030px] flex flex-col items-center"
        exit={textExit}
      >
        <motion.p
          className="font-hand text-[60px] leading-none text-black/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tl.transition('heading')}
        >
          kollegerne siger …
        </motion.p>
        <div className="flex w-full flex-1 items-center">
          <RevealText
            texts={nominee.votes}
            start={tl.steps.text.start}
            perWord={PER_WORD}
            className="w-full space-y-[28px] text-center font-hand leading-[1.15]"
            style={{ fontSize: textSize }}
          />
        </div>
        <svg viewBox="0 0 600 40" className="h-[48px] w-[600px]" fill="none">
          <motion.path
            d="M6 28 C 120 6, 260 34, 380 16 S 560 10, 594 22"
            stroke="rgb(var(--reload-primary))"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={tl.transition('scribble', { ease: easings.inOut })}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export const polaroidStack = defineAnimation({
  id: 'lab-polaroid-stack',
  name: 'Polaroid-stak',
  group: 'Lab · Polaroid',
  timeline: stackTimeline,
  hold: 5,
  Component: PolaroidStackCard,
});
