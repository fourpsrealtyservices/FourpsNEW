import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Insight from '@/models/Insight';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const insight = await Insight.findByIdAndUpdate(id, body, { new: true });
    if (!insight) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(insight);
  } catch (error) {
    console.error('Error updating insight:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Insight.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting insight:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
