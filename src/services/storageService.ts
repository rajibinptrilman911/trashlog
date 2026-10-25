import type { WasteActivity, WasteFormData } from '../types';
import { calculateWasteImpact } from '../utils/calculator';
import { MOCK_ACTIVITIES } from './mockData';
import { initSupabaseClient, getStoredSupabaseConfig } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'ecotrack_activities_v1';

export class StorageService {
  /**
   * Mengambil semua aktivitas tersimpan (dari Supabase jika aktif, atau LocalStorage)
   */
  static async getActivities(): Promise<{ activities: WasteActivity[]; source: 'supabase' | 'local' }> {
    const supabase = initSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('waste_activities')
          .select('*')
          .order('date', { ascending: false });

        if (!error && data) {
          // Map snake_case PostgreSQL to camelCase TypeScript
          const mapped: WasteActivity[] = data.map(item => ({
            id: item.id,
            date: item.date,
            category: item.category,
            subcategory: item.subcategory,
            weightKg: Number(item.weight_kg),
            method: item.method,
            location: item.location,
            notes: item.notes || '',
            co2eAvoidedKg: Number(item.co2e_avoided_kg),
            energySavedKWh: Number(item.energy_saved_kwh),
            treesEquivalent: Number(item.trees_equivalent),
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }));

          // Backup ke local cache
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped));
          return { activities: mapped, source: 'supabase' };
        } else {
          console.warn('Supabase query error, fallback to local storage:', error?.message);
        }
      } catch (err) {
        console.warn('Supabase connection error, fallback to local:', err);
      }
    }

    // Fallback: LocalStorage
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_ACTIVITIES));
      return { activities: MOCK_ACTIVITIES, source: 'local' };
    }

    try {
      const parsed = JSON.parse(stored) as WasteActivity[];
      return { activities: parsed, source: 'local' };
    } catch {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_ACTIVITIES));
      return { activities: MOCK_ACTIVITIES, source: 'local' };
    }
  }

  /**
   * Menambahkan aktivitas baru dengan kalkulasi otomatis dampak lingkungan
   */
  static async addActivity(formData: WasteFormData): Promise<WasteActivity> {
    const weightNum = Number(formData.weightKg);
    if (isNaN(weightNum) || weightNum <= 0) {
      throw new Error('Berat sampah harus berupa angka positif.');
    }

    const impact = calculateWasteImpact(formData.category, weightNum);
    const nowIso = new Date().toISOString();
    const newActivity: WasteActivity = {
      id: 'act-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      date: formData.date,
      category: formData.category,
      subcategory: formData.subcategory.trim() || formData.category,
      weightKg: weightNum,
      method: formData.method,
      location: formData.location.trim() || 'Lokasi Tidak Ditentukan',
      notes: formData.notes?.trim() || '',
      co2eAvoidedKg: impact.co2eAvoidedKg,
      energySavedKWh: impact.energySavedKWh,
      treesEquivalent: impact.treesEquivalent,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    const supabase = initSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('waste_activities').insert({
          id: newActivity.id,
          date: newActivity.date,
          category: newActivity.category,
          subcategory: newActivity.subcategory,
          weight_kg: newActivity.weightKg,
          method: newActivity.method,
          location: newActivity.location,
          notes: newActivity.notes,
          co2e_avoided_kg: newActivity.co2eAvoidedKg,
          energy_saved_kwh: newActivity.energySavedKWh,
          trees_equivalent: newActivity.treesEquivalent,
          created_at: newActivity.createdAt,
          updated_at: newActivity.updatedAt
        });

        if (error) {
          console.error('Gagal menyimpan ke Supabase:', error);
          // tetap simpan ke local
        }
      } catch (err) {
        console.error('Error saat menghubungi Supabase:', err);
      }
    }

    // Simpan selalu ke LocalStorage
    const { activities } = await this.getActivities();
    const updated = [newActivity, ...activities];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    return newActivity;
  }

  /**
   * Memperbarui aktivitas yang sudah ada
   */
  static async updateActivity(id: string, formData: WasteFormData): Promise<WasteActivity> {
    const weightNum = Number(formData.weightKg);
    if (isNaN(weightNum) || weightNum <= 0) {
      throw new Error('Berat sampah harus berupa angka positif.');
    }

    const impact = calculateWasteImpact(formData.category, weightNum);
    const nowIso = new Date().toISOString();

    const { activities } = await this.getActivities();
    const existingIndex = activities.findIndex(a => a.id === id);
    if (existingIndex === -1) {
      throw new Error('Data aktivitas tidak ditemukan.');
    }

    const existing = activities[existingIndex];
    const updatedActivity: WasteActivity = {
      ...existing,
      date: formData.date,
      category: formData.category,
      subcategory: formData.subcategory.trim() || formData.category,
      weightKg: weightNum,
      method: formData.method,
      location: formData.location.trim() || existing.location,
      notes: formData.notes?.trim() || '',
      co2eAvoidedKg: impact.co2eAvoidedKg,
      energySavedKWh: impact.energySavedKWh,
      treesEquivalent: impact.treesEquivalent,
      updatedAt: nowIso
    };

    const supabase = initSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('waste_activities')
          .update({
            date: updatedActivity.date,
            category: updatedActivity.category,
            subcategory: updatedActivity.subcategory,
            weight_kg: updatedActivity.weightKg,
            method: updatedActivity.method,
            location: updatedActivity.location,
            notes: updatedActivity.notes,
            co2e_avoided_kg: updatedActivity.co2eAvoidedKg,
            energy_saved_kwh: updatedActivity.energySavedKWh,
            trees_equivalent: updatedActivity.treesEquivalent,
            updated_at: updatedActivity.updatedAt
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Update Supabase error, updating local:', err);
      }
    }

    activities[existingIndex] = updatedActivity;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activities));

    return updatedActivity;
  }

  /**
   * Menghapus aktivitas
   */
  static async deleteActivity(id: string): Promise<boolean> {
    const supabase = initSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('waste_activities').delete().eq('id', id);
      } catch (err) {
        console.warn('Gagal menghapus di Supabase:', err);
      }
    }

    const { activities } = await this.getActivities();
    const filtered = activities.filter(a => a.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Reset data ke dataset demo default
   */
  static async resetToDefault(): Promise<WasteActivity[]> {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_ACTIVITIES));
    return MOCK_ACTIVITIES;
  }

  /**
   * Import data aktivitas dari file JSON
   */
  static async importActivities(imported: WasteActivity[]): Promise<WasteActivity[]> {
    if (!Array.isArray(imported)) {
      throw new Error('Format file JSON tidak valid. Harus berupa array data aktivitas.');
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(imported));
    return imported;
  }

  /**
   * Status koneksi backend
   */
  static getBackendStatus() {
    return getStoredSupabaseConfig();
  }
}
