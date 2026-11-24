'use client';

import { easings } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay: number;
  duration?: number;
  exitDuration?: number;
  className?: string;
};

export function Tag({ children, delay, duration = 0.5, exitDuration = 0.35, className }: Props) {
  return (
    <motion.div
      className={cn('inline-block whitespace-nowrap', className)}
      initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
      animate={{
        clipPath: 'inset(0% 0% 0% 0%)',
        transition: { delay, duration, ease: easings.inOut },
      }}
      exit={{
        clipPath: 'inset(0% 0% 0% 100%)',
        transition: { duration: exitDuration, ease: easings.inOut },
      }}
    >
      <motion.span
        className="block"
        initial={{ opacity: 0, x: '-0.5em' }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            delay: delay + duration * 0.4,
            duration: duration * 0.9,
            ease: easings.out,
          },
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}
