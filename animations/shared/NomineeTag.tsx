'use client';

import { Tag } from '@/animations/shared/Tag';
import { Typo } from '@/app/components/typo';
import { cn } from '@/lib/utils';

type Variant = 'largeCardHalf' | 'whiteSpaceCard';

type Props = {
  title: string;
  delay: number;
  duration: number;
  variant: Variant;
  className?: string;
};

const variantClasses: Record<Variant, string> = {
  largeCardHalf: 'absolute top-12 left-12 z-10 px-8 py-4 bg-reload-primary rounded-xl',
  whiteSpaceCard:
    'bg-reload-primary px-4 py-2 text-black border border-gray-200 rounded-lg shadow-sm',
};

export const NomineeTag = ({ title, delay, duration, variant, className }: Props) => (
  <Tag
    delay={Math.max(0, delay - duration)}
    duration={duration * 1.5}
    exitDuration={duration}
    className={cn(variantClasses[variant], className)}
  >
    <Typo className="text-black uppercase text-center whitespace-nowrap">{title}</Typo>
  </Tag>
);
