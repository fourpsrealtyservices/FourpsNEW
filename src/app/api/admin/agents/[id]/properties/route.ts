import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const properties = await Property.find({ 'submittedBy.agentId': id }).sort({ createdAt: -1 });
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
