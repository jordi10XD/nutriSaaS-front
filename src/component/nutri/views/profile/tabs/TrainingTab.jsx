import React, { useState } from 'react';
import { Dumbbell, PlusCircle, Trash2, X } from 'lucide-react';
import Card from '../ui/Card';

const TrainingTab = ({ rutina, setRutina }) => {
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

  // --- 2. LÓGICA DE DÍAS (NUEVO) ---
  const addDay = () => {
    setRutina([...rutina, { id: Date.now(), nombre: `Día ${rutina.length + 1}`, ejercicios: [] }]);
    setActiveDay(rutina.length); 
  };

  // Cambiar el nombre del día
  const handleDayNameChange = (dayIndex, newName) => {
    const newRutina = [...rutina];
    newRutina[dayIndex].nombre = newName;
    setRutina(newRutina);
  };

  // Borrar un día entero
  const removeDay = (dayIndex, e) => {
    e.stopPropagation(); // Evita que se dispare el click del tab al darle a la X
    
    // Validación: No permitir borrar si solo queda 1 día
    if (rutina.length <= 1) {
        alert("Debe existir al menos un día de entrenamiento.");
        return;
    }

    if (window.confirm("¿Estás seguro de eliminar este día y todos sus ejercicios?")) {
        const newRutina = rutina.filter((_, idx) => idx !== dayIndex);
        setRutina(newRutina);
        
        // Ajustar el tab activo para que no apunte a un índice que ya no existe
        if (activeDay >= newRutina.length) {
            setActiveDay(newRutina.length - 1);
        } else if (activeDay === dayIndex) {
            setActiveDay(0);
        }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
      
      {/* NAVEGACIÓN Y EDICIÓN DE DÍAS */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <div className="flex gap-2">
              {rutina.map((dia, index) => (
                  <div
                      key={dia.id}
                      onClick={() => setActiveDay(index)}
                      className={`relative flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer group
                          ${activeDay === index 
                          ? 'bg-amber-500 text-white shadow-md pr-8' // pr-8 da espacio para la X
                          : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400'}`}
                  >
                      {/* Si está activo, es un input. Si no, es texto normal */}
                      {activeDay === index ? (
                          <input 
                              type="text" 
                              value={dia.nombre} 
                              onChange={(e) => handleDayNameChange(index, e.target.value)}
                              className="bg-transparent border-b border-amber-300 focus:border-white outline-none text-white font-bold w-32 placeholder-white/70 p-0"
                              onClick={(e) => e.stopPropagation()} // Evita recargar el tab al escribir
                              autoFocus
                          />
                      ) : (
                          <span>{dia.nombre}</span>
                      )}

                      {/* Botón Borrar Día (Solo aparece en el día activo) */}
                      {activeDay === index && rutina.length > 1 && (
                          <button 
                              onClick={(e) => removeDay(index, e)} 
                              className="absolute right-2 text-amber-200 hover:text-white hover:bg-amber-600 rounded p-0.5 transition-colors"
                              title="Borrar Día"
                          >
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
          <div className="overflow-x-auto min-h-[300px]">
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
    </div>
  );
};

export default TrainingTab;