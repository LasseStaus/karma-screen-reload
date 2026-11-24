import { colors, snowScene } from '@/animations/christmas/shared';
import { fitFontSize, revealDuration, RevealText } from '@/animations/lab/shared';
import { Tag } from '@/animations/shared/Tag';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, springs, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const PER_WORD = 0.08;
const DOOR = 820;
const TEXT_EXIT = 0.5;
const DOOR_CLOSE = 0.8;
const VOTES_BOX = { width: 936, height: 520 };

const kalenderTimeline = (nominee: KarmaNominee) =>
  timeline({
    frame: { duration: 0.7 },
    door: { at: '+0.3', duration: 1.2 },
    tag: { at: '-0.4', duration: 0.5 },
    name: { at: '-0.2', duration: 0.5 },
    votes: { at: '-0.1', duration: revealDuration(nominee.votes, PER_WORD) },
  });

type Keys = keyof ReturnType<typeof kalenderTimeline>['steps'];

function KalenderCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const fontSize = fitFontSize(nominee.votes, VOTES_BOX, { max: 84, min: 30, gap: 24 });
  const textExit = { opacity: 0, y: -24, transition: { duration: TEXT_EXIT, ease: easings.inOut } };

  return (
    <div className="relative h-full text-reload-secondary">
      <motion.div
        className="absolute left-1/2 top-[230px] border-[16px] border-reload-secondary"
        style={{ marginLeft: -DOOR / 2 - 16, width: DOOR + 32, height: DOOR + 32 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          y: 40,
          transition: { delay: TEXT_EXIT * 0.6 + DOOR_CLOSE, duration: 0.6, ease: easings.inOut },
        }}
        transition={tl.transition('frame', springs.soft)}
      >
        <div className="relative h-full w-full overflow-hidden">
          <motion.img
            src={nominee.avatar_url}
            alt={nominee.full_name}
            className="h-full w-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ delay: tl.steps.door.start, duration: 2.4, ease: easings.out }}
          />
        </div>

        <div className="absolute inset-0" style={{ perspective: 2400 }}>
          <motion.div
            className="relative h-full w-full origin-left [transform-style:preserve-3d]"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -105 }}
            exit={{
              rotateY: 0,
              transition: { delay: TEXT_EXIT * 0.6, duration: DOOR_CLOSE, ease: easings.inOut },
            }}
            transition={tl.transition('door', { ease: easings.inOut })}
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center [backface-visibility:hidden]"
              style={{ background: colors.red }}
            >
              <div className="absolute inset-[28px] border-[3px] border-dashed border-reload-secondary/60" />
              <span className="font-mono text-[40px] uppercase tracking-[0.3em]">Uge</span>
              <span className="font-grotesk text-[340px] font-bold leading-none">
                {nominee.week}
              </span>
              <div className="absolute right-[56px] top-1/2 h-[36px] w-[36px] -translate-y-1/2 rounded-full bg-reload-primary" />
            </div>
            <div
              className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{ background: '#6e1512' }}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-x-[72px] bottom-[72px] top-[1130px] flex flex-col"
        exit={textExit}
      >
        <Tag
          delay={tl.steps.tag.start}
          duration={tl.steps.tag.duration}
          className="self-start rounded-[12px] bg-reload-primary px-[24px] py-[10px] font-mono text-[28px] uppercase text-black"
        >
          {nominee.title}
        </Tag>
        <motion.h1
          className="mt-[20px] font-grotesk text-[64px] font-bold leading-[1.1]"
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
            effect="mask"
            className="space-y-[24px] font-grotesk font-medium leading-[1.2]"
            style={{ fontSize }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export const kalender = defineAnimation({
  id: 'jul-kalender',
  name: 'Kalenderlåge',
  group: 'Jul',
  timeline: kalenderTimeline,
  hold: 5,
  Component: KalenderCard,
  Scene: snowScene(colors.night, { lights: true }),
});
