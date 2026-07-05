import mongoose, { Schema, Document } from 'mongoose';

export interface ILocality extends Document {
  name: string;
  city: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocalitySchema = new Schema<ILocality>(
  {
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicates per city
LocalitySchema.index({ name: 1, city: 1 }, { unique: true });

export default mongoose.models.Locality || mongoose.model<ILocality>('Locality', LocalitySchema);
