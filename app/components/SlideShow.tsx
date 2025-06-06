'use client';

import LargeCardHalf from '@/app/components/Cards/LargeCardHalf';
import { KarmaNominee } from '@/types';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Must include the duration of animation durations & delays.
const SLIDE_DURATION = 10000;

type Props = {
  data: KarmaNominee[];
};

export default function KarmaSlideshow({ data }: Props) {
  const [index, setIndex] = useState(0);
  const [visibleKey, setVisibleKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
      setVisibleKey((k) => k + 1);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [data.length]);

  const current = data[index];

  return (
    <>
      <AnimatePresence mode="wait">
        <LargeCardHalf key={visibleKey} nominee={current} />
      </AnimatePresence>
    </>
  );
}
