import React from 'react';
import { 
  X, 
  Trash2, 
  Edit3, 
  Calendar, 
  MapPin, 
  Tag, 
  ExternalLink,
  Car,
  Smartphone,
  Trees,
  CheckCircle2,
  FileText
} from 'lucide-react';
import type { WasteActivity } from '../../types';
import { EMISSION_FACTORS, MANAGEMENT_METHODS_META } from '../../config/emissionFactors';

interface ActivityDetailModalProps {
  activity: WasteActivity | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (activity: WasteActivity) => void;
  onDelete: (id: string) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !activity) return null;

  const factor = EMISSION_FACTORS[activity.category] || EMISSION_FACTORS.lainnya;
  const methodMeta = MANAGEMENT_METHODS_META[activity.method];

  // Equivalencies for tangible understanding:
  // - Average passenger gasoline car emits ~0.192 kg CO2 per km (EPA/EEA)
  const kmCarEquivalent = Number((activity.co2eAvoidedKg / 0.192).toFixed(1));
  // - Smartphone full charge consumes ~0.012 kWh (~0.009 kg CO2e)
  const phoneChargeEquivalent = Math.round(activity.co2eAvoidedKg / 0.009);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${factor.badgeColor}`}>
              {activity.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {activity.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Info */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {activity.subcategory || factor.name}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {activity.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {activity.location}
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {methodMeta ? methodMeta.label : activity.method}
              </span>
            </div>
          </div>

          {/* Environmental Impact Highlight Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center">
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                Emisi CO2e Dihindari
              </div>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 my-0.5">
                {activity.co2eAvoidedKg}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                kg CO2e
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-center">
              <div className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                Konservasi Energi
              </div>
              <div className="text-2xl font-bold text-teal-900 dark:text-teal-100 my-0.5">
                {activity.energySavedKWh}
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400">
                kWh listrik dihemat
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/60 text-center col-span-2 sm:col-span-1">
              <div className="text-xs text-cyan-700 dark:text-cyan-400 font-medium">
                Pohon Terserap
              </div>
              <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-100 my-0.5">
                {activity.treesEquivalent}
              </div>
              <div className="text-[10px] text-cyan-600 dark:text-cyan-400">
                pohon ekuivalen/thn
              </div>
            </div>
          </div>

          {/* Scientific Calculation Box */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              Transparansi Rumus & Faktor Emisi Ilmiah
            </h4>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
              CO2e Dihindari = {activity.weightKg} kg × {factor.factorKgCO2ePerKg} kg CO2e/kg = <strong>{activity.co2eAvoidedKg} kg CO2e</strong>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {factor.description}
            </p>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span><strong>Sumber Ilmiah:</strong> {factor.referenceSource}</span>
              {factor.referenceUrl && (
                <a
                  href={factor.referenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-600 hover:underline"
                >
                  <span>Referensi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Tangible Equivalence */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
            <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Dampak Konkret Terhadap Kehidupan Sehari-hari
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Setara berkendara mobil bensin sejauh <strong>{kmCarEquivalent} km</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Setara daya pengisian <strong>{phoneChargeEquivalent} kali</strong> smartphone</span>
              </div>
              <div className="flex items-center gap-2">
                <Trees className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Serapan setara <strong>{activity.treesEquivalent} pohon</strong> selama setahun penuh</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {activity.notes && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Catatan Petugas / Pemilahan:
              </div>
              <p className="text-slate-600 dark:text-slate-400 italic">
                "{activity.notes}"
              </p>
            </div>
          )}

          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
            <span>Dibuat: {new Date(activity.createdAt).toLocaleString('id-ID')}</span>
            <span>Diperbarui: {new Date(activity.updatedAt).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <button
            onClick={() => {
              onDelete(activity.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Aktivitas</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(activity);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Data</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
