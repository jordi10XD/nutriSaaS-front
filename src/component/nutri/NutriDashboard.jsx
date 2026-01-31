import React, { useState } from 'react';
import { Calendar, Utensils } from 'lucide-react';

// --- IMPORTAMOS COMPONENTES ---
import NutriSidebar from './layout/NutriSidebar';
import Header from '../admin/layout/Header'; // Reutilizamos el Header de Admin por ahora
import PacientesView from './views/PacientesView';

const NutriDashboard = ({ user, onLogout, isDark, toggleTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Estados de navegación: 'dashboard', 'pacientes', 'agenda', 'dietas'
    const [activeView, setActiveView] = useState('pacientes'); // Por defecto Pacientes como pidió el usuario

    if (!user) return null;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] font-sans text-sm transition-colors duration-300">

            {/* 1. BARRA LATERAL */}
            <NutriSidebar
                isOpen={sidebarOpen}
                user={user}
                activeView={activeView}
                setActiveView={setActiveView}
                onLogout={onLogout}
            />

            {/* 2. CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* CABECERA */}
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    selectedEmpresa={user.empresaConfig} // Pasamos la empresa del usuario
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                />

                {/* ÁREA DE VISTAS DINÁMICAS */}
                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a] p-6 transition-colors duration-300">
                    <div className="container mx-auto max-w-7xl h-full">

                        {activeView === 'dashboard' && (
                            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-slate-400 h-64 text-center">
                                <p className="font-bold">Resumen del Día</p>
                                <span className="text-[10px] mt-2 bg-orange-100 text-orange-600 px-2 py-1 rounded">Próximamente</span>
                            </div>
                        )}

                        {activeView === 'pacientes' && <PacientesView user={user} />}

                        {activeView === 'agenda' && (
                            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-slate-400 h-64 text-center">
                                <Calendar size={48} className="mb-4 opacity-20" />
                                <p className="font-bold">Agenda de Citas</p>
                                <span className="text-[10px] mt-2 bg-orange-100 text-orange-600 px-2 py-1 rounded">Próximamente</span>
                            </div>
                        )}

                        {activeView === 'dietas' && (
                            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-slate-400 h-64 text-center">
                                <Utensils size={48} className="mb-4 opacity-20" />
                                <p className="font-bold">Generador de Dietas</p>
                                <span className="text-[10px] mt-2 bg-orange-100 text-orange-600 px-2 py-1 rounded">Próximamente</span>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
};

export default NutriDashboard;
