import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('fourps_token')?.value;
  
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return NextResponse.json({ 
      authenticated: true, 
      role: payload.role,
      name: payload.name,
    });
  } catch (err: unknown) {
    console.error('Auth check failed:', err);
    return NextResponse.json({ authenticated: false });
  }
}
