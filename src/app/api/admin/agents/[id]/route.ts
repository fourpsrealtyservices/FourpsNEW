import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';
import bcrypt from 'bcryptjs';

// GET single agent
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const agent = await Agent.findById(id).select('-password');
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }
}

// Generate unique agent code by finding the highest existing number
async function generateAgentCode(): Promise<string> {
  const agents = await Agent.find({ agentCode: { $exists: true, $ne: null } })
    .select('agentCode')
    .lean();
  
  let maxNum = 0;
  for (const agent of agents) {
    const match = (agent as { agentCode?: string }).agentCode?.match(/FP-AGT-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  
  const nextNum = String(maxNum + 1).padStart(3, '0');
  return `FP-AGT-${nextNum}`;
}

// PUT update agent
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // If approving and agent doesn't have a code yet, generate one
    if (body.status === 'approved') {
      const existing = await Agent.findById(id);
      if (existing && !existing.agentCode) {
        body.agentCode = await generateAgentCode();
      }
    }

    // Hash password if being set/updated
    if (body.password && body.password.length < 60) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const agent = await Agent.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json(agent);
  } catch (error: unknown) {
    console.error('Error updating agent:', error);
    const message = error instanceof Error ? error.message : 'Failed to update agent';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const agent = await Agent.findByIdAndDelete(id);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
}
