import LargeCardHalf, { largeCardHalfTimeline } from '@/animations/large-card-half/LargeCardHalf';
import { defineAnimation } from '@/animations/types';

export const largeCardHalf = defineAnimation({
  id: 'large-card-half',
  name: 'Large card (half)',
  timeline: largeCardHalfTimeline,
  hold: 4.7,
  Component: LargeCardHalf,
});
