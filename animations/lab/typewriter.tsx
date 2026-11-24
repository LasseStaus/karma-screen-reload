import { CountUp, exitFade, fitFontSize, GLYPH_WIDTH, Typewriter } from '@/animations/lab/shared';
import { Tag } from '@/animations/shared/Tag';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { springs, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const NAME_PER_CHAR = 0.05;
const VOTE_PER_CHAR = 0.028;
const VOTE_GAP = 28;
const VOTES_BOX = { width: 920 - 56, height: 520 };

const totalChars = (votes: string[]) => votes.reduce((sum, vote) => sum + vote.length, 0);

const typewriterTimeline = (nominee: KarmaNominee) =>
  timeline({
    week: { duration: 1 },
    photo: { at: '-0.6', duration: 0.8 },
    name: { at: '-0.2', duration: nominee.full_name.length * NAME_PER_CHAR },
    title: { at: '<', duration: 0.4 },
    votes: { at: '+0.2', duration: totalChars(nominee.votes) * VOTE_PER_CHAR },
  });

type Keys = keyof ReturnType<typeof typewriterTimeline>['steps'];

function TypewriterCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const fontSize = fitFontSize(nominee.votes, VOTES_BOX, {
    max: 76,
    min: 30,
    glyph: GLYPH_WIDTH.mono,
    lineHeight: 1.3,
    gap: VOTE_GAP,
  });
  let offset = tl.steps.votes.start;

  return (
    <motion.div
      className="relative flex h-full flex-col bg-reload-primary px-[80px] pb-[80px] pt-[88px] text-black"
      exit={exitFade}
    >
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[32px] uppercase tracking-[0.3em]">Uge</p>
          <p className="font-grotesk text-[260px] font-bold leading-[0.85] tabular-nums">
            <CountUp
              to={nominee.week}
              delay={tl.steps.week.start}
              duration={tl.steps.week.duration}
            />
          </p>
        </div>
        <Tag
          delay={tl.steps.title.start}
          duration={0.6}
          className="mb-[16px] bg-black px-[20px] py-[8px] font-mono text-[30px] uppercase text-reload-primary"
        >
          {nominee.title}
        </Tag>
      </div>

      <h1 className="mt-[32px] min-h-[1.1em] font-mono text-[56px] font-bold leading-[1.1]">
        <Typewriter
          text={nominee.full_name}
          start={tl.steps.name.start}
          perChar={NAME_PER_CHAR}
          cursor={false}
        />
      </h1>

      <div className="flex flex-1 items-center">
        <div className="w-full font-mono leading-[1.3]" style={{ fontSize }}>
          {nominee.votes.map((vote, i) => {
            const start = offset;
            offset += vote.length * VOTE_PER_CHAR;
            return (
              <p
                key={i}
                className="relative pl-[1.2em]"
                style={{ marginTop: i === 0 ? 0 : VOTE_GAP }}
              >
                <motion.span
                  className="absolute left-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: start, duration: 0 }}
                >
                  ›
                </motion.span>
                <Typewriter
                  text={vote}
                  start={start}
                  perChar={VOTE_PER_CHAR}
                  cursor={i === nominee.votes.length - 1}
                />
              </p>
            );
          })}
        </div>
      </div>

      <motion.div
        className="h-[720px] shrink-0 border-[10px] border-black bg-black"
        initial={{ opacity: 0, y: 500, rotate: 6 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={tl.transition('photo', springs.soft)}
      >
        <img
          src={nominee.avatar_url}
          alt={nominee.full_name}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

export const typewriter = defineAnimation({
  id: 'lab-typewriter',
  name: 'Typewriter',
  group: 'Lab',
  timeline: typewriterTimeline,
  hold: 5,
  Component: TypewriterCard,
});
