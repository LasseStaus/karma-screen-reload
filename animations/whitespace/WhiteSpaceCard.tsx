'use client';

import { NomineeTag } from '@/animations/shared/NomineeTag';
import type { SlideProps } from '@/animations/types';
import { NomineeCard } from '@/animations/whitespace/NomineeCard';
import { NomineeText } from '@/animations/whitespace/NomineeText';
import type { WhitespaceKeys } from '@/animations/whitespace/timeline';
import { easings } from '@/lib/motion';
import { motion } from 'motion/react';

export default function WhiteSpaceCard({ nominee, timeline: tl }: SlideProps<WhitespaceKeys>) {
  return (
    <motion.div
      className="bg-reload-secondary text-black flex flex-col gap-12 py-12 px-8 h-full"
      exit={{ opacity: 0, transition: { duration: 0.5, ease: easings.inOut } }}
    >
      <div>
        <NomineeTag
          title={'Karma'}
          delay={tl.steps.tagText.start}
          duration={tl.steps.tag.duration}
          variant="whiteSpaceCard"
          className="mb-12"
        />
        <NomineeCard nominee={nominee} timeline={tl} />
      </div>
      <NomineeText nominee={nominee} timeline={tl} className="mt-auto" />
    </motion.div>
  );
}
