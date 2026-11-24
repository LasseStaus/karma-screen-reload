import type { Timeline } from '@/lib/motion';
import type { KarmaNominee } from '@/types';
import type { ComponentType, ReactNode } from 'react';

export type SlideProps<K extends string = string> = {
  nominee: KarmaNominee;
  timeline: Timeline<K>;
};

export type KarmaAnimation<K extends string = string> = {
  id: string;
  name: string;
  group?: string;
  timeline: (nominee: KarmaNominee) => Timeline<K>;
  hold: number;
  Component: ComponentType<SlideProps<K>>;
  Scene?: ComponentType<{ children: ReactNode }>;
};

export function defineAnimation<K extends string>(animation: KarmaAnimation<K>): KarmaAnimation {
  return animation as unknown as KarmaAnimation;
}
