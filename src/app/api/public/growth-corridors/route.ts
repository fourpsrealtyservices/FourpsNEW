import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GrowthCorridor from '@/models/GrowthCorridor';

export async function GET() {
  try {
    await dbConnect();
    const corridors = await GrowthCorridor.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(corridors);
  } catch (error) {
    console.error('Error fetching growth corridors:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
