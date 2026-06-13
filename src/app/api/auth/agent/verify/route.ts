import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';

// This endpoint verifies the agent after Firebase OTP verification on client-side
export async function POST(request: NextRequest) {
  try {
    const { phone, firebaseUid } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if agent exists
    const agent = await Agent.findOne({ phone });

    if (!agent) {
      // Agent doesn't exist - tell them to register first
      return NextResponse.json(
        { error: 'No account found. Please register first.', needsRegistration: true },
        { status: 404 }
      );
    }

    if (agent.status === 'pending') {
      return NextResponse.json(
        { error: 'Your registration is pending admin approval. Please wait.' },
        { status: 403 }
      );
    }

    if (agent.status === 'rejected') {
      return NextResponse.json(
        { error: 'Your registration was not approved. Contact admin.' },
        { status: 403 }
      );
    }

    if (!agent.isActive) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Contact admin.' },
        { status: 401 }
      );
    }

    // Update firebaseUid if needed
    if (firebaseUid && !agent.firebaseUid) {
      agent.firebaseUid = firebaseUid;
      await agent.save();
    }

    // Create JWT token
    const token = await createToken({
      id: agent._id.toString(),
      role: 'agent',
      name: agent.name,
      phone: agent.phone,
    });

    // Set cookie - persistent session
    const response = NextResponse.json({ 
      success: true, 
      role: 'agent',
      agent: {
        id: agent._id,
        name: agent.name,
        phone: agent.phone,
      }
    });
    
    response.cookies.set('fourps_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Agent verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
