'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PlaygroundRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/preview');
  }, [router]);

  return null;
}
