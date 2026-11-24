'use client';

import type { KarmaAnimation } from '@/animations/types';
import { usePreloadedImages } from '@/lib/preload';
import type { KarmaNominee } from '@/types';
import { AnimatePresence } from 'motion/react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

type SlideProps = {
  animation: KarmaAnimation;
  nominee: KarmaNominee;
  onDone?: () => void;
};

function Slide({ animation, nominee, onDone }: SlideProps) {
  const timeline = useMemo(() => animation.timeline(nominee), [animation, nominee]);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const id = setTimeout(() => onDoneRef.current?.(), (timeline.end + animation.hold) * 1000);
    return () => clearTimeout(id);
  }, [timeline, animation.hold]);

  return <animation.Component nominee={nominee} timeline={timeline} />;
}

type SlidePlayerProps = SlideProps & { slideKey: string | number };

export function SlidePlayer({ slideKey, ...props }: SlidePlayerProps) {
  const Scene = props.animation.Scene ?? Fragment;
  return (
    <Scene>
      <AnimatePresence mode="wait">
        <Slide key={slideKey} {...props} />
      </AnimatePresence>
    </Scene>
  );
}

type SlideshowProps = {
  animations: KarmaAnimation[];
  nominees: KarmaNominee[];
};

export default function Slideshow({ animations, nominees }: SlideshowProps) {
  const [step, setStep] = useState(0);
  const ready = usePreloadedImages(nominees.map((n) => n.avatar_url));
  const nominee = nominees[step % nominees.length];
  const animation = animations[step % animations.length];

  if (!ready) return null;

  return (
    <SlidePlayer
      slideKey={step}
      animation={animation}
      nominee={nominee}
      onDone={() => setStep((s) => s + 1)}
    />
  );
}
