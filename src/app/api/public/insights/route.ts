import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Insight from '@/models/Insight';

export async function GET() {
  try {
    await dbConnect();
    const insights = await Insight.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
