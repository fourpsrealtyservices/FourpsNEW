import mongoose, { Schema, Document } from 'mongoose';

export interface IPropertyPhoto {
  url: string;
  publicId: string;
  label: string;
  isMasked: boolean;
  isCover: boolean;
  order: number;
}

export interface IProperty extends Document {
  propertyId: string; // FP-L-RTL-0042
  city: string;
  transactionType: 'lease' | 'sale';
  category: 'retail' | 'office' | 'coworking' | 'commercial_plot' | 'land_plot' | 'investment' | 'rental_income';
  officeType?: 'furnished' | 'unfurnished'; // Only for office category
  
  // Dynamic fields - stored as key-value pairs with checkbox state
  fields: {
    [key: string]: {
      value: string | number | string[];
      checked: boolean; // Only checked fields show on public listing
      unit?: string;
    };
  };

  // Common fields
  locationArea?: string;
  description?: string;
  
  // Back-end only fields (NEVER shown on public listing or to agents)
  locationPin?: string; // Google Maps coordinates
  contactName?: string;
  contactMobile?: string;
  contactDesignation?: string;

  // Photos
  photos: IPropertyPhoto[];

  // Status & metadata
  status: 'draft' | 'pending' | 'published' | 'rejected' | 'unpublished';
  submittedBy: {
    type: 'admin' | 'agent';
    id: string;
    name: string;
  };
  rejectionReason?: string;
  
  // Auto-increment number for property ID
  propertyNumber: number;

  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const PropertyPhotoSchema = new Schema<IPropertyPhoto>({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  label: { type: String, default: '' },
  isMasked: { type: Boolean, default: false },
  isCover: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const PropertySchema = new Schema<IProperty>(
  {
    propertyId: { type: String, required: true, unique: true, index: true },
    city: { type: String, required: true, index: true },
    transactionType: { 
      type: String, 
      enum: ['lease', 'sale'], 
      required: true, 
      index: true 
    },
    category: { 
      type: String, 
      enum: ['retail', 'office', 'coworking', 'commercial_plot', 'land_plot', 'investment', 'rental_income'], 
      required: true,
      index: true 
    },
    officeType: { 
      type: String, 
      enum: ['furnished', 'unfurnished'] 
    },

    // Dynamic checkbox-based fields
    fields: { type: Schema.Types.Mixed, default: {} },

    // Common
    locationArea: { type: String },
    description: { type: String },

    // Back-end only
    locationPin: { type: String },
    contactName: { type: String },
    contactMobile: { type: String },
    contactDesignation: { type: String },

    // Photos
    photos: [PropertyPhotoSchema],

    // Status
    status: { 
      type: String, 
      enum: ['draft', 'pending', 'published', 'rejected', 'unpublished'], 
      default: 'draft',
      index: true 
    },
    submittedBy: {
      type: { type: String, enum: ['admin', 'agent'] },
      id: { type: String },
      name: { type: String },
    },
    rejectionReason: { type: String },

    propertyNumber: { type: Number, required: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// Compound indexes for search
PropertySchema.index({ city: 1, transactionType: 1, category: 1, status: 1 });
PropertySchema.index({ city: 1, status: 1, createdAt: -1 });

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
