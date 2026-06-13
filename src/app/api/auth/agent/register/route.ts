import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';

// POST - Agent self-registration (goes to pending approval)
export async function POST(request: NextRequest) {
  try {
    const { name, phone, email } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    await dbConnect();

    // Check if already registered
    const existing = await Agent.findOne({ phone: formattedPhone });
    if (existing) {
      if (existing.status === 'pending') {
        return NextResponse.json(
          { error: 'You have already registered. Your approval is pending.' },
          { status: 409 }
        );
      }
      if (existing.status === 'approved' && existing.isActive) {
        return NextResponse.json(
          { error: 'Account already exists. Please login instead.' },
          { status: 409 }
        );
      }
      if (existing.status === 'rejected') {
        return NextResponse.json(
          { error: 'Your previous registration was rejected. Contact admin.' },
          { status: 409 }
        );
      }
    }

    // Create agent with pending status
    await Agent.create({
      name,
      phone: formattedPhone,
      email: email || undefined,
      isActive: false,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Registration submitted! Admin will review and approve your account.',
    });
  } catch (error) {
    console.error('Agent registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Try again.' },
      { status: 500 }
    );
  }
}
