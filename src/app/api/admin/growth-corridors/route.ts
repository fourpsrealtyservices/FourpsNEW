import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GrowthCorridor from '@/models/GrowthCorridor';

export async function GET() {
  try {
    await dbConnect();
    const corridors = await GrowthCorridor.find().sort({ order: 1 });
    return NextResponse.json(corridors);
  } catch (error) {
    console.error('Error fetching growth corridors:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const corridor = await GrowthCorridor.create(body);
    return NextResponse.json(corridor, { status: 201 });
  } catch (error) {
    console.error('Error creating growth corridor:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
