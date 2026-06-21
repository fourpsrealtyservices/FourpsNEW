import mongoose from 'mongoose';
import { readFileSync } from 'fs';

// Load .env.local manually
const envContent = readFileSync('.env.local', 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) envVars[key.trim()] = vals.join('=').trim();
});
process.env.MONGODB_URI = envVars.MONGODB_URI;

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'CEO, TechStart Solutions',
    text: 'FourPs helped us find the perfect Grade A office in HITEC City within a week. Their understanding of commercial spaces is exceptional.',
    imageUrl: '',
    order: 1,
    isActive: true,
  },
  {
    name: 'Priya Sharma',
    role: 'Founder, Retail Chain',
    text: 'We expanded to 3 retail locations in Hyderabad with FourPs. Their curated listings saved us months of searching.',
    imageUrl: '',
    order: 2,
    isActive: true,
  },
  {
    name: 'Vikram Reddy',
    role: 'Managing Director, VR Group',
    text: 'The team at FourPs understands commercial real estate like no one else. Professional, prompt, and precise — exactly what you need.',
    imageUrl: '',
    order: 3,
    isActive: true,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to MongoDB');

  const existing = await Testimonial.countDocuments();
  if (existing > 0) {
    console.log(`Already have ${existing} testimonials. Skipping seed.`);
  } else {
    await Testimonial.insertMany(testimonials);
    console.log(`Seeded ${testimonials.length} testimonials.`);
  }

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
