import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fourps-secret';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 });
    }

    const agent = await Agent.findOne({ phone });
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found. Please register first.' }, { status: 404 });
    }

    if (agent.status !== 'approved' || !agent.isActive) {
      return NextResponse.json({ error: 'Your account is not yet approved or has been deactivated.' }, { status: 403 });
    }

    if (!agent.password) {
      return NextResponse.json({ error: 'No password set. Contact admin to set your password.' }, { status: 403 });
    }

    // Simple password check (plain text for now — can add bcrypt later)
    if (agent.password !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: agent._id, role: 'agent', name: agent.name, agentCode: agent.agentCode, mustChangePassword: agent.mustChangePassword },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      agent: { id: agent._id, name: agent.name, agentCode: agent.agentCode, mustChangePassword: agent.mustChangePassword },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Agent login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
