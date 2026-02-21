import React, { useMemo } from 'react';
import { Scale, Activity, ClipboardList, TrendingUp, PlusCircle, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import { InputGroup } from '../ui/FormComponents';

const MeasurementsTab = ({ patient, onChange, evaluaciones, setEvaluaciones }) => {
  
  // --- CÁLCULO DE IMC (De la evaluación actual) ---
  const imcData = useMemo(() => {
    if (!patient.peso || !patient.altura) return { value: '--', status: '', color: 'text-slate-400', bg: 'bg-slate-100' };
    const alturaM = parseFloat(patient.altura) / 100;
    const pesoKg = parseFloat(patient.peso);
    if(alturaM <= 0) return { value: '--', status: '', color: '', bg: '' };
    const val = (pesoKg / (alturaM * alturaM)).toFixed(2);
    const numVal = parseFloat(val);
    let status = '', color = '', bg = '';
    if (numVal < 18.5) { status = 'Bajo Peso'; color = 'text-blue-600'; bg = 'bg-blue-100 dark:bg-blue-900/30'; }
    else if (numVal < 24.9) { status = 'Normopeso'; color = 'text-green-600'; bg = 'bg-green-100 dark:bg-green-900/30'; }
    else if (numVal < 29.9) { status = 'Sobrepeso'; color = 'text-orange-600'; bg = 'bg-orange-100 dark:bg-orange-900/30'; }
    else { status = 'Obesidad'; color = 'text-red-600'; bg = 'bg-red-100 dark:bg-red-900/30'; }
    return { value: val, status, color, bg };
  }, [patient.peso, patient.altura]);

  // --- LÓGICA DE LA TABLA HISTÓRICA ---
  const handleEvalChange = (id, field, value) => {
      setEvaluaciones(evaluaciones.map(ev => ev.id === id ? { ...ev, [field]: value } : ev));
  };

  const addEval = () => {
      const newId = Date.now();
      const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      setEvaluaciones([...evaluaciones, { 
          id: newId, fecha: today, peso: '', pecho: '', brazoDer: '', brazoIzq: '', cintura: '', cadera: '', piernaDer: '', piernaIzq: '' 
      }]);
  };

  const removeEval = (id) => {
      if (evaluaciones.length <= 1) {
          alert("Debe mantener al menos una evaluación.");
          return;
      }
      if(window.confirm('¿Estás seguro de eliminar esta evaluación y sus medidas?')) {
          setEvaluaciones(evaluaciones.filter(ev => ev.id !== id));
      }
  };

  // Definición de las filas que queremos mostrar (Métricas)
  const metricsList = [
      { key: 'peso', label: 'Peso (kg)' },
      { key: 'pecho', label: 'Pecho (cm)' },
      { key: 'brazoDer', label: 'Brazo Derecho (cm)' },
      { key: 'brazoIzq', label: 'Brazo Izquierdo (cm)' },
      { key: 'cintura', label: 'Cintura (cm)' },
      { key: 'cadera', label: 'Cadera (cm)' },
      { key: 'piernaDer', label: 'Pierna Derecha (cm)' },
      { key: 'piernaIzq', label: 'Pierna Izquierda (cm)' }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
        
        {/* BLOQUE SUPERIOR: Mediciones Actuales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Antropometría (Actual)" icon={Scale}>
                <div className="mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-700">
                    <div><p className="text-xs font-bold text-slate-500 uppercase">IMC Calculado</p><p className={`text-3xl font-bold ${imcData.color}`}>{imcData.value}</p></div>
                    {imcData.status && (<span className={`px-3 py-1 rounded-full text-xs font-bold ${imcData.bg} ${imcData.color}`}>{imcData.status}</span>)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Peso" type="number" name="peso" value={patient.peso} onChange={onChange} suffix="kg" />
                    <InputGroup label="Altura" type="number" name="altura" value={patient.altura} onChange={onChange} suffix="cm" />
                    <InputGroup label="Cintura" type="number" name="cintura" value={patient.cintura} onChange={onChange} suffix="cm" />
                    <InputGroup label="Cadera" type="number" name="cadera" value={patient.cadera} onChange={onChange} suffix="cm" />
                </div>
            </Card>
            
            <Card title="Composición Corporal" icon={Activity}>
                <div className="space-y-6">
                    <div>
                        <h5 className="text-xs font-bold text-teal-600 uppercase mb-3">Bioimpedancia</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="% Grasa" type="number" name="masaGrasa" value={patient.masaGrasa} onChange={onChange} suffix="%" />
                            <InputGroup label="Masa Muscular" type="number" name="masaMuscular" value={patient.masaMuscular} onChange={onChange} suffix="kg" />
                            <InputGroup label="Grasa Visceral" type="number" name="grasaVisceral" value={patient.grasaVisceral} onChange={onChange} suffix="niv" />
                            <InputGroup label="Edad Metab." type="number" name="edadMetabolica" value={patient.edadMetabolica} onChange={onChange} suffix="años" />
                        </div>
                    </div>
                </div>
            </Card>
            
            <Card title="Bioquímica & Signos" icon={ClipboardList}>
                <div className="space-y-6">
                    <InputGroup label="Presión Arterial" name="presionArterial" value={patient.presionArterial} onChange={onChange} placeholder="120/80" />
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Perfil Metabólico</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Glucemia" name="glucemia" value={patient.glucemia} onChange={onChange} suffix="mg" />
                            <InputGroup label="HbA1c" name="hba1c" value={patient.hba1c} onChange={onChange} suffix="%" />
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Perfil Lipídico</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Col. Total" name="colesterol" value={patient.colesterol} onChange={onChange} />
                            <InputGroup label="Triglic." name="trigliceridos" value={patient.trigliceridos} onChange={onChange} />
                        </div>
                    </div>
                </div>
            </Card>
        </div>

        {/* BLOQUE INFERIOR: HISTÓRICO Y PERÍMETROS (LA NUEVA TABLA) */}
        <Card title="Histórico y Evolución de Perímetros" icon={TrendingUp} className="border-t-4 border-t-teal-500">
            <div className="bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 p-3 rounded-lg text-sm mb-4 border border-teal-100 dark:border-teal-900/30">
                Registra la evolución del paciente a través del tiempo. Añade una nueva columna por cada consulta.
            </div>
            
            <div className="overflow-x-auto relative rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {/* Celda Fija Izquierda */}
                            <th className="px-4 py-4 min-w-[160px] sticky left-0 bg-slate-50 dark:bg-slate-900 z-10 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_#334155]">
                                Métrica / Fecha
                            </th>
                            
                            {/* Columnas Dinámicas de Fechas */}
                            {evaluaciones.map((ev, index) => (
                                <th key={ev.id} className="px-2 py-2 min-w-[130px] text-center border-l border-slate-200 dark:border-slate-700">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <span className="text-teal-600 dark:text-teal-400 bg-teal-100/50 dark:bg-teal-900/30 px-2 py-0.5 rounded">Eval {index + 1}</span>
                                        <input 
                                            type="date" 
                                            value={ev.fecha} 
                                            onChange={(e) => handleEvalChange(ev.id, 'fecha', e.target.value)}
                                            className="w-full bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-teal-500 outline-none text-center font-normal text-xs p-1 dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert"
                                        />
                                    </div>
                                </th>
                            ))}
                            
                            {/* Botón Flotante a la derecha para añadir */}
                            <th className="px-3 py-2 w-16 text-center border-l border-slate-200 dark:border-slate-700">
                                <button onClick={addEval} className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 p-2 rounded-full transition-colors" title="Añadir Evaluación">
                                    <PlusCircle size={22} />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {/* Iteramos sobre nuestra lista de métricas para crear las filas */}
                        {metricsList.map((metric) => (
                            <tr key={metric.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                {/* Nombre de la Métrica (Columna Fija) */}
                                <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1e293b] sticky left-0 z-10 shadow-[1px_0_0_0_#f1f5f9] dark:shadow-[1px_0_0_0_#334155]">
                                    {metric.label}
                                </td>
                                
                                {/* Inputs de Valores */}
                                {evaluaciones.map((ev) => (
                                    <td key={ev.id} className="p-2 border-l border-slate-100 dark:border-slate-700/50">
                                        <input 
                                            type="number" 
                                            value={ev[metric.key]} 
                                            onChange={(e) => handleEvalChange(ev.id, metric.key, e.target.value)}
                                            className="w-full text-center bg-transparent border-b border-transparent focus:border-teal-500 outline-none p-1.5 font-medium text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-slate-900 transition-all rounded"
                                            placeholder="-"
                                        />
                                    </td>
                                ))}
                                <td className="border-l border-slate-100 dark:border-slate-700/50"></td>
                            </tr>
                        ))}
                        
                        {/* Fila Inferior para Eliminar Columnas */}
                        <tr>
                            <td className="px-4 py-2 sticky left-0 bg-white dark:bg-[#1e293b] z-10 shadow-[1px_0_0_0_#f1f5f9] dark:shadow-[1px_0_0_0_#334155]"></td>
                            {evaluaciones.map((ev) => (
                                <td key={`del-${ev.id}`} className="p-2 text-center border-l border-slate-100 dark:border-slate-700/50">
                                    <button onClick={() => removeEval(ev.id)} className="text-slate-300 hover:text-red-500 p-1 transition-colors" title="Eliminar Evaluación">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            ))}
                            <td className="border-l border-slate-100 dark:border-slate-700/50"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
  );
};

export default MeasurementsTab;