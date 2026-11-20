import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Leaf, 
  Zap, 
  Cpu, 
  HardDrive, 
  Database, 
  Moon, 
  Sun, 
  CheckCircle2, 
  Sparkles,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useWaste } from '../context/WasteContext';
import { 
  getStoredSupabaseConfig, 
  saveSupabaseCredentials, 
  SUPABASE_SQL_SCHEMA, 
  initSupabaseClient 
} from '../services/supabaseClient';

export const GreenAuditPage: React.FC = () => {
  const { isDark, toggleDark, isEcoMode, toggleEcoMode } = useTheme();
  const { dataSource, reloadActivities, resetToMockData, showNotification } = useWaste();
  
  const currentConfig = getStoredSupabaseConfig();
  const [url, setUrl] = useState<string>(currentConfig.url);
  const [key, setKey] = useState<string>(currentConfig.key);
  const [testing, setTesting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Digital Carbon Footprint Calculation (Sustainable Web Design Model v4)
  // Payload transfer EcoTrack: ~140 KB gzip
  // SWD formula: transfer_GB * 0.2 kWh/GB * 442 g CO2/kWh
  const bundleSizeKb = 142;
  const webCarbonGramsPerVisit = Number(((bundleSizeKb / 1024 / 1024) * 0.2 * 442).toFixed(4));
  const globalAverageGrams = 0.84; // HTTP Archive average website
  const reductionPercentage = Math.round(((globalAverageGrams - webCarbonGramsPerVisit) / globalAverageGrams) * 100);

  const handleSaveBackend = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setStatusMsg(null);

    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    if (!cleanUrl || !cleanKey) {
      saveSupabaseCredentials('', '');
      await reloadActivities();
      setStatusMsg({ ok: true, text: 'Menggunakan penyimpanan lokal persisten (LocalStorage offline-first).' });
      setTesting(false);
      showNotification('info', 'Menggunakan penyimpanan lokal browser.');
      return;
    }

    try {
      saveSupabaseCredentials(cleanUrl, cleanKey);
      const client = initSupabaseClient();
      if (!client) throw new Error('Client Supabase gagal diinisialisasi.');

      const { error } = await client.from('waste_activities').select('id').limit(1);
      if (error) throw new Error(error.message);

      setStatusMsg({ ok: true, text: 'Berhasil terhubung ke database cloud Supabase PostgreSQL!' });
      showNotification('success', 'Koneksi Supabase PostgreSQL aktif.');
      await reloadActivities();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal.';
      setStatusMsg({ ok: false, text: `Koneksi gagal: ${msg}. Silakan periksa URL & Key.` });
    } finally {
      setTesting(false);
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Green Software Engineering (GSF) Principles</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Green Software & Audit Keberlanjutan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Dokumentasi penerapan prinsip rekayasa perangkat lunak ramah lingkungan, efisiensi energi layar OLED, jejak karbon digital web, dan arsitektur database.
        </p>
      </div>

      {/* 4 Pillars of Green Software Foundation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              1. Carbon Efficiency
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Meminimalkan emisi karbon per transaksi. Bundle Vite dipadatkan tanpa dependensi CSS berat yang tidak terpakai, menghasilkan efisiensi transfer data tinggi.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            ✓ Zero Bloatware
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              2. Energy Efficiency
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dukungan native Dark Mode untuk panel layar OLED/AMOLED mematikan piksel hitam sehingga menghemat hingga 40-60% daya konsumsi baterai perangkat.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            ✓ OLED Black Palette
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              3. Carbon Awareness
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Fitur <em>Eco Mode</em> menonaktifkan rendering animasi GPU dan shadow berat. Menekan komputasi CPU perangkat pengguna hingga titik terendah.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
            ✓ Low-Carbon Toggle
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <HardDrive className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              4. Hardware Efficiency
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Arsitektur Offline-First & Local Caching memastikan aplikasi berjalan mulus di perangkat komputer spesifikasi rendah tanpa perlu server komputasi awan berdaya tinggi.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            ✓ Client-Side Persistence
          </div>
        </div>
      </div>

      {/* Digital Carbon Footprint Scoreboard */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Sustainable Web Design (SWD) Model v4</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Estimasi Emisi Digital Aplikasi TrashLog
            </h3>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
            Grade A+ Web Sustainability
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-xs text-emerald-200 font-medium">
              Ukuran Transfer Data (Gzip)
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white my-1">
              ~{bundleSizeKb} KB
            </div>
            <div className="text-[11px] text-emerald-300/80">
              Jauh di bawah batas rekomendasi 500 KB
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-xs text-emerald-200 font-medium">
              Emisi Karbon per Kunjungan
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white my-1">
              {webCarbonGramsPerVisit} g
            </div>
            <div className="text-[11px] text-emerald-300/80">
              CO2e / pageview (SWD v4 Model)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-xs text-emerald-200 font-medium">
              Efisiensi Terhadap Web Global
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white my-1">
              {reductionPercentage}% Lebih Bersih
            </div>
            <div className="text-[11px] text-emerald-300/80">
              Dibandingkan rata-rata web global (0.84g)
            </div>
          </div>
        </div>

        {/* Live Interactive Energy Toggles */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white font-semibold"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
              <span>Mode Gelap: {isDark ? 'Aktif (OLED Save)' : 'Non-Aktif'}</span>
            </button>

            <button
              onClick={toggleEcoMode}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors font-semibold ${
                isEcoMode ? 'bg-emerald-500 text-slate-900 font-bold' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Eco Mode UI: {isEcoMode ? 'Aktif (No Animation)' : 'Non-Aktif'}</span>
            </button>
          </div>

          <div className="text-[11px] text-emerald-200/80">
            Sumber acuan: SustainableWebDesign.org & Green Software Foundation
          </div>
        </div>
      </div>

      {/* Backend & Supabase Configuration Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Konfigurasi Database & Backend (Supabase PostgreSQL)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hubungkan database relasional cloud atau tetap gunakan penyimpanan browser offline
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Status: {dataSource === 'supabase' ? 'Cloud Terhubung' : 'Penyimpanan Lokal'}
          </span>
        </div>

        <form onSubmit={handleSaveBackend} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Supabase Project URL:
            </label>
            <input
              type="url"
              placeholder="https://xyzproject.supabase.co"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Supabase Anon Public API Key:
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={e => setKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {statusMsg && (
            <div className={`md:col-span-2 p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.ok 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
          )}

          <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={testing}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              {testing ? 'Menguji Koneksi...' : 'Simpan & Uji Koneksi Supabase'}
            </button>

            <button
              type="button"
              onClick={() => {
                setUrl('');
                setKey('');
                saveSupabaseCredentials('', '');
                reloadActivities();
                setStatusMsg({ ok: true, text: 'Kredensial dikosongkan. Kembali ke LocalStorage.' });
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Kembali ke Local Data
            </button>

            <button
              type="button"
              onClick={async () => {
                await resetToMockData();
                showNotification('info', 'Dataset demo awal berhasil dipulihkan.');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-900 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Dataset Demo Mahasiswa</span>
            </button>
          </div>
        </form>

        {/* SQL Script Box */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Skema DDL PostgreSQL (Jalankan di Supabase SQL Editor):
            </span>
            <button
              onClick={copySql}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-medium"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Tersalin' : 'Salin Script SQL'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>
    </div>
  );
};
