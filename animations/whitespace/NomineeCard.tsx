import type { SlideProps } from '@/animations/types';
import type { WhitespaceKeys } from '@/animations/whitespace/timeline';
import { Typo } from '@/app/components/typo';
import { springs } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

type Props = SlideProps<WhitespaceKeys> & { className?: string };

export const NomineeCard = ({ nominee, timeline: tl, className }: Props) => (
  <div className={cn('grid grid-cols-[1fr_min-content] gap-x-8 text-black', className)}>
    <div>
      <div className="overflow-hidden">
        <motion.img
          src={nominee.avatar_url}
          alt={nominee.full_name}
          className="w-full"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={tl.transition('image')}
        />
      </div>
      <motion.div
        className="mt-8 flex justify-between items-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={tl.transition('meta')}
      >
        <Typo variant={'small'} weight={700} className="uppercase">
          Uge {nominee.week}
        </Typo>
        <Typo variant={'small'} weight={700} className="uppercase">
          kollegerne siger
        </Typo>
      </motion.div>
    </div>
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={tl.transition('name', springs.soft)}
    >
      <Typo className="writing-vertical" font={'grotesk'} variant={'xlarge'}>
        {nominee.full_name}
      </Typo>
    </motion.div>
  </div>
);
