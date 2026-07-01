import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { generatePropertyId } from '@/lib/propertyId';

// GET all properties (admin sees everything)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const transactionType = searchParams.get('transactionType');

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (city) filter.city = city;
    if (category) filter.category = category;
    if (transactionType) filter.transactionType = transactionType;

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// POST create new property
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { city, transactionType, category, officeType, fields, nearbyAreas, locationPin, contactName, contactMobile, contactDesignation, photos, status: requestedStatus } = body;

    if (!city || !transactionType || !category) {
      return NextResponse.json(
        { error: 'City, transaction type, and category are required' },
        { status: 400 }
      );
    }

    // Generate unique property ID
    const { propertyId, propertyNumber } = await generatePropertyId(transactionType, category);

    const property = await Property.create({
      propertyId,
      propertyNumber,
      city,
      transactionType,
      category,
      officeType: category === 'office' ? officeType : undefined,
      fields: fields || {},
      locationArea: fields?.locationArea?.value || '',
      description: fields?.description?.value || '',
      nearbyAreas: nearbyAreas || [],
      locationPin,
      contactName,
      contactMobile,
      contactDesignation,
      photos: photos || [],
      status: requestedStatus || 'published',
      publishedAt: requestedStatus === 'draft' ? undefined : new Date(),
      submittedBy: {
        type: 'admin',
        id: 'admin',
        name: 'Admin',
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
