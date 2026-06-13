import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

// GET single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

// PUT update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Handle photo mask toggle
    if (body.photoIndex !== undefined && body.isMasked !== undefined) {
      const property = await Property.findById(id);
      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }
      if (property.photos && property.photos[body.photoIndex]) {
        property.photos[body.photoIndex].isMasked = body.isMasked;
        await property.save();
      }
      return NextResponse.json(property);
    }

    // Handle approval/rejection
    if (body.status === 'published' && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const property = await Property.findByIdAndUpdate(id, body, { new: true });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

// DELETE property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
