import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Insight from '@/models/Insight';
import cache, { CACHE_TTL } from '@/lib/cache';

export async function GET() {
  try {
    const cacheKey = 'insights:public';
    const cached = cache.get<object[]>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300', 'X-Cache': 'HIT' },
      });
    }

    await dbConnect();
    const insights = await Insight.find({ isActive: true }).sort({ order: 1 }).lean();
    cache.set(cacheKey, insights, CACHE_TTL.INSIGHTS);

    return NextResponse.json(insights, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300', 'X-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
