import React from 'react';
import {
    LayoutDashboard, Users, Calendar, Utensils,
    LogOut
} from 'lucide-react';

// NO importamos las vistas aquí. El sidebar solo cambia el estado 'activeView'.

const NutriSidebar = ({
    isOpen,
    user,
    activeView,
    setActiveView,
    onLogout
}) => {
    return (
        <aside className={`bg-[#1e293b] text-slate-300 flex flex-col transition-all duration-300 border-r border-slate-700/50 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            {/* LOGO */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-700/50 bg-[#1e293b] shrink-0">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold brand-font shadow-md">N</div>
                <span className="font-bold text-lg tracking-wide text-white brand-font">Nutri<span className="text-orange-500">SaaS</span></span>
            </div>

            {/* PERFIL */}
            <div 
                onClick={() => setActiveView('settings')} // <--- Acción al clic
                className="p-6 border-b border-slate-700/50 cursor-pointer group hover:bg-slate-800/50 transition-colors"
                title="Ver Configuración de Cuenta"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white shadow-inner border-2 border-slate-500 group-hover:border-orange-500 transition-colors">
                        {user.nombre ? user.nombre[0] : 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white font-semibold truncate block group-hover:text-orange-400 transition-colors">
                            {user.nombre} {user.apellido}
                        </p>
                        <p className="text-xs text-orange-500 font-bold truncate group-hover:text-orange-300">
                            Ver mi cuenta
                        </p>
                    </div>
                </div>
            </div>

            {/* NAVEGACIÓN */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Consultorio</div>

                <NavButton
                    active={activeView === 'resumen'} // CORREGIDO: minúscula
                    onClick={() => setActiveView('resumen')} // CORREGIDO: minúscula
                    icon={LayoutDashboard}
                    label="Resumen"
                />
                <NavButton
                    active={activeView === 'pacientes'}
                    onClick={() => setActiveView('pacientes')}
                    icon={Users}
                    label="Pacientes"
                />
                <NavButton
                    active={activeView === 'agenda'}
                    onClick={() => setActiveView('agenda')}
                    icon={Calendar}
                    label="Agenda"
                />
                <NavButton
                    active={activeView === 'dietas'}
                    onClick={() => setActiveView('dietas')}
                    icon={Utensils}
                    label="Dietas"
                />
            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t border-slate-700/50">
                <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs font-bold uppercase">
                    <LogOut size={14} /> Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

// Subcomponente interno
const NavButton = ({ active, onClick, icon: Icon, label }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${active ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}`}>
        <Icon size={20} /> <span>{label}</span>
    </button>
);

export default NutriSidebar;