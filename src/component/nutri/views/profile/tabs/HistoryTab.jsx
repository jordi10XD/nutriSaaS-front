import React from 'react';
import { Activity, Heart, Utensils, Clock, Apple, Brain, HeartPulse, FileText, Users, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import { InputGroup, CheckboxGroup, TextAreaGroup } from '../ui/FormComponents';

// Lista de Patologías para la sección final (APP/APF)
const PATHOLOGIES = [
    { id: 'diabetes', label: 'Diabetes', sub: 'Tipo 1, Mellitus, Gestacional' },
    { id: 'hta', label: 'Hipertensión Arterial (HTA)', sub: 'Alta, Baja' },
    { id: 'cardiacas', label: 'Enfermedades Cardiacas', sub: 'Insuficiencia, Arritmias, Infarto' },
    { id: 'tiroideas', label: 'Enfermedades Tiroideas', sub: 'Hipo/Hipertiroidismo' },
    { id: 'cancer', label: 'Cáncer', sub: 'Tipos diversos' },
    { id: 'renales', label: 'Enfermedades Renales', sub: 'Insuficiencia, Cálculos, Infecciones' },
    { id: 'hepaticas', label: 'Enf. Hepáticas / Biliares', sub: 'Cirrosis, Hígado graso, Cálculos' },
];

const HistoryTab = ({ patient, setPatient, onChange }) => {
  
  // --- LÓGICA DE LA PESTAÑA ---
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

  // Manejador para la nueva sección de Patologías APP/APF
  const handlePathologyChange = (pathId, field, value) => {
      setPatient(prev => ({
          ...prev,
          historial_patologico: {
              ...prev.historial_patologico,
              [pathId]: {
                  ...(prev.historial_patologico?.[pathId] || {}),
                  [field]: value
              }
          }
      }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
      
      {/* --- FILA 1: ESTILO DE VIDA Y CLÍNICA GENERAL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TARJETA 1: ESTILO DE VIDA Y EMOCIONAL */}
        <Card title="Estilo de Vida & Emocional" icon={Activity}>
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Nivel Actividad Física" name="nivel_actividad" value={patient.nivel_actividad} onChange={onChange} options={['Sedentario', 'Ligero', 'Moderado', 'Intenso']} />
                    <InputGroup label="Tipo Entrenamiento" name="tipo_entrenamiento" value={patient.tipo_entrenamiento} onChange={onChange} placeholder="Ej: Pesas, Running..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Horas Sueño" type="number" name="horas_sueno" value={patient.horas_sueno} onChange={onChange} suffix="h" />
                    <InputGroup label="Calidad Sueño" name="calidad_sueno" value={patient.calidad_sueno} onChange={onChange} options={['Mala', 'Regular', 'Buena']} />
                </div>

                {/* Slider de Estrés */}
                <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                            <Brain size={14} className="text-teal-500" /> Nivel de Estrés
                        </label>
                        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded">
                            {patient.nivel_estres || 5} / 10
                        </span>
                    </div>
                    <input 
                        type="range" name="nivel_estres" min="1" max="10" 
                        value={patient.nivel_estres || 5} onChange={onChange} 
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Horarios de Ansiedad / Picoteo" name="picoteo_ansiedad" value={patient.picoteo_ansiedad} onChange={onChange} placeholder="Ej: Noche, Media tarde" />
                    <div className="flex items-center gap-4 mt-6">
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 w-full">
                            <input type="checkbox" name="fumador" checked={patient.fumador} onChange={onChange} className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"/>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">¿Fumador?</span>
                        </label>
                    </div>
                </div>
                <InputGroup label="Consumo de Alcohol" name="alcohol" value={patient.alcohol} onChange={onChange} placeholder="Ej: Social, Fines de semana..." />
            </div>
        </Card>

        {/* TARJETA 2: SALUD, CLÍNICA Y DIGESTIVA */}
        <Card title="Salud, Clínica & Digestiva" icon={Heart}>
            <div className="space-y-5">
                <InputGroup label="Patologías Diagnosticadas (Resumen)" type="textarea" name="patologias" value={patient.patologias} onChange={onChange} placeholder="Diabetes, HTA, SOP, Hipotiroidismo..." />
                
                <CheckboxGroup label="Sintomatología GI Actual" options={['Acidez', 'Reflujo', 'Gases', 'Distensión', 'Estreñimiento', 'Diarrea']} values={patient.sintomasGI || []} onChange={handleSintomasChange} />
                
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-4">
                    <InputGroup label="Frecuencia Evacuatoria" name="frecuencia_evacuatoria" value={patient.frecuencia_evacuatoria} onChange={onChange} placeholder="Ej: 1 vez al día" />
                    <InputGroup label="Escala Bristol" name="escala_bristol" value={patient.escala_bristol} onChange={onChange} options={['Tipo 1 (Duro)', 'Tipo 2', 'Tipo 3', 'Tipo 4 (Ideal)', 'Tipo 5', 'Tipo 6', 'Tipo 7 (Líquido)']} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Medicación Habitual" name="medicacion" value={patient.medicacion} onChange={onChange} />
                    <InputGroup label="Suplementación" name="suplementacion" value={patient.suplementacion} onChange={onChange} />
                </div>

                {/* Salud Femenina Condicional */}
                {patient.sexo?.toLowerCase() === 'mujer' && (
                    <div className="bg-pink-50 dark:bg-pink-900/10 p-4 rounded-xl border border-pink-100 dark:border-pink-900/30 mt-4">
                        <h4 className="text-pink-600 dark:text-pink-400 font-bold text-xs uppercase mb-3 flex items-center gap-2"><HeartPulse size={14}/> Salud Femenina</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup label="Ciclo Menstrual" name="ciclo_menstrual" value={patient.ciclo_menstrual} onChange={onChange} placeholder="Regular, Menopausia..." />
                            <InputGroup label="Anticonceptivos" name="anticonceptivos" value={patient.anticonceptivos} onChange={onChange} />
                        </div>
                    </div>
                )}
            </div>
        </Card>
      </div>

      {/* --- FILA 2: HISTORIA ALIMENTARIA --- */}
      <Card title="Preferencias e Historia Alimentaria" icon={Apple} className="border-t-4 border-t-green-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Alimentos Favoritos" type="textarea" name="alimentos_favoritos" value={patient.alimentos_favoritos} onChange={onChange} placeholder="Alimentos que el paciente disfruta mucho..." />
                  <InputGroup label="Alimentos Rechazados" type="textarea" name="alimentos_rechazados" value={patient.alimentos_rechazados} onChange={onChange} placeholder="Alimentos que no le gustan o no tolera..." />
              </div>
              <div className="space-y-4">
                  <InputGroup label="Alergias e Intolerancias" name="alergias" value={patient.alergias} onChange={onChange} placeholder="Ej: Celíaco, Intolerante a lactosa..." />
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                      <InputGroup label="Consumo Diario de Agua" type="number" step="0.1" name="litros_agua" value={patient.litros_agua} onChange={onChange} suffix="Litros" />
                  </div>
              </div>
          </div>
      </Card>

      {/* --- FILA 3: MATRIZ DE INGESTA --- */}
      <Card title="Matriz de Patrón de Ingesta Habitual" icon={Utensils} className="border-l-4 border-l-orange-400 dark:border-l-orange-500">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th className="px-4 py-3 rounded-tl-lg w-40">Tiempo</th>
                        <th className="px-4 py-3 w-40">Hora</th>
                        <th className="px-4 py-3 rounded-tr-lg">Qué acostumbra comer (Detalle y Cantidades)</th>
                    </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800">
                    {Object.entries(patient.recordatorio_24h || {}).map(([key, data]) => (
                        <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-bold capitalize text-slate-700 dark:text-slate-200">{key.replace(/([0-9])/g, ' $1')}</td>
                            <td className="px-4 py-2">
                                <div className="relative">
                                    <Clock size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"/>
                                    <input type="time" value={data.hora} onChange={(e) => handleMatrixChange(key, 'hora', e.target.value)} className="pl-7 w-full bg-transparent border border-slate-200 dark:border-slate-600 rounded text-sm p-1.5 focus:ring-1 focus:ring-teal-500 outline-none dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert"/>
                                </div>
                            </td>
                            <td className="px-4 py-2">
                                <input type="text" value={data.detalle} onChange={(e) => handleMatrixChange(key, 'detalle', e.target.value)} placeholder="Ej: 2 huevos, 1 taza de café..." className="w-full bg-transparent border border-slate-200 dark:border-slate-600 rounded text-sm p-1.5 focus:ring-1 focus:ring-teal-500 outline-none placeholder-slate-300 dark:placeholder-slate-600"/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>

      {/* --- FILA 4: ANTECEDENTES PATOLÓGICOS DETALLADOS (NUEVO BLOQUE FINAL) --- */}
      <Card title="Antecedentes Patológicos (APP / APF) - Detalle" icon={FileText} className="border-t-4 border-t-blue-500">
          <div className="space-y-4">
              {/* Header Visual */}
              <div className="hidden md:flex text-xs uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-2">
                  <div className="w-1/3">Patología</div>
                  <div className="w-1/3 pl-4">Antecedentes Personales (APP)</div>
                  <div className="w-1/3 pl-4">Antecedentes Familiares (APF)</div>
              </div>

              {PATHOLOGIES.map((path) => {
                  const data = patient.historial_patologico?.[path.id] || {};
                  return (
                      <div key={path.id} className="flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-900 transition-colors">
                          
                          {/* NOMBRE ENFERMEDAD */}
                          <div className="md:w-1/3 pt-1">
                              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${data.app || data.apf ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                                  {path.label}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1 ml-4">{path.sub}</p>
                          </div>

                          {/* APP (PERSONAL) */}
                          <div className="md:w-1/3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input 
                                      type="checkbox" 
                                      checked={data.app || false}
                                      onChange={(e) => handlePathologyChange(path.id, 'app', e.target.checked)}
                                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
                                  />
                                  <span className={`text-xs font-bold ${data.app ? 'text-teal-600' : 'text-slate-500'}`}>
                                      Sí, Diagnosticado
                                  </span>
                              </label>
                              {data.app && (
                                  <div className="animate-in slide-in-from-top-2 duration-200">
                                      <input 
                                          type="text" 
                                          placeholder="Fecha Dx / Detalles..."
                                          value={data.fecha_dx || ''}
                                          onChange={(e) => handlePathologyChange(path.id, 'fecha_dx', e.target.value)}
                                          className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded outline-none focus:border-teal-500 dark:text-white"
                                      />
                                  </div>
                              )}
                          </div>

                          {/* APF (FAMILIAR) */}
                          <div className="md:w-1/3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input 
                                      type="checkbox" 
                                      checked={data.apf || false}
                                      onChange={(e) => handlePathologyChange(path.id, 'apf', e.target.checked)}
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                  />
                                  <span className={`text-xs font-bold flex items-center gap-1 ${data.apf ? 'text-blue-600' : 'text-slate-500'}`}>
                                      <Users size={12}/> Antecedente Familiar
                                  </span>
                              </label>
                              {data.apf && (
                                  <div className="animate-in slide-in-from-top-2 duration-200">
                                      <input 
                                          type="text" 
                                          placeholder="¿Quién? (Ej: Padre, Abuela)"
                                          value={data.familiar || ''}
                                          onChange={(e) => handlePathologyChange(path.id, 'familiar', e.target.value)}
                                          className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded outline-none focus:border-blue-500 dark:text-white"
                                      />
                                  </div>
                              )}
                          </div>
                      </div>
                  );
              })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <TextAreaGroup 
                  label="Hospitalizaciones Previas / Cirugías" 
                  name="hospitalizaciones" 
                  value={patient.hospitalizaciones} 
                  onChange={onChange} 
                  rows={2}
                  placeholder="Detalles de intervenciones quirúrgicas o ingresos hospitalarios relevantes..." 
              />
          </div>
      </Card>

    </div>
  );
};

export default HistoryTab;