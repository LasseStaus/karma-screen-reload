import { defineAnimation } from '@/animations/types';
import { whitespaceTimeline } from '@/animations/whitespace/timeline';
import WhiteSpaceCard from '@/animations/whitespace/WhiteSpaceCard';

export const whitespace = defineAnimation({
  id: 'whitespace',
  name: 'Whitespace',
  timeline: whitespaceTimeline,
  hold: 6,
  Component: WhiteSpaceCard,
});
