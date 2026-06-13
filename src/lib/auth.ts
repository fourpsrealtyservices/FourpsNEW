import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function getJwtSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
}

export interface TokenPayload {
  id: string;
  role: 'admin' | 'agent';
  name?: string;
  phone?: string;
}

export async function createToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d') // Persistent session - never expires (until logout)
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('fourps_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getAdminSession(): Promise<TokenPayload | null> {
  const session = await getSession();
  if (!session || session.role !== 'admin') return null;
  return session;
}

export async function getAgentSession(): Promise<TokenPayload | null> {
  const session = await getSession();
  if (!session || session.role !== 'agent') return null;
  return session;
}
