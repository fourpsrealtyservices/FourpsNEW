import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';

// POST - Agent self-registration (goes to pending approval)
// Also handles "forgot password" — agent re-submits form, goes back to pending for admin to reset password
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
          { error: 'You have already registered. Your approval is pending. Please wait for admin to share credentials.' },
          { status: 409 }
        );
      }
      if (existing.status === 'approved' && existing.isActive) {
        // This is a "forgot password" scenario — reset to pending so admin can set new password
        existing.status = 'pending';
        existing.isActive = false;
        existing.password = undefined;
        existing.mustChangePassword = true;
        existing.name = name; // Update name if changed
        existing.email = email || existing.email;
        await existing.save();
        return NextResponse.json({
          success: true,
          message: 'Password reset request submitted! Admin will set a new password and share it with you.',
        });
      }
      if (existing.status === 'rejected') {
        // Allow re-registration for rejected agents
        existing.status = 'pending';
        existing.isActive = false;
        existing.password = undefined;
        existing.mustChangePassword = true;
        existing.name = name;
        existing.email = email || existing.email;
        await existing.save();
        return NextResponse.json({
          success: true,
          message: 'Re-registration submitted! Admin will review your application.',
        });
      }
      // Inactive approved agent — also allow re-registration
      if (existing.status === 'approved' && !existing.isActive) {
        existing.status = 'pending';
        existing.password = undefined;
        existing.mustChangePassword = true;
        existing.name = name;
        existing.email = email || existing.email;
        await existing.save();
        return NextResponse.json({
          success: true,
          message: 'Re-activation request submitted! Admin will review and share new credentials.',
        });
      }
    }

    // Create new agent with pending status
    await Agent.create({
      name,
      phone: formattedPhone,
      email: email || undefined,
      isActive: false,
      status: 'pending',
      mustChangePassword: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Registration submitted! Admin will review and share your login credentials.',
    });
  } catch (error) {
    console.error('Agent registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Try again.' },
      { status: 500 }
    );
  }
}
