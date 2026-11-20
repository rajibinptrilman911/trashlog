import React from 'react';
import { 
  Scale, 
  Leaf, 
  Zap, 
  Trees, 
  RotateCcw,
  Sparkles,
  Info,
  ArrowUpRight
} from 'lucide-react';
import { useWaste } from '../context/WasteContext';
import { StatCard } from '../components/common/StatCard';
import { ImpactCharts } from '../components/dashboard/ImpactCharts';
import { RecentActivities } from '../components/dashboard/RecentActivities';
import type { WasteActivity } from '../types';

interface DashboardPageProps {
  onOpenAddModal: () => void;
  onSelectActivity: (act: WasteActivity) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenAddModal,
  onSelectActivity,
  onNavigateToTab
}) => {
  const { activities, summary, loading } = useWaste();

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Memuat metrik keberlanjutan...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome & Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Informasi Berkelanjutan • Circular Economy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Pantau Sirkularitas Sampah & Reduksi Karbon
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-4">
            TrashLog menghitung estimasi dampak lingkungan dari setiap kilogram sampah yang dialihkan dari Tempat Pemrosesan Akhir (TPA) menggunakan faktor emisi terverifikasi (IPCC & US EPA WARM).
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-sm hover:bg-emerald-50 transition-colors"
            >
              + Catat Aktivitas Sampah
            </button>
            <button
              onClick={() => onNavigateToTab('calculator')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md transition-colors flex items-center gap-1.5"
            >
              <span>Pelajari Rumus Sains Karbon</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
        <StatCard
          title="Sampah Terkelola"
          value={summary.totalWeightKg}
          unit="kg"
          icon={<Scale className="w-5 h-5" />}
          subtitle="Dialihkan dari TPA terbuka"
          badge="100% Sirkular"
          colorScheme="emerald"
        />

        <StatCard
          title="Reduksi Karbon (CO2e)"
          value={summary.totalCO2eAvoidedKg}
          unit="kg CO2e"
          icon={<Leaf className="w-5 h-5" />}
          subtitle="Estimasi gas rumah kaca dicegah"
          badge="IPCC Ref."
          colorScheme="cyan"
        />

        <StatCard
          title="Konservasi Energi"
          value={summary.totalEnergySavedKWh}
          unit="kWh"
          icon={<Zap className="w-5 h-5" />}
          subtitle="Penghematan energi primer"
          badge="Smelting/Pulp"
          colorScheme="amber"
        />

        <StatCard
          title="Serapan Pohon"
          value={summary.totalTreesEquivalent}
          unit="pohon/thn"
          icon={<Trees className="w-5 h-5" />}
          subtitle="Ekuivalen sekuestrasi karbon"
          badge="Arbor Day Eq."
          colorScheme="indigo"
        />

        <StatCard
          title="Rasio Pengalihan"
          value={summary.activityCount > 0 ? '100%' : '0%'}
          icon={<RotateCcw className="w-5 h-5" />}
          subtitle={`${summary.activityCount} transaksi tercatat`}
          badge="Circular Index"
          colorScheme="rose"
        />
      </div>

      {/* Charts Section */}
      <ImpactCharts activities={activities} />

      {/* Grid: Recent Feed & Circular Knowledge Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivities
            activities={activities}
            onSelectActivity={onSelectActivity}
            onViewAll={() => onNavigateToTab('history')}
          />
        </div>

        {/* Circular Economy Educational Tip Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
              <Info className="w-4 h-4" />
              <span>Integritas Ilmiah & Keberlanjutan</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Mengapa Reduksi Karbon Sampah Menggunakan Estimasi?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed space-y-2 mb-3">
              Dalam ilmu <em>Life Cycle Assessment</em> (LCA), emisi yang dihindari dihitung dari perbedaan antara skenario dasar (pembuangan ke TPA tanpa penangkapan metana) dengan skenario sirkular (daur ulang, pengomposan).
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sebagai mahasiswa Sistem Informasi Berkelanjutan, pelaporan data yang transparan dan bersumber dari referensi valid (IPCC & US EPA) adalah bentuk kejujuran akademis.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400">Model Pengujian: EPA WARM v15</span>
            <button
              onClick={() => onNavigateToTab('calculator')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 shrink-0"
            >
              <span>Buka Kalkulator</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
