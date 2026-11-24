import {
  exitFade,
  fitFontSize,
  Float,
  HighlightQuote,
  quoteWords,
  SlowZoom,
  Votes,
} from '@/animations/lab/shared';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, springs, staggerDuration, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const WORD_STAGGER = 0.07;
const HIGHLIGHT_STAGGER = 0.035;
const VOTE_STAGGER = 0.12;
const PHOTO = 580;
const HOLD = 5;

const quotePortraitTimeline = (nominee: KarmaNominee) => {
  const count = quoteWords(nominee.votes[0] ?? '').length;
  return timeline({
    blob: { duration: 0.6 },
    photo: { at: '-0.4', duration: 0.7 },
    name: { at: '-0.3', duration: 0.5 },
    mark: { at: '-0.2', duration: 0.5 },
    quote: { at: '-0.2', duration: staggerDuration(count, WORD_STAGGER, 0.5) },
    highlight: { at: '+0.1', duration: staggerDuration(count, HIGHLIGHT_STAGGER, 0.3) },
    rest: {
      at: '-0.3',
      duration: staggerDuration(Math.max(nominee.votes.length - 1, 1), VOTE_STAGGER, 0.5),
    },
  });
};

type Keys = keyof ReturnType<typeof quotePortraitTimeline>['steps'];

function QuotePortraitCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  const rest = nominee.votes.slice(1);
  const quoteSize = fitFontSize(
    [nominee.votes[0] ?? ''],
    { width: 888, height: rest.length ? 460 : 640 },
    { max: 104, min: 36, lineHeight: 1.15 },
  );
  const restSize = fitFontSize(rest, { width: 838, height: 200 }, { max: 38, min: 22, gap: 12 });

  return (
    <motion.div
      className="relative flex h-full flex-col overflow-hidden bg-reload-secondary px-[96px] pb-[96px] pt-[110px] text-black"
      exit={exitFade}
    >
      <motion.div
        className="absolute -left-[160px] -top-[140px] h-[820px] w-[820px]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={tl.transition('blob', { ease: easings.out })}
      >
        <Float
          y={14}
          scale={0.04}
          duration={9}
          className="h-full w-full rounded-full bg-reload-primary"
        />
      </motion.div>

      <div className="relative flex items-start justify-between">
        <motion.div
          className="relative shrink-0"
          style={{ width: PHOTO, height: PHOTO }}
          initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={tl.transition('photo', springs.soft)}
        >
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute -inset-[30px]"
            animate={{ rotate: 360 }}
            transition={{ duration: 54, ease: 'linear', repeat: Infinity }}
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="black"
              strokeWidth="0.8"
              strokeDasharray="3 2.4"
            />
          </motion.svg>
          <div className="h-full w-full overflow-hidden rounded-full">
            <SlowZoom
              src={nominee.avatar_url}
              alt={nominee.full_name}
              duration={tl.end + HOLD}
              from={1.15}
              drift={0}
            />
          </div>
        </motion.div>

        <Float y={12} rotate={-3} duration={6} className="mr-[-12px] mt-[300px]">
          <motion.span
            className="block h-[150px] font-grotesk text-[300px] font-bold leading-[0.9]"
            initial={{ opacity: 0, y: -120, rotate: -30 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={tl.transition('mark', springs.soft)}
          >
            ”
          </motion.span>
        </Float>
      </div>

      <motion.div
        className="relative mt-[56px]"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={tl.transition('name')}
      >
        <p className="font-grotesk text-[84px] font-bold leading-[1.02]">{nominee.full_name}</p>
        <p className="mt-[14px] font-mono text-[28px] uppercase">
          {nominee.title} · uge {nominee.week}
        </p>
      </motion.div>

      <div className="flex flex-1 flex-col justify-center">
        <HighlightQuote
          text={nominee.votes[0] ?? ''}
          start={tl.steps.quote.start}
          wordStagger={WORD_STAGGER}
          highlightStart={tl.steps.highlight.start}
          highlightStagger={HIGHLIGHT_STAGGER}
          className="font-grotesk font-medium leading-[1.15]"
          style={{ fontSize: quoteSize }}
        />
        <Votes
          votes={rest}
          start={tl.steps.rest.start}
          stagger={VOTE_STAGGER}
          marker="+"
          className="mt-[40px] space-y-[12px] font-mono leading-[1.35] text-black/70"
          style={{ fontSize: restSize }}
        />
      </div>
    </motion.div>
  );
}

export const quotePortrait = defineAnimation({
  id: 'lab-quote-portrait',
  name: 'Quote · portræt',
  group: 'Lab',
  timeline: quotePortraitTimeline,
  hold: HOLD,
  Component: QuotePortraitCard,
});
