'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AgentLoginRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/agent'); }, [router]);
  return null;
}
