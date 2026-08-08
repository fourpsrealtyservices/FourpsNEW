import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';
import { verifyToken, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const token = request.cookies.get('fourps_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { currentPassword, newPassword } = await request.json();
    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: 'New password must be at least 4 characters' }, { status: 400 });
    }

    const agent = await Agent.findById(decoded.id);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // If must change password (first login), skip current password check
    if (!agent.mustChangePassword) {
      if (!currentPassword || agent.password !== currentPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
      }
    }

    agent.password = newPassword;
    agent.mustChangePassword = false;
    await agent.save();

    // Issue new token
    const newToken = await createToken({
      id: agent._id.toString(),
      role: 'agent',
      name: agent.name,
      phone: agent.phone,
    });

    const response = NextResponse.json({ success: true, message: 'Password changed successfully' });
    response.cookies.set('fourps_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
