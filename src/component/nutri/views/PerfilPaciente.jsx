import React, { useState, useMemo } from 'react';
import { 
  User, Activity, ClipboardList, Scale, Calculator, 
  Heart, Utensils, Brain, ArrowLeft, Save, Clock, TrendingUp, Droplet
} from 'lucide-react';

// --- COMPONENTES UI INTERNOS ---

const Card = ({ children, title, icon: Icon, className = "" }) => (
  <div className={`bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden mb-6 ${className}`}>
    {title && (
      <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
        {Icon && <Icon size={20} className="text-teal-600" />}
        <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const CheckboxGroup = ({ label, options, values, onChange }) => (
  <div className="mb-4">
    <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2 uppercase block">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label key={opt} className={`inline-flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${values.includes(opt) ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-400' : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-300 hover:bg-gray-100'}`}>
          <input type="checkbox" className="hidden" checked={values.includes(opt)} onChange={(e) => { const newValues = e.target.checked ? [...values, opt] : values.filter(v => v !== opt); onChange(newValues); }} />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

const InputGroup = ({ label, type = "text", value, onChange, placeholder, suffix, options, name, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5 uppercase">{label}</label>
    <div className="relative">
      {options ? (
        <select name={name} value={value} onChange={onChange} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 appearance-none">
          <option value="">Seleccione...</option>
          {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 resize-none" />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5" />
      )}
      {suffix && <span className="absolute right-3 top-2.5 text-gray-400 text-sm pointer-events-none">{suffix}</span>}
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
const PerfilPaciente = ({ patientData, onBack }) => {
  const [activeTab, setActiveTab] = useState('planning'); // Empezamos en Planificación
  
  // Estado inicial completo
  const [patient, setPatient] = useState({
    // General & Historia
    nombre_completo: '', cedula: '', edad: '', sexo: 'mujer', 
    ocupacion: '', tipoConsulta: 'online', motivo: '', expectativas: '', objetivosClinicos: '',
    nivel_actividad: 'Sedentario', horas_sueno: '', calidad_sueno: 'Regular', fumador: false, alcohol: '', 
    patologias: '', sintomasGI: [], medicacion: '', suplementacion: '',
    
    // Mediciones
    peso: '70', altura: '170', cintura: '', cadera: '',
    masaGrasa: '', masaMuscular: '', grasaVisceral: '', edadMetabolica: '',
    brazoR: '', brazoC: '', pantorrilla: '',
    presionArterial: '', glucemia: '', hba1c: '', colesterol: '', trigliceridos: '',

    // Planificación (NUEVOS CAMPOS)
    pesoObjetivo: '65', 
    formulaTMB: 'mifflin', 
    factorActividad: '1.2', 
    ajusteCalorico: '-300',
    macroProt: '25', 
    macroGrasa: '30', 
    macroCarbo: '45',

    // Matriz
    recordatorio_24h: { 
        desayuno: { hora: '08:00', detalle: '' }, colacion1: { hora: '11:00', detalle: '' },
        almuerzo: { hora: '13:00', detalle: '' }, colacion2: { hora: '17:00', detalle: '' },
        cena: { hora: '20:00', detalle: '' }, extra: { hora: '', detalle: '' }
    },
    ...patientData 
  });

  // --- CÁLCULOS AUTOMÁTICOS ---
  
  // 1. IMC
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

  // 2. TMB (Mifflin-St Jeor Simplificada)
  const tmb = useMemo(() => {
    const peso = parseFloat(patient.peso) || 0;
    const altura = parseFloat(patient.altura) || 0;
    const edad = parseFloat(patient.edad) || 30; // Default 30 si no hay edad
    const sexo = patient.sexo?.toLowerCase();
    
    if (!peso || !altura) return 0;
    
    // (10 x peso) + (6.25 x altura) - (5 x edad)
    let base = (10 * peso) + (6.25 * altura) - (5 * edad);
    return sexo === 'hombre' ? base + 5 : base - 161;
  }, [patient.peso, patient.altura, patient.edad, patient.sexo]);

  // 3. GET (Gasto Energético Total)
  const get = useMemo(() => {
    return Math.round(tmb * parseFloat(patient.factorActividad || 1.2));
  }, [tmb, patient.factorActividad]);

  // 4. Calorías Totales Dieta
  const caloriasObjetivo = useMemo(() => {
    return get + parseInt(patient.ajusteCalorico || 0);
  }, [get, patient.ajusteCalorico]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPatient(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSintomasChange = (newValues) => setPatient(prev => ({ ...prev, sintomasGI: newValues }));
  const handleMatrixChange = (key, field, value) => setPatient(prev => ({ ...prev, recordatorio_24h: { ...prev.recordatorio_24h, [key]: { ...prev.recordatorio_24h[key], [field]: value } } }));

  // --- RENDERS DE VISTAS ---

  const renderGeneral = () => (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
      <Card title="Información Demográfica" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputGroup label="Nombre Completo" name="nombre_completo" value={patient.nombre_completo} onChange={handleChange} />
          <InputGroup label="Documento (C.I.)" name="cedula" value={patient.cedula} onChange={handleChange} />
          <div className="flex gap-2"><InputGroup className="w-1/2" label="Edad" type="number" name="edad" value={patient.edad} onChange={handleChange} suffix="años" /><InputGroup className="w-1/2" label="Nacimiento" value={patient.fecha_nacimiento || ''} onChange={()=>{}} placeholder="--/--/--" /></div>
          <InputGroup label="Sexo Biológico" name="sexo" value={patient.sexo} onChange={handleChange} options={[{value: 'hombre', label: 'Hombre'}, {value: 'mujer', label: 'Mujer'}]} />
          <InputGroup label="Ocupación" name="ocupacion" value={patient.ocupacion} onChange={handleChange} />
          <InputGroup label="Tipo Consulta" name="tipoConsulta" value={patient.tipoConsulta} onChange={handleChange} options={[{value: 'online', label: 'Online'}, {value: 'presencial', label: 'Presencial'}, {value: 'hibrido', label: 'Híbrido'}]} />
        </div>
      </Card>
      <Card title="Informe Motivacional" icon={Brain}>
        <div className="space-y-6">
            <InputGroup label="Motivo de la Consulta" name="motivo" value={patient.motivo} onChange={handleChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Expectativas del Paciente" type="textarea" name="expectativas" value={patient.expectativas} onChange={handleChange} />
                <div className="relative"><InputGroup label="Objetivos Clínicos (Nutricionista)" type="textarea" name="objetivosClinicos" value={patient.objetivosClinicos} onChange={handleChange} className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg -m-2 p-2" /></div>
            </div>
        </div>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Estilo de Vida" icon={Activity}>
            <div className="space-y-4">
                <InputGroup label="Nivel Actividad Física" name="nivel_actividad" value={patient.nivel_actividad} onChange={handleChange} options={[{value: 'Sedentario', label: 'Sedentario'}, {value: 'Ligero', label: 'Ligero (1-3 días)'}, {value: 'Moderado', label: 'Moderado (3-5 días)'}, {value: 'Intenso', label: 'Intenso (6-7 días)'}]} />
                <div className="grid grid-cols-2 gap-4"><InputGroup label="Horas Sueño" type="number" name="horas_sueno" value={patient.horas_sueno} onChange={handleChange} suffix="h" /><InputGroup label="Calidad Sueño" name="calidad_sueno" value={patient.calidad_sueno} onChange={handleChange} options={[{value: 'Mala', label: 'Mala'}, {value: 'Regular', label: 'Regular'}, {value: 'Buena', label: 'Buena'}]} /></div>
                <div className="grid grid-cols-2 gap-4 items-end"><div className="flex items-center h-10"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="fumador" checked={patient.fumador} onChange={handleChange} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300" /><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Fumador</span></label></div><InputGroup label="Alcohol" name="alcohol" value={patient.alcohol} onChange={handleChange} placeholder="Ej. Social" /></div>
            </div>
        </Card>
        <Card title="Salud & Clínica" icon={Heart}>
            <div className="space-y-4">
                <InputGroup label="Patologías Diagnosticadas" name="patologias" value={patient.patologias} onChange={handleChange} placeholder="Diabetes, HTA, SOP..." />
                <CheckboxGroup label="Sintomatología GI Actual" options={['Acidez', 'Reflujo', 'Gases', 'Distensión', 'Estreñimiento']} values={patient.sintomasGI || []} onChange={handleSintomasChange} />
                <div className="grid grid-cols-2 gap-4"><InputGroup label="Medicación" name="medicacion" value={patient.medicacion} onChange={handleChange} /><InputGroup label="Suplementación" name="suplementacion" value={patient.suplementacion} onChange={handleChange} /></div>
            </div>
        </Card>
      </div>
      <Card title="Matriz de Patrón de Ingesta Habitual" icon={Utensils} className="border-l-4 border-l-orange-400 dark:border-l-orange-500">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left"><thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-slate-800"><tr><th className="px-4 py-3 rounded-l-lg">Tiempo</th><th className="px-4 py-3 w-32">Hora</th><th className="px-4 py-3 rounded-r-lg">Qué acostumbra comer (Detalle)</th></tr></thead><tbody className="text-gray-600 dark:text-gray-300">{Object.entries(patient.recordatorio_24h).map(([key, data]) => (<tr key={key} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"><td className="px-4 py-3 font-bold capitalize text-slate-700 dark:text-white">{key.replace(/([0-9])/g, ' $1')}</td><td className="px-4 py-2"><div className="relative"><Clock size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"/><input type="time" value={data.hora} onChange={(e) => handleMatrixChange(key, 'hora', e.target.value)} className="pl-7 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded text-sm p-1.5 focus:ring-1 focus:ring-teal-500 outline-none"/></div></td><td className="px-4 py-2"><input type="text" value={data.detalle} onChange={(e) => handleMatrixChange(key, 'detalle', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded text-sm p-1.5 focus:ring-1 focus:ring-teal-500 outline-none"/></td></tr>))}</tbody></table>
        </div>
      </Card>
    </div>
  );

  const renderMeasurements = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
        <Card title="Antropometría" icon={Scale}>
            <div className="mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-700"><div><p className="text-xs font-bold text-slate-500 uppercase">IMC Calculado</p><p className={`text-3xl font-bold ${imcData.color}`}>{imcData.value}</p></div>{imcData.status && (<span className={`px-3 py-1 rounded-full text-xs font-bold ${imcData.bg} ${imcData.color}`}>{imcData.status}</span>)}</div>
            <div className="grid grid-cols-2 gap-4"><InputGroup label="Peso" type="number" name="peso" value={patient.peso} onChange={handleChange} suffix="kg" /><InputGroup label="Altura" type="number" name="altura" value={patient.altura} onChange={handleChange} suffix="cm" /><InputGroup label="Cintura" type="number" name="cintura" value={patient.cintura} onChange={handleChange} suffix="cm" /><InputGroup label="Cadera" type="number" name="cadera" value={patient.cadera} onChange={handleChange} suffix="cm" /></div>
        </Card>
        <Card title="Composición Corporal" icon={Activity}>
            <div className="space-y-6"><div><h5 className="text-xs font-bold text-teal-600 uppercase mb-3">Bioimpedancia</h5><div className="grid grid-cols-2 gap-4"><InputGroup label="% Grasa" type="number" name="masaGrasa" value={patient.masaGrasa} onChange={handleChange} suffix="%" /><InputGroup label="Masa Muscular" type="number" name="masaMuscular" value={patient.masaMuscular} onChange={handleChange} suffix="kg" /><InputGroup label="Grasa Visceral" type="number" name="grasaVisceral" value={patient.grasaVisceral} onChange={handleChange} suffix="niv" /><InputGroup label="Edad Metab." type="number" name="edadMetabolica" value={patient.edadMetabolica} onChange={handleChange} suffix="años" /></div></div><div className="border-t border-gray-100 dark:border-slate-700 pt-4"><h5 className="text-xs font-bold text-teal-600 uppercase mb-3">Perímetros Deportivos</h5><div className="grid grid-cols-2 gap-4"><InputGroup label="Brazo (R)" type="number" name="brazoR" value={patient.brazoR} onChange={handleChange} suffix="cm" /><InputGroup label="Brazo (C)" type="number" name="brazoC" value={patient.brazoC} onChange={handleChange} suffix="cm" /></div><div className="mt-4 w-1/2 pr-2"><InputGroup label="Pantorrilla" type="number" name="pantorrilla" value={patient.pantorrilla} onChange={handleChange} suffix="cm" /></div></div></div>
        </Card>
        <Card title="Bioquímica & Signos" icon={ClipboardList}>
            <div className="space-y-6"><InputGroup label="Presión Arterial" name="presionArterial" value={patient.presionArterial} onChange={handleChange} placeholder="120/80" /><div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700"><h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Perfil Metabólico</h5><div className="grid grid-cols-2 gap-4"><InputGroup label="Glucemia" name="glucemia" value={patient.glucemia} onChange={handleChange} suffix="mg" /><InputGroup label="HbA1c" name="hba1c" value={patient.hba1c} onChange={handleChange} suffix="%" /></div></div><div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700"><h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Perfil Lipídico</h5><div className="grid grid-cols-2 gap-4"><InputGroup label="Col. Total" name="colesterol" value={patient.colesterol} onChange={handleChange} /><InputGroup label="Triglic." name="trigliceridos" value={patient.trigliceridos} onChange={handleChange} /></div></div></div>
        </Card>
    </div>
  );

  // --- VISTA 4: PLANIFICACIÓN (NUEVO) ---
  const renderPlanning = () => (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
        
        {/* SECCIÓN 1: DIAGNÓSTICO */}
        <Card title="Diagnóstico y Objetivos" icon={TrendingUp}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Estado Actual */}
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Estado Actual</p>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">{patient.peso || 0} <span className="text-sm font-normal text-slate-500">kg</span></span>
                    </div>
                    <p className={`text-xs font-bold mt-1 ${imcData.color}`}>{imcData.status} (IMC {imcData.value})</p>
                </div>

                {/* Input Meta */}
                <div>
                    <InputGroup label="Peso Objetivo" type="number" name="pesoObjetivo" value={patient.pesoObjetivo} onChange={handleChange} suffix="kg" className="bg-blue-50/50 dark:bg-blue-900/10 p-2 rounded-lg" />
                </div>

                {/* Resultado Meta */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">Meta a Lograr</p>
                        <p className="text-blue-600 dark:text-blue-400 font-bold">
                            {parseFloat(patient.peso) > parseFloat(patient.pesoObjetivo) ? 'Reducción de' : 'Aumento de'} {Math.abs(patient.peso - patient.pesoObjetivo).toFixed(1)} kg
                        </p>
                    </div>
                    <TrendingUp className="text-blue-300 dark:text-blue-600" size={32} />
                </div>
            </div>
        </Card>

        {/* SECCIÓN 2: CÁLCULOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CÁLCULO GASTO */}
            <Card title="Cálculo Energético (Gasto)" icon={Calculator}>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <InputGroup className="flex-1" label="Fórmula TMB" name="formulaTMB" value={patient.formulaTMB} onChange={handleChange} options={[{value: 'mifflin', label: 'Mifflin-St Jeor'}, {value: 'harris', label: 'Harris-Benedict'}]} />
                        <div className="w-1/3">
                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5 uppercase block">TMB (Basal)</label>
                            <div className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-mono text-center py-2.5 rounded-lg border border-gray-200 dark:border-slate-700">{Math.round(tmb)}</div>
                        </div>
                    </div>

                    <InputGroup label="Nivel de Actividad (PAL)" name="factorActividad" value={patient.factorActividad} onChange={handleChange} 
                        options={[
                            {value: 1.2, label: 'Sedentario (1.2)'}, {value: 1.375, label: 'Ligero (1.375)'},
                            {value: 1.55, label: 'Moderado (1.55)'}, {value: 1.725, label: 'Activo (1.725)'}, {value: 1.9, label: 'Muy Activo (1.9)'}
                        ]} 
                    />

                    <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg flex justify-between items-center border border-teal-100 dark:border-teal-800/50">
                        <span className="text-teal-800 dark:text-teal-300 font-bold text-sm">Gasto Energético Total (GET)</span>
                        <span className="text-xl font-bold text-teal-700 dark:text-teal-400">{get} kcal</span>
                    </div>
                </div>
            </Card>

            {/* PLANIFICACIÓN DIETA */}
            <Card title="Planificación Dietética" icon={Utensils} className="border-t-4 border-t-purple-500 dark:border-t-purple-600">
                <div className="mb-6">
                    <InputGroup label="Ajuste por Objetivo (Déficit/Superávit)" type="number" name="ajusteCalorico" value={patient.ajusteCalorico} onChange={handleChange} suffix="kcal" placeholder="-300" />
                    
                    <div className="mt-6 text-center">
                        <span className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest">Calorías Totales Dieta</span>
                        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-1">{caloriasObjetivo} kcal</div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-700 pt-4 space-y-4">
                    <h5 className="text-xs font-bold text-teal-600 uppercase">Distribución de Macros</h5>
                    
                    {/* PROTEÍNA */}
                    <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300">
                            <span className="font-bold">Proteínas ({patient.macroProt}%)</span>
                            <span>{Math.round((caloriasObjetivo * (patient.macroProt/100)) / 4)}g / {Math.round(caloriasObjetivo * (patient.macroProt/100))}kcal</span>
                        </div>
                        <input type="range" name="macroProt" min="10" max="60" value={patient.macroProt} onChange={handleChange} className="w-full h-2 bg-blue-100 dark:bg-blue-900 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>

                    {/* GRASAS */}
                    <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300">
                            <span className="font-bold">Grasas ({patient.macroGrasa}%)</span>
                            <span>{Math.round((caloriasObjetivo * (patient.macroGrasa/100)) / 9)}g / {Math.round(caloriasObjetivo * (patient.macroGrasa/100))}kcal</span>
                        </div>
                        <input type="range" name="macroGrasa" min="10" max="60" value={patient.macroGrasa} onChange={handleChange} className="w-full h-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                    </div>

                    {/* CARBOS */}
                    <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300">
                            <span className="font-bold">Carbohidratos ({patient.macroCarbo}%)</span>
                            <span>{Math.round((caloriasObjetivo * (patient.macroCarbo/100)) / 4)}g / {Math.round(caloriasObjetivo * (patient.macroCarbo/100))}kcal</span>
                        </div>
                        <input type="range" name="macroCarbo" min="10" max="80" value={patient.macroCarbo} onChange={handleChange} className="w-full h-2 bg-green-100 dark:bg-green-900 rounded-lg appearance-none cursor-pointer accent-green-600" />
                    </div>

                    {/* Validación Total */}
                    <div className="flex justify-between items-center pt-2 text-xs">
                        <span className="text-slate-400">Total: {parseInt(patient.macroProt) + parseInt(patient.macroGrasa) + parseInt(patient.macroCarbo)}%</span>
                        {(parseInt(patient.macroProt) + parseInt(patient.macroGrasa) + parseInt(patient.macroCarbo)) !== 100 && (
                            <span className="text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">¡Debe sumar 100%!</span>
                        )}
                    </div>
                </div>
            </Card>
        </div>

        {/* SECCIÓN 3: REQUERIMIENTOS */}
        <Card title="Requerimientos Específicos">
            <div className="grid grid-cols-2 gap-6">
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Meta Agua</div>
                        <div className="text-xs text-slate-400">35ml x Kg Peso</div>
                    </div>
                    <div className="text-xl font-bold text-blue-600 flex items-center gap-1">
                        <Droplet size={18} /> {((patient.peso * 35) / 1000).toFixed(1)} L
                    </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Meta Fibra</div>
                        <div className="text-xs text-slate-400">Estándar Salud</div>
                    </div>
                    <div className="text-xl font-bold text-green-600">25 - 30 g</div>
                </div>
            </div>
        </Card>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0f172a] relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors"><ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" /></button>
            <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">{patient.nombre || patient.nombre_completo || 'Nuevo Paciente'} <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold uppercase hidden sm:inline-block">Activo</span></h2><p className="text-xs text-slate-500">{patient.cedula ? `C.I. ${patient.cedula}` : 'Sin identificación'} • {new Date().toLocaleDateString()}</p></div>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"><Save size={18} /> <span className="hidden sm:inline">Guardar Cambios</span></button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
        {[{ id: 'general', label: 'Información General', icon: User }, { id: 'history', label: 'Historia Clínica', icon: ClipboardList }, { id: 'measurements', label: 'Mediciones', icon: Scale }, { id: 'planning', label: 'Planificación', icon: Calculator }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><tab.icon size={16} /> {tab.label}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-10 pr-2 custom-scrollbar">
         {activeTab === 'general' && renderGeneral()}
         {activeTab === 'history' && renderHistory()}
         {activeTab === 'measurements' && renderMeasurements()}
         {activeTab === 'planning' && renderPlanning()}
      </div>
    </div>
  );
};

export default PerfilPaciente;