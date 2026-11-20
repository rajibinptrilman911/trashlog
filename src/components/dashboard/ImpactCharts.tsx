import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart,
  Bar
} from 'recharts';
import type { WasteActivity, WasteCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ImpactChartsProps {
  activities: WasteActivity[];
}

const CATEGORY_COLORS: Record<WasteCategory, string> = {
  organik: '#10b981', // emerald-500
  plastik: '#06b6d4', // cyan-500
  kertas: '#f59e0b',  // amber-500
  logam: '#6366f1',   // indigo-500
  kaca: '#14b8a6',    // teal-500
  elektronik: '#a855f7', // purple-500
  lainnya: '#f43f5e'  // rose-500
};

export const ImpactCharts: React.FC<ImpactChartsProps> = ({ activities }) => {
  const { isDark } = useTheme();

  // 1. Data Timeline (Aktivitas terkelola urut tanggal)
  const timelineData = useMemo(() => {
    // Kelompokkan berdasarkan tanggal
    const mapByDate: Record<string, { date: string; weightKg: number; co2eKg: number }> = {};

    // Sort ascending by date
    const sorted = [...activities].sort((a, b) => a.date.localeCompare(b.date));

    sorted.forEach(item => {
      if (!mapByDate[item.date]) {
        mapByDate[item.date] = {
          date: item.date.slice(5), // MM-DD
          weightKg: 0,
          co2eKg: 0
        };
      }
      mapByDate[item.date].weightKg += item.weightKg;
      mapByDate[item.date].co2eKg += item.co2eAvoidedKg;
    });

    return Object.values(mapByDate).map(d => ({
      ...d,
      weightKg: Number(d.weightKg.toFixed(1)),
      co2eKg: Number(d.co2eKg.toFixed(1))
    }));
  }, [activities]);

  // 2. Data Komposisi Kategori
  const categoryData = useMemo(() => {
    const mapCat: Record<string, number> = {};
    activities.forEach(item => {
      mapCat[item.category] = (mapCat[item.category] || 0) + item.weightKg;
    });

    return Object.entries(mapCat).map(([cat, weight]) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      category: cat as WasteCategory,
      value: Number(weight.toFixed(1)),
      color: CATEGORY_COLORS[cat as WasteCategory] || '#94a3b8'
    }));
  }, [activities]);

  // 3. Data Distribusi Metode Pengelolaan
  const methodData = useMemo(() => {
    const mapMethod: Record<string, number> = {};
    activities.forEach(item => {
      mapMethod[item.method] = (mapMethod[item.method] || 0) + item.weightKg;
    });

    const labels: Record<string, string> = {
      daur_ulang: 'Daur Ulang',
      kompos: 'Kompos / BSF',
      bank_sampah: 'Bank Sampah',
      guna_ulang: 'Guna Ulang',
      sedekah_sampah: 'Sedekah'
    };

    return Object.entries(mapMethod).map(([key, val]) => ({
      name: labels[key] || key,
      weightKg: Number(val.toFixed(1))
    }));
  }, [activities]);

  const gridColor = isDark ? '#334155' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: Timeline Tren Sampah & Emisi */}
      <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 min-w-0">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              Tren Pengelolaan Sampah & Reduksi CO2e
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perbandingan akumulasi berat material (kg) terhadap estimasi emisi karbon yang dihindari (kg CO2e)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs shrink-0">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Sampah (kg)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              CO2e Dihindari (kg)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          {timelineData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Belum ada data aktivitas
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weightKg"
                  name="Berat Sampah (kg)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWeight)"
                />
                <Area
                  type="monotone"
                  dataKey="co2eKg"
                  name="CO2e Dihindari (kg)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCo2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 2: Komposisi Kategori Sampah */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Proporsi Jenis Material
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total berat diklasifikasikan berdasarkan kategori
          </p>
        </div>

        <div className="h-56 w-full relative flex items-center justify-center">
          {categoryData.length === 0 ? (
            <div className="text-xs text-slate-400">Belum ada data</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: unknown) => [`${val} kg`, 'Berat']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap gap-1.5 justify-center pt-2">
          {categoryData.map(c => (
            <span
              key={c.name}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              {c.name}: {c.value}kg
            </span>
          ))}
        </div>
      </div>

      {/* Chart 3: Distribusi Metode Pengelolaan */}
      <div className="lg:col-span-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sirkularitas Berdasarkan Metode Pengelolaan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribusi volume sampah yang diproses melalui daur ulang mekanik, pengomposan, bank sampah, dan guna ulang
            </p>
          </div>
        </div>

        <div className="h-44 w-full">
          {methodData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Belum ada data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={methodData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: unknown) => [`${val} kg`, 'Total Berat']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="weightKg" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
