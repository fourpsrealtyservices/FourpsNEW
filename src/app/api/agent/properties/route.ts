import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { generatePropertyId } from '@/lib/propertyId';
import { verifyToken } from '@/lib/auth';

// GET agent's own submissions only
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get('fourps_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Agent can only see their own submissions
    const properties = await Property.find({ 'submittedBy.id': payload.id })
      .select('-locationPin -contactName -contactMobile -contactDesignation')
      .sort({ createdAt: -1 });
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// PUT update agent's own property (edit fields, mark sold, full edit)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const token = request.cookies.get('fourps_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { propertyId, action } = body;

    if (!propertyId) return NextResponse.json({ error: 'Property ID required' }, { status: 400 });

    // Verify agent owns this property
    const property = await Property.findOne({ _id: propertyId, 'submittedBy.id': payload.id });
    if (!property) return NextResponse.json({ error: 'Property not found or not yours' }, { status: 404 });

    // Action: Mark as Sold
    if (action === 'markSold') {
      property.soldOut = true;
      await property.save();
      return NextResponse.json({ success: true, message: 'Property marked as sold' });
    }

    // Action: Undo Sold
    if (action === 'undoSold') {
      property.soldOut = false;
      await property.save();
      return NextResponse.json({ success: true, message: 'Sold status removed' });
    }

    // Action: Full Edit (update all editable fields)
    if (action === 'edit') {
      const { city, transactionType, category, officeType, customHeading, fields, nearbyAreas, locationPin, contactName, contactMobile, contactDesignation, remarks, photos, status: requestedStatus } = body;

      if (city) property.city = city;
      if (transactionType) property.transactionType = transactionType;
      if (category) property.category = category;
      if (officeType !== undefined) property.officeType = category === 'office' ? officeType : undefined;
      if (customHeading !== undefined) property.customHeading = customHeading || undefined;
      if (fields) {
        property.fields = fields;
        property.locationArea = fields?.locationArea?.value || '';
        property.description = fields?.description?.value || '';
      }
      if (nearbyAreas !== undefined) property.nearbyAreas = nearbyAreas;
      if (locationPin !== undefined) property.locationPin = locationPin;
      if (contactName !== undefined) property.contactName = contactName;
      if (contactMobile !== undefined) property.contactMobile = contactMobile;
      if (contactDesignation !== undefined) property.contactDesignation = contactDesignation;
      if (remarks !== undefined) property.remarks = remarks;
      if (photos !== undefined) property.photos = photos;

      // If draft and agent wants to submit, change to pending
      if (requestedStatus === 'pending' && property.status === 'draft') {
        property.status = 'pending';
      }
      // If rejected and agent resubmits, change to pending
      if (property.status === 'rejected') {
        property.status = 'pending';
      }
      // If it was a draft and agent wants to keep as draft
      if (requestedStatus === 'draft') {
        property.status = 'draft';
      }

      await property.save();
      return NextResponse.json({ success: true, property });
    }

    // Legacy: simple field/photo update (backward compatible)
    const { fields, photos } = body;
    if (fields) property.fields = fields;
    if (photos) property.photos = photos;
    if (property.status === 'rejected') property.status = 'pending';
    await property.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// POST submit new property (goes to pending or draft)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const token = request.cookies.get('fourps_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { city, transactionType, category, officeType, customHeading, fields, nearbyAreas, locationPin, contactName, contactMobile, contactDesignation, remarks, photos, status } = body;

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
      customHeading: customHeading || undefined,
      fields: fields || {},
      nearbyAreas: nearbyAreas || [],
      locationPin: locationPin || '',
      contactName: contactName || '',
      contactMobile: contactMobile || '',
      contactDesignation: contactDesignation || '',
      remarks: remarks || undefined,
      locationArea: fields?.locationArea?.value || '',
      description: fields?.description?.value || '',
      photos: photos || [],
      status: status === 'draft' ? 'draft' : 'pending', // Agent submissions are PENDING or DRAFT
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
