'use client';

import { DEFAULT_ANIMATION_ID, getAnimation } from '@/animations/registry';
import FpsMeter from '@/app/components/FpsMeter';
import Slideshow from '@/app/components/Slideshow';
import TvCanvas from '@/app/components/TvCanvas';
import { Typo } from '@/app/components/typo';
import { useNominees, type DataSource } from '@/lib/nominees';
import { useEffect, useState } from 'react';

export default function Page() {
  const [source, setSource] = useState<DataSource | null>(null);
  const { nominees } = useNominees(source);
  const [animationIds, setAnimationIds] = useState([DEFAULT_ANIMATION_ID]);
  const [showFps, setShowFps] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('animation');
    if (requested) setAnimationIds(requested.split(',').filter(Boolean));
    setShowFps(params.has('fps'));
    setSource(params.get('data') === 'test' ? 'test' : 'live');
  }, []);

  return (
    <main className="h-screen w-screen">
      {showFps && <FpsMeter />}
      <TvCanvas fit="width">
        {nominees?.length === 0 && (
          <div className="h-full flex items-center justify-center bg-reload-secondary">
            <Typo className="text-center" variant={'large'} font={'grotesk'}>
              Der er ingen nominerede i øjeblikket!
            </Typo>
          </div>
        )}
        {nominees && nominees.length > 0 && (
          <Slideshow animations={animationIds.map(getAnimation)} nominees={nominees} />
        )}
      </TvCanvas>
    </main>
  );
}
