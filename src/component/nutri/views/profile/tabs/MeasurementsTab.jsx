import React, { useState, useMemo } from 'react';
import { 
    Scale, Activity, ClipboardList, TrendingUp, 
    PlusCircle, Trash2, Scissors, BarChart2, 
    TestTube, Plus, X 
} from 'lucide-react';
import Card from '../ui/Card';
import { InputGroup } from '../ui/FormComponents';

const MeasurementsTab = ({ patient, setPatient, onChange, evaluaciones, setEvaluaciones }) => {
  
  // --- 1. ESTADO PARA PARÁMETROS DINÁMICOS ---
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [newMarker, setNewMarker] = useState({ label: '', unit: '' });

  // --- 2. CÁLCULO DE IMC ---
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

  // --- 3. LÓGICA DEL HISTÓRICO ---
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

  // --- 4. LÓGICA DEL GRÁFICO DE LÍNEA SVG ---
  const chartData = useMemo(() => {
    const validData = evaluaciones
        .filter(ev => ev.peso && !isNaN(ev.peso) && Number(ev.peso) > 0)
        .map((ev, index) => ({ 
            id: ev.id, 
            fecha: ev.fecha, 
            peso: Number(ev.peso),
            label: ev.fecha ? ev.fecha.substring(5).replace('-', '/') : `E${index+1}`
        }));

    if (validData.length < 2) return null;

    const HEIGHT = 150;
    const WIDTH = 500;
    const PADDING_Y = 20;

    const weights = validData.map(d => d.peso);
    const minWeight = Math.min(...weights) - 1;
    const maxWeight = Math.max(...weights) + 1;
    const weightRange = maxWeight - minWeight || 1;

    const getY = (weight) => {
        const relativePos = (weight - minWeight) / weightRange;
        return HEIGHT - PADDING_Y - (relativePos * (HEIGHT - (PADDING_Y * 2)));
    };

    const points = validData.map((d, i) => {
        const x = (i / (validData.length - 1)) * WIDTH;
        const y = getY(d.peso);
        return { ...d, x, y };
    });

    const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    return { points, pathD, HEIGHT, WIDTH, minWeight, maxWeight };
  }, [evaluaciones]);

  // --- 5. LÓGICA DEL GENERADOR DE BIOMARCADORES ---
  const handleAddCustomMarker = (e) => {
      e.preventDefault();
      if (!newMarker.label) return;

      const markerId = 'bio_' + newMarker.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_');
      const currentCustomMarkers = patient.custom_bio_markers || [];
      
      setPatient(prev => ({
          ...prev,
          custom_bio_markers: [...currentCustomMarkers, { id: markerId, label: newMarker.label, unit: newMarker.unit }],
          [markerId]: ''
      }));
      
      setNewMarker({ label: '', unit: '' });
      setIsBioModalOpen(false);
  };

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
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300 pb-10">
        
        {/* --- FILA 1: DATOS FÍSICOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Antropometría General */}
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

            {/* 2. Composición Corporal (ACTUALIZADA) */}
            <Card title="Composición Corporal" icon={Activity}>
                <div className="space-y-6">
                    <div>
                        <h5 className="text-xs font-bold text-teal-600 uppercase mb-3">Análisis de Masas (Bioimpedancia)</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="% Masa Grasa" type="number" step="0.1" name="masaGrasa" value={patient.masaGrasa} onChange={onChange} suffix="%" />
                            <InputGroup label="% M. Musculo Esq." type="number" step="0.1" name="masaMuscular" value={patient.masaMuscular} onChange={onChange} suffix="%" />
                            <InputGroup label="Masa Ósea" type="number" step="0.1" name="masaOsea" value={patient.masaOsea} onChange={onChange} suffix="kg" />
                            <InputGroup label="% Agua Corporal" type="number" step="0.1" name="aguaCorporal" value={patient.aguaCorporal} onChange={onChange} suffix="%" />
                            <InputGroup label="% Grasa Subcutánea" type="number" step="0.1" name="grasaSubcutanea" value={patient.grasaSubcutanea} onChange={onChange} suffix="%" />
                            <InputGroup label="Grasa Visceral" type="number" step="0.1" name="grasaVisceral" value={patient.grasaVisceral} onChange={onChange} suffix="niv" />
                        </div>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                        <h5 className="text-xs font-bold text-teal-600 uppercase mb-3">Perímetros Rápidos</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Brazo (R)" type="number" name="brazoR" value={patient.brazoR} onChange={onChange} suffix="cm" />
                            <InputGroup label="Brazo (C)" type="number" name="brazoC" value={patient.brazoC} onChange={onChange} suffix="cm" />
                            <InputGroup label="Pantorrilla" type="number" name="pantorrilla" value={patient.pantorrilla} onChange={onChange} suffix="cm" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* 3. Pliegues (ISAK) */}
            <Card title="Pliegues Cutáneos (ISAK)" icon={Scissors}>
                <div className="grid grid-cols-2 gap-4"><InputGroup label="Tricipital" type="number" name="pliegue_tricipital" value={patient.pliegue_tricipital} onChange={onChange} suffix="mm" /><InputGroup label="Bicipital" type="number" name="pliegue_bicipital" value={patient.pliegue_bicipital} onChange={onChange} suffix="mm" /><InputGroup label="Subescapular" type="number" name="pliegue_subescapular" value={patient.pliegue_subescapular} onChange={onChange} suffix="mm" /><InputGroup label="Supraespinal" type="number" name="pliegue_supraespinal" value={patient.pliegue_supraespinal} onChange={onChange} suffix="mm" /><InputGroup label="Abdominal" type="number" name="pliegue_abdominal" value={patient.pliegue_abdominal} onChange={onChange} suffix="mm" /><InputGroup label="Muslo Frontal" type="number" name="pliegue_muslo" value={patient.pliegue_muslo} onChange={onChange} suffix="mm" /><div className="col-span-2 md:w-1/2 pr-2"><InputGroup label="Pantorrilla" type="number" name="pliegue_pantorrilla" value={patient.pliegue_pantorrilla} onChange={onChange} suffix="mm" /></div></div>
            </Card>
        </div>

        {/* --- FILA 2: BIOQUÍMICA (NUEVA) Y GRÁFICO (MANTENIDO) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bioquímica Dinámica */}
            <Card title="Bioquímica & Signos Clínicos" icon={TestTube}>
                <div className="space-y-6">
                    <InputGroup label="Presión Arterial" name="presionArterial" value={patient.presionArterial} onChange={onChange} placeholder="120/80" />
                    
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                        <h5 className="text-xs font-bold text-teal-600 uppercase mb-3">Panel Sanguíneo Base</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Hemoglobina" name="hemoglobina" value={patient.hemoglobina} onChange={onChange} suffix="g/dL" />
                            <InputGroup label="Glucosa" name="glucosa" value={patient.glucosa} onChange={onChange} suffix="mg/dL" />
                            <InputGroup label="Colesterol Total" name="colesterol" value={patient.colesterol} onChange={onChange} suffix="mg/dL" />
                            <InputGroup label="Triglicéridos" name="trigliceridos" value={patient.trigliceridos} onChange={onChange} suffix="mg/dL" />
                            <InputGroup label="Creatinina" name="creatinina" value={patient.creatinina} onChange={onChange} suffix="mg/dL" />
                        </div>
                    </div>

                    {/* ZONA DE PARÁMETROS DINÁMICOS */}
                    {(patient.custom_bio_markers && patient.custom_bio_markers.length > 0) && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <h4 className="text-[10px] font-bold text-orange-500 uppercase mb-3 flex items-center gap-1">
                                Marcadores Personalizados
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {patient.custom_bio_markers.map(marker => (
                                    <InputGroup 
                                        key={marker.id} 
                                        label={marker.label} 
                                        name={marker.id} 
                                        value={patient[marker.id] || ''} 
                                        onChange={onChange} 
                                        suffix={marker.unit} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* BOTÓN AÑADIR PARÁMETRO */}
                    <button 
                        onClick={() => setIsBioModalOpen(true)}
                        className="w-full mt-2 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-bold text-xs rounded-lg hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={14} /> Añadir parámetro extra
                    </button>
                </div>
            </Card>

            {/* Gráfico de Línea SVG (Mantenido intacto) */}
            <div className="lg:col-span-2">
                <Card title="Tendencia de Peso Corporal" icon={TrendingUp} className="h-full">
                    <div className="flex flex-col h-full min-h-[300px] justify-center pt-6 pb-2 px-4">
                        {chartData ? (
                            <div className="relative w-full h-full">
                                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-mono pointer-events-none z-0 pb-6 pl-6">
                                    <div className="border-b border-slate-200 dark:border-slate-700 w-full h-0 flex items-center"><span>{Math.round(chartData.maxWeight)}kg</span></div>
                                    <div className="border-b border-slate-100 dark:border-slate-800 w-full h-0"></div>
                                    <div className="border-b border-slate-200 dark:border-slate-700 w-full h-0 flex items-center"><span>{Math.round(chartData.minWeight)}kg</span></div>
                                </div>
                                <svg viewBox={`0 0 ${chartData.WIDTH} ${chartData.HEIGHT}`} className="w-full h-full overflow-visible z-10 relative pl-6 pb-6">
                                    <path d={chartData.pathD} fill="none" stroke="currentColor" strokeWidth="3" className="text-teal-500 dark:text-teal-400 transition-all duration-500 ease-in-out" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                                    {chartData.points.map((p, i) => (
                                        <g key={p.id} className="group cursor-pointer">
                                            <circle cx={p.x} cy={p.y} r="5" className="fill-white dark:fill-slate-800 stroke-teal-600 dark:stroke-teal-400 stroke-2 transition-all group-hover:r-7 group-hover:fill-teal-100" vectorEffect="non-scaling-stroke"/>
                                            <foreignObject x={p.x - 40} y={p.y - 55} width="80" height="50" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center bg-slate-800 text-white text-xs rounded-lg py-1 shadow-lg">
                                                    <span className="font-bold">{p.peso} kg</span>
                                                    <span className="text-[10px] text-slate-300">{p.label}</span>
                                                </div>
                                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800 mx-auto mt-[-1px]"></div>
                                            </foreignObject>
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

        {/* --- FILA 3: TABLA MATRIZ HISTÓRICA --- */}
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

        {/* --- MODAL PARA AÑADIR BIOMARCADOR --- */}
        {isBioModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleAddCustomMarker}>
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <TestTube size={18} className="text-teal-500"/> Nuevo Biomarcador
                            </h3>
                            <button type="button" onClick={() => setIsBioModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nombre del parámetro</label>
                                <input 
                                    required autoFocus type="text" placeholder="Ej: Ácido Úrico, Hierro, Vitamina D..."
                                    value={newMarker.label} onChange={(e) => setNewMarker({...newMarker, label: e.target.value})}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm outline-none focus:border-teal-500 dark:text-white"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Unidad de medida (Opcional)</label>
                                <input 
                                    type="text" placeholder="Ej: mg/dL, ng/mL, UI/L..."
                                    value={newMarker.unit} onChange={(e) => setNewMarker({...newMarker, unit: e.target.value})}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm outline-none focus:border-teal-500 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                            <button type="button" onClick={() => setIsBioModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Cancelar</button>
                            <button type="submit" className="px-4 py-2 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md">Agregar al perfil</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

    </div>
  );
};

export default MeasurementsTab;