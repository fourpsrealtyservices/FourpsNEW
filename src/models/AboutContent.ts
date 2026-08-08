import mongoose, { Schema } from 'mongoose';

const AboutContentSchema = new Schema({
  // There will only be ONE document in this collection (singleton pattern)
  founderName: { type: String, default: 'Jhansi Desavath' },
  founderTitle: { type: String, default: 'Founder & CEO' },
  founderPhotoUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  education: { type: String, default: 'IIM Lucknow' },
  educationDetail: { type: String, default: 'Post Graduate Programme' },
  quote: { type: String, default: 'A strong business foundation combined with years of corporate leadership shaped the consulting approach that defines 4P\'s Realty Services today.' },
  credentials: [{ type: String }],
  education2: { type: String, default: 'Osmania University' },
  education2Detail: { type: String, default: 'Mechanical Engineer' },
  educationLogoUrl: { type: String, default: '' },
  education2LogoUrl: { type: String, default: '' },
  experience: [{
    company: { type: String },
    title: { type: String },
    description: { type: String },
    logoUrl: { type: String, default: '' },
  }],
  storySteps: [{
    title: { type: String },
    description: { type: String },
  }],
  mission: { type: String, default: 'To transform the unorganized commercial real estate sector into a transparent, trusted and professional ecosystem for businesses, investors and land owners.' },
  vision: { type: String, default: 'To become India\'s most trusted commercial real estate advisory platform by helping businesses make confident location decisions.' },
  whatsappNumber: { type: String, default: '919059909675' },
}, { timestamps: true });

export default mongoose.models.AboutContent || mongoose.model('AboutContent', AboutContentSchema);
