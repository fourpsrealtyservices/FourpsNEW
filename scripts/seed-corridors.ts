// Run with: npx tsx scripts/seed-corridors.ts
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Parse .env.local manually
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && !key.startsWith('#')) {
    process.env[key.trim()] = vals.join('=').trim();
  }
});

const GrowthCorridorSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: String,
  city: String,
  order: Number,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const GrowthCorridor = mongoose.models.GrowthCorridor || mongoose.model('GrowthCorridor', GrowthCorridorSchema);

const corridors = [
  {
    title: 'HITEC City & Madhapur',
    content: 'The IT backbone of Hyderabad — home to Google, Microsoft, Amazon, and 100+ tech companies. Grade A office rents range from ₹55-85/sq ft. Ideal for IT/ITES, fintech, and SaaS companies. The area boasts excellent metro connectivity, world-class restaurants, and premium residential options nearby.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    city: 'Hyderabad',
    order: 1,
    isActive: true,
  },
  {
    title: 'Financial District',
    content: 'The newest commercial hub with premium towers, wide roads, and excellent infrastructure. Major occupiers include banks, consulting firms, and global tech giants. Rents: ₹60-90/sq ft. Home to the Hyderabad Stock Exchange, multiple Fortune 500 offices, and upcoming metro connectivity.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    city: 'Hyderabad',
    order: 2,
    isActive: true,
  },
  {
    title: 'Gachibowli & Nanakramguda',
    content: 'Strategic location between HITEC City and Financial District. Growing rapidly with SEZs, business parks, and pharma companies. Affordable yet premium: ₹45-65/sq ft. The area hosts ISB, University of Hyderabad, and multiple IT SEZs making it a knowledge corridor.',
    imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&q=80',
    city: 'Hyderabad',
    order: 3,
    isActive: true,
  },
  {
    title: 'Kokapet & Narsingi',
    content: 'The next frontier — upcoming IT corridor with massive land parcels and new developments. Early movers can lock in rates of ₹35-50/sq ft with high appreciation potential. The Outer Ring Road connectivity and proximity to Financial District make this a prime investment zone.',
    imageUrl: 'https://images.unsplash.com/photo-1582407947092-79ad8656ff9d?auto=format&fit=crop&w=600&q=80',
    city: 'Hyderabad',
    order: 4,
    isActive: true,
  },
  {
    title: 'Uppal & LB Nagar Corridor',
    content: 'The eastern growth corridor connecting to Warangal Highway. Rapid infrastructure development with metro Phase 2, affordable commercial spaces at ₹25-40/sq ft. Ideal for warehousing, retail showrooms, and budget-friendly office setups for startups.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    city: 'Hyderabad',
    order: 5,
    isActive: true,
  },
  {
    title: 'Shamshabad & Airport Zone',
    content: 'The logistics and aerospace hub around Rajiv Gandhi International Airport. Home to GMR Aerospace Park, pharma clusters, and IT parks. Commercial rents: ₹30-55/sq ft. Excellent for companies needing airport proximity — logistics, export, aviation, and hospitality sectors.',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?auto=format&fit=crop&w=600&q=80',
    city: 'Hyderabad',
    order: 6,
    isActive: true,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Clear existing
  await GrowthCorridor.deleteMany({});
  console.log('Cleared existing corridors');

  // Insert
  const result = await GrowthCorridor.insertMany(corridors);
  console.log(`Inserted ${result.length} growth corridors:`);
  result.forEach((c: { title: string }) => console.log(`  ✓ ${c.title}`));

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
