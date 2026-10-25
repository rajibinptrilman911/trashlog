import type { WasteActivity } from '../types';
import { calculateWasteImpact } from '../utils/calculator';

const initialItems: Array<{
  id: string;
  date: string;
  category: 'organik' | 'plastik' | 'kertas' | 'logam' | 'kaca' | 'elektronik' | 'lainnya';
  subcategory: string;
  weightKg: number;
  method: 'daur_ulang' | 'kompos' | 'bank_sampah' | 'guna_ulang' | 'sedekah_sampah';
  location: string;
  notes: string;
}> = [
  {
    id: 'act-001',
    date: '2026-10-18',
    category: 'organik',
    subcategory: 'Sisa Makanan / Sayur',
    weightKg: 24.5,
    method: 'kompos',
    location: 'Komposter Komunal Kampus',
    notes: 'Pengolahan sisa sayuran dan kulit buah dari kantin mahasiswa menggunakan metode komposter takakura aerobik.'
  },
  {
    id: 'act-002',
    date: '2026-10-19',
    category: 'plastik',
    subcategory: 'Botol Minuman (PET)',
    weightKg: 12.8,
    method: 'bank_sampah',
    location: 'Bank Sampah Unit 05 Mandiri',
    notes: 'Penyetoran botol plastik bersih tanpa tutup dan label yang telah dikempeskan untuk efisiensi volume.'
  },
  {
    id: 'act-003',
    date: '2026-10-20',
    category: 'kertas',
    subcategory: 'Kardus Box / Corrugated',
    weightKg: 35.0,
    method: 'daur_ulang',
    location: 'Pusat Daur Ulang TPS 3R',
    notes: 'Kardus bekas pembungkus inventaris laboratorium komputer yang dilipat rapi.'
  },
  {
    id: 'act-004',
    date: '2026-10-21',
    category: 'logam',
    subcategory: 'Kaleng Minuman Aluminium',
    weightKg: 6.2,
    method: 'bank_sampah',
    location: 'Bank Sampah Berkah Hijau',
    notes: 'Kaleng minuman ringan aluminium yang dipipihkan. Nilai penghematan emisi smelting sangat tinggi.'
  },
  {
    id: 'act-005',
    date: '2026-10-22',
    category: 'kaca',
    subcategory: 'Botol Kaca Bening',
    weightKg: 18.0,
    method: 'guna_ulang',
    location: 'Workshop Upcycling Kreatif',
    notes: 'Botol kaca sirup dan saus dibersihkan untuk dijadikan wadah rempah dan vas hidroponik.'
  },
  {
    id: 'act-006',
    date: '2026-10-23',
    category: 'elektronik',
    subcategory: 'Kabel & Charger Rusak',
    weightKg: 4.5,
    method: 'daur_ulang',
    location: 'Drop Point E-Waste Kotamadya',
    notes: 'Kabel USB, adaptor laptop rusak, dan PCB bekas modul mikrokontroler proyek perkuliahan.'
  },
  {
    id: 'act-007',
    date: '2026-10-24',
    category: 'organik',
    subcategory: 'Dedaunan & Ranting',
    weightKg: 42.0,
    method: 'kompos',
    location: 'Biokonversi Maggot BSF Center',
    notes: 'Serasah daun kering dari taman kampus dicacah untuk campuran substrat maggot dan pengomposan aerobik.'
  },
  {
    id: 'act-008',
    date: '2026-10-25',
    category: 'plastik',
    subcategory: 'Tutup Botol & Jerigen (HDPE)',
    weightKg: 8.4,
    method: 'daur_ulang',
    location: 'Sentra Pencacahan Plastik Mandiri',
    notes: 'Pencacahan plastik HDPE grade 2 untuk biji plastik injection moulding produk papan daur ulang.'
  }
];

export const MOCK_ACTIVITIES: WasteActivity[] = initialItems.map(item => {
  const impact = calculateWasteImpact(item.category, item.weightKg);
  return {
    ...item,
    co2eAvoidedKg: impact.co2eAvoidedKg,
    energySavedKWh: impact.energySavedKWh,
    treesEquivalent: impact.treesEquivalent,
    createdAt: `${item.date}T08:30:00.000Z`,
    updatedAt: `${item.date}T08:30:00.000Z`
  };
});
