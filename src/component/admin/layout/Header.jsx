import React from 'react';
import { Menu, Sun, Moon, Bell } from 'lucide-react';

const Header = ({ 
    sidebarOpen, 
    setSidebarOpen, 
    selectedEmpresa, 
    isDark, 
    toggleTheme 
}) => {
  return (
    <header className="h-16 bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between px-6 shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white brand-font hidden md:block">
            {selectedEmpresa ? `Gestión: ${selectedEmpresa.nombre}` : 'Panel Super Admin'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="text-slate-500 dark:text-slate-300 hover:text-orange-500 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative">
            <button className="text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white relative p-1">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-[#1e293b]"></span>
            </button>
          </div>
        </div>
      </header>
  );
};

export default Header;