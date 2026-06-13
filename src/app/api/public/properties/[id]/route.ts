import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

// GET single published property by propertyId (e.g. FP-L-OFC-0042)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Try to find by propertyId first, then by MongoDB _id
    let property = await Property.findOne({ propertyId: id, status: 'published' })
      .select('-locationPin -contactName -contactMobile -contactDesignation');

    if (!property) {
      property = await Property.findOne({ _id: id, status: 'published' })
        .select('-locationPin -contactName -contactMobile -contactDesignation');
    }

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}
