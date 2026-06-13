'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ApprovalsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/addddmin/properties?status=pending');
  }, [router]);
  return <p className="p-8 text-gray-500">Redirecting to pending approvals...</p>;
}
