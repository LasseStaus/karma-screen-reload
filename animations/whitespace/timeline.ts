import { staggerDuration, timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';

export const VOTE_STAGGER = 0.15;
export const VOTE_DURATION = 0.4;

export const whitespaceTimeline = (nominee: KarmaNominee) =>
  timeline({
    tag: { duration: 0.4 },
    tagText: { at: '-0.1', duration: 0.3 },
    image: { at: '-0.2', duration: 0.8 },
    name: { at: '-0.4', duration: 0.6 },
    meta: { at: '<', duration: 0.4 },
    votes: {
      at: '-0.2',
      duration: staggerDuration(nominee.votes.length, VOTE_STAGGER, VOTE_DURATION),
    },
  });

export type WhitespaceKeys = keyof ReturnType<typeof whitespaceTimeline>['steps'];
