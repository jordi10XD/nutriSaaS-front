import React, { useMemo } from 'react';
import { Scale, Activity, ClipboardList, TrendingUp, PlusCircle, Trash2, Scissors, BarChart2 } from 'lucide-react';
import Card from '../ui/Card';
import { InputGroup } from '../ui/FormComponents';

const MeasurementsTab = ({ patient, onChange, evaluaciones, setEvaluaciones }) => {
  
  // --- CÁLCULO DE IMC ---
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

  // --- LÓGICA DEL HISTÓRICO ---
  const handleEvalChange = (id, field, value) => {
      setEvaluaciones(evaluaciones.map(ev => ev.id === id ? { ...ev, [field]: value } : ev));
  };

  const addEval = () => {
      const newId = Date.now();
      const today = new Date().toISOString().split('T')[0];
      setEvaluaciones([...evaluaciones, { 
          id: newId, fecha: today, peso: '', pecho: '', brazoDer: '', brazoIzq: '', cintura: '', cadera: '', piernaDer: '', piernaIzq: '' 
      }]);
  };

  const removeEval = (id) => {
      if (evaluaciones.length <= 1) {
          alert("Debe mantener al menos una evaluación.");
          return;
      }
      if(window.confirm('¿Estás seguro de eliminar esta evaluación?')) {
          setEvaluaciones(evaluaciones.filter(ev => ev.id !== id));
      }
  };

  // --- LÓGICA DEL GRÁFICO DE LÍNEA SVG (NUEVO) ---
  const chartData = useMemo(() => {
    // 1. Filtramos solo las evaluaciones que tienen peso válido
    const validData = evaluaciones
        .filter(ev => ev.peso && !isNaN(ev.peso) && Number(ev.peso) > 0)
        .map((ev, index) => ({ 
            id: ev.id, 
            fecha: ev.fecha, 
            peso: Number(ev.peso),
            label: ev.fecha ? ev.fecha.substring(5).replace('-', '/') : `E${index+1}`
        }));

    if (validData.length < 2) return null; // Necesitamos al menos 2 puntos para una línea

    // 2. Constantes para el dibujo SVG
    const HEIGHT = 150;
    const WIDTH = 500; // Ancho interno virtual del SVG
    const PADDING_Y = 20; // Espacio arriba y abajo

    // 3. Cálculos de escala Y (Peso)
    const weights = validData.map(d => d.peso);
    const minWeight = Math.min(...weights) - 1; // Un poco de aire abajo
    const maxWeight = Math.max(...weights) + 1; // Un poco de aire arriba
    const weightRange = maxWeight - minWeight || 1;

    // Función para convertir peso a coordenada Y (invertido porque SVG Y=0 es arriba)
    const getY = (weight) => {
        const relativePos = (weight - minWeight) / weightRange;
        return HEIGHT - PADDING_Y - (relativePos * (HEIGHT - (PADDING_Y * 2)));
    };

    // 4. Generar puntos de coordenadas (X,Y)
    const points = validData.map((d, i) => {
        const x = (i / (validData.length - 1)) * WIDTH;
        const y = getY(d.peso);
        return { ...d, x, y };
    });

    // 5. Crear el string del path SVG (M=Move to, L=Line to)
    const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

    return { points, pathD, HEIGHT, WIDTH, minWeight, maxWeight };
  }, [evaluaciones]);


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
        
        {/* --- FILA 1: DATOS FÍSICOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Antropometría y Complexión" icon={Scale}>
                <div className="mb-5 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-700">
                    <div><p className="text-xs font-bold text-slate-500 uppercase">IMC Calculado</p><p className={`text-3xl font-bold ${imcData.color}`}>{imcData.value}</p></div>
                    {imcData.status && (<span className={`px-3 py-1 rounded-full text-xs font-bold ${imcData.bg} ${imcData.color}`}>{imcData.status}</span>)}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <InputGroup label="Peso" type="number" name="peso" value={patient.peso} onChange={onChange} suffix="kg" />
                    <InputGroup label="Altura" type="number" name="altura" value={patient.altura} onChange={onChange} suffix="cm" />
                    <InputGroup label="Cintura" type="number" name="cintura" value={patient.cintura} onChange={onChange} suffix="cm" />
                    <InputGroup label="Cadera" type="number" name="cadera" value={patient.cadera} onChange={onChange} suffix="cm" />
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Somatotipo Predominante</label>
                    <div className="flex gap-2">
                        {['Ectomorfo', 'Mesomorfo', 'Endomorfo'].map(tipo => (
                            <button key={tipo} type="button" onClick={() => onChange({target: {name: 'somatotipo', value: tipo, type: 'text'}})} className={`flex-1 py-2 text-[10px] sm:text-xs font-bold rounded-lg border transition-all ${patient.somatotipo === tipo ? 'bg-teal-600 border-teal-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-teal-300 dark:hover:border-teal-700'}`}>{tipo}</button>
                        ))}
                    </div>
                </div>
            </Card>
            <Card title="Composición Corporal" icon={Activity}>
                <div className="space-y-6">
                    <div><h5 className="text-xs font-bold text-teal-600 uppercase mb-3">Bioimpedancia</h5><div className="grid grid-cols-2 gap-4"><InputGroup label="% Grasa" type="number" name="masaGrasa" value={patient.masaGrasa} onChange={onChange} suffix="%" /><InputGroup label="Masa Muscular" type="number" name="masaMuscular" value={patient.masaMuscular} onChange={onChange} suffix="kg" /><InputGroup label="Grasa Visceral" type="number" name="grasaVisceral" value={patient.grasaVisceral} onChange={onChange} suffix="niv" /><InputGroup label="Edad Metab." type="number" name="edadMetabolica" value={patient.edadMetabolica} onChange={onChange} suffix="años" /></div></div>
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-4"><h5 className="text-xs font-bold text-teal-600 uppercase mb-3">Perímetros Rápidos</h5><div className="grid grid-cols-2 gap-4"><InputGroup label="Brazo (R)" type="number" name="brazoR" value={patient.brazoR} onChange={onChange} suffix="cm" /><InputGroup label="Brazo (C)" type="number" name="brazoC" value={patient.brazoC} onChange={onChange} suffix="cm" /></div><div className="mt-4 w-1/2 pr-2"><InputGroup label="Pantorrilla" type="number" name="pantorrilla" value={patient.pantorrilla} onChange={onChange} suffix="cm" /></div></div>
                </div>
            </Card>
            <Card title="Pliegues Cutáneos (ISAK)" icon={Scissors}>
                <div className="grid grid-cols-2 gap-4"><InputGroup label="Tricipital" type="number" name="pliegue_tricipital" value={patient.pliegue_tricipital} onChange={onChange} suffix="mm" /><InputGroup label="Bicipital" type="number" name="pliegue_bicipital" value={patient.pliegue_bicipital} onChange={onChange} suffix="mm" /><InputGroup label="Subescapular" type="number" name="pliegue_subescapular" value={patient.pliegue_subescapular} onChange={onChange} suffix="mm" /><InputGroup label="Supraespinal" type="number" name="pliegue_supraespinal" value={patient.pliegue_supraespinal} onChange={onChange} suffix="mm" /><InputGroup label="Abdominal" type="number" name="pliegue_abdominal" value={patient.pliegue_abdominal} onChange={onChange} suffix="mm" /><InputGroup label="Muslo Frontal" type="number" name="pliegue_muslo" value={patient.pliegue_muslo} onChange={onChange} suffix="mm" /><div className="col-span-2 md:w-1/2 pr-2"><InputGroup label="Pantorrilla" type="number" name="pliegue_pantorrilla" value={patient.pliegue_pantorrilla} onChange={onChange} suffix="mm" /></div></div>
            </Card>
        </div>

        {/* --- FILA 2: BIOQUÍMICA Y GRÁFICO DE LÍNEA (NUEVO) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Bioquímica & Signos" icon={ClipboardList}>
                <div className="space-y-6"><InputGroup label="Presión Arterial" name="presionArterial" value={patient.presionArterial} onChange={onChange} placeholder="120/80" /><div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700"><h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Perfil Metabólico</h5><div className="grid grid-cols-2 gap-4"><InputGroup label="Glucemia" name="glucemia" value={patient.glucemia} onChange={onChange} suffix="mg" /><InputGroup label="HbA1c" name="hba1c" value={patient.hba1c} onChange={onChange} suffix="%" /></div></div><div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700"><h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Perfil Lipídico</h5><div className="grid grid-cols-2 gap-4"><InputGroup label="Col. Total" name="colesterol" value={patient.colesterol} onChange={onChange} /><InputGroup label="Triglic." name="trigliceridos" value={patient.trigliceridos} onChange={onChange} /></div></div></div>
            </Card>

            {/* NUEVO: Gráfico de Línea SVG */}
            <div className="lg:col-span-2">
                <Card title="Tendencia de Peso Corporal" icon={TrendingUp} className="h-full">
                    <div className="flex flex-col h-full min-h-[250px] justify-center pt-6 pb-2 px-4">
                        {chartData ? (
                            <div className="relative w-full h-full">
                                {/* Ejes y Líneas Guía */}
                                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-mono pointer-events-none z-0 pb-6 pl-6">
                                    <div className="border-b border-slate-200 dark:border-slate-700 w-full h-0 flex items-center"><span>{Math.round(chartData.maxWeight)}kg</span></div>
                                    <div className="border-b border-slate-100 dark:border-slate-800 w-full h-0"></div>
                                    <div className="border-b border-slate-200 dark:border-slate-700 w-full h-0 flex items-center"><span>{Math.round(chartData.minWeight)}kg</span></div>
                                </div>

                                {/* SVG del Gráfico */}
                                <svg viewBox={`0 0 ${chartData.WIDTH} ${chartData.HEIGHT}`} className="w-full h-full overflow-visible z-10 relative pl-6 pb-6">
                                    {/* La línea de tendencia */}
                                    <path d={chartData.pathD} fill="none" stroke="currentColor" strokeWidth="3" className="text-teal-500 dark:text-teal-400 transition-all duration-500 ease-in-out" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                                    
                                    {/* Puntos Interactivos */}
                                    {chartData.points.map((p, i) => (
                                        <g key={p.id} className="group cursor-pointer">
                                            {/* Círculo del punto */}
                                            <circle cx={p.x} cy={p.y} r="5" className="fill-white dark:fill-slate-800 stroke-teal-600 dark:stroke-teal-400 stroke-2 transition-all group-hover:r-7 group-hover:fill-teal-100" vectorEffect="non-scaling-stroke"/>
                                            
                                            {/* Tooltip Flotante (Solo visible en hover) */}
                                            <foreignObject x={p.x - 40} y={p.y - 55} width="80" height="50" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center bg-slate-800 text-white text-xs rounded-lg py-1 shadow-lg">
                                                    <span className="font-bold">{p.peso} kg</span>
                                                    <span className="text-[10px] text-slate-300">{p.label}</span>
                                                </div>
                                                {/* Triangulito del tooltip */}
                                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800 mx-auto mt-[-1px]"></div>
                                            </foreignObject>

                                            {/* Etiqueta Eje X (Fecha) */}
                                            <text x={p.x} y={chartData.HEIGHT + 20} textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">{p.label}</text>
                                        </g>
                                    ))}
                                </svg>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-6">
                                <BarChart2 size={32} className="text-slate-300 mb-2"/>
                                <p>Se necesitan al menos 2 registros de peso en la tabla histórica.</p>
                                <p className="text-xs">Añade evaluaciones abajo para visualizar la tendencia.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>

        {/* --- FILA 3: TABLA MATRIZ HISTÓRICA (Igual que antes) --- */}
        <Card title="Matriz Histórica de Perímetros" icon={TrendingUp} className="border-t-4 border-t-teal-500">
            <div className="bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 p-3 rounded-lg text-sm mb-4 border border-teal-100 dark:border-teal-900/30">
                Registra la evolución del paciente. Los datos de 'Peso' ingresados aquí se reflejarán en el gráfico de tendencia superior.
            </div>
            
            <div className="overflow-x-auto relative rounded-lg border border-slate-200 dark:border-slate-700 custom-scrollbar pb-2">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-4 py-4 min-w-[160px] sticky left-0 bg-slate-50 dark:bg-slate-900 z-20 shadow-[1px_0_0_0_#e2e8f0] dark:shadow-[1px_0_0_0_#334155]">Métrica / Fecha</th>
                            {evaluaciones.map((ev, index) => (
                                <th key={ev.id} className="px-2 py-2 min-w-[130px] text-center border-l border-slate-200 dark:border-slate-700">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <span className="text-teal-600 dark:text-teal-400 bg-teal-100/50 dark:bg-teal-900/30 px-2 py-0.5 rounded">Eval {index + 1}</span>
                                        <input type="date" value={ev.fecha} onChange={(e) => handleEvalChange(ev.id, 'fecha', e.target.value)} className="w-full bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-teal-500 outline-none text-center font-normal text-xs p-1 dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert"/>
                                    </div>
                                </th>
                            ))}
                            <th className="px-3 py-2 w-16 text-center border-l border-slate-200 dark:border-slate-700"><button onClick={addEval} className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 p-2 rounded-full transition-colors" title="Añadir Evaluación"><PlusCircle size={22} /></button></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {metricsList.map((metric) => (
                            <tr key={metric.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1e293b] sticky left-0 z-10 shadow-[1px_0_0_0_#f1f5f9] dark:shadow-[1px_0_0_0_#334155]">{metric.label}</td>
                                {evaluaciones.map((ev) => (
                                    <td key={ev.id} className="p-2 border-l border-slate-100 dark:border-slate-700/50"><input type="number" value={ev[metric.key]} onChange={(e) => handleEvalChange(ev.id, metric.key, e.target.value)} className="w-full text-center bg-transparent border-b border-transparent focus:border-teal-500 outline-none p-1.5 font-medium text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-slate-900 transition-all rounded" placeholder="-"/></td>
                                ))}
                                <td className="border-l border-slate-100 dark:border-slate-700/50"></td>
                            </tr>
                        ))}
                        <tr>
                            <td className="px-4 py-2 sticky left-0 bg-white dark:bg-[#1e293b] z-10 shadow-[1px_0_0_0_#f1f5f9] dark:shadow-[1px_0_0_0_#334155]"></td>
                            {evaluaciones.map((ev) => (
                                <td key={`del-${ev.id}`} className="p-2 text-center border-l border-slate-100 dark:border-slate-700/50"><button onClick={() => removeEval(ev.id)} className="text-slate-300 hover:text-red-500 p-1 transition-colors" title="Eliminar Evaluación"><Trash2 size={16} /></button></td>
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