import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import cache, { CACHE_TTL } from '@/lib/cache';
import { verifyToken } from '@/lib/auth';

// GET single published property by propertyId (e.g. FP-L-OFC-0042)
// Supports ?preview=true for admin to preview unpublished/pending properties
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isPreview = request.nextUrl.searchParams.get('preview') === 'true';

    // Admin preview mode: allow viewing any property regardless of status
    if (isPreview) {
      const token = request.cookies.get('fourps_token')?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload && payload.role === 'admin') {
          await dbConnect();
          let property = await Property.findOne({ propertyId: id })
            .select('-locationPin -contactName -contactMobile -contactDesignation -remarks')
            .lean();
          if (!property) {
            property = await Property.findOne({ _id: id })
              .select('-locationPin -contactName -contactMobile -contactDesignation -remarks')
              .lean();
          }
          if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
          }
          return NextResponse.json({ ...(property as object), _preview: true });
        }
      }
    }

    const cacheKey = `property:${id}`;

    // Check cache first
    const cached = cache.get<object>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'X-Cache': 'HIT',
        },
      });
    }

    await dbConnect();

    // Try to find by propertyId first, then by MongoDB _id
    let property = await Property.findOne({ propertyId: id, status: 'published' })
      .select('-locationPin -contactName -contactMobile -contactDesignation -remarks')
      .lean();

    if (!property) {
      property = await Property.findOne({ _id: id, status: 'published' })
        .select('-locationPin -contactName -contactMobile -contactDesignation -remarks')
        .lean();
    }

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if ((property as Record<string, unknown>).soldOut) {
      return NextResponse.json({ error: 'This property has been sold out', soldOut: true }, { status: 410 });
    }

    // Store in cache
    cache.set(cacheKey, property, CACHE_TTL.PROPERTY_DETAIL);

    return NextResponse.json(property, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}
