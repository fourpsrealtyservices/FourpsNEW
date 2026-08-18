import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import cache, { CACHE_TTL } from '@/lib/cache';

export async function GET() {
  try {
    const cacheKey = 'testimonials:public';
    const cached = cache.get<object[]>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', 'X-Cache': 'HIT' },
      });
    }

    await dbConnect();
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1 }).lean();
    cache.set(cacheKey, testimonials, CACHE_TTL.TESTIMONIALS);

    return NextResponse.json(testimonials, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', 'X-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
