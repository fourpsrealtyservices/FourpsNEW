import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import City from '@/models/City';

// PUT update city
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const city = await City.findByIdAndUpdate(id, body, { new: true });
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    return NextResponse.json(city);
  } catch (error) {
    console.error('Error updating city:', error);
    return NextResponse.json({ error: 'Failed to update city' }, { status: 500 });
  }
}

// DELETE city
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const city = await City.findByIdAndDelete(id);
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting city:', error);
    return NextResponse.json({ error: 'Failed to delete city' }, { status: 500 });
  }
}
