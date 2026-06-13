import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Counter from '@/models/Counter';

// POST submit enquiry or requirement
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { type, name, mobile, email, message, preferredCallbackTime, propertyId, city, lookingFor, propertyType, preferredLocation, areaRequired, budgetRange, additionalNotes } = body;

    if (!name || !mobile || !type) {
      return NextResponse.json({ error: 'Name, mobile, and type are required' }, { status: 400 });
    }

    // Generate lead ID
    const counter = await Counter.findOneAndUpdate(
      { name: 'lead' },
      { $inc: { value: 1 } },
      { upsert: true, new: true }
    );
    const leadId = `LD-${String(counter.value).padStart(5, '0')}`;

    const lead = await Lead.create({
      leadId,
      type,
      name,
      mobile,
      email,
      message,
      preferredCallbackTime,
      propertyId,
      city,
      lookingFor,
      propertyType,
      preferredLocation,
      areaRequired,
      budgetRange,
      additionalNotes,
    });

    return NextResponse.json({ success: true, leadId: lead.leadId }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
