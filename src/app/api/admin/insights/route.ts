import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Insight from '@/models/Insight';

export async function GET() {
  try {
    await dbConnect();
    const insights = await Insight.find().sort({ order: 1 });
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const insight = await Insight.create(body);
    return NextResponse.json(insight, { status: 201 });
  } catch (error) {
    console.error('Error creating insight:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
