import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AboutContent from '@/models/AboutContent';

export async function GET() {
  try {
    await dbConnect();
    const content = await AboutContent.findOne();
    if (!content) {
      return NextResponse.json({});
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
