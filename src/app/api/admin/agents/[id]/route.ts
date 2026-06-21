import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';

// Generate unique agent code
async function generateAgentCode(): Promise<string> {
  const count = await Agent.countDocuments();
  const num = String(count + 1).padStart(3, '0');
  return `FP-AGT-${num}`;
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

    const agent = await Agent.findByIdAndUpdate(id, body, { new: true });
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
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
