'use client';

import { NomineeTag } from '@/animations/shared/NomineeTag';
import { VoteItem } from '@/animations/shared/VoteItem';
import type { SlideProps } from '@/animations/types';
import { Typo } from '@/app/components/typo';
import { springs, timeline, variants } from '@/lib/motion';
import { motion, type Variants } from 'motion/react';

export const largeCardHalfTimeline = () =>
  timeline({
    tag: { at: 0, duration: 0.3 },
    tagText: { at: 0.3, duration: 0.3 },
    content: { at: 0.4, duration: 0.6 },
    image: { at: 1.2, duration: 0.6 },
    panel: { at: '<', duration: 0.6 },
  });

type Keys = keyof ReturnType<typeof largeCardHalfTimeline>['steps'];

export default function LargeCardHalf({ nominee, timeline: tl }: SlideProps<Keys>) {
  const fadeIn = (key: 'image' | 'panel') => ({
    initial: { opacity: 0 },
    animate: { opacity: 1, y: 0, transition: tl.transition(key, springs.default) },
    exit: {
      opacity: 0,
      transition: { duration: tl.steps.tag.duration, delay: tl.steps[key].start },
    },
  });

  const content: Variants = {
    ...variants.container,
    visible: {
      opacity: 1,
      y: 0,
      transition: { when: 'beforeChildren', staggerChildren: 0.1, delay: tl.steps.content.start },
    },
  };

  return (
    <div className="w-full h-full relative bg-black text-white overflow-hidden grid grid-rows-[minmax(200px,1fr)_minmax(50%,auto)]">
      <NomineeTag
        title={nominee.title}
        delay={tl.steps.tagText.start}
        duration={tl.steps.tag.duration}
        variant="largeCardHalf"
      />

      <motion.img
        src={nominee.avatar_url}
        alt={nominee.full_name}
        className="object-cover h-full w-full"
        {...fadeIn('image')}
      />

      <motion.div
        className="bg-reload-secondary flex flex-col px-12 py-8 text-black overflow-auto space-y-10"
        {...fadeIn('panel')}
      >
        <motion.div variants={content} initial="hidden" animate="visible" exit="exit">
          <motion.div variants={variants.item}>
            <Typo as="h1" font={'grotesk'} variant="xlarge" weight={500} className="mb-6">
              {nominee.full_name}
            </Typo>
          </motion.div>

          <motion.div variants={content} className="space-y-4">
            {nominee.votes.map((vote, i) => (
              <VoteItem key={i} text={vote} />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-auto flex justify-between items-center"
          variants={content}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Typo variant={'small'} weight={700} className="uppercase">
            Uge {nominee.week}
          </Typo>
          <Typo variant={'small'} weight={700} className="uppercase">
            kollegerne siger
          </Typo>
        </motion.div>
      </motion.div>
    </div>
  );
}
