import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  Download, 
  Upload, 
  PlusCircle, 
  Eye, 
  Edit3, 
  Trash2, 
  X,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';
import { useWaste } from '../context/WasteContext';
import type { WasteActivity, WasteCategory, ManagementMethod } from '../types';
import { EMISSION_FACTORS, MANAGEMENT_METHODS_META } from '../config/emissionFactors';
import { exportActivitiesToCSV, exportActivitiesToJSON } from '../utils/calculator';
import { StorageService } from '../services/storageService';

interface HistoryPageProps {
  onOpenAddModal: () => void;
  onSelectActivity: (act: WasteActivity) => void;
  onEditActivity: (act: WasteActivity) => void;
  onDeleteActivity: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onOpenAddModal,
  onSelectActivity,
  onEditActivity,
  onDeleteActivity
}) => {
  const { activities, reloadActivities, showNotification } = useWaste();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter States
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  // Filter and Sort Logic
  const filteredActivities = useMemo(() => {
    return activities.filter(item => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = (item.subcategory || '').toLowerCase().includes(q);
        const matchLoc = (item.location || '').toLowerCase().includes(q);
        const matchNotes = (item.notes || '').toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchNotes && !matchCat) return false;
      }

      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Method
      if (selectedMethod !== 'all' && item.method !== selectedMethod) {
        return false;
      }

      // Date range
      if (startDate && item.date < startDate) return false;
      if (endDate && item.date > endDate) return false;

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return a.date.localeCompare(b.date);
        case 'weight-desc':
          return b.weightKg - a.weightKg;
        case 'weight-asc':
          return a.weightKg - b.weightKg;
        case 'co2-desc':
          return b.co2eAvoidedKg - a.co2eAvoidedKg;
        case 'date-desc':
        default:
          return b.date.localeCompare(a.date);
      }
    });
  }, [activities, search, selectedCategory, selectedMethod, startDate, endDate, sortBy]);

  // Aggregate stats for filtered items
  const filteredStats = useMemo(() => {
    const totalKg = filteredActivities.reduce((acc, curr) => acc + curr.weightKg, 0);
    const totalCo2 = filteredActivities.reduce((acc, curr) => acc + curr.co2eAvoidedKg, 0);
    return {
      count: filteredActivities.length,
      totalKg: Number(totalKg.toFixed(2)),
      totalCo2: Number(totalCo2.toFixed(2))
    };
  }, [filteredActivities]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedMethod('all');
    setStartDate('');
    setEndDate('');
    setSortBy('date-desc');
  };

  const hasActiveFilters = Boolean(
    search || selectedCategory !== 'all' || selectedMethod !== 'all' || startDate || endDate || sortBy !== 'date-desc'
  );

  // Handle JSON Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error('Data JSON harus berupa array aktivitas.');
        }
        await StorageService.importActivities(parsed);
        await reloadActivities();
        showNotification('success', `Berhasil mengimpor ${parsed.length} data aktivitas.`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Format JSON tidak valid.';
        showNotification('error', `Gagal import data: ${msg}`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset file input
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Kelola & Riwayat Pengelolaan Sampah
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total {activities.length} aktivitas tercatat dalam sistem sirkularitas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={() => exportActivitiesToCSV(filteredActivities)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-emerald-400 transition-colors shadow-xs"
            title="Download laporan dalam format tabel CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={() => exportActivitiesToJSON(activities)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-emerald-400 transition-colors shadow-xs"
            title="Download cadangan data format JSON"
          >
            <Download className="w-4 h-4 text-cyan-600" />
            <span>Backup JSON</span>
          </button>

          {/* Import JSON */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-emerald-400 transition-colors shadow-xs"
            title="Impor cadangan data JSON"
          >
            <Upload className="w-4 h-4 text-amber-600" />
            <span>Impor JSON</span>
          </button>

          {/* Add Activity CTA */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Data</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari jenis sampah, lokasi, catatan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 capitalize"
            >
              <option value="all">Semua Kategori</option>
              {(Object.keys(EMISSION_FACTORS) as WasteCategory[]).map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Method Dropdown */}
          <div>
            <select
              value={selectedMethod}
              onChange={e => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">Semua Metode</option>
              {(Object.keys(MANAGEMENT_METHODS_META) as ManagementMethod[]).map(mKey => (
                <option key={mKey} value={mKey}>
                  {MANAGEMENT_METHODS_META[mKey].label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="date-desc">Tanggal: Terbaru</option>
              <option value="date-asc">Tanggal: Terlama</option>
              <option value="weight-desc">Berat: Tertinggi</option>
              <option value="weight-asc">Berat: Terendah</option>
              <option value="co2-desc">Reduksi CO2e: Tertinggi</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center">
            {hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-center text-[11px] text-slate-400">
                Filter Lengkap
              </div>
            )}
          </div>
        </div>

        {/* Filter Summary Pill */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <span>Menampilkan <strong>{filteredStats.count}</strong> dari {activities.length} aktivitas</span>
            <span>•</span>
            <span>Total Berat: <strong>{filteredStats.totalKg} kg</strong></span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              -{filteredStats.totalCo2} kg CO2e
            </span>
          </div>
        </div>
      </div>

      {/* Table / Cards View */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="text-sm font-semibold">Tidak ada data yang cocok dengan kriteria filter.</p>
            <p className="text-xs">Coba sesuaikan pencarian atau klik tombol Reset Filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Kategori & Material</th>
                  <th className="py-3.5 px-4">Metode Sirkular</th>
                  <th className="py-3.5 px-4">Lokasi</th>
                  <th className="py-3.5 px-4 text-right">Berat (kg)</th>
                  <th className="py-3.5 px-4 text-right">Reduksi CO2e</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredActivities.map(item => {
                  const factor = EMISSION_FACTORS[item.category] || EMISSION_FACTORS.lainnya;
                  const methodMeta = MANAGEMENT_METHODS_META[item.method];

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Tanggal */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* Kategori & Material */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${factor.badgeColor}`}>
                            {item.category}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {item.subcategory}
                          </span>
                        </div>
                      </td>

                      {/* Metode */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          {methodMeta?.label || item.method}
                        </span>
                      </td>

                      {/* Lokasi */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-[180px] truncate" title={item.location}>
                        {item.location}
                      </td>

                      {/* Berat */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {item.weightKg} kg
                      </td>

                      {/* Reduksi CO2e */}
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        -{item.co2eAvoidedKg} kg
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectActivity(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            title="Lihat Detail & Rumus"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditActivity(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="Edit Data"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteActivity(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
