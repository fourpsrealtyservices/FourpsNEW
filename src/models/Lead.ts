import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  leadId: string;
  type: 'enquiry' | 'requirement';
  
  // Visitor info
  name: string;
  mobile: string;
  email?: string;
  message?: string;
  preferredCallbackTime?: string;
  
  // If enquiry on specific property
  propertyId?: string;
  
  // If requirement submission
  city?: string;
  lookingFor?: 'lease' | 'sale';
  propertyType?: string;
  preferredLocation?: string;
  areaRequired?: string;
  budgetRange?: string;
  additionalNotes?: string;

  // Status tracking
  status: 'new' | 'contacted' | 'converted' | 'not_interested';
  adminNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    leadId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['enquiry', 'requirement'], required: true },
    
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    message: { type: String },
    preferredCallbackTime: { type: String },
    
    propertyId: { type: String },
    
    city: { type: String },
    lookingFor: { type: String, enum: ['lease', 'sale'] },
    propertyType: { type: String },
    preferredLocation: { type: String },
    areaRequired: { type: String },
    budgetRange: { type: String },
    additionalNotes: { type: String },

    status: { 
      type: String, 
      enum: ['new', 'contacted', 'converted', 'not_interested'], 
      default: 'new' 
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
