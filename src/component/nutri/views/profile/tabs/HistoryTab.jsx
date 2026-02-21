import React from 'react';
import { Activity, Heart, Utensils, Clock } from 'lucide-react';
import Card from '../ui/Card';
import { InputGroup, CheckboxGroup } from '../ui/FormComponents';

const HistoryTab = ({ patient, setPatient, onChange }) => {
  
  // Lógica exclusiva de esta pestaña
  const handleSintomasChange = (newValues) => {
    setPatient(prev => ({ ...prev, sintomasGI: newValues }));
  };

  const handleMatrixChange = (key, field, value) => {
    setPatient(prev => ({
      ...prev,
      recordatorio_24h: {
        ...prev.recordatorio_24h,
        [key]: { ...prev.recordatorio_24h[key], [field]: value }
      }
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Estilo de Vida" icon={Activity}>
            <div className="space-y-4">
                <InputGroup label="Nivel Actividad Física" name="nivel_actividad" value={patient.nivel_actividad} onChange={onChange} options={['Sedentario', 'Ligero', 'Moderado', 'Intenso']} />
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Horas Sueño" type="number" name="horas_sueno" value={patient.horas_sueno} onChange={onChange} suffix="h" />
                    <InputGroup label="Calidad Sueño" name="calidad_sueno" value={patient.calidad_sueno} onChange={onChange} options={['Mala', 'Regular', 'Buena']} />
                </div>
                <div className="grid grid-cols-2 gap-4 items-end">
                    <div className="flex items-center h-10">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="fumador" checked={patient.fumador} onChange={onChange} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Fumador</span>
                        </label>
                    </div>
                    <InputGroup label="Alcohol" name="alcohol" value={patient.alcohol} onChange={onChange} placeholder="Ej. Social" />
                </div>
            </div>
        </Card>
        <Card title="Salud & Clínica" icon={Heart}>
            <div className="space-y-4">
                <InputGroup label="Patologías Diagnosticadas" name="patologias" value={patient.patologias} onChange={onChange} placeholder="Diabetes, HTA, SOP..." />
                <CheckboxGroup label="Sintomatología GI Actual" options={['Acidez', 'Reflujo', 'Gases', 'Distensión', 'Estreñimiento']} values={patient.sintomasGI || []} onChange={handleSintomasChange} />
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Medicación" name="medicacion" value={patient.medicacion} onChange={onChange} />
                    <InputGroup label="Suplementación" name="suplementacion" value={patient.suplementacion} onChange={onChange} />
                </div>
            </div>
        </Card>
      </div>
      <Card title="Matriz de Patrón de Ingesta Habitual" icon={Utensils} className="border-l-4 border-l-orange-400 dark:border-l-orange-500">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-slate-800">
                    <tr><th className="px-4 py-3 rounded-l-lg">Tiempo</th><th className="px-4 py-3 w-32">Hora</th><th className="px-4 py-3 rounded-r-lg">Qué acostumbra comer (Detalle)</th></tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                    {Object.entries(patient.recordatorio_24h).map(([key, data]) => (
                        <tr key={key} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-bold capitalize text-slate-700 dark:text-white">{key.replace(/([0-9])/g, ' $1')}</td>
                            <td className="px-4 py-2">
                                <div className="relative">
                                    <Clock size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"/>
                                    <input type="time" value={data.hora} onChange={(e) => handleMatrixChange(key, 'hora', e.target.value)} className="pl-7 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded text-sm p-1.5 focus:ring-1 focus:ring-teal-500 outline-none dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert"/>
                                </div>
                            </td>
                            <td className="px-4 py-2">
                                <input type="text" value={data.detalle} onChange={(e) => handleMatrixChange(key, 'detalle', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded text-sm p-1.5 focus:ring-1 focus:ring-teal-500 outline-none"/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default HistoryTab;