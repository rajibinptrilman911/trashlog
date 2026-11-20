import React from 'react';
import { 
  LayoutDashboard, 
  Trash2, 
  Calculator, 
  ShieldCheck, 
  PlusCircle, 
  Database,
  ExternalLink 
} from 'lucide-react';
import { useWaste } from '../../context/WasteContext';
import { Logo } from '../common/Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenConfigModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenConfigModal
}) => {
  const { summary, dataSource } = useWaste();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Metrik',
      desc: 'Ringkasan & Analitik',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'history',
      label: 'Kelola & Riwayat',
      desc: 'CRUD & Filter Data',
      icon: <Trash2 className="w-5 h-5" />
    },
    {
      id: 'calculator',
      label: 'Kalkulator Karbon',
      desc: 'Simulator & Faktor Emisi',
      icon: <Calculator className="w-5 h-5" />
    },
    {
      id: 'green-audit',
      label: 'Green Software & Audit',
      desc: 'Prinsip GSF & Database',
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 p-5 select-none justify-between">
      <div>
        {/* Brand Header */}
        <div className="px-2 py-2 mb-6">
          <Logo variant="horizontal" size="md" showSubtitle={true} />
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 mb-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow hover:shadow-emerald-600/30 active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Catat Sampah Baru</span>
        </button>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Menu Utama
          </div>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                  {item.icon}
                </span>
                <div className="flex-1">
                  <div className="leading-tight">{item.label}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal leading-tight">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Academic Credential */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {/* Storage State Indicator */}
        <button
          onClick={onOpenConfigModal}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs text-left hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {dataSource === 'supabase' ? 'Supabase PostgreSQL' : 'Local Storage Cache'}
              </div>
              <div className="text-[10px] text-slate-400">
                {dataSource === 'supabase' ? 'Cloud Terhubung' : 'Siap Diintegrasikan'}
              </div>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Impact Live Counter Badge */}
        <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 text-xs">
          <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-300 font-semibold mb-1">
            <span>Dampak Kumulatif</span>
            <span>{summary.totalWeightKg} kg</span>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-tight">
            Menghindari estimasi <strong>{summary.totalCO2eAvoidedKg} kg CO2e</strong> dari atmosfer bumi.
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400 dark:text-slate-500">
          Tugas Akhir Sistem Informasi Berkelanjutan
        </div>
      </div>
    </aside>
  );
};
