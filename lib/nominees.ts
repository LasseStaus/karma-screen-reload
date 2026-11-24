'use client';

import { testKings } from '@/lib/data';
import type { KarmaNominee } from '@/types';
import { useEffect, useState } from 'react';

export const LATEST_KINGS_URL = 'https://europe-west1-karma-26309.cloudfunctions.net/latestKings';

export type DataSource = 'live' | 'test';

export async function fetchLatestNominees(): Promise<KarmaNominee[]> {
  const res = await fetch(LATEST_KINGS_URL);
  if (!res.ok) throw new Error(`Status ${res.status}`);
  const json = await res.json();
  delete json.week;
  delete json.year;
  return Object.values(json) as KarmaNominee[];
}

export function useNominees(source: DataSource | null) {
  const [nominees, setNominees] = useState<KarmaNominee[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!source) return;
    if (source === 'test') {
      setNominees(testKings);
      setError(null);
      return;
    }

    let cancelled = false;
    setNominees(null);
    fetchLatestNominees()
      .then((data) => {
        if (cancelled) return;
        setNominees(data);
        setError(null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.error('Error fetching data:', err.message);
        setError(err.message);
        setNominees([]);
      });

    return () => {
      cancelled = true;
    };
  }, [source]);

  return { nominees, error };
}
