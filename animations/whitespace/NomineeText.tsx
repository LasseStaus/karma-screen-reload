import { VoteItem } from '@/animations/shared/VoteItem';
import type { SlideProps } from '@/animations/types';
import { VOTE_DURATION, VOTE_STAGGER, type WhitespaceKeys } from '@/animations/whitespace/timeline';
import { easings } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { motion, type Variants } from 'motion/react';

type Props = SlideProps<WhitespaceKeys> & { className?: string };

export const NomineeText = ({ nominee, timeline: tl, className }: Props) => {
  const list: Variants = {
    hidden: {},
    visible: {
      transition: { delayChildren: tl.steps.votes.start, staggerChildren: VOTE_STAGGER },
    },
  };

  return (
    <motion.div
      className={cn('text-black space-y-4', className)}
      variants={list}
      initial="hidden"
      animate="visible"
    >
      {nominee.votes.map((vote, i) => (
        <VoteItem key={i} text={vote} transition={{ duration: VOTE_DURATION, ease: easings.out }} />
      ))}
    </motion.div>
  );
};
