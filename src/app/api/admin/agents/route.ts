import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';

// GET all agents
export async function GET() {
  try {
    await dbConnect();
    const agents = await Agent.find().sort({ createdAt: -1 });
    return NextResponse.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

// POST create new agent
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, phone, email } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const agent = await Agent.create({ name, phone, email, status: 'approved', isActive: true });
    return NextResponse.json(agent, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json({ error: 'Agent with this phone number already exists' }, { status: 409 });
    }
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
