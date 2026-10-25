import React from 'react';
import type { WasteActivity } from '../../types';
import { EMISSION_FACTORS } from '../../config/emissionFactors';
import { ArrowRight, Eye, Calendar, MapPin, Sparkles } from 'lucide-react';

interface RecentActivitiesProps {
  activities: WasteActivity[];
  onSelectActivity: (act: WasteActivity) => void;
  onViewAll: () => void;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  onSelectActivity,
  onViewAll
}) => {
  const recent = activities.slice(0, 5);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Aktivitas Pengelolaan Terbaru</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Live
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log pencatatan dan reduksi jejak karbon terkini
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
        >
          <span>Lihat Semua ({activities.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">
          Belum ada catatan aktivitas sampah. Klik tombol <strong>Catat Sampah Baru</strong> untuk memulai.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recent.map(item => {
            const factor = EMISSION_FACTORS[item.category] || EMISSION_FACTORS.lainnya;
            return (
              <div
                key={item.id}
                onClick={() => onSelectActivity(item)}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase border ${factor.badgeColor}`}>
                    {item.category.slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.subcategory || factor.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.weightKg} kg
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>-{item.co2eAvoidedKg} kg CO2e</span>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
