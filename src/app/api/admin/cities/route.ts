import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import City from '@/models/City';

// GET all cities
export async function GET() {
  try {
    await dbConnect();
    const cities = await City.find().sort({ displayOrder: 1 });
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}

// POST create new city
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, state, status, displayOrder } = body;

    if (!name || !state) {
      return NextResponse.json({ error: 'Name and state are required' }, { status: 400 });
    }

    const city = await City.create({
      name,
      state,
      status: status || 'active',
      displayOrder: displayOrder || 0,
    });

    return NextResponse.json(city, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json({ error: 'City already exists' }, { status: 409 });
    }
    console.error('Error creating city:', error);
    return NextResponse.json({ error: 'Failed to create city' }, { status: 500 });
  }
}
