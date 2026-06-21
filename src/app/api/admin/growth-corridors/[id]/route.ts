import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GrowthCorridor from '@/models/GrowthCorridor';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const corridor = await GrowthCorridor.findByIdAndUpdate(id, body, { new: true });
    if (!corridor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(corridor);
  } catch (error) {
    console.error('Error updating growth corridor:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    await GrowthCorridor.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting growth corridor:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
