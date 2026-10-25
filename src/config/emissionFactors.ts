import type { EmissionFactor, WasteCategory, ManagementMethod } from '../types';

/**
 * FAKTOR EMISI PENGURANGAN KARBON (EMISSION AVOIDANCE FACTORS)
 * 
 * Sesuai integritas akademik, faktor-faktor ini bersumber dari model LCA (Life Cycle Assessment)
 * standar internasional:
 * 1. US EPA WARM (Waste Reduction Model) Version 15 (2020)
 * 2. IPCC 2019 Refinement to the 2006 Guidelines for National Greenhouse Gas Inventories (Vol. 5: Waste)
 * 3. UK DEFRA / DESNZ Greenhouse Gas Conversion Factors for Company Reporting (2023)
 * 4. Plastics Europe & International Aluminium Institute (IAI) Life Cycle Assessments
 * 5. UN ITU / Global E-waste Monitor 2024
 */

export const EMISSION_FACTORS: Record<WasteCategory, EmissionFactor> = {
  organik: {
    category: 'organik',
    name: 'Sampah Organik & Sisa Makanan',
    factorKgCO2ePerKg: 0.53, // Menghindari degradasi anaerobik (CH4) di TPA terbuka
    energySavedKWhPerKg: 0.15, // Biogas potensial atau konservasi energi pupuk kimia
    waterSavedLiterPerKg: 12.0, // Retensi air tanah dari kompos
    referenceSource: 'IPCC (2019) Vol. 5 Waste & US EPA WARM v15 (Composting vs Landfill Anaerobic Digestion)',
    referenceUrl: 'https://www.epa.gov/warm',
    description: 'Pengomposan aerobik atau biokonversi maggot BSF mencegah dekomposisi anaerobik yang menghasilkan gas metana (CH4) berpotensi pemanasan global 28x lebih tinggi daripada CO2.',
    subcategories: ['Sisa Makanan / Sayur', 'Dedaunan & Ranting', 'Ampas Kopi / Teh', 'Kulit Buah', 'Sisa Nasi & Roti'],
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
  },
  plastik: {
    category: 'plastik',
    name: 'Plastik Polimer (PET, HDPE, PP, LDPE)',
    factorKgCO2ePerKg: 1.42, // Menghindari ekstraksi minyak bumi & polimerisasi virgin resin
    energySavedKWhPerKg: 5.60, // Penghematan energi termal & elektrik proses cracking
    waterSavedLiterPerKg: 25.0,
    referenceSource: 'US EPA WARM v15 (Plastic Mechanical Recycling) & Plastics Europe Eco-Profiles (2021)',
    referenceUrl: 'https://plasticseurope.org/sustainability/',
    description: 'Daur ulang mekanik plastik menggantikan kebutuhan resin berbasis minyak bumi perawan, memangkas emisi pemurnian nafta dan polimerisasi industri petrokimia.',
    subcategories: ['Botol Minuman (PET)', 'Tutup Botol & Jerigen (HDPE)', 'Cup Minuman / Wadah (PP)', 'Kantong Plastik / Film (LDPE)', 'Styrofoam / Lainnya (PS/Other)'],
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700'
  },
  kertas: {
    category: 'kertas',
    name: 'Kertas, Karton & Kardus Box',
    factorKgCO2ePerKg: 1.08, // Mencegah penebangan pohon dan proses pulping kimia
    energySavedKWhPerKg: 4.10, // Penghematan energi pulping mekanik & termal
    waterSavedLiterPerKg: 26.0, // Daur ulang kertas menghemat air drastis dibanding virgin pulp
    referenceSource: 'UK DEFRA / DESNZ GHG Conversion Factors (2023) & US EPA WARM v15 (Corrugated Containers)',
    referenceUrl: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting',
    description: 'Daur ulang 1 ton kertas dan kardus mempertahankan sekuestrasi karbon pohon di hutan, menghemat sekitar 17 batang pohon dan puluhan ribu liter air bersih.',
    subcategories: ['Kardus Box / Corrugated', 'Kertas HVS & Dokumen', 'Koran & Majalah Bekas', 'Buku & Paperboard', 'Tetra Pak / Kemasan Karton'],
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700'
  },
  logam: {
    category: 'logam',
    name: 'Logam & Aluminium (Kaleng & Besi)',
    factorKgCO2ePerKg: 8.14, // Aluminium smelting sangat intensif energi (Hall-Héroult)
    energySavedKWhPerKg: 14.00, // Daur ulang aluminium hemat 95% energi primer
    waterSavedLiterPerKg: 40.0,
    referenceSource: 'International Aluminium Institute (IAI LCA 2022) & US EPA WARM v15',
    referenceUrl: 'https://international-aluminium.org/',
    description: 'Peleburan kaleng aluminium dan logam daur ulang hanya memerlukan 5% energi dibandingkan peleburan bijih bauksit primer, menghasilkan reduksi emisi karbon yang sangat masif.',
    subcategories: ['Kaleng Minuman Aluminium', 'Kaleng Susu / Biskuit (Besi)', 'Paku & Kawat Bekas', 'Peralatan Masak Rusak', 'Seng & Logam Campur'],
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
  },
  kaca: {
    category: 'kaca',
    name: 'Kaca & Botol Beling (Cullet)',
    factorKgCO2ePerKg: 0.31, // Mengurangi suhu tanur peleburan & dekomposisi soda ash
    energySavedKWhPerKg: 1.20,
    waterSavedLiterPerKg: 8.0,
    referenceSource: 'FEVE (European Container Glass Federation LCA) & US EPA WARM v15',
    referenceUrl: 'https://feve.org/glass-recycling-circular-economy/',
    description: 'Setiap 10% pecahan kaca (cullet) yang ditambahkan ke tanur peleburan menurunkan temperatur tungku dan menekan emisi dekomposisi bahan baku mineral (silika, soda abu, dan kapur).',
    subcategories: ['Botol Kaca Bening', 'Botol Kaca Cokelat/Hijau', 'Stoples Beling', 'Pecahan Kaca Lembaran'],
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300 dark:border-teal-700'
  },
  elektronik: {
    category: 'elektronik',
    name: 'Sampah Elektronik (E-Waste & Baterai)',
    factorKgCO2ePerKg: 12.50, // Urban mining tembaga, emas, litium menghindari penambangan bijih primer
    energySavedKWhPerKg: 22.00,
    waterSavedLiterPerKg: 85.0,
    referenceSource: 'Global E-waste Monitor (UN ITU / UNITAR 2024) & WEEE Forum LCA Models',
    referenceUrl: 'https://ewastemonitor.info/',
    description: 'Urban mining melalui pemulihan logam mulia dan logam tanah jarang dari e-waste menghindari penambangan tanah keras berkadar karbon tinggi dan mencegah kontaminasi racun B3.',
    subcategories: ['Kabel & Charger Rusak', 'Ponsel / Komponen Gadget', 'Baterai Kering / Aki', 'Motherboard / PCB', 'Lampu LED / Komponen Elektronik'],
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700'
  },
  lainnya: {
    category: 'lainnya',
    name: 'Kategori Lainnya (Tekstil, Ban, Karet)',
    factorKgCO2ePerKg: 3.60, // Pergantian serat virgin poliester/katun
    energySavedKWhPerKg: 6.80,
    waterSavedLiterPerKg: 50.0,
    referenceSource: 'Ellen MacArthur Foundation Circular Fibres Initiative & WRAP UK LCA',
    referenceUrl: 'https://ellenmacarthurfoundation.org/a-new-textiles-economy',
    description: 'Pemanfaatan kembali tekstil dan material sekunder memutus rantai emisi pembudidayaan serat kapas intensif air atau produksi poliester berbasis petrokimia.',
    subcategories: ['Pakaian Bekas Layak Pakai', 'Kain Perca / Majun', 'Karet & Ban Bekas', 'Limbah Sepatu / Kulit'],
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300 dark:border-rose-700'
  }
};

