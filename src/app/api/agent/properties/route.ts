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

// PUT update agent's own property (edit fields or mark sold)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const token = request.cookies.get('fourps_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { propertyId, action, fields, photos } = body;

    if (!propertyId) return NextResponse.json({ error: 'Property ID required' }, { status: 400 });

    // Verify agent owns this property
    const property = await Property.findOne({ _id: propertyId, 'submittedBy.id': payload.id });
    if (!property) return NextResponse.json({ error: 'Property not found or not yours' }, { status: 404 });

    if (action === 'markSold') {
      property.soldOut = true;
      await property.save();
      return NextResponse.json({ success: true, message: 'Property marked as sold' });
    }

    if (action === 'undoSold') {
      property.soldOut = false;
      await property.save();
      return NextResponse.json({ success: true, message: 'Sold status removed' });
    }

    // Edit fields
    if (fields) property.fields = fields;
    if (photos) property.photos = photos;
    // Resubmit for approval if it was rejected
    if (property.status === 'rejected') property.status = 'pending';
    await property.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
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
