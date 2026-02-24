import React, { useState } from 'react';
import { Calendar, Utensils } from 'lucide-react';

// --- IMPORTAMOS COMPONENTES ---
import NutriSidebar from './layout/NutriSidebar';
import Header from '../admin/layout/Header';
import PacientesView from './views/PacientesView';
import ResumenView from './views/ResumenView';
import AgendaView from './views/AgendaView';
import PerfilPaciente from "./views/PerfilPaciente";
import SettingsView from './views/SettingsView';

const NutriDashboard = ({ user, onLogout, isDark, toggleTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Estados de navegación
    const [activeView, setActiveView] = useState('resumen');

    // Estado para manejar el paciente seleccionado desde el Resumen
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Función para navegar al perfil de un paciente específico
    const handleGoToPatient = (patientData) => {
        setSelectedPatient(patientData); // Guardamos los datos del paciente (nombre, id, etc)
        setActiveView('paciente_detail'); // Cambiamos a una vista especial de detalle
    };

    if (!user) return null;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] font-sans text-sm transition-colors duration-300">

            {/* BARRA LATERAL */}
            <NutriSidebar
                isOpen={sidebarOpen}
                user={user}
                activeView={activeView}
                setActiveView={setActiveView}
                onLogout={onLogout}
            />

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col overflow-hidden">

                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    selectedEmpresa={user.empresaConfig}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                />

                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a] p-6 transition-colors duration-300">
                    <div className="container mx-auto max-w-7xl h-full">

                        {/* VISTA: RESUMEN  */}
                        {activeView === 'resumen' && (
                            <ResumenView
                                user={user}
                                onViewChange={setActiveView}
                                onGoToPatient={handleGoToPatient}
                            />
                        )}

                        {/* VISTA: PACIENTES (Lista) */}
                        {activeView === 'pacientes' && (
                            <PacientesView user={user} />
                        )}

                        {/* VISTA: PERFIL DE PACIENTE (Vista Detalle Directa) */}
                        {activeView === 'paciente_detail' && (
                            <PerfilPaciente
                                patientData={selectedPatient} // Pasamos los datos
                                onBack={() => setActiveView('resumen')} // Al volver, regresamos al resumen
                            />
                        )}

                        {/* VISTA: AGENDA */}
                        {activeView === 'agenda' && (
                            <AgendaView user={user} />
                        )}

                        {/* VISTA: DIETAS */}
                        {activeView === 'dietas' && (
                            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-slate-400 h-64 text-center">
                                <Utensils size={48} className="mb-4 opacity-20" />
                                <p className="font-bold">Generador de Dietas</p>
                                <span className="text-[10px] mt-2 bg-orange-100 text-orange-600 px-2 py-1 rounded">Próximamente</span>
                            </div>
                        )}

                        {activeView === 'settings' && (
                            <SettingsView user={user} />
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
};

export default NutriDashboard;