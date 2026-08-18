import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import City from '@/models/City';
import cache, { CACHE_TTL } from '@/lib/cache';

// GET public cities (active + coming_soon, not hidden)
export async function GET() {
  try {
    const cacheKey = 'cities:public';
    const cached = cache.get<object[]>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', 'X-Cache': 'HIT' },
      });
    }

    await dbConnect();
    const cities = await City.find({ status: { $ne: 'hidden' } }).sort({ displayOrder: 1 }).lean();
    cache.set(cacheKey, cities, CACHE_TTL.CITIES);

    return NextResponse.json(cities, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', 'X-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
