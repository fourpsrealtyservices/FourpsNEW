import Counter from '@/models/Counter';
import dbConnect from '@/lib/mongodb';

const CATEGORY_CODES: Record<string, string> = {
  retail: 'RTL',
  office: 'OFC',
  coworking: 'CWK',
  commercial_plot: 'CPL',
  land_plot: 'LND',
  investment: 'INV',
  rental_income: 'RIP',
};

const TRANSACTION_CODES: Record<string, string> = {
  lease: 'L',
  sale: 'S',
};

export async function generatePropertyId(
  transactionType: string,
  category: string
): Promise<{ propertyId: string; propertyNumber: number }> {
  await dbConnect();

  const counterName = `property_${transactionType}_${category}`;
  
  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { value: 1 } },
    { upsert: true, new: true }
  );

  const txCode = TRANSACTION_CODES[transactionType] || 'X';
  const catCode = CATEGORY_CODES[category] || 'XXX';
  const number = String(counter.value).padStart(4, '0');

  return {
    propertyId: `FP-${txCode}-${catCode}-${number}`,
    propertyNumber: counter.value,
  };
}
