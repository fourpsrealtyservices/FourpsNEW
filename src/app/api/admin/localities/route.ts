import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Locality from '@/models/Locality';

// GET all localities (optionally filter by city)
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

// POST create new locality
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, city } = body;

    if (!name || !city) {
      return NextResponse.json({ error: 'Name and city are required' }, { status: 400 });
    }

    const locality = await Locality.create({ name: name.trim(), city });
    return NextResponse.json(locality, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'This locality already exists for this city' }, { status: 409 });
    }
    console.error('Error creating locality:', error);
    return NextResponse.json({ error: 'Failed to create locality' }, { status: 500 });
  }
}
