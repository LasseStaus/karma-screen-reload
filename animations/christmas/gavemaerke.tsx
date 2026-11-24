import { colors, snowScene, Swing } from '@/animations/christmas/shared';
import {
  fitFontSize,
  GLYPH_WIDTH,
  liftOut,
  revealDuration,
  RevealText,
} from '@/animations/lab/shared';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, springs, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const PER_WORD = 0.08;
const CONTENT_EXIT = 0.5;
const TAG_WIDTH = 900;
const STRING = 220;
const PHOTO = 400;
const TEXT_BOX = { width: 756, height: 520 };
const TAG_SHAPE = 'polygon(16% 0, 84% 0, 100% 8%, 100% 100%, 0 100%, 0 8%)';

const gavemaerkeTimeline = (nominee: KarmaNominee) =>
  timeline({
    tag: { duration: 1 },
    photo: { at: '-0.3', duration: 0.6 },
    name: { at: '-0.3', duration: 0.5 },
    text: { at: '-0.1', duration: revealDuration(nominee.votes, PER_WORD) },
    from: { at: '+0.1', duration: 0.5 },
  });

type Keys = keyof ReturnType<typeof gavemaerkeTimeline>['steps'];

function GavemaerkeCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const textSize = fitFontSize(nominee.votes, TEXT_BOX, {
    max: 110,
    min: 28,
    glyph: GLYPH_WIDTH.serif,
    lineHeight: 1.15,
    gap: 22,
  });
  const contentExit = { opacity: 0, transition: { duration: CONTENT_EXIT, ease: easings.inOut } };
  const fadeUp = (key: Keys) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: contentExit,
    transition: tl.transition(key),
  });

  return (
    <motion.div
      className="absolute left-1/2 top-0"
      style={{ marginLeft: -TAG_WIDTH / 2, width: TAG_WIDTH }}
      initial={{ y: -1900 }}
      animate={{ y: 0 }}
      exit={liftOut({ delay: CONTENT_EXIT * 0.6, distance: 2000 })}
      transition={tl.transition('tag', springs.soft)}
    >
      <Swing degrees={0.8} duration={5}>
        <div className="mx-auto w-[4px] bg-[rgba(253,249,240,0.8)]" style={{ height: STRING }} />
        <div
          className="relative -mt-[30px] flex h-[1560px] flex-col items-center bg-reload-secondary px-[72px] pb-[64px] pt-[130px] text-black"
          style={{ clipPath: TAG_SHAPE }}
        >
          <div
            className="absolute left-1/2 top-[30px] h-[56px] w-[56px] -translate-x-1/2 rounded-full border-[8px] border-reload-primary"
            style={{ background: colors.red }}
          />

          <motion.div
            className="shrink-0 overflow-hidden rounded-full border-[12px] border-reload-primary"
            style={{ width: PHOTO, height: PHOTO }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={contentExit}
            transition={tl.transition('photo', springs.soft)}
          >
            <img
              src={nominee.avatar_url}
              alt={nominee.full_name}
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.p className="mt-[36px] text-center font-serif leading-none" {...fadeUp('name')}>
            <span className="text-[48px] text-black/50">Til </span>
            <span className="text-[76px]">{nominee.full_name}</span>
          </motion.p>

          <div className="mt-[32px] w-full border-t-[3px] border-dashed border-black/25" />

          <motion.div className="flex w-full flex-1 items-center" exit={contentExit}>
            <RevealText
              texts={nominee.votes}
              start={tl.steps.text.start}
              perWord={PER_WORD}
              className="w-full space-y-[22px] text-center font-serif leading-[1.15]"
              style={{ fontSize: textSize }}
            />
          </motion.div>

          <motion.div className="flex w-full items-end justify-between" {...fadeUp('from')}>
            <span className="font-serif text-[64px] leading-none">
              <span className="text-black/50">Fra </span>kollegerne
            </span>
            <span className="font-mono text-[24px] uppercase">
              {nominee.title} · uge {nominee.week}
            </span>
          </motion.div>
        </div>
      </Swing>
    </motion.div>
  );
}

export const gavemaerke = defineAnimation({
  id: 'jul-gavemaerke',
  name: 'Gavemærke',
  group: 'Jul',
  timeline: gavemaerkeTimeline,
  hold: 5,
  Component: GavemaerkeCard,
  Scene: snowScene(colors.red),
});
