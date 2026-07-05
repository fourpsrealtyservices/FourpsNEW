import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Locality from '@/models/Locality';

// DELETE a locality
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Locality.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting locality:', error);
    return NextResponse.json({ error: 'Failed to delete locality' }, { status: 500 });
  }
}
