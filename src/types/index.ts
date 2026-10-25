export type WasteCategory =
  | 'organik'
  | 'plastik'
  | 'kertas'
  | 'logam'
  | 'kaca'
  | 'elektronik'
  | 'lainnya';

export type ManagementMethod =
  | 'daur_ulang'      // Daur Ulang Mekanik
  | 'kompos'          // Pengomposan / Biokonversi BSF
  | 'bank_sampah'     // Setor ke Bank Sampah
  | 'guna_ulang'      // Guna Ulang / Upcycling
  | 'sedekah_sampah'; // Sedekah / Donasi ke Pengepul Terverifikasi

export interface EmissionFactor {
  category: WasteCategory;
  name: string;
  factorKgCO2ePerKg: number; // Pengurangan emisi per kg (kg CO2e dihindari / kg sampah)
  energySavedKWhPerKg: number; // Energi dihemat (kWh / kg)
  waterSavedLiterPerKg?: number; // Air dihemat (liter / kg)
  referenceSource: string; // Sumber referensi akademis/institusional resmi
  referenceUrl?: string;
  description: string;
  subcategories: string[];
  badgeColor: string;
}

export interface WasteActivity {
  id: string;
  date: string; // YYYY-MM-DD
  category: WasteCategory;
  subcategory: string;
  weightKg: number;
  method: ManagementMethod;
  location: string;
  notes?: string;
  co2eAvoidedKg: number; // Estimasi dihitung
  energySavedKWh: number; // Estimasi dihitung
  treesEquivalent: number; // Estimasi pohon diimbangi
  createdAt: string;
  updatedAt: string;
}

export interface WasteFormData {
  date: string;
  category: WasteCategory;
  subcategory: string;
  weightKg: number | string;
  method: ManagementMethod;
  location: string;
  notes?: string;
}

export interface ImpactSummary {
  totalWeightKg: number;
  totalCO2eAvoidedKg: number;
  totalEnergySavedKWh: number;
  totalTreesEquivalent: number;
  landfillDiversionKg: number;
  activityCount: number;
  diversionRatePercent: number; // Rasio sirkularitas terhadap total estimasi
}

export interface FilterState {
  search: string;
  category: string;
  method: string;
  startDate: string;
  endDate: string;
  sortBy: 'date-desc' | 'date-asc' | 'weight-desc' | 'weight-asc' | 'co2-desc';
}

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
