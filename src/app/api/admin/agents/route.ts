import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';

// Generate unique agent code like FP-AGT-001
async function generateAgentCode(): Promise<string> {
  const count = await Agent.countDocuments();
  const num = String(count + 1).padStart(3, '0');
  return `FP-AGT-${num}`;
}

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

// POST create new agent (by admin — directly approved with password)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, phone, email, password } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const agentCode = await generateAgentCode();

    const agent = await Agent.create({
      name,
      phone,
      email,
      password: password || undefined,
      agentCode,
      status: 'approved',
      isActive: true,
      mustChangePassword: true,
    });
    return NextResponse.json(agent, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json({ error: 'Agent with this phone number already exists' }, { status: 409 });
    }
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
