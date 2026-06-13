import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { generatePropertyId } from '@/lib/propertyId';
import { verifyToken } from '@/lib/auth';

// GET agent's own submissions + all published properties (without sensitive data)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view'); // 'mine' or 'browse'

    const token = request.cookies.get('fourps_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    if (view === 'mine') {
      // Agent's own submissions
      const properties = await Property.find({ 'submittedBy.id': payload.id })
        .select('-locationPin -contactName -contactMobile -contactDesignation')
        .sort({ createdAt: -1 });
      return NextResponse.json(properties);
    }

    // Browse all published (no sensitive data)
    const properties = await Property.find({ status: 'published' })
      .select('-locationPin -contactName -contactMobile -contactDesignation')
      .sort({ createdAt: -1 });
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST submit new property (goes to pending)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const token = request.cookies.get('fourps_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { city, transactionType, category, officeType, fields, photos } = body;

    if (!city || !transactionType || !category) {
      return NextResponse.json({ error: 'City, transaction type, and category are required' }, { status: 400 });
    }

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
      photos: photos || [],
      status: 'pending', // Agent submissions are PENDING
      submittedBy: {
        type: 'agent',
        id: payload.id,
        name: payload.name || 'Agent',
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to submit property' }, { status: 500 });
  }
}
