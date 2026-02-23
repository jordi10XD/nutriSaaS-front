import React, { useMemo } from 'react';
import { TrendingUp, Calculator, Utensils, Droplet, PieChart, Pill, PlusCircle, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import { InputGroup } from '../ui/FormComponents';

const PlanningTab = ({ patient, setPatient, onChange }) => {
  
  // --- CÁLCULOS ENERGÉTICOS ---
  const tmb = useMemo(() => {
    const peso = parseFloat(patient.peso) || 0;
    const altura = parseFloat(patient.altura) || 0;
    const edad = parseFloat(patient.edad) || 30; 
    const sexo = patient.sexo?.toLowerCase();
    if (!peso || !altura) return 0;
    let base = (10 * peso) + (6.25 * altura) - (5 * edad);
    return sexo === 'hombre' ? base + 5 : base - 161;
  }, [patient.peso, patient.altura, patient.edad, patient.sexo]);

  const get = useMemo(() => Math.round(tmb * parseFloat(patient.factorActividad || 1.2)), [tmb, patient.factorActividad]);
  const caloriasObjetivo = useMemo(() => get + parseInt(patient.ajusteCalorico || 0), [get, patient.ajusteCalorico]);

  // --- CÁLCULO DE MACROS (g/kg) ---
  const pesoActual = parseFloat(patient.peso) || 1; // Evitar división por cero
  
  const macros = useMemo(() => {
      const calProt = caloriasObjetivo * (patient.macroProt / 100);
      const calGrasa = caloriasObjetivo * (patient.macroGrasa / 100);
      const calCarbo = caloriasObjetivo * (patient.macroCarbo / 100);

      const gProt = calProt / 4;
      const gGrasa = calGrasa / 9;
      const gCarbo = calCarbo / 4;

      return {
          prot: { kcal: Math.round(calProt), g: Math.round(gProt), gkg: (gProt / pesoActual).toFixed(1) },
          grasa: { kcal: Math.round(calGrasa), g: Math.round(gGrasa), gkg: (gGrasa / pesoActual).toFixed(1) },
          carbo: { kcal: Math.round(calCarbo), g: Math.round(gCarbo), gkg: (gCarbo / pesoActual).toFixed(1) },
          totalPorcentaje: parseInt(patient.macroProt) + parseInt(patient.macroGrasa) + parseInt(patient.macroCarbo)
      }
  }, [caloriasObjetivo, patient.macroProt, patient.macroGrasa, patient.macroCarbo, pesoActual]);

  // --- LÓGICA DE SUPLEMENTOS ---
  const handleAddSuplemento = () => {
      const nuevos = [...(patient.suplementos_prescritos || [])];
      nuevos.push({ id: Date.now(), nombre: '', dosis: '', momento: '' });
      setPatient(prev => ({ ...prev, suplementos_prescritos: nuevos }));
  };

  const handleSuplementoChange = (id, field, value) => {
      const nuevos = patient.suplementos_prescritos.map(sup => 
          sup.id === id ? { ...sup, [field]: value } : sup
      );
      setPatient(prev => ({ ...prev, suplementos_prescritos: nuevos }));
  };

  const handleRemoveSuplemento = (id) => {
      const nuevos = patient.suplementos_prescritos.filter(sup => sup.id !== id);
      setPatient(prev => ({ ...prev, suplementos_prescritos: nuevos }));
  };

  // --- LÓGICA DE DISTRIBUCIÓN DE COMIDAS ---
  const handleDistribucionChange = (comida, valor) => {
      setPatient(prev => ({
          ...prev,
          distribucion_comidas: {
              ...prev.distribucion_comidas,
              [comida]: parseInt(valor) || 0
          }
      }));
  };

  const totalDistribucion = useMemo(() => {
      const dist = patient.distribucion_comidas || {};
      return Object.values(dist).reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
  }, [patient.distribucion_comidas]);

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
        
        {/* --- FILA 1: DIAGNÓSTICO Y GASTO --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Diagnóstico y Objetivos" icon={TrendingUp}>
                <div className="flex flex-col gap-6 h-full justify-center">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Peso Actual</p>
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">{patient.peso || 0} <span className="text-sm font-normal text-slate-500">kg</span></span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-1">Meta a Lograr</p>
                            <p className="text-blue-600 dark:text-blue-400 font-bold">
                                {parseFloat(patient.peso) > parseFloat(patient.pesoObjetivo) ? 'Reducción de' : 'Aumento de'} {Math.abs(patient.peso - patient.pesoObjetivo).toFixed(1)} kg
                            </p>
                        </div>
                    </div>
                    <div>
                        <InputGroup label="Peso Objetivo" type="number" name="pesoObjetivo" value={patient.pesoObjetivo} onChange={onChange} suffix="kg" className="bg-blue-50/50 dark:bg-blue-900/10 p-2 rounded-lg" />
                    </div>
                </div>
            </Card>

            <Card title="Cálculo Energético (Gasto)" icon={Calculator}>
                <div className="space-y-5">
                    <div className="flex gap-4">
                        <InputGroup className="flex-1" label="Fórmula TMB" name="formulaTMB" value={patient.formulaTMB} onChange={onChange} options={[{value: 'mifflin', label: 'Mifflin-St Jeor'}, {value: 'harris', label: 'Harris-Benedict'}]} />
                        <div className="w-1/3">
                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5 uppercase block">TMB (Basal)</label>
                            <div className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-mono text-center py-2.5 rounded-lg border border-gray-200 dark:border-slate-700">{Math.round(tmb)}</div>
                        </div>
                    </div>
                    <InputGroup label="Nivel de Actividad (PAL)" name="factorActividad" value={patient.factorActividad} onChange={onChange} options={[{value: 1.2, label: 'Sedentario (1.2)'}, {value: 1.375, label: 'Ligero (1.375)'}, {value: 1.55, label: 'Moderado (1.55)'}, {value: 1.725, label: 'Activo (1.725)'}, {value: 1.9, label: 'Muy Activo (1.9)'}]} />
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg flex justify-between items-center border border-teal-100 dark:border-teal-800/50">
                        <span className="text-teal-800 dark:text-teal-300 font-bold text-sm">Gasto Energético Total (GET)</span>
                        <span className="text-xl font-bold text-teal-700 dark:text-teal-400">{get} kcal</span>
                    </div>
                </div>
            </Card>
        </div>

       {/* --- FILA 2: PLANIFICACIÓN DIETÉTICA Y DISTRIBUCIÓN --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* MACROS */}
            <Card title="Planificación Dietética (Macros)" icon={Utensils} className="border-t-4 border-t-purple-500">
                <div className="mb-6">
                    <InputGroup label="Ajuste por Objetivo (Déficit/Superávit)" type="number" name="ajusteCalorico" value={patient.ajusteCalorico} onChange={onChange} suffix="kcal" placeholder="-300" />
                    
                    <div className="mt-6 text-center">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">Calorías Totales Dieta</span>
                        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-1">{caloriasObjetivo} kcal</div>
                    </div>
                </div>
                
                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-5">
                    <h5 className="text-xs font-bold text-teal-600 uppercase">Distribución de Macronutrientes</h5>
                    
                    {/* Proteína */}
                    <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300">
                            <span className="font-bold">Proteínas ({patient.macroProt}%)</span>
                            <span className="flex gap-2">
                                {/* NUEVO: Indicador g/kg */}
                                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 rounded font-bold">
                                    {macros.prot.gkg} g/kg
                                </span>
                                <span>{macros.prot.g}g / {macros.prot.kcal}kcal</span>
                            </span>
                        </div>
                        <input type="range" name="macroProt" min="10" max="60" value={patient.macroProt} onChange={onChange} className="w-full h-2 bg-blue-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>

                    {/* Grasas */}
                    <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300">
                            <span className="font-bold">Grasas ({patient.macroGrasa}%)</span>
                            <span className="flex gap-2">
                                <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 px-1.5 rounded font-bold">
                                    {macros.grasa.gkg} g/kg
                                </span>
                                <span>{macros.grasa.g}g / {macros.grasa.kcal}kcal</span>
                            </span>
                        </div>
                        <input type="range" name="macroGrasa" min="10" max="60" value={patient.macroGrasa} onChange={onChange} className="w-full h-2 bg-yellow-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                    </div>

                    {/* Carbos */}
                    <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300">
                            <span className="font-bold">Carbohidratos ({patient.macroCarbo}%)</span>
                            <span className="flex gap-2">
                                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 rounded font-bold">
                                    {macros.carbo.gkg} g/kg
                                </span>
                                <span>{macros.carbo.g}g / {macros.carbo.kcal}kcal</span>
                            </span>
                        </div>
                        <input type="range" name="macroCarbo" min="10" max="80" value={patient.macroCarbo} onChange={onChange} className="w-full h-2 bg-green-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-600" />
                    </div>

                    {/* Validación Total */}
                    <div className="flex justify-between items-center pt-2 text-xs font-bold">
                        <span className={macros.totalPorcentaje === 100 ? 'text-green-500' : 'text-slate-400'}>
                            Total: {macros.totalPorcentaje}%
                        </span>
                        {macros.totalPorcentaje !== 100 && (
                            <span className="text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">¡Debe sumar 100%!</span>
                        )}
                    </div>
                </div>
            </Card>

            {/* DISTRIBUCIÓN DE COMIDAS & REQUERIMIENTOS */}
            <div className="flex flex-col gap-6">
                <Card title="Distribución de Comidas (%)" icon={PieChart}>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Desayuno" type="number" value={patient.distribucion_comidas?.desayuno || ''} onChange={(e) => handleDistribucionChange('desayuno', e.target.value)} suffix="%" />
                        <InputGroup label="Colación 1" type="number" value={patient.distribucion_comidas?.colacion1 || ''} onChange={(e) => handleDistribucionChange('colacion1', e.target.value)} suffix="%" />
                        <InputGroup label="Almuerzo" type="number" value={patient.distribucion_comidas?.almuerzo || ''} onChange={(e) => handleDistribucionChange('almuerzo', e.target.value)} suffix="%" />
                        <InputGroup label="Colación 2" type="number" value={patient.distribucion_comidas?.colacion2 || ''} onChange={(e) => handleDistribucionChange('colacion2', e.target.value)} suffix="%" />
                        <InputGroup label="Cena" type="number" value={patient.distribucion_comidas?.cena || ''} onChange={(e) => handleDistribucionChange('cena', e.target.value)} suffix="%" />
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs font-bold">
                         <span className={totalDistribucion === 100 ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}>
                             Total Distribución: {totalDistribucion}%
                         </span>
                         {totalDistribucion !== 100 && <span className="text-red-500">Ajustar a 100%</span>}
                    </div>
                </Card>

                <Card title="Requerimientos Específicos">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                            <div><div className="text-xs font-bold text-slate-500 uppercase">Meta Agua</div><div className="text-xs text-slate-400">35ml x Kg</div></div>
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Droplet size={16} /> {((pesoActual * 35) / 1000).toFixed(1)} L</div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                            <div><div className="text-xs font-bold text-slate-500 uppercase">Meta Fibra</div><div className="text-xs text-slate-400">Estándar</div></div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">25 - 30 g</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>

        {/* --- FILA 3: SUPLEMENTACIÓN DEPORTIVA/CLÍNICA --- */}
        <Card title="Prescripción de Suplementación" icon={Pill} className="border-t-4 border-t-amber-500">
             <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-3 rounded-lg text-sm mb-4 border border-amber-100 dark:border-amber-900/30">
                Añade los suplementos específicos, dosis y el momento de toma para el paciente.
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-4 py-3">Nombre del Suplemento</th>
                            <th className="px-4 py-3 w-40">Dosis / Cantidad</th>
                            <th className="px-4 py-3 w-64">Momento de Toma (Timing)</th>
                            <th className="px-4 py-3 w-10 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {(patient.suplementos_prescritos || []).map((sup) => (
                            <tr key={sup.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="p-2">
                                    <input 
                                        type="text" 
                                        value={sup.nombre} 
                                        onChange={(e) => handleSuplementoChange(sup.id, 'nombre', e.target.value)} 
                                        placeholder="Ej: Proteína Whey, Omega 3..." 
                                        className="w-full bg-transparent border-b border-transparent focus:border-amber-500 outline-none p-1.5 font-medium text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 transition-all"
                                    />
                                </td>
                                <td className="p-2">
                                    <input 
                                        type="text" 
                                        value={sup.dosis} 
                                        onChange={(e) => handleSuplementoChange(sup.id, 'dosis', e.target.value)} 
                                        placeholder="Ej: 30g, 1 cap..." 
                                        className="w-full bg-transparent border-b border-transparent focus:border-amber-500 outline-none p-1.5 text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 transition-all"
                                    />
                                </td>
                                <td className="p-2">
                                    <input 
                                        type="text" 
                                        value={sup.momento} 
                                        onChange={(e) => handleSuplementoChange(sup.id, 'momento', e.target.value)} 
                                        placeholder="Ej: Post-entreno, con almuerzo..." 
                                        className="w-full bg-transparent border-b border-transparent focus:border-amber-500 outline-none p-1.5 text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 transition-all"
                                    />
                                </td>
                                <td className="p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleRemoveSuplemento(sup.id)} className="text-slate-300 hover:text-red-500 p-1">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleAddSuplemento} className="w-full py-3 mt-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all flex items-center justify-center gap-2 font-bold text-sm">
                    <PlusCircle size={18} /> Añadir Suplemento
                </button>
            </div>
        </Card>

    </div>
  );
};

export default PlanningTab;