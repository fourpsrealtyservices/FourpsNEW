import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
}

async function verifyTokenRole(token: string, expectedRole: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === expectedRole;
  } catch (err) {
    console.error('[Proxy] Token verification failed for role:', expectedRole, err);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('fourps_token')?.value;

  // Only protect API routes - page auth is handled client-side inline
  // Admin API routes protection
  if (pathname.startsWith('/api/admin')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isAdmin = await verifyTokenRole(token, 'admin');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Agent API routes protection
  if (pathname.startsWith('/api/agent')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isAgent = await verifyTokenRole(token, 'agent');
    if (!isAgent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/agent/:path*',
  ],
};
