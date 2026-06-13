import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import City from '@/models/City';

// GET public cities (active + coming_soon, not hidden)
export async function GET() {
  try {
    await dbConnect();
    const cities = await City.find({ status: { $ne: 'hidden' } }).sort({ displayOrder: 1 });
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
