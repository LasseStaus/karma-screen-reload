import { colors, snowScene, Swing } from '@/animations/christmas/shared';
import {
  fitFontSize,
  GLYPH_WIDTH,
  liftOut,
  Polaroid,
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
const CARD = 700;
const TEXT_BOX = { width: 936, height: 560 };

const julekortTimeline = (nominee: KarmaNominee) =>
  timeline({
    card: { duration: 0.9 },
    tag: { at: '-0.2', duration: 0.5 },
    text: { at: '-0.1', duration: revealDuration(nominee.votes, PER_WORD) },
  });

type Keys = keyof ReturnType<typeof julekortTimeline>['steps'];

function JulekortCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const textSize = fitFontSize(nominee.votes, TEXT_BOX, {
    max: 150,
    min: 30,
    glyph: GLYPH_WIDTH.serif,
    lineHeight: 1.15,
    gap: 28,
  });

  return (
    <div className="relative h-full text-reload-secondary">
      <motion.div
        className="absolute left-1/2 top-0"
        style={{ marginLeft: -CARD / 2, width: CARD }}
        initial={{ y: -1300 }}
        animate={{ y: 0 }}
        exit={liftOut({ delay: TEXT_EXIT * 0.6, distance: 1400 })}
        transition={tl.transition('card', springs.soft)}
      >
        <Swing degrees={1.2} duration={4.5}>
          <div className="mx-auto h-[190px] w-[4px] bg-[rgba(253,249,240,0.7)]" />
          <div className="relative">
            <div className="absolute -top-[34px] left-1/2 z-10 h-[70px] w-[30px] -translate-x-1/2 rounded-[4px] bg-[#c9a36b]" />
            <Polaroid
              src={nominee.avatar_url}
              alt={nominee.full_name}
              width={CARD}
              caption={nominee.full_name}
              className="rotate-[-1.5deg]"
              captionClassName="font-serif"
            />
          </div>
        </Swing>
      </motion.div>

      <motion.div
        className="absolute inset-x-[72px] bottom-[72px] top-[1100px] flex flex-col items-center"
        exit={{ opacity: 0, y: -24, transition: { duration: TEXT_EXIT, ease: easings.inOut } }}
      >
        <Tag
          delay={tl.steps.tag.start}
          duration={tl.steps.tag.duration}
          className="rounded-[12px] bg-reload-primary px-[24px] py-[10px] font-mono text-[28px] uppercase text-black"
        >
          {nominee.title} · uge {nominee.week}
        </Tag>
        <div className="flex w-full flex-1 items-center">
          <RevealText
            texts={nominee.votes}
            start={tl.steps.text.start}
            perWord={PER_WORD}
            className="w-full space-y-[28px] text-center font-serif leading-[1.15]"
            style={{ fontSize: textSize }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export const julekort = defineAnimation({
  id: 'jul-julekort',
  name: 'Julekort',
  group: 'Jul',
  timeline: julekortTimeline,
  hold: 5,
  Component: JulekortCard,
  Scene: snowScene(colors.green, { lights: true }),
});
