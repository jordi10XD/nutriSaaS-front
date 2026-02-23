import React, { useState } from 'react';
import { Dumbbell, PlusCircle, Trash2, X, HeartPulse, MessageSquare, Activity } from 'lucide-react';
import Card from '../ui/Card';
import { InputGroup, TextAreaGroup } from '../ui/FormComponents'; // Asegúrate de exportar TextAreaGroup en FormComponents

const TrainingTab = ({ rutina, setRutina, patient, onChange }) => {
  const [activeDay, setActiveDay] = useState(0);

  // --- 1. LÓGICA DE EJERCICIOS ---
  const handleExerciseChange = (dayIndex, exerciseId, field, value) => {
    const newRutina = [...rutina];
    const exercise = newRutina[dayIndex].ejercicios.find(e => e.id === exerciseId);
    if (exercise) {
        exercise[field] = value; 
        setRutina(newRutina); 
    }
  };

  const addExercise = (dayIndex) => {
    const newRutina = [...rutina];
    newRutina[dayIndex].ejercicios.push({ 
      id: Date.now(), nombre: '', series: '3', tipo: 'Normal', reps: '', kg: '', rir: '', descanso: '' 
    });
    setRutina(newRutina);
  };

  const removeExercise = (dayIndex, exerciseId) => {
    const newRutina = [...rutina];
    newRutina[dayIndex].ejercicios = newRutina[dayIndex].ejercicios.filter(e => e.id !== exerciseId);
    setRutina(newRutina);
  };

  // --- 2. LÓGICA DE DÍAS ---
  const addDay = () => {
    setRutina([...rutina, { id: Date.now(), nombre: `Día ${rutina.length + 1}`, ejercicios: [] }]);
    setActiveDay(rutina.length); 
  };

  const handleDayNameChange = (dayIndex, newName) => {
    const newRutina = [...rutina];
    newRutina[dayIndex].nombre = newName;
    setRutina(newRutina);
  };

  const removeDay = (dayIndex, e) => {
    e.stopPropagation(); 
    if (rutina.length <= 1) {
        alert("Debe existir al menos un día de entrenamiento.");
        return;
    }
    if (window.confirm("¿Estás seguro de eliminar este día y todos sus ejercicios?")) {
        const newRutina = rutina.filter((_, idx) => idx !== dayIndex);
        setRutina(newRutina);
        if (activeDay >= newRutina.length) {
            setActiveDay(newRutina.length - 1);
        } else if (activeDay === dayIndex) {
            setActiveDay(0);
        }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
      
      {/* --- BLOQUE 1: RUTINA DE FUERZA --- */}
      
      {/* NAVEGACIÓN Y EDICIÓN DE DÍAS */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar">
          <div className="flex gap-2">
              {rutina.map((dia, index) => (
                  <div
                      key={dia.id}
                      onClick={() => setActiveDay(index)}
                      className={`relative flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer group
                          ${activeDay === index 
                          ? 'bg-amber-500 text-white shadow-md pr-8' 
                          : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400'}`}
                  >
                      {activeDay === index ? (
                          <input 
                              type="text" 
                              value={dia.nombre} 
                              onChange={(e) => handleDayNameChange(index, e.target.value)}
                              className="bg-transparent border-b border-amber-300 focus:border-white outline-none text-white font-bold w-32 placeholder-white/70 p-0"
                              onClick={(e) => e.stopPropagation()} 
                              autoFocus
                          />
                      ) : (
                          <span>{dia.nombre}</span>
                      )}

                      {activeDay === index && rutina.length > 1 && (
                          <button onClick={(e) => removeDay(index, e)} className="absolute right-2 text-amber-200 hover:text-white hover:bg-amber-600 rounded p-0.5 transition-colors" title="Borrar Día">
                              <X size={16} />
                          </button>
                      )}
                  </div>
              ))}
              <button onClick={addDay} className="px-3 py-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" title="Añadir Día">
                  <PlusCircle size={20} />
              </button>
          </div>
      </div>
  
      {/* TABLA DE RUTINA */}
      <Card title={rutina[activeDay]?.nombre || "Entrenamiento"} icon={Dumbbell} className="border-t-4 border-t-amber-500">
          <div className="overflow-x-auto min-h-[250px] custom-scrollbar pb-2">
              <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                          <th className="px-4 py-3 min-w-[180px]">Ejercicio</th>
                          <th className="px-1 py-3 w-14 text-center">Series</th>
                          <th className="px-2 py-3 min-w-[130px]">Tipo</th>
                          <th className="px-1 py-3 w-20 text-center">Reps</th>
                          <th className="px-1 py-3 w-20 text-center">Kg</th>
                          <th className="px-1 py-3 w-16 text-center">RIR</th>
                          <th className="px-1 py-3 w-20 text-center">Rest</th>
                          <th className="px-1 py-3 w-10"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {rutina[activeDay]?.ejercicios.map((ej) => (
                          <tr key={ej.id} className="group hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                              <td className="p-2">
                                  <input type="text" value={ej.nombre} onChange={(e) => handleExerciseChange(activeDay, ej.id, 'nombre', e.target.value)} placeholder="Nombre del ejercicio..." className="w-full bg-transparent border-b border-transparent focus:border-amber-500 outline-none p-1.5 font-bold text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 transition-all" />
                              </td>
                              <td className="p-1">
                                  <input type="text" value={ej.series} onChange={(e) => handleExerciseChange(activeDay, ej.id, 'series', e.target.value)} className="w-full text-center bg-slate-100 dark:bg-slate-800 border-none rounded p-1.5 font-bold text-slate-700 dark:text-white focus:ring-1 focus:ring-amber-500" />
                              </td>
                              <td className="p-2">
                                  <select value={ej.tipo} onChange={(e) => handleExerciseChange(activeDay, ej.id, 'tipo', e.target.value)} className="w-full bg-transparent text-xs border border-slate-200 dark:border-slate-700 rounded p-1.5 outline-none focus:border-amber-500 dark:bg-slate-800 dark:text-slate-300 appearance-none">
                                      <option value="Normal">Tradicional</option><option value="Drop set">Drop set</option><option value="Rest pause">Rest pause</option><option value="Biserie">Biserie</option><option value="Triserie">Triserie</option><option value="Cluster">Cluster</option><option value="Circuito">Circuito HIIT</option><option value="Minutos">Por Minutos</option>
                                  </select>
                              </td>
                              {['reps', 'kg', 'rir', 'descanso'].map((field) => (
                                  <td className="p-1" key={field}>
                                      <input type="text" value={ej[field]} onChange={(e) => handleExerciseChange(activeDay, ej.id, field, e.target.value)} className="w-full text-center bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-amber-500 outline-none p-1 text-slate-600 dark:text-slate-400 focus:bg-slate-50 dark:focus:bg-slate-800 transition-colors" />
                                  </td>
                              ))}
                              <td className="p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => removeExercise(activeDay, ej.id)} className="text-slate-300 hover:text-red-500 p-1">
                                      <Trash2 size={16} />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              <button onClick={() => addExercise(activeDay)} className="w-full py-3 mt-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all flex items-center justify-center gap-2 font-bold text-sm">
                  <PlusCircle size={18} /> Añadir Ejercicio
              </button>
          </div>
      </Card>

      {/* --- BLOQUE 2: CARDIO, NEAT Y NOTAS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Cardio y NEAT */}
          <Card title="Cardio & Actividad Diaria (NEAT)" icon={HeartPulse} className="border-t-4 border-t-rose-500 h-full">
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                          <InputGroup label="Tipo de Cardio" name="cardio_tipo" value={patient.cardio_tipo} onChange={onChange} placeholder="Ej: Caminadora Zona 2, Bici..." />
                      </div>
                      <InputGroup label="Días x Sem" type="number" name="cardio_frecuencia" value={patient.cardio_frecuencia} onChange={onChange} placeholder="Ej: 3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
                          <label className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase mb-2 block">Duración (Sesión)</label>
                          <div className="flex items-center gap-2">
                              <Activity size={18} className="text-rose-400" />
                              <input type="number" name="cardio_duracion" value={patient.cardio_duracion} onChange={onChange} className="w-full bg-transparent border-b border-rose-200 dark:border-rose-800 focus:border-rose-500 outline-none font-bold text-lg text-slate-700 dark:text-white" placeholder="0" />
                              <span className="text-sm font-bold text-rose-400">min</span>
                          </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2 block">Meta Pasos Diarios</label>
                          <div className="flex items-center gap-2">
                              <input type="number" name="pasos_diarios" value={patient.pasos_diarios} onChange={onChange} className="w-full bg-transparent border-b border-blue-200 dark:border-blue-800 focus:border-blue-500 outline-none font-bold text-lg text-slate-700 dark:text-white" placeholder="10000" />
                          </div>
                      </div>
                  </div>
              </div>
          </Card>

          {/* Notas y Enfoque */}
          <Card title="Notas y Enfoque del Mes" icon={MessageSquare} className="border-t-4 border-t-sky-500 h-full">
              <div className="h-full flex flex-col">
                  <div className="bg-sky-50 dark:bg-sky-900/20 text-sky-800 dark:text-sky-300 p-3 rounded-lg text-xs mb-4 border border-sky-100 dark:border-sky-900/30">
                      Usa este espacio para advertencias de lesiones, foco de hipertrofia o recordatorios de técnica.
                  </div>
                  {/* NOTA: Asegúrate de que tu FormComponents.jsx tenga exportado TextAreaGroup */}
                  <textarea 
                      name="notas_entrenamiento" 
                      value={patient.notas_entrenamiento} 
                      onChange={onChange} 
                      placeholder="Ej: Cuidar técnica en peso muerto por molestia lumbar. Priorizar fase excéntrica en ejercicios de espalda..." 
                      className="w-full flex-1 min-h-[120px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 block p-3 outline-none transition-all resize-none placeholder:text-slate-400"
                  />
              </div>
          </Card>

      </div>
    </div>
  );
};

export default TrainingTab;