import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Locality from '@/models/Locality';
import cache, { CACHE_TTL } from '@/lib/cache';

// GET localities (public - filtered by city)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const cacheKey = `localities:${city || 'all'}`;

    const cached = cache.get<object[]>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', 'X-Cache': 'HIT' },
      });
    }

    await dbConnect();
    const filter: Record<string, unknown> = { isActive: true };
    if (city) filter.city = city;
    const localities = await Locality.find(filter).sort({ name: 1 }).lean();
    cache.set(cacheKey, localities, CACHE_TTL.LOCALITIES);

    return NextResponse.json(localities, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', 'X-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('Error fetching localities:', error);
    return NextResponse.json({ error: 'Failed to fetch localities' }, { status: 500 });
  }
}
