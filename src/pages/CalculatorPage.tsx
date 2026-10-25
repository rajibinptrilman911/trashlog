import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  ExternalLink, 
  Zap, 
  Droplets, 
  Trees, 
  Car, 
  Smartphone, 
  Lightbulb,
  PlusCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import type { WasteCategory } from '../types';
import { EMISSION_FACTORS } from '../config/emissionFactors';
import { calculateWasteImpact } from '../utils/calculator';
import { useWaste } from '../context/WasteContext';

export const CalculatorPage: React.FC = () => {
  const { addActivity, showNotification } = useWaste();

  // Simulator Inputs
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>('plastik');
  const [weight, setWeight] = useState<number>(25);
  const [timeframe, setTimeframe] = useState<'sekali' | 'mingguan' | 'bulanan' | 'tahunan'>('sekali');

  const factor = EMISSION_FACTORS[selectedCategory];

  // Multiplier for timeframe
  const timeframeMultiplier = {
    sekali: 1,
    mingguan: 52,
    bulanan: 12,
    tahunan: 1
  }[timeframe];

  const effectiveWeight = weight * (timeframe === 'sekali' ? 1 : timeframeMultiplier);
  const impact = calculateWasteImpact(selectedCategory, effectiveWeight);

  // Equivalencies:
  // 1 km gasoline car ~ 0.192 kg CO2e
  const carKm = Number((impact.co2eAvoidedKg / 0.192).toFixed(1));
  // 1 smartphone charge ~ 0.009 kg CO2e
  const phoneCharges = Math.round(impact.co2eAvoidedKg / 0.009);
  // 10W LED bulb for 24 hours consumes 0.24 kWh ~ 0.18 kg CO2e in Indonesian grid (0.78 kg/kWh)
  const ledBulbDays = Math.round(impact.energySavedKWh / 0.24);

  const handleQuickAdd = async () => {
    const ok = await addActivity({
      date: new Date().toISOString().split('T')[0],
      category: selectedCategory,
      subcategory: factor.subcategories[0],
      weightKg: weight,
      method: selectedCategory === 'organik' ? 'kompos' : 'daur_ulang',
      location: 'Hasil Simulasi Kalkulator Karbon',
      notes: `Simulasi skenario ${timeframe}: ${weight} kg ${selectedCategory}.`
    });
    if (ok) {
      showNotification('success', `Hasil simulasi ${weight} kg ${selectedCategory} berhasil disimpan ke data aktivitas!`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>Scientific Carbon Impact Simulator</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Kalkulator & Simulator Jejak Karbon
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Hitung potensi pengurangan emisi gas rumah kaca (CO2e), penghematan energi, dan air bersih berdasarkan metodologi Life Cycle Assessment (LCA) standar US EPA dan IPCC.
        </p>
      </div>

      {/* Simulator Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Simulasi Skenario Pengurangan Emisi</span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            What-If Analysis
          </span>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step 1: Material */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              1. Pilih Material Sampah:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(EMISSION_FACTORS) as WasteCategory[]).map(catKey => {
                const item = EMISSION_FACTORS[catKey];
                const isSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSelectedCategory(catKey)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="text-xs font-bold capitalize text-slate-900 dark:text-white">
                      {catKey}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {item.factorKgCO2ePerKg} kg CO2e/kg
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Weight */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              2. Masukkan Bobot Sampah:
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0.5"
                  max="10000"
                  step="0.5"
                  value={weight}
                  onChange={e => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-lg text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800"
                />
                <span className="text-sm font-semibold text-slate-500">kg</span>
              </div>

              {/* Quick slider */}
              <input
                type="range"
                min="1"
                max="250"
                value={Math.min(weight, 250)}
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 kg</span>
                <span>50 kg</span>
                <span>100 kg</span>
                <span>250 kg</span>
              </div>

              {/* Timeframe selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                  Proyeksi Waktu:
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {(['sekali', 'mingguan', 'bulanan', 'tahunan'] as const).map(tf => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      className={`py-1.5 px-2 rounded-lg text-center font-medium capitalize transition-colors ${
                        timeframe === tf
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Realtime Calculated Results */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider mb-2">
                Hasil Estimasi Pengurangan
              </div>
              <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-1">
                {impact.co2eAvoidedKg} <span className="text-sm font-semibold">kg CO2e</span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300/80 mb-4">
                Total material: <strong>{effectiveWeight} kg</strong> ({timeframe !== 'sekali' ? `skenario 1 tahun dari ${weight} kg/${timeframe}` : 'satu kali aksi'})
              </p>

              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-emerald-200/50 dark:border-emerald-900/40">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Energi Listrik Dihemat
                  </span>
                  <span className="font-bold">{impact.energySavedKWh} kWh</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-emerald-200/50 dark:border-emerald-900/40">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                    Konservasi Air Bersih
                  </span>
                  <span className="font-bold">{impact.waterSavedLiter} Liter</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5">
                    <Trees className="w-3.5 h-3.5 text-emerald-600" />
                    Ekuivalen Serapan Pohon
                  </span>
                  <span className="font-bold">{impact.treesEquivalent} pohon/thn</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simpan Skenario Ini ke Riwayat</span>
            </button>
          </div>
        </div>

        {/* Tangible Equivalency Grid */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            Ekuivalensi Riil Terhadap Aktivitas Manusia:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {carKm} km
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Jarak tempuh mobil bensin yang emisi knalpotnya dinetralisir
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {phoneCharges.toLocaleString('id-ID')} ×
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Pengisian daya baterai smartphone dari 0 hingga 100%
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {ledBulbDays} Hari
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Daya operasional lampu LED penerangan hemat energi non-stop
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formula Transparency Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Pemisahan Input, Faktor Emisi, Rumus, dan Hasil (Integritas Akademik)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-1">
              Komponen 1: Data Input
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Diinput oleh pengguna berupa <strong>Bobot Sampah (kg)</strong> dan <strong>Kategori Material</strong> hasil penimbangan nyata di lapangan.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-1">
              Komponen 2: Faktor Emisi (EF)
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Konstanta ilmiah LCA berstandar internasional yang mencerminkan emisi dasar TPA dikurangi emisi pengolahan sirkular (kg CO2e/kg).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-1">
              Komponen 3: Rumus Matematika
            </div>
            <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 mt-1">
              CO2e = Bobot (kg) × EF
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-1">
              Komponen 4: Klasifikasi Hasil
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Dinyatakan secara eksplisit sebagai <strong>ESTIMASI DAMPAK LINGKUNGAN</strong>, bukan pengukuran emisi cerobong langsung.
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Reference Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Tabel Faktor Emisi & Sumber Referensi Akademis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Faktor konversi yang digunakan dalam sistem EcoTrack beserta rujukan literatur ilmiah resminya
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 uppercase font-bold text-[10px]">
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Faktor Emisi (kg CO2e/kg)</th>
                <th className="py-3 px-3">Faktor Energi (kWh/kg)</th>
                <th className="py-3 px-3">Konservasi Air (L/kg)</th>
                <th className="py-3 px-3">Rujukan Ilmiah Utama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(Object.keys(EMISSION_FACTORS) as WasteCategory[]).map(catKey => {
                const item = EMISSION_FACTORS[catKey];
                return (
                  <tr key={catKey} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-semibold capitalize text-slate-900 dark:text-white">
                      {catKey}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {item.factorKgCO2ePerKg}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                      {item.energySavedKWhPerKg}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                      {item.waterSavedLiterPerKg || '-'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-sm">
                      <div className="flex items-center gap-1.5">
                        <span>{item.referenceSource}</span>
                        {item.referenceUrl && (
                          <a
                            href={item.referenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 hover:underline shrink-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>Pernyataan Integritas Akademik:</strong> Angka faktor emisi di atas diambil langsung dari dokumentasi publik US Environmental Protection Agency (EPA WARM v15) dan Panduan Inventarisasi Gas Rumah Kaca Nasional IPCC 2019 Refinement. Sistem ini tidak memalsukan atau mengklaim reduksi karbon di luar batas metodologi ilmiah yang diakui.
          </div>
        </div>
      </div>
    </div>
  );
};
