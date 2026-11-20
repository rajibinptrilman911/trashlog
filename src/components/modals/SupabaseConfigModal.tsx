import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';
import { 
  getStoredSupabaseConfig, 
  saveSupabaseCredentials, 
  SUPABASE_SQL_SCHEMA,
  initSupabaseClient 
} from '../../services/supabaseClient';
import { useWaste } from '../../context/WasteContext';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const { reloadActivities, resetToMockData, showNotification } = useWaste();
  const currentConfig = getStoredSupabaseConfig();

  const [url, setUrl] = useState<string>(currentConfig.url);
  const [key, setKey] = useState<string>(currentConfig.key);
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'config' | 'sql'>('config');

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    if (!cleanUrl || !cleanKey) {
      // Clear credentials
      saveSupabaseCredentials('', '');
      await reloadActivities();
      setTestResult({ ok: true, message: 'Kembali menggunakan penyimpanan browser lokal (Offline-first LocalStorage).' });
      setTesting(false);
      showNotification('info', 'Menggunakan penyimpanan lokal persisten.');
      return;
    }

    try {
      saveSupabaseCredentials(cleanUrl, cleanKey);
      const client = initSupabaseClient();
      if (!client) {
        throw new Error('Inisialisasi client Supabase gagal.');
      }

      const { error } = await client.from('waste_activities').select('id').limit(1);
      if (error) {
        throw new Error(error.message);
      }

      setTestResult({ ok: true, message: 'Koneksi ke Supabase PostgreSQL berhasil terhubung!' });
      showNotification('success', 'Berhasil terhubung ke Supabase PostgreSQL.');
      await reloadActivities();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghubungi server Supabase.';
      setTestResult({
        ok: false,
        message: `Koneksi gagal: ${msg}. Pastikan tabel "waste_activities" sudah dibuat di SQL Editor Supabase.`
      });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Konfigurasi Database & Backend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih antara Penyimpanan Browser Lokal atau Cloud Supabase PostgreSQL
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-2">
          <button
            onClick={() => setActiveSubTab('config')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeSubTab === 'config'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Koneksi Supabase
          </button>
          <button
            onClick={() => setActiveSubTab('sql')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeSubTab === 'sql'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Skema SQL PostgreSQL
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-4">
          {activeSubTab === 'config' ? (
            <form onSubmit={handleTestAndSave} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Aplikasi TrashLog dirancang dengan arsitektur <strong>Offline-First & Green Computing</strong>. Secara bawaan, data tersimpan persisten di LocalStorage tanpa membebani server. Anda dapat menghubungkan proyek Supabase untuk penyimpanan multi-perangkat.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supabase Anon Public API Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {testResult && (
                <div className={`p-3.5 rounded-xl flex items-start gap-2.5 text-xs ${
                  testResult.ok 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                }`}>
                  {testResult.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={testing}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {testing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menguji Koneksi...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5" />
                      <span>{url && key ? 'Uji & Simpan Koneksi' : 'Gunakan Penyimpanan Lokal'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUrl('');
                    setKey('');
                    saveSupabaseCredentials('', '');
                    reloadActivities();
                    setTestResult({ ok: true, message: 'Kredensial dikosongkan. Kembali ke LocalStorage.' });
                  }}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Kosongkan Kredensial
                </button>
              </div>

              {/* Reset to demo dataset */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Kembalikan data demo perkuliahan:
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await resetToMockData();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reset ke Data Demo</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Script Pembuatan Tabel PostgreSQL:
                </span>
                <button
                  onClick={copySql}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-medium hover:bg-emerald-100"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
                {SUPABASE_SQL_SCHEMA}
              </pre>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Langkah: Buka dashboard Supabase Anda → Pilih tab <strong>SQL Editor</strong> → Tempel script di atas → Klik <strong>Run</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
