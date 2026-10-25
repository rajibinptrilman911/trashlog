import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  Save, 
  Sparkles, 
  Info,
  Calendar,
  Weight,
  MapPin,
  FileText,
  Tag
} from 'lucide-react';
import type { WasteActivity, WasteCategory, ManagementMethod, WasteFormData } from '../../types';
import { EMISSION_FACTORS, MANAGEMENT_METHODS_META } from '../../config/emissionFactors';
import { calculateWasteImpact } from '../../utils/calculator';
import { useWaste } from '../../context/WasteContext';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityToEdit?: WasteActivity | null;
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  activityToEdit
}) => {
  const { addActivity, updateActivity } = useWaste();

  const [date, setDate] = useState<string>('');
  const [category, setCategory] = useState<WasteCategory>('plastik');
  const [subcategory, setSubcategory] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [method, setMethod] = useState<ManagementMethod>('daur_ulang');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activityToEdit) {
      setDate(activityToEdit.date);
      setCategory(activityToEdit.category);
      setSubcategory(activityToEdit.subcategory);
      setWeightKg(String(activityToEdit.weightKg));
      setMethod(activityToEdit.method);
      setLocation(activityToEdit.location);
      setNotes(activityToEdit.notes || '');
    } else {
      // Default initial form
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setCategory('plastik');
      setSubcategory(EMISSION_FACTORS.plastik.subcategories[0]);
      setWeightKg('5');
      setMethod('daur_ulang');
      setLocation('Bank Sampah Unit Kampus');
      setNotes('');
    }
    setErrors({});
  }, [activityToEdit, isOpen]);

  // Update subcategory options when category changes
  const handleCategoryChange = (newCat: WasteCategory) => {
    setCategory(newCat);
    const subcats = EMISSION_FACTORS[newCat].subcategories;
    setSubcategory(subcats[0] || '');
    
    // Auto-adjust default method for better UX (e.g. organik -> kompos)
    if (newCat === 'organik' && method === 'daur_ulang') {
      setMethod('kompos');
    } else if (newCat !== 'organik' && method === 'kompos') {
      setMethod('daur_ulang');
    }
  };

  // Real-time calculation preview
  const parsedWeight = parseFloat(weightKg) || 0;
  const liveImpact = calculateWasteImpact(category, parsedWeight);
  const currentFactor = EMISSION_FACTORS[category];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!date) {
      errs.date = 'Tanggal aktivitas harus diisi.';
    }
    if (!weightKg || isNaN(Number(weightKg)) || Number(weightKg) <= 0) {
      errs.weightKg = 'Berat sampah harus berupa angka lebih besar dari 0 kg.';
    } else if (Number(weightKg) > 50000) {
      errs.weightKg = 'Berat sampah maksimal 50.000 kg per transaksi.';
    }
    if (!location.trim()) {
      errs.location = 'Lokasi / drop-point aktivitas harus diisi.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const formData: WasteFormData = {
      date,
      category,
      subcategory: subcategory.trim() || currentFactor.subcategories[0],
      weightKg: Number(weightKg),
      method,
      location: location.trim(),
      notes: notes.trim()
    };

    let ok = false;
    if (activityToEdit) {
      ok = await updateActivity(activityToEdit.id, formData);
    } else {
      ok = await addActivity(formData);
    }

    setSubmitting(false);
    if (ok) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              {activityToEdit ? <Save className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activityToEdit ? 'Edit Catatan Aktivitas Sampah' : 'Catat Aktivitas Pengelolaan Sampah'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data akan langsung dihitung dampaknya terhadap emisi CO2e & energi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {/* Tanggal & Berat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Tanggal Pengelolaan *
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors ${
                  errors.date ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.date && <p className="text-[11px] text-rose-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Weight className="w-3.5 h-3.5 text-slate-400" />
                Berat Material (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={weightKg}
                  onChange={e => setWeightKg(e.target.value)}
                  className={`w-full px-3.5 py-2.5 pr-12 rounded-xl border text-sm font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors ${
                    errors.weightKg ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  kg
                </span>
              </div>
              {errors.weightKg && <p className="text-[11px] text-rose-500 mt-1">{errors.weightKg}</p>}
            </div>
          </div>

          {/* Kategori Sampah */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Kategori Sampah *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(EMISSION_FACTORS) as WasteCategory[]).map(catKey => {
                const item = EMISSION_FACTORS[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => handleCategoryChange(catKey)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-semibold capitalize">{catKey}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-400 line-clamp-1">
                      {item.factorKgCO2ePerKg} kg CO2e/kg
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subkategori & Metode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sub-Kategori / Jenis Material
              </label>
              <select
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {currentFactor.subcategories.map(sub => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Metode Pengelolaan Sirkular *
              </label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as ManagementMethod)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {(Object.keys(MANAGEMENT_METHODS_META) as ManagementMethod[]).map(mKey => (
                  <option key={mKey} value={mKey}>
                    {MANAGEMENT_METHODS_META[mKey].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lokasi / Drop-point */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Lokasi Pengelolaan / Mitra Sirkular *
            </label>
            <input
              type="text"
              placeholder="Contoh: Bank Sampah Unit Kampus, Komposter Rumah Tangga, TPS 3R"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                errors.location ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.location && <p className="text-[11px] text-rose-500 mt-1">{errors.location}</p>}
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Catatan / Deskripsi (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Catatan kondisi material, proses pemilahan, atau nama petugas..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* REAL-TIME CARBON IMPACT PREVIEW BOX */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200/70 dark:border-emerald-900/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Estimasi Dampak Lingkungan (Real-time)</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                Faktor Emisi: {currentFactor.factorKgCO2ePerKg} kg CO2e/kg
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-emerald-200/40 dark:border-emerald-900/40 text-center">
              <div>
                <div className="text-base sm:text-lg font-bold text-emerald-800 dark:text-emerald-200">
                  {liveImpact.co2eAvoidedKg} <span className="text-xs font-normal">kg</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  CO2e Dihindari
                </div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold text-teal-800 dark:text-teal-200">
                  {liveImpact.energySavedKWh} <span className="text-xs font-normal">kWh</span>
                </div>
                <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                  Energi Dihemat
                </div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold text-emerald-800 dark:text-emerald-200">
                  {liveImpact.treesEquivalent} <span className="text-xs font-normal">pohon</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Ekuivalen Serapan/Thn
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-start gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Rumus:</strong> {liveImpact.formulaDescription}. Sumber: {currentFactor.referenceSource}.
              </span>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow hover:shadow-emerald-600/30 disabled:opacity-50"
          >
            {submitting ? (
              <span>Menyimpan...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{activityToEdit ? 'Simpan Perubahan' : 'Simpan Data Aktivitas'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
