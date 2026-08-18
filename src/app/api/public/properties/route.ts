import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import cache, { CACHE_TTL } from '@/lib/cache';

// GET published properties (public - no sensitive data)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const transactionType = searchParams.get('transactionType');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'latest';

    // Build cache key from query params
    const cacheKey = `properties:${city || ''}:${transactionType || ''}:${category || ''}:${search || ''}:${sort}`;

    // Check cache first
    const cached = cache.get<object[]>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'X-Cache': 'HIT',
        },
      });
    }

    await dbConnect();

    const filter: Record<string, unknown> = { status: 'published' };
    if (city) filter.city = city;
    if (transactionType) filter.transactionType = transactionType;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { locationArea: { $regex: search, $options: 'i' } },
        { propertyId: { $regex: search, $options: 'i' } },
        { 'fields.locationArea.value': { $regex: search, $options: 'i' } },
        { nearbyAreas: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price_low') sortOption = { 'fields.expectedRent.value': 1 };
    if (sort === 'price_high') sortOption = { 'fields.expectedRent.value': -1 };

    const properties = await Property.find(filter)
      .select('-locationPin -contactName -contactMobile -contactDesignation -remarks')
      .sort(sortOption)
      .limit(50)
      .lean();

    // Store in cache
    cache.set(cacheKey, properties, CACHE_TTL.PROPERTIES_LIST);

    return NextResponse.json(properties, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error fetching public properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
