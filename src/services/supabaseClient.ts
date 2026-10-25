import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'ecotrack_supabase_url';
const STORAGE_KEY_KEY = 'ecotrack_supabase_key';

let cachedClient: SupabaseClient | null = null;
let currentUrl: string = '';
let currentKey: string = '';

export function getStoredSupabaseConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_KEY) || '';

  return {
    url: localUrl || envUrl,
    key: localKey || envKey,
    isCustomConfigured: Boolean(localUrl && localKey),
    isEnvConfigured: Boolean(envUrl && envKey),
    isConnected: false
  };
}

export function initSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.url || !config.key) {
    cachedClient = null;
    return null;
  }

  if (cachedClient && currentUrl === config.url && currentKey === config.key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.key);
    currentUrl = config.url;
    currentKey = config.key;
    return cachedClient;
  } catch (err) {
    console.error('Gagal menginisialisasi Supabase Client:', err);
    cachedClient = null;
    return null;
  }
}

export function saveSupabaseCredentials(url: string, key: string) {
  if (!url || !key) {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
    cachedClient = null;
    currentUrl = '';
    currentKey = '';
    return;
  }
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, key.trim());
  cachedClient = null; // force re-creation
}

export const SUPABASE_SQL_SCHEMA = `-- SKEMA DATABASE POSTGRESQL UNTUK ECOTRACK
-- Jalankan kode ini di Supabase SQL Editor jika ingin menghubungkan database cloud

CREATE TABLE IF NOT EXISTS public.waste_activities (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    weight_kg NUMERIC(10, 2) NOT NULL,
    method TEXT NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    co2e_avoided_kg NUMERIC(10, 2) NOT NULL,
    energy_saved_kwh NUMERIC(10, 2) NOT NULL,
    trees_equivalent NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Kebijakan Akses (RLS) untuk demo tugas perkuliahan
ALTER TABLE public.waste_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Akses publik demo untuk aktivitas" 
ON public.waste_activities 
FOR ALL 
USING (true) 
WITH CHECK (true);
`;
