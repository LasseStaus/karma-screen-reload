import { exitFade, Votes } from '@/animations/lab/shared';
import { defineAnimation, type SlideProps } from '@/animations/types';
import { easings, staggerDuration, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import { motion } from 'motion/react';

const VOTE_STAGGER = 0.12;

const wipeTimeline = (nominee: KarmaNominee) =>
  timeline({
    wipe: { duration: 0.6 },
    photo: { at: '-0.15', duration: 0.9 },
    title: { at: '-0.4', duration: 0.4 },
    name: { at: '-0.2', duration: 0.6 },
    votes: { at: '-0.2', duration: staggerDuration(nominee.votes.length, VOTE_STAGGER, 0.5) },
  });

type Keys = keyof ReturnType<typeof wipeTimeline>['steps'];

function WipeCard({ nominee, timeline: tl }: SlideProps<Keys>) {
  return (
    <motion.div className="relative h-full overflow-hidden bg-black" exit={exitFade}>
      <motion.div
        className="absolute inset-0 origin-left bg-reload-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={tl.transition('wipe', { ease: easings.inOut })}
      />

      <motion.div
        className="absolute inset-x-0 top-0 h-[1080px] overflow-hidden"
        initial={{ y: '-100%' }}
        animate={{ y: '0%' }}
        transition={tl.transition('photo', { ease: easings.inOut })}
      >
        <motion.div
          className="h-full w-full"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          transition={tl.transition('photo', { ease: easings.inOut })}
        >
          <motion.img
            src={nominee.avatar_url}
            alt={nominee.full_name}
            className="h-full w-full object-cover"
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            transition={tl.transition('photo')}
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 top-[1080px] flex flex-col px-[72px] py-[64px] text-black">
        <motion.p
          className="font-mono text-[28px] uppercase tracking-[0.2em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tl.transition('title')}
        >
          {nominee.title} · uge {nominee.week}
        </motion.p>

        <div className="mt-[12px] overflow-hidden">
          <motion.h1
            className="font-grotesk text-[96px] font-bold leading-[1.05]"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={tl.transition('name')}
          >
            {nominee.full_name}
          </motion.h1>
        </div>

        <Votes
          votes={nominee.votes}
          start={tl.steps.votes.start}
          stagger={VOTE_STAGGER}
          marker="→"
          className="mt-[56px] space-y-[20px] font-mono text-[30px] leading-[1.4]"
        />
      </div>
    </motion.div>
  );
}

export const wipe = defineAnimation({
  id: 'lab-wipe',
  name: 'Wipe',
  group: 'Lab',
  timeline: wipeTimeline,
  hold: 5,
  Component: WipeCard,
});
