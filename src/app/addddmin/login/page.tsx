'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLoginRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/addddmin'); }, [router]);
  return null;
}
