'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const router = useRouter();
  const pathname = usePathname();

  // Pages that don't require authentication
  const publicPages = ['/agent/login', '/agent/change-password'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    if (isPublicPage) {
      setAuthState('unauthenticated');
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (data.authenticated && data.role === 'agent') {
          setAuthState('authenticated');
        } else {
          setAuthState('unauthenticated');
          router.push('/agent/login');
        }
      } catch {
        setAuthState('unauthenticated');
        router.push('/agent/login');
      }
    };

    checkAuth();
  }, [pathname, isPublicPage, router]);

  // Public pages (login, register) render immediately
  if (isPublicPage) {
    return <>{children}</>;
  }

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
