import mongoose from 'mongoose';

const GrowthCorridorSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  city: { type: String, default: 'Hyderabad' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.GrowthCorridor || mongoose.model('GrowthCorridor', GrowthCorridorSchema);
