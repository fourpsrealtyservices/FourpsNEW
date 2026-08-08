import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Insight from '@/models/Insight';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const insight = await Insight.findById(id);
    if (!insight || !insight.isActive) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(insight);
  } catch (error) {
    console.error('Error fetching insight:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
