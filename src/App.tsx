import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { WasteProvider } from './context/WasteContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Toast } from './components/common/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { GreenAuditPage } from './pages/GreenAuditPage';
import { ActivityFormModal } from './components/modals/ActivityFormModal';
import { ActivityDetailModal } from './components/modals/ActivityDetailModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { SupabaseConfigModal } from './components/modals/SupabaseConfigModal';
import { Analytics } from '@vercel/analytics/react';
import type { WasteActivity } from './types';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isOpenMobileDrawer, setIsOpenMobileDrawer] = useState<boolean>(false);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [activityToEdit, setActivityToEdit] = useState<WasteActivity | null>(null);

  const [selectedActivity, setSelectedActivity] = useState<WasteActivity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  // Handlers
  const handleOpenAddModal = () => {
    setActivityToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (activity: WasteActivity) => {
    setActivityToEdit(activity);
    setIsAddEditModalOpen(true);
  };

  const handleOpenDetailModal = (activity: WasteActivity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-800 dark:text-slate-100 transition-colors">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header
          activeTab={activeTab}
          onOpenAddModal={handleOpenAddModal}
          onOpenConfigModal={() => setIsConfigModalOpen(true)}
          onToggleMobileDrawer={() => setIsOpenMobileDrawer(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onOpenAddModal={handleOpenAddModal}
              onSelectActivity={handleOpenDetailModal}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage
              onOpenAddModal={handleOpenAddModal}
              onSelectActivity={handleOpenDetailModal}
              onEditActivity={handleOpenEditModal}
              onDeleteActivity={handleOpenDeleteModal}
            />
          )}

          {activeTab === 'calculator' && (
            <CalculatorPage />
          )}

          {activeTab === 'green-audit' && (
            <GreenAuditPage />
          )}
        </main>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenDrawer={isOpenMobileDrawer}
        onCloseDrawer={() => setIsOpenMobileDrawer(false)}
        onOpenAddModal={handleOpenAddModal}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
      />

      {/* Interactive Modals */}
      <ActivityFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        activityToEdit={activityToEdit}
      />

      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      <DeleteConfirmModal
        idToDelete={idToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <WasteProvider>
        <MainAppContent />
        <Analytics />
      </WasteProvider>
    </ThemeProvider>
  );
}
