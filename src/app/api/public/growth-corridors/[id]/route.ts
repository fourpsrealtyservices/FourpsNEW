import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GrowthCorridor from '@/models/GrowthCorridor';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const corridor = await GrowthCorridor.findById(id);
    if (!corridor) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(corridor);
  } catch (error) {
    console.error('Error fetching growth corridor:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
