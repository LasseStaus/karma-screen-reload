import {
  exitFadeAfter,
  fallExitEnd,
  fallOut,
  fitFontSize,
  GLYPH_WIDTH,
  liftOut,
} from '@/animations/lab/shared';
import { Tag } from '@/animations/shared/Tag';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { springs, staggerDuration, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const NOTE_STAGGER = 0.25;
const NOTE_ROTATIONS = [-3, 2.5, -1.5, 3, -2.5, 1.5];
const NOTES_AREA = { width: 936, height: 760 };
const GAP = 32;

function noteLayout(count: number) {
  if (count === 1) return { width: NOTES_AREA.width - 40, minHeight: 600, padding: 56 };
  const rows = Math.ceil(count / 2);
  const width = (NOTES_AREA.width - GAP) / 2;
  const minHeight = count === 2 ? 520 : (NOTES_AREA.height - GAP * (rows - 1)) / rows;
  return { width, minHeight, padding: 36 };
}

const notesTimeline = (nominee: KarmaNominee) =>
  timeline({
    tag: { duration: 0.6 },
    photo: { at: '-0.1', duration: 0.8 },
    name: { at: '-0.3', duration: 0.5 },
    notes: { at: '-0.1', duration: staggerDuration(nominee.votes.length, NOTE_STAGGER, 0.6) },
  });

type Keys = keyof ReturnType<typeof notesTimeline>['steps'];

function NotesCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const layout = noteLayout(nominee.votes.length);
  const box = {
    width: layout.width - layout.padding * 2,
    height: layout.minHeight - layout.padding * 2,
  };
  const fontSize = Math.min(
    ...nominee.votes.map((vote) =>
      fitFontSize([vote], box, { max: 120, min: 28, glyph: GLYPH_WIDTH.hand, lineHeight: 1.1 }),
    ),
  );

  return (
    <motion.div
      className="flex h-full flex-col items-center bg-reload-secondary px-[72px] py-[80px] text-black"
      exit={exitFadeAfter(fallExitEnd(nominee.votes.length + 1) - 0.2)}
    >
      <Tag
        delay={tl.steps.tag.start}
        duration={tl.steps.tag.duration}
        className="self-start rounded-[12px] bg-reload-primary px-[24px] py-[10px] font-mono text-[28px] uppercase"
      >
        {nominee.title} · uge {nominee.week}
      </Tag>

      <motion.figure
        className="mt-[40px] bg-white p-[24px] pb-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        style={{ width: nominee.votes.length === 1 ? 780 : 660 }}
        initial={{ opacity: 0, y: -240, rotate: -14 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        exit={liftOut({ rotate: -3 })}
        transition={tl.transition('photo', springs.soft)}
      >
        <img
          src={nominee.avatar_url}
          alt={nominee.full_name}
          className="aspect-square w-full object-cover"
        />
        <motion.figcaption
          className="pt-[20px] text-center font-hand text-[64px] leading-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={tl.transition('name')}
        >
          {nominee.full_name}
        </motion.figcaption>
      </motion.figure>

      <div
        className="mt-auto flex flex-wrap content-center justify-center"
        style={{ gap: GAP, width: NOTES_AREA.width, minHeight: NOTES_AREA.height }}
      >
        {nominee.votes.map((vote, i) => {
          const rotate = NOTE_ROTATIONS[i % NOTE_ROTATIONS.length];
          return (
            <motion.div
              key={i}
              className="flex items-center bg-reload-primary font-hand leading-[1.1] shadow-[0_12px_30px_rgba(0,0,0,0.15)]"
              style={{
                width: layout.width,
                minHeight: layout.minHeight,
                padding: layout.padding,
                fontSize,
              }}
              initial={{ opacity: 0, scale: 1.4, y: -80, rotate: rotate * 4 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate }}
              exit={fallOut({ order: i + 1, rotate })}
              transition={{
                ...springs.soft,
                visualDuration: 0.6,
                delay: tl.steps.notes.start + i * NOTE_STAGGER,
              }}
            >
              {vote}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export const notes = defineAnimation({
  id: 'lab-notes',
  name: 'Sticky notes',
  group: 'Lab · Polaroid',
  timeline: notesTimeline,
  hold: 5,
  Component: NotesCard,
});
