import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { WasteActivity, WasteFormData, ImpactSummary, AppNotification } from '../types';
import { StorageService } from '../services/storageService';
import { aggregateImpactSummary } from '../utils/calculator';

interface WasteContextType {
  activities: WasteActivity[];
  summary: ImpactSummary;
  loading: boolean;
  dataSource: 'supabase' | 'local';
  notification: AppNotification | null;
  clearNotification: () => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  addActivity: (formData: WasteFormData) => Promise<boolean>;
  updateActivity: (id: string, formData: WasteFormData) => Promise<boolean>;
  deleteActivity: (id: string) => Promise<boolean>;
  resetToMockData: () => Promise<void>;
  reloadActivities: () => Promise<void>;
}

const WasteContext = createContext<WasteContextType | undefined>(undefined);

export const WasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<WasteActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'supabase' | 'local'>('local');
  const [notification, setNotification] = useState<AppNotification | null>(null);

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setNotification({ id, type, message });
    setTimeout(() => {
      setNotification(curr => (curr?.id === id ? null : curr));
    }, 4500);
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const reloadActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await StorageService.getActivities();
      setActivities(res.activities);
      setDataSource(res.source);
    } catch (err: unknown) {
      console.error(err);
      showNotification('error', 'Gagal memuat data aktivitas.');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    reloadActivities();
  }, [reloadActivities]);

  const summary = useMemo(() => {
    return aggregateImpactSummary(activities);
  }, [activities]);

  const addActivity = async (formData: WasteFormData): Promise<boolean> => {
    try {
      const newAct = await StorageService.addActivity(formData);
      setActivities(prev => [newAct, ...prev]);
      showNotification('success', `Aktivitas berhasil dicatat! Menghemat estimasi ${newAct.co2eAvoidedKg} kg CO2e.`);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat menambah data.';
      showNotification('error', msg);
      return false;
    }
  };

  const updateActivity = async (id: string, formData: WasteFormData): Promise<boolean> => {
    try {
      const updated = await StorageService.updateActivity(id, formData);
      setActivities(prev => prev.map(a => (a.id === id ? updated : a)));
      showNotification('success', `Data aktivitas berhasil diperbarui.`);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui data.';
      showNotification('error', msg);
      return false;
    }
  };

  const deleteActivity = async (id: string): Promise<boolean> => {
    try {
      await StorageService.deleteActivity(id);
      setActivities(prev => prev.filter(a => a.id !== id));
      showNotification('info', 'Data aktivitas telah dihapus.');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus data.';
      showNotification('error', msg);
      return false;
    }
  };

  const resetToMockData = async () => {
    try {
      const resetList = await StorageService.resetToDefault();
      setActivities(resetList);
      showNotification('info', 'Data berhasil direset ke dataset demo awal.');
    } catch (err: unknown) {
      console.error(err);
      showNotification('error', 'Gagal mereset data.');
    }
  };

  return (
    <WasteContext.Provider
      value={{
        activities,
        summary,
        loading,
        dataSource,
        notification,
        clearNotification,
        showNotification,
        addActivity,
        updateActivity,
        deleteActivity,
        resetToMockData,
        reloadActivities
      }}
    >
      {children}
    </WasteContext.Provider>
  );
};

export const useWaste = () => {
  const context = useContext(WasteContext);
  if (!context) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  return context;
};
