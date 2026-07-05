import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Locality from '@/models/Locality';

// GET localities (public - filtered by city)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const filter: Record<string, unknown> = { isActive: true };
    if (city) filter.city = city;
    const localities = await Locality.find(filter).sort({ name: 1 });
    return NextResponse.json(localities);
  } catch (error) {
    console.error('Error fetching localities:', error);
    return NextResponse.json({ error: 'Failed to fetch localities' }, { status: 500 });
  }
}