/**
 * FAKTOR PENYERAPAN KARBON POHON (TREE CARBON SEQUESTRATION EQUIVALENCE)
 * Berdasarkan standar Arbor Day Foundation & US Forest Service:
 * 1 pohon dewasa mampu menyerap rata-rata 48 lbs (~21.77 kg) CO2 per tahun.
 */
export const TREE_CO2_SEQUESTRATION_KG_PER_YEAR = 21.77;

/**
 * METHOD METADATA
 */
export const MANAGEMENT_METHODS_META: Record<ManagementMethod, { label: string; badge: string; description: string }> = {
  daur_ulang: {
    label: 'Daur Ulang Mekanik',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-300',
    description: 'Pencacahan, pembersihan, dan peleburan kembali menjadi bahan baku sekunder.'
  },
  kompos: {
    label: 'Pengomposan / Biokonversi BSF',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border-emerald-300',
    description: 'Penguraian biologis aerobik atau biokonversi larva lalat Black Soldier Fly.'
  },
  bank_sampah: {
    label: 'Setor ke Bank Sampah',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200 border-teal-300',
    description: 'Pencatatan timbangan dan integrasi dengan sirkularitas terdesentralisasi.'
  },
  guna_ulang: {
    label: 'Guna Ulang / Upcycling',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200 border-violet-300',
    description: 'Modifikasi barang bekas tanpa proses industri berat untuk fungsi bernilai baru.'
  },
  sedekah_sampah: {
    label: 'Sedekah Sampah / Donasi',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border-amber-300',
    description: 'Pemberian kepada agregator sosial atau pemulung binaan untuk sirkulasi ekonomi.'
  }
};
