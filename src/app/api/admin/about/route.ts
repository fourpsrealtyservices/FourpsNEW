import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AboutContent from '@/models/AboutContent';

// Default data to seed if no document exists
const DEFAULT_DATA = {
  founderName: 'Jhansi Desavath',
  founderTitle: 'Founder & CEO',
  founderPhotoUrl: '',
  linkedinUrl: '',
  education: 'IIM Lucknow',
  educationDetail: 'Post Graduate Programme',
  quote: "A strong business foundation combined with years of corporate leadership shaped the consulting approach that defines 4P's Realty Services today.",
  credentials: [
    'Commercial Real Estate Consultant',
    'Relationship Builder',
    'Corporate Strategy Professional',
    'Business Growth Enabler',
  ],
  experience: [
    { company: 'Airtel', description: 'Built strong foundation in operations & customer focus' },
    { company: 'Park+', description: 'Gained diverse experience in growth & partnerships' },
    { company: 'Disney Star', description: 'Enhanced strategic thinking & business development expertise' },
  ],
  storySteps: [
    { title: 'Career Break', description: 'After a fulfilling career break following Disney Star, I was still exploring my next chapter.' },
    { title: 'A Friend Asked', description: 'A friend casually asked if I could help find tenants for his commercial property.' },
    { title: 'Spoke to Retail Brands', description: 'I reached out to retailers, clothing brands, electronics stores and businesses in my network.' },
    { title: 'Unexpected Responses', description: "Most of them weren't interested in that particular property." },
    { title: 'Realized the Market Gap', description: 'They said, "If you have opportunities in other locations, let us know."' },
    { title: 'Started Helping Businesses', description: 'I began understanding requirements, studying markets and connecting the right dots.' },
    { title: "Founded 4P's Realty", description: 'What began as a small favor became a full-time mission.' },
  ],
  mission: 'To transform the unorganized commercial real estate sector into a transparent, trusted and professional ecosystem for businesses, investors and land owners.',
  vision: "To become India's most trusted commercial real estate advisory platform by helping businesses make confident location decisions.",
  whatsappNumber: '919059909675',
};

export async function GET() {
  try {
    await dbConnect();
    let content = await AboutContent.findOne();
    if (!content) {
      content = await AboutContent.create(DEFAULT_DATA);
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    let content = await AboutContent.findOne();
    if (!content) {
      content = await AboutContent.create(body);
    } else {
      Object.assign(content, body);
      await content.save();
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
