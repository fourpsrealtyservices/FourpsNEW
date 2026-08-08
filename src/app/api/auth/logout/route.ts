import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('fourps_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Delete cookie
  });
  return response;
}

// GET handler for logout via anchor links (admin dashboard)
export async function GET(request: NextRequest) {
  const url = new URL('/', request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set('fourps_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Delete cookie
  });
  return response;
}
