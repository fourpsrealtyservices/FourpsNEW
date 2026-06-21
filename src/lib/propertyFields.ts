// Field definitions for each category
export interface FieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'dropdown' | 'multi-checkbox' | 'range';
  unit?: string;
  options?: string[];
  placeholder?: string;
  placeholderMin?: string;
  placeholderMax?: string;
  hasCFP?: boolean; // Call for Price option
}

export const CATEGORY_FIELDS: Record<string, FieldDefinition[]> = {
  // Lease - Retail
  lease_retail: [
    { key: 'locationArea', label: 'Location / Area', type: 'text', placeholder: 'Area / locality name' },
    { key: 'superBuiltUpArea', label: 'Super Built-up Area', type: 'number', unit: 'sq ft' },
    { key: 'carpetArea', label: 'Carpet Area', type: 'number', unit: 'sq ft' },
    { key: 'floor', label: 'Floor', type: 'dropdown', options: ['Ground', 'Basement', '1st', '2nd', '3rd', '4th', '5th', '6th+', 'Terrace'] },
    { key: 'frontage', label: 'Frontage', type: 'number', unit: 'ft' },
    { key: 'ceilingHeight', label: 'Ceiling / Beam Height', type: 'number', unit: 'ft' },
    { key: 'roadWidth', label: 'Road Width in Front', type: 'number', unit: 'ft' },
    { key: 'expectedRent', label: 'Expected Rent', type: 'text', placeholder: 'Per sq ft OR full floor/unit amount', hasCFP: true },
    { key: 'buildingStatus', label: 'Building Status', type: 'dropdown', options: ['Ready to Move In', 'Under Construction', 'About to Vacate'] },
    { key: 'buildingType', label: 'Building Type', type: 'dropdown', options: ['Grade A', 'Standalone', 'Mixed Use'] },
    { key: 'parking', label: 'Parking', type: 'text', placeholder: 'Available / Not Available / Details' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Free-text summary for listing' },
  ],

  // Lease - Office
  lease_office: [
    { key: 'locationArea', label: 'Location / Area', type: 'text', placeholder: 'Area / locality name' },
    { key: 'superBuiltUpArea', label: 'Super Built-up Area (SBU)', type: 'number', unit: 'sq ft' },
    { key: 'carpetArea', label: 'Carpet Area', type: 'number', unit: 'sq ft' },
    { key: 'floor', label: 'Floor', type: 'text', placeholder: 'e.g. 3rd Floor, Full Building, Ground + 1st' },
    { key: 'expectedRent', label: 'Expected Rent', type: 'text', placeholder: 'Per sq ft OR full floor amount', hasCFP: true },
    { key: 'buildingStatus', label: 'Building Status', type: 'dropdown', options: ['Ready to Move In', 'Under Construction', 'About to Vacate'] },
    { key: 'buildingType', label: 'Building Type', type: 'dropdown', options: ['Grade A', 'Standalone', 'Business Park'] },
    { key: 'parking', label: 'Parking', type: 'text', placeholder: 'Available / Not Available / Details' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Free-text summary' },
  ],

  // Lease - Co-working Space
  lease_coworking: [
    { key: 'locationArea', label: 'Location / Area', type: 'text', placeholder: 'Area / locality name' },
    { key: 'roadWidth', label: 'Road Width in Front', type: 'number', unit: 'ft' },
    { key: 'buildingType', label: 'Building Type', type: 'dropdown', options: ['Grade A', 'Standalone'] },
    { key: 'parking', label: 'Parking', type: 'text', placeholder: 'Available / Not Available / Details' },
    { key: 'seatsAvailable', label: 'Number of Seats Available', type: 'range', unit: 'seats', placeholderMin: 'Min (e.g. 2)', placeholderMax: 'Max (e.g. 20)' },
    { key: 'amenities', label: 'Amenities', type: 'multi-checkbox', options: ['WiFi', 'Cafeteria', 'Meeting Rooms', 'Reception', 'Power Backup', 'Parking', 'Security', 'Housekeeping'] },
    { key: 'expectedRentPerSeat', label: 'Expected Rent / Seat', type: 'text', placeholder: 'Per seat per month', hasCFP: true },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Free-text summary' },
  ],

  // Lease - Commercial Plot
  lease_commercial_plot: [
    { key: 'locationArea', label: 'Location / Area', type: 'text', placeholder: 'Area / locality name' },
    { key: 'plotArea', label: 'Plot Area', type: 'number', unit: 'sq yards' },
    { key: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'e.g. 50 ft x 100 ft' },
    { key: 'expectedRent', label: 'Expected Rent', type: 'text', placeholder: 'Per sq yard or total', hasCFP: true },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Free-text summary' },
  ],

  // Sale - Retail
  sale_retail: [
    { key: 'locationArea', label: 'Location / Area', type: 'text', placeholder: 'Area / locality name' },
    { key: 'superBuiltUpArea', label: 'Super Built-up Area', type: 'number', unit: 'sq ft' },
    { key: 'carpetArea', label: 'Carpet Area', type: 'number', unit: 'sq ft' },
    { key: 'floor', label: 'Floor', type: 'dropdown', options: ['Ground', 'Basement', '1st', '2nd', '3rd', '4th', '5th', '6th+', 'Terrace'] },
    { key: 'roadWidth', label: 'Road Width in Front', type: 'number', unit: 'ft' },
    { key: 'expectedSalePrice', label: 'Expected Sale Price', type: 'text', placeholder: 'Per sq ft OR total amount', hasCFP: true },
    { key: 'buildingStatus', label: 'Building Status', type: 'dropdown', options: ['Ready to Move In', 'Under Construction'] },
    { key: 'buildingType', label: 'Building Type', type: 'dropdown', options: ['Grade A', 'Standalone'] },
    { key: 'parking', label: 'Parking', type: 'text', placeholder: 'Available / Not Available / Details' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Free-text summary' },
  ],

  // Sale - Office (no fixed floor dropdown, no road width)
  sale_office: [
    { key: 'locationArea', label: 'Location / Area', type: 'text', placeholder: 'Area / locality name' },
    { key: 'superBuiltUpArea', label: 'Super Built-up Area (SBU)', type: 'number', unit: 'sq ft' },
    { key: 'carpetArea', label: 'Carpet Area', type: 'number', unit: 'sq ft' },
    { key: 'floor', label: 'Floor', type: 'text', placeholder: 'e.g. 3rd Floor, Full Building, Ground + 1st' },
    { key: 'expectedSalePrice', label: 'Expected Sale Price', type: 'text', placeholder: 'Per sq ft OR total', hasCFP: true },
    { key: 'buildingStatus', label: 'Building Status', type: 'dropdown', options: ['Ready to Move In', 'Under Construction'] },
    { key: 'buildingType', label: 'Building Type', type: 'dropdown', options: ['Grade A', 'Business Park', 'Standalone'] },
    { key: 'parking', label: 'Parking', type: 'text', placeholder: 'Available / Not Available / Details' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Free-text summary' },
  ],

  // Sale - Land / Plot
  sale_land_plot: [
    { key: 'locationArea', label: 'Location / Area', type: 'text', placeholder: 'Area / locality name' },
    { key: 'plotArea', label: 'Plot Area', type: 'text', placeholder: 'sq yards / acres' },
    { key: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'e.g. 50 ft x 100 ft' },
    { key: 'roadWidth', label: 'Road Width in Front', type: 'number', unit: 'ft' },
    { key: 'expectedSalePrice', label: 'Expected Sale Price', type: 'text', placeholder: 'Per sq yard or total', hasCFP: true },
    { key: 'landUseZoning', label: 'Land Use / Zoning', type: 'dropdown', options: ['Commercial', 'Mixed Use', 'Residential', 'Industrial'] },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Free-text summary' },
  ],

  // Sale - Rental Income Properties
  sale_rental_income: [
    { key: 'locationArea', label: 'Location / Area', type: 'text', placeholder: 'Area / locality name' },
    { key: 'propertyType', label: 'Property Type', type: 'dropdown', options: ['Office', 'Retail', 'Warehouse', 'Mixed Use', 'Other'] },
    { key: 'superBuiltUpArea', label: 'Super Built-up Area', type: 'number', unit: 'sq ft' },
    { key: 'carpetArea', label: 'Carpet Area', type: 'number', unit: 'sq ft' },
    { key: 'currentRent', label: 'Current Monthly Rent', type: 'text', placeholder: 'Monthly rental income' },
    { key: 'tenant', label: 'Tenant Name', type: 'text', placeholder: 'Current tenant' },
    { key: 'leaseExpiry', label: 'Lease Expiry', type: 'text', placeholder: 'e.g. Dec 2027' },
    { key: 'expectedReturns', label: 'Expected Yield / ROI', type: 'text', placeholder: 'e.g. 7-8%' },
    { key: 'expectedSalePrice', label: 'Expected Sale Price', type: 'text', placeholder: 'Total asking price', hasCFP: true },
    { key: 'buildingType', label: 'Building Type', type: 'dropdown', options: ['Grade A', 'Business Park', 'Standalone', 'Mixed Use'] },
    { key: 'parking', label: 'Parking', type: 'text', placeholder: 'Available / Not Available / Details' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Free-text summary' },
  ],

  // Sale - Investment Options
  sale_investment: [
    { key: 'locationArea', label: 'Location / Area', type: 'text', placeholder: 'Area / locality name' },
    { key: 'investmentType', label: 'Type of Investment', type: 'dropdown', options: ['Pre-leased', 'Under Construction', 'REIT', 'Other'] },
    { key: 'assetSize', label: 'Asset Size / Area', type: 'text', placeholder: 'Number + unit' },
    { key: 'expectedReturns', label: 'Expected Returns / Yield', type: 'text', placeholder: 'e.g. 8%' },
    { key: 'expectedPrice', label: 'Expected Price', type: 'text', placeholder: 'Total investment value', hasCFP: true },
    { key: 'tenant', label: 'Tenant (if pre-leased)', type: 'text', placeholder: 'Optional' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Free-text summary' },
  ],
};

export function getFieldsForCategory(transactionType: string, category: string): FieldDefinition[] {
  const key = `${transactionType}_${category}`;
  return CATEGORY_FIELDS[key] || [];
}

export const CATEGORIES = {
  lease: [
    { key: 'retail', label: 'Retail', icon: '🏪' },
    { key: 'office', label: 'Office', icon: '🏢' },
    { key: 'coworking', label: 'Co-working Space', icon: '💼' },
    { key: 'commercial_plot', label: 'Commercial Plot', icon: '📐' },
  ],
  sale: [
    { key: 'retail', label: 'Retail', icon: '🏪' },
    { key: 'office', label: 'Office', icon: '🏢' },
    { key: 'rental_income', label: 'Rental Income Properties', icon: '🏠' },
    { key: 'investment', label: 'Investment Options', icon: '💰' },
  ],
};
