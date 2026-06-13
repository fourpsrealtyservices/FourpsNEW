import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  state: string;
  status: 'active' | 'coming_soon' | 'hidden';
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['active', 'coming_soon', 'hidden'], 
      default: 'active' 
    },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.City || mongoose.model<ICity>('City', CitySchema);
