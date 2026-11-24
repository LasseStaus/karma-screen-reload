import { exitFade, fitFontSize, Votes } from '@/animations/lab/shared';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, springs, staggerDuration, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const WORD_STAGGER = 0.07;
const HIGHLIGHT_STAGGER = 0.035;
const VOTE_STAGGER = 0.12;
const TEXT_WIDTH = 888;

const words = (nominee: KarmaNominee) => (nominee.votes[0] ?? '').split(/\s+/).filter(Boolean);

const quoteTimeline = (nominee: KarmaNominee) => {
  const count = words(nominee).length;
  return timeline({
    mark: { duration: 0.6 },
    quote: { at: '-0.3', duration: staggerDuration(count, WORD_STAGGER, 0.5) },
    highlight: { at: '+0.1', duration: staggerDuration(count, HIGHLIGHT_STAGGER, 0.3) },
    photo: { at: '-0.4', duration: 0.6 },
    name: { at: '-0.3', duration: 0.5 },
    rest: {
      at: '-0.1',
      duration: staggerDuration(Math.max(nominee.votes.length - 1, 1), VOTE_STAGGER, 0.5),
    },
  });
};

type Keys = keyof ReturnType<typeof quoteTimeline>['steps'];

function QuoteCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const rest = nominee.votes.slice(1);
  const quoteSize = fitFontSize(
    [nominee.votes[0] ?? ''],
    { width: TEXT_WIDTH, height: rest.length ? 640 : 900 },
    { max: 120, min: 40, lineHeight: 1.15 },
  );
  const restSize = fitFontSize(
    rest,
    { width: TEXT_WIDTH - 50, height: 300 },
    {
      max: 44,
      min: 24,
      gap: 16,
    },
  );

  return (
    <motion.div
      className="relative flex h-full flex-col overflow-hidden bg-reload-secondary px-[96px] pb-[96px] pt-[110px] text-black"
      exit={exitFade}
    >
      <motion.div
        className="absolute -right-[180px] -top-[180px] h-[620px] w-[620px] rounded-full bg-reload-primary"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={tl.transition('mark', { ease: easings.out })}
      />

      <motion.span
        className="relative block h-[180px] font-grotesk text-[340px] font-bold leading-[0.9]"
        initial={{ opacity: 0, y: -200, rotate: -40 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={tl.transition('mark', springs.soft)}
      >
        “
      </motion.span>

      <div className="flex flex-1 flex-col justify-center">
        <p
          className="isolate font-grotesk font-medium leading-[1.15]"
          style={{ fontSize: quoteSize }}
        >
          {words(nominee).map((word, i) => (
            <motion.span
              key={i}
              className="relative mr-[0.25em] inline-block"
              initial={{ opacity: 0, y: '0.5em', rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                delay: tl.steps.quote.start + i * WORD_STAGGER,
                duration: 0.5,
                ease: easings.out,
              }}
            >
              <motion.span
                className="absolute -left-[0.08em] -right-[0.3em] bottom-[0.06em] -z-10 h-[0.42em] origin-left bg-reload-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: tl.steps.highlight.start + i * HIGHLIGHT_STAGGER,
                  duration: 0.3,
                  ease: easings.inOut,
                }}
              />
              {word}
            </motion.span>
          ))}
        </p>

        <Votes
          votes={rest}
          start={tl.steps.rest.start}
          stagger={VOTE_STAGGER}
          marker="+"
          className="mt-[56px] space-y-[16px] font-mono leading-[1.35] text-black/70"
          style={{ fontSize: restSize }}
        />
      </div>

      <div className="mt-[48px] flex items-center gap-[44px]">
        <motion.div
          className="relative h-[240px] w-[240px] shrink-0"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={tl.transition('photo', springs.soft)}
        >
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute -inset-[22px]"
            animate={{ rotate: 360 }}
            transition={{ duration: 54, ease: 'linear', repeat: Infinity }}
          >
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="black"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
          </motion.svg>
          <img
            src={nominee.avatar_url}
            alt={nominee.full_name}
            className="h-full w-full rounded-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={tl.transition('name')}
        >
          <p className="font-grotesk text-[56px] font-bold leading-[1.05]">{nominee.full_name}</p>
          <p className="mt-[12px] font-mono text-[26px] uppercase tracking-[0.15em]">
            {nominee.title} · uge {nominee.week}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export const quote = defineAnimation({
  id: 'lab-quote',
  name: 'Quote first',
  group: 'Lab',
  timeline: quoteTimeline,
  hold: 5,
  Component: QuoteCard,
});
