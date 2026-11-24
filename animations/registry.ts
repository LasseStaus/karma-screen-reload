import { christmasAnimations } from '@/animations/christmas';
import { labAnimations } from '@/animations/lab';
import { largeCardHalf } from '@/animations/large-card-half';
import type { KarmaAnimation } from '@/animations/types';
import { whitespace } from '@/animations/whitespace';

export const animations: KarmaAnimation[] = [
  largeCardHalf,
  whitespace,
  ...labAnimations,
  ...christmasAnimations,
];

export const DEFAULT_ANIMATION_ID = largeCardHalf.id;

export function getAnimation(id: string | null | undefined): KarmaAnimation {
  return (
    animations.find((animation) => animation.id === id) ??
    animations.find((animation) => animation.id === DEFAULT_ANIMATION_ID)!
  );
}

export function groupAnimations(list: KarmaAnimation[] = animations) {
  const groups = new Map<string, KarmaAnimation[]>();
  for (const animation of list) {
    const group = animation.group ?? 'Skærm';
    groups.set(group, [...(groups.get(group) ?? []), animation]);
  }
  return [...groups.entries()];
}
