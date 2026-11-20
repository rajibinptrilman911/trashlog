import React from 'react';
import { 
  Sun, 
  Moon, 
  Zap, 
  PlusCircle, 
  Database,
  Menu
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useWaste } from '../../context/WasteContext';

interface HeaderProps {
  activeTab: string;
  onOpenAddModal: () => void;
  onOpenConfigModal: () => void;
  onToggleMobileDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenAddModal,
  onOpenConfigModal,
  onToggleMobileDrawer
}) => {
  const { isDark, toggleDark, isEcoMode, toggleEcoMode } = useTheme();
  const { dataSource } = useWaste();

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Keberlanjutan',
      subtitle: 'Monitoring metrik sirkularitas sampah & reduksi karbon'
    },
    history: {
      title: 'Kelola & Riwayat Sampah',
      subtitle: 'Pencatatan, filter, pencarian, dan manajemen aktivitas'
    },
    calculator: {
      title: 'Kalkulator Jejak Karbon',
      subtitle: 'Simulasi penghematan emisi berbasis faktor emisi akademis'
    },
    'green-audit': {
      title: 'Green Software & Audit',
      subtitle: 'Implementasi efisiensi energi, karbon web, & integrasi database'
    }
  };

  const currentTab = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileDrawer}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden flex items-center shrink-0">
          <img src="/logo-icon.png" alt="TrashLog" className="w-7 h-7 object-contain" />
        </div>

        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {currentTab.title}
          </h2>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
            {currentTab.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend Indicator Pill */}
        <button
          onClick={onOpenConfigModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400 transition-colors"
          title="Klik untuk konfigurasi database Supabase"
        >
          <Database className={`w-3.5 h-3.5 ${dataSource === 'supabase' ? 'text-emerald-500' : 'text-slate-400'}`} />
          <span>{dataSource === 'supabase' ? 'PostgreSQL' : 'Local Data'}</span>
          <span className={`w-2 h-2 rounded-full ${dataSource === 'supabase' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
        </button>

        {/* Low Carbon / Eco Mode Toggle */}
        <button
          onClick={toggleEcoMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            isEcoMode
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Mode Rendah Karbon (Green Software): menonaktifkan animasi berat dan meminimalkan konsumsi daya layar"
        >
          <Zap className={`w-3.5 h-3.5 ${isEcoMode ? 'fill-white' : ''}`} />
          <span className="hidden md:inline">Eco Mode</span>
          <span className="text-[10px] px-1 rounded bg-black/10 dark:bg-white/10">
            {isEcoMode ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          title={isDark ? 'Mode Terang' : 'Mode Gelap (Hemat daya layar OLED)'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Quick Add CTA */}
        <button
          onClick={onOpenAddModal}
          className="flex lg:hidden items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Catat</span>
        </button>
      </div>
    </header>
  );
};
