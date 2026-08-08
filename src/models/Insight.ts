import mongoose from 'mongoose';

const InsightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tag: { type: String, default: 'Insights' },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Insight || mongoose.model('Insight', InsightSchema);
