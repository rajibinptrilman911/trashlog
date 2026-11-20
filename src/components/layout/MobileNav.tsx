import React from 'react';
import { 
  LayoutDashboard, 
  Trash2, 
  Calculator, 
  ShieldCheck, 
  PlusCircle, 
  X, 
  Database 
} from 'lucide-react';
import { useWaste } from '../../context/WasteContext';
import { Logo } from '../common/Logo';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenDrawer: boolean;
  onCloseDrawer: () => void;
  onOpenAddModal: () => void;
  onOpenConfigModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  isOpenDrawer,
  onCloseDrawer,
  onOpenAddModal,
  onOpenConfigModal
}) => {
  const { summary, dataSource } = useWaste();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'history', label: 'Riwayat', icon: <Trash2 className="w-5 h-5" /> },
    { id: 'calculator', label: 'Kalkulator', icon: <Calculator className="w-5 h-5" /> },
    { id: 'green-audit', label: 'Green Audit', icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpenDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={onCloseDrawer} 
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white dark:bg-slate-900 shadow-xl p-5 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <Logo variant="horizontal" size="sm" showSubtitle={true} />
                <button
                  onClick={onCloseDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => {
                  onCloseDrawer();
                  onOpenAddModal();
                }}
                className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-medium text-sm shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Catat Sampah Baru</span>
              </button>

              <div className="space-y-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onCloseDrawer();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <button
                onClick={() => {
                  onCloseDrawer();
                  onOpenConfigModal();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-left"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {dataSource === 'supabase' ? 'Supabase Connected' : 'Local Storage Mode'}
                  </span>
                </div>
                <span className={`w-2 h-2 rounded-full ${dataSource === 'supabase' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              </button>

              <div className="text-[11px] text-center text-slate-400">
                Total Terkelola: <strong>{summary.totalWeightKg} kg</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
