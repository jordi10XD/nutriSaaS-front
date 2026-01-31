import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

// --- IMPORTAMOS LOS MÓDULOS REFACTORIZADOS ---
import Sidebar from './component/admin/layout/Sidebar';
import Header from './component/admin/layout/Header';
import DashboardStats from './component/admin/views/DashboardStats';
import EmpresasView from './component/admin/views/EmpresasView';
import NutricionistasView from './component/admin/views/NutricionistasView';

const AdminDashboard = ({ user, onLogout, isDark, toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  
  // Estados de navegación: 'dashboard', 'empresas', 'nutricionistas', 'menus'
  const [activeView, setActiveView] = useState('dashboard'); 

  if (!user) return null;

  const goBackToGlobal = () => {
    setSelectedEmpresa(null);
    setActiveView('dashboard');
  };

  const goBackToEmpresas = () => {
    setSelectedEmpresa(null);
    setActiveView('empresas');
  };

  const handleSelectEmpresa = (emp) => {
    setSelectedEmpresa(emp);
    setActiveView('nutricionistas');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] font-sans text-sm transition-colors duration-300">
      
      {/* 1. BARRA LATERAL */}
      <Sidebar 
        isOpen={sidebarOpen}
        user={user}
        selectedEmpresa={selectedEmpresa}
        activeView={activeView}
        setActiveView={setActiveView}
        
        // Pasamos AMBAS funciones
        goBackToGlobal={goBackToGlobal}
        goBackToEmpresas={goBackToEmpresas} 
        
        onLogout={onLogout}
      />

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* CABECERA */}
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedEmpresa={selectedEmpresa}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        {/* ÁREA DE VISTAS DINÁMICAS */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a] p-6 transition-colors duration-300">
          <div className="container mx-auto max-w-7xl">
            
            {/* ESCENARIO A: SUPER ADMIN GLOBAL */}
            {!selectedEmpresa && (
                <>
                    {activeView === 'dashboard' && <DashboardStats />}
                    {activeView === 'empresas' && (
                        <EmpresasView 
                            token={user.token} 
                            onSelectEmpresa={handleSelectEmpresa} 
                        />
                    )}
                </>
            )}

            {/* ESCENARIO B: GESTIÓN DE EMPRESA (TENANT) */}
            {selectedEmpresa && (
                <>
                    {activeView === 'nutricionistas' && (
                        <NutricionistasView 
                            empresa={selectedEmpresa} 
                            token={user.token} 
                        />
                    )}

                    {activeView === 'menus' && (
                        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-slate-400 h-64 text-center">
                            <Utensils size={48} className="mb-4 opacity-20" />
                            <p className="font-bold">Gestión de Menús</p>
                            <p className="text-xs">Seleccionado: {selectedEmpresa.nombre}</p>
                            <span className="text-[10px] mt-2 bg-orange-100 text-orange-600 px-2 py-1 rounded">Próximamente</span>
                        </div>
                    )}
                </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;