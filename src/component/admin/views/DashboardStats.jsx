import React from 'react';
import { Building2, Activity, Users, Bell } from 'lucide-react';
import CardStats from '../ui/CardStats'; // Importamos el componente UI que creaste antes

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <CardStats 
        title="Empresas Activas" 
        value="12" 
        colorClass="bg-gradient-to-br from-slate-700 to-slate-900" 
        icon={Building2} 
      />
      <CardStats 
        title="Ingresos Totales" 
        value="$45.2k" 
        colorClass="bg-gradient-to-br from-emerald-600 to-emerald-800" 
        icon={Activity} 
      />
      <CardStats 
        title="Usuarios Totales" 
        value="843" 
        colorClass="bg-gradient-to-br from-blue-600 to-blue-800" 
        icon={Users} 
      />
      <CardStats 
        title="Soporte Pendiente" 
        value="5" 
        colorClass="bg-gradient-to-br from-orange-500 to-orange-700" 
        icon={Bell} 
      />
    </div>
  );
};

export default DashboardStats;