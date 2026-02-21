import React, { useMemo } from 'react';
import { TrendingUp, Calculator, Utensils, Droplet } from 'lucide-react';
import Card from '../ui/Card';
import { InputGroup } from '../ui/FormComponents';

const PlanningTab = ({ patient, onChange }) => {
  // Cálculos encapsulados
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

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
        <Card title="Diagnóstico y Objetivos" icon={TrendingUp}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Estado Actual</p>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">{patient.peso || 0} <span className="text-sm font-normal text-slate-500">kg</span></span>
                    </div>
                </div>
                <div><InputGroup label="Peso Objetivo" type="number" name="pesoObjetivo" value={patient.pesoObjetivo} onChange={onChange} suffix="kg" className="bg-blue-50/50 dark:bg-blue-900/10 p-2 rounded-lg" /></div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50 flex justify-between items-center">
                    <div><p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">Meta a Lograr</p><p className="text-blue-600 dark:text-blue-400 font-bold">{parseFloat(patient.peso) > parseFloat(patient.pesoObjetivo) ? 'Reducción de' : 'Aumento de'} {Math.abs(patient.peso - patient.pesoObjetivo).toFixed(1)} kg</p></div><TrendingUp className="text-blue-300 dark:text-blue-600" size={32} />
                </div>
            </div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Cálculo Energético (Gasto)" icon={Calculator}>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <InputGroup className="flex-1" label="Fórmula TMB" name="formulaTMB" value={patient.formulaTMB} onChange={onChange} options={[{value: 'mifflin', label: 'Mifflin-St Jeor'}, {value: 'harris', label: 'Harris-Benedict'}]} />
                        <div className="w-1/3"><label className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5 uppercase block">TMB (Basal)</label><div className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-mono text-center py-2.5 rounded-lg border border-gray-200 dark:border-slate-700">{Math.round(tmb)}</div></div>
                    </div>
                    <InputGroup label="Nivel de Actividad (PAL)" name="factorActividad" value={patient.factorActividad} onChange={onChange} options={[{value: 1.2, label: 'Sedentario (1.2)'}, {value: 1.375, label: 'Ligero (1.375)'}, {value: 1.55, label: 'Moderado (1.55)'}, {value: 1.725, label: 'Activo (1.725)'}, {value: 1.9, label: 'Muy Activo (1.9)'}]} />
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg flex justify-between items-center border border-teal-100 dark:border-teal-800/50"><span className="text-teal-800 dark:text-teal-300 font-bold text-sm">Gasto Energético Total (GET)</span><span className="text-xl font-bold text-teal-700 dark:text-teal-400">{get} kcal</span></div>
                </div>
            </Card>
            <Card title="Planificación Dietética" icon={Utensils} className="border-t-4 border-t-purple-500 dark:border-t-purple-600">
                <div className="mb-6">
                    <InputGroup label="Ajuste por Objetivo (Déficit/Superávit)" type="number" name="ajusteCalorico" value={patient.ajusteCalorico} onChange={onChange} suffix="kcal" placeholder="-300" />
                    <div className="mt-6 text-center"><span className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest">Calorías Totales Dieta</span><div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-1">{caloriasObjetivo} kcal</div></div>
                </div>
                <div className="border-t border-gray-100 dark:border-slate-700 pt-4 space-y-4">
                    <h5 className="text-xs font-bold text-teal-600 uppercase">Distribución de Macros</h5>
                    <div><div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300"><span className="font-bold">Proteínas ({patient.macroProt}%)</span><span>{Math.round((caloriasObjetivo * (patient.macroProt/100)) / 4)}g / {Math.round(caloriasObjetivo * (patient.macroProt/100))}kcal</span></div><input type="range" name="macroProt" min="10" max="60" value={patient.macroProt} onChange={onChange} className="w-full h-2 bg-blue-100 dark:bg-blue-900 rounded-lg appearance-none cursor-pointer accent-blue-600" /></div>
                    <div><div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300"><span className="font-bold">Grasas ({patient.macroGrasa}%)</span><span>{Math.round((caloriasObjetivo * (patient.macroGrasa/100)) / 9)}g / {Math.round(caloriasObjetivo * (patient.macroGrasa/100))}kcal</span></div><input type="range" name="macroGrasa" min="10" max="60" value={patient.macroGrasa} onChange={onChange} className="w-full h-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg appearance-none cursor-pointer accent-yellow-500" /></div>
                    <div><div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300"><span className="font-bold">Carbohidratos ({patient.macroCarbo}%)</span><span>{Math.round((caloriasObjetivo * (patient.macroCarbo/100)) / 4)}g / {Math.round(caloriasObjetivo * (patient.macroCarbo/100))}kcal</span></div><input type="range" name="macroCarbo" min="10" max="80" value={patient.macroCarbo} onChange={onChange} className="w-full h-2 bg-green-100 dark:bg-green-900 rounded-lg appearance-none cursor-pointer accent-green-600" /></div>
                    <div className="flex justify-between items-center pt-2 text-xs"><span className="text-slate-400">Total: {parseInt(patient.macroProt) + parseInt(patient.macroGrasa) + parseInt(patient.macroCarbo)}%</span>{(parseInt(patient.macroProt) + parseInt(patient.macroGrasa) + parseInt(patient.macroCarbo)) !== 100 && (<span className="text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">¡Debe sumar 100%!</span>)}</div>
                </div>
            </Card>
        </div>
        <Card title="Requerimientos Específicos">
            <div className="grid grid-cols-2 gap-6">
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700"><div><div className="text-xs font-bold text-slate-500 uppercase">Meta Agua</div><div className="text-xs text-slate-400">35ml x Kg Peso</div></div><div className="text-xl font-bold text-blue-600 flex items-center gap-1"><Droplet size={18} /> {((patient.peso * 35) / 1000).toFixed(1)} L</div></div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700"><div><div className="text-xs font-bold text-slate-500 uppercase">Meta Fibra</div><div className="text-xs text-slate-400">Estándar Salud</div></div><div className="text-xl font-bold text-green-600">25 - 30 g</div></div>
            </div>
        </Card>
    </div>
  );
};

export default PlanningTab;