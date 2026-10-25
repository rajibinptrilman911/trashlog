import { EMISSION_FACTORS, TREE_CO2_SEQUESTRATION_KG_PER_YEAR } from '../config/emissionFactors';
import type { WasteActivity, WasteCategory, ImpactSummary } from '../types';

export interface CalculatedImpactResult {
  co2eAvoidedKg: number;
  energySavedKWh: number;
  treesEquivalent: number;
  waterSavedLiter: number;
  formulaDescription: string;
}

/**
 * Menghitung estimasi dampak lingkungan secara transparan berdasarkan faktor emisi terverifikasi.
 * 
 * @param category Kategori material sampah
 * @param weightKg Berat material dalam kilogram
 */
export function calculateWasteImpact(category: WasteCategory, weightKg: number): CalculatedImpactResult {
  const factor = EMISSION_FACTORS[category] || EMISSION_FACTORS.lainnya;
  const safeWeight = Math.max(0, Number(weightKg) || 0);

  const co2eAvoidedKg = Number((safeWeight * factor.factorKgCO2ePerKg).toFixed(2));
  const energySavedKWh = Number((safeWeight * factor.energySavedKWhPerKg).toFixed(2));
  const treesEquivalent = Number((co2eAvoidedKg / TREE_CO2_SEQUESTRATION_KG_PER_YEAR).toFixed(2));
  const waterSavedLiter = Number(((factor.waterSavedLiterPerKg || 0) * safeWeight).toFixed(2));

  const formulaDescription = `${safeWeight} kg × ${factor.factorKgCO2ePerKg} kg CO2e/kg = ${co2eAvoidedKg} kg CO2e`;

  return {
    co2eAvoidedKg,
    energySavedKWh,
    treesEquivalent,
    waterSavedLiter,
    formulaDescription
  };
}

/**
 * Menghitung agregat total dampak dari daftar seluruh aktivitas pengelolaan sampah
 */
export function aggregateImpactSummary(activities: WasteActivity[]): ImpactSummary {
  const totalWeightKg = Number(
    activities.reduce((acc, curr) => acc + (Number(curr.weightKg) || 0), 0).toFixed(2)
  );

  const totalCO2eAvoidedKg = Number(
    activities.reduce((acc, curr) => acc + (Number(curr.co2eAvoidedKg) || 0), 0).toFixed(2)
  );

  const totalEnergySavedKWh = Number(
    activities.reduce((acc, curr) => acc + (Number(curr.energySavedKWh) || 0), 0).toFixed(2)
  );

  const totalTreesEquivalent = Number(
    (totalCO2eAvoidedKg / TREE_CO2_SEQUESTRATION_KG_PER_YEAR).toFixed(2)
  );

  // Estimasi pengalihan dari Tempat Pemrosesan Akhir (TPA)
  const landfillDiversionKg = totalWeightKg;
  
  // Dalam kerangka circular economy, setiap kg sampah yang dikelola dengan metode 
  // daur ulang/kompos/bank sampah mengalihkan 100% material tersebut dari TPA liar
  const diversionRatePercent = activities.length > 0 ? 100 : 0;

  return {
    totalWeightKg,
    totalCO2eAvoidedKg,
    totalEnergySavedKWh,
    totalTreesEquivalent,
    landfillDiversionKg,
    activityCount: activities.length,
    diversionRatePercent
  };
}

/**
 * Export data aktivitas ke format CSV untuk pelaporan tugas akhir
 */
export function exportActivitiesToCSV(activities: WasteActivity[]): void {
  const headers = [
    'ID',
    'Tanggal',
    'Kategori',
    'Sub-Kategori',
    'Metode Pengelolaan',
    'Berat (kg)',
    'Lokasi',
    'Estimasi CO2e Dihindari (kg)',
    'Energi Dihemat (kWh)',
    'Ekuivalen Pohon',
    'Catatan'
  ];

  const rows = activities.map(item => [
    `"${item.id}"`,
    `"${item.date}"`,
    `"${item.category}"`,
    `"${item.subcategory || ''}"`,
    `"${item.method}"`,
    item.weightKg,
    `"${item.location.replace(/"/g, '""')}"`,
    item.co2eAvoidedKg,
    item.energySavedKWh,
    item.treesEquivalent,
    `"${(item.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ecotrack_laporan_keberlanjutan_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data aktivitas ke format JSON backup
 */
export function exportActivitiesToJSON(activities: WasteActivity[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activities, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `ecotrack_data_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
