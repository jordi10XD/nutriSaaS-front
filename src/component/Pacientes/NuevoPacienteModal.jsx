import React, { useState } from 'react';
import { 
  X, Save, User, Activity, HeartPulse, Utensils, 
  Clock, Loader2, Brain, ChevronRight, ChevronLeft
} from 'lucide-react';

// --- COMPONENTES UI INTERNOS ESTILIZADOS ---

const InputGroup = ({ label, name, value, onChange, type = "text", placeholder, options, suffix }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">{label}</label>
    <div className="relative">
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none transition-all appearance-none"
        >
          <option value="">Seleccione...</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          // 'dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert'
          // Invierte el color del icono (negro -> blanco) solo en modo oscuro.
          className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block outline-none transition-all placeholder:text-slate-400 
            ${type === 'date' ? 'p-3 text-base' : 'p-2.5 text-sm'}
            ${(type === 'date' || type === 'time') ? 'dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert' : ''}
          `}
        />
      )}
      {suffix && (
        <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-bold pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const TextAreaGroup = ({ label, name, value, onChange, rows = 3, placeholder }) => (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none transition-all resize-none placeholder:text-slate-400"
      />
    </div>
);

// --- COMPONENTE PRINCIPAL ---
const NuevoPacienteModal = ({ isOpen, onClose, onSave, token, empresaId }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // 1. Demográfica
    nombre_completo: '', cedula: '', estado_civil: '', tipo_consulta: 'Presencial',
    fecha_nacimiento: '', sexo_biologico: 'Mujer', ocupacion: '', pais_residencia: '',
    // 2. Informe
    motivo_consulta: '', expectativas: '', objetivos_clinicos: '',
    // 3. Estilo de Vida
    dinamica_familiar: '', nivel_actividad: 'Sedentario', tipo_entrenamiento: '',
    horas_sueno: '', calidad_sueno: 'Regular',
    ciclo_menstrual: '', anticonceptivos: '', fumador: false, alcohol: '',
    frecuencia_evacuatoria: '', escala_bristol: '',
    // 4. Clínica
    patologias: '', antecedentes_familiares: '', sintomas_gastro: '',
    medicacion: '', suplementacion: '',
    // 5. Alimentaria
    alimentos_favoritos: '', alimentos_rechazados: '', alergias: '',
    litros_agua: '', picoteo_ansiedad: '', hora_levantarse: '', hora_acostarse: '',
    // Matriz Recordatorio
    recordatorio_24h: {
        desayuno: { hora: '', detalle: '' },
        colacion1: { hora: '', detalle: '' },
        almuerzo: { hora: '', detalle: '' },
        colacion2: { hora: '', detalle: '' },
        cena: { hora: '', detalle: '' },
        extra: { hora: '', detalle: '' },
    },
    // Login 
    usuario: '', contraseña: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMatrixChange = (comida, field, value) => {
      setFormData(prev => ({
          ...prev,
          recordatorio_24h: {
              ...prev.recordatorio_24h,
              [comida]: { ...prev.recordatorio_24h[comida], [field]: value }
          }
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch('http://127.0.0.1:8000/api/tenant/pacientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Empresa-ID': empresaId
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
            onSave(data.data);
            onClose();
        } else {
            alert('Error: ' + (data.message || 'Error desconocido'));
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión con el servidor');
    } finally {
        setLoading(false);
    }
  };

  // --- TABS CONFIG ---
  const tabs = [
    {id: 1, label: 'Datos', icon: User},
    {id: 2, label: 'Informe', icon: Brain},
    {id: 3, label: 'Estilo Vida', icon: Activity},
    {id: 4, label: 'Clínica', icon: HeartPulse},
    {id: 5, label: 'Alimentación', icon: Utensils},
    {id: 6, label: 'Recordatorio', icon: Clock},
    {id: 7, label: 'Acceso', icon: Save},
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
        
        {/* HEADER */}
        <div className="bg-white dark:bg-[#0f172a] p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-lg">
                   <User size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Nuevo Paciente</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Creación de expediente clínico</p>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X size={20}/>
            </button>
        </div>

        {/* TABS NAVEGACIÓN */}
        <div className="flex bg-slate-50 dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-700 overflow-x-auto shrink-0 custom-scrollbar">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 
                        ${activeTab === tab.id 
                            ? 'border-teal-500 text-teal-700 bg-white dark:bg-slate-900 dark:text-teal-400' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-[#0f172a] custom-scrollbar">
            <form id="paciente-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                
                {/* 1. DATOS DEMOGRÁFICOS */}
                {activeTab === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
                        <InputGroup label="Nombre Completo" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} placeholder="Ej: Juan Pérez" />
                        <InputGroup label="Documento (C.I. / DNI)" name="cedula" value={formData.cedula} onChange={handleChange} />
                        <InputGroup label="Sexo Biológico" name="sexo_biologico" value={formData.sexo_biologico} onChange={handleChange} options={['Mujer', 'Hombre']} />
                        <InputGroup label="Fecha Nacimiento" type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
                        <InputGroup label="Ocupación" name="ocupacion" value={formData.ocupacion} onChange={handleChange} />
                        <InputGroup label="País Residencia" name="pais_residencia" value={formData.pais_residencia} onChange={handleChange} />
                        <InputGroup label="Tipo Consulta" name="tipo_consulta" value={formData.tipo_consulta} onChange={handleChange} options={['Presencial', 'Online', 'Híbrido']} />
                        <InputGroup label="Estado Civil" name="estado_civil" value={formData.estado_civil} onChange={handleChange} />
                    </div>
                )}

                {/* 2. INFORME MOTIVACIONAL */}
                {activeTab === 2 && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <TextAreaGroup label="Motivo de Consulta" name="motivo_consulta" value={formData.motivo_consulta} onChange={handleChange} placeholder="¿Qué trae al paciente a consulta?" rows={2} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <TextAreaGroup label="Expectativas del Paciente" name="expectativas" value={formData.expectativas} onChange={handleChange} />
                             <TextAreaGroup label="Objetivos Clínicos (Nutricionista)" name="objetivos_clinicos" value={formData.objetivos_clinicos} onChange={handleChange} />
                        </div>
                    </div>
                )}

                {/* 3. ESTILO DE VIDA */}
                {activeTab === 3 && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <InputGroup label="Dinámica Familiar / Logística" name="dinamica_familiar" value={formData.dinamica_familiar} onChange={handleChange} placeholder="¿Quién cocina? ¿Quién compra?" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputGroup label="Nivel Actividad" name="nivel_actividad" value={formData.nivel_actividad} onChange={handleChange} options={['Sedentario', 'Ligero', 'Moderado', 'Intenso']} />
                            <InputGroup label="Tipo Entrenamiento" name="tipo_entrenamiento" value={formData.tipo_entrenamiento} onChange={handleChange} />
                            
                            {/* Checkbox Estilizado */}
                            <div className="flex flex-col justify-end pb-3">
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <input type="checkbox" name="fumador" checked={formData.fumador} onChange={handleChange} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300" />
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">¿Es Fumador?</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputGroup label="Horas Sueño" type="number" name="horas_sueno" value={formData.horas_sueno} onChange={handleChange} suffix="h" />
                            <InputGroup label="Calidad Sueño" name="calidad_sueno" value={formData.calidad_sueno} onChange={handleChange} options={['Buena', 'Regular', 'Mala']} />
                            <InputGroup label="Consumo Alcohol" name="alcohol" value={formData.alcohol} onChange={handleChange} placeholder="Ej: Social, fines de semana" />
                        </div>

                        {formData.sexo_biologico === 'Mujer' && (
                            <div className="bg-pink-50 dark:bg-pink-900/10 p-5 rounded-xl border border-pink-100 dark:border-pink-900/30">
                                <h4 className="text-pink-600 dark:text-pink-400 font-bold text-xs uppercase mb-3 flex items-center gap-2"><HeartPulse size={16}/> Salud Femenina</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Ciclo Menstrual" name="ciclo_menstrual" value={formData.ciclo_menstrual} onChange={handleChange} placeholder="Regular, Menopausia..." />
                                    <InputGroup label="Anticonceptivos" name="anticonceptivos" value={formData.anticonceptivos} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <InputGroup label="Frecuencia Evacuatoria" name="frecuencia_evacuatoria" value={formData.frecuencia_evacuatoria} onChange={handleChange} />
                             <InputGroup label="Escala Bristol" name="escala_bristol" value={formData.escala_bristol} onChange={handleChange} placeholder="1-7" />
                        </div>
                    </div>
                )}

                {/* 4. CLÍNICA */}
                {activeTab === 4 && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <TextAreaGroup label="Patologías Diagnosticadas" name="patologias" value={formData.patologias} onChange={handleChange} placeholder="Diabetes, HTA, Dislipidemias..." />
                        <TextAreaGroup label="Antecedentes Familiares" name="antecedentes_familiares" value={formData.antecedentes_familiares} onChange={handleChange} />
                        <TextAreaGroup label="Sintomatología Gastrointestinal" name="sintomas_gastro" value={formData.sintomas_gastro} onChange={handleChange} placeholder="Acidez, Reflujo, Gases..." />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Medicación Actual" name="medicacion" value={formData.medicacion} onChange={handleChange} />
                            <InputGroup label="Suplementación" name="suplementacion" value={formData.suplementacion} onChange={handleChange} />
                        </div>
                    </div>
                )}

                {/* 5. ALIMENTARIA */}
                {activeTab === 5 && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextAreaGroup label="Alimentos Favoritos" name="alimentos_favoritos" value={formData.alimentos_favoritos} onChange={handleChange} />
                            <TextAreaGroup label="Alimentos Rechazados" name="alimentos_rechazados" value={formData.alimentos_rechazados} onChange={handleChange} />
                        </div>
                        <InputGroup label="Alergias e Intolerancias" name="alergias" value={formData.alergias} onChange={handleChange} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <InputGroup label="Agua (Litros)" type="number" step="0.1" name="litros_agua" value={formData.litros_agua} onChange={handleChange} suffix="L" />
                            <InputGroup label="Picoteo / Ansiedad" name="picoteo_ansiedad" value={formData.picoteo_ansiedad} onChange={handleChange} />
                            <InputGroup label="Hora Levantarse" type="time" name="hora_levantarse" value={formData.hora_levantarse} onChange={handleChange} />
                            <InputGroup label="Hora Acostarse" type="time" name="hora_acostarse" value={formData.hora_acostarse} onChange={handleChange} />
                        </div>
                    </div>
                )}

                {/* 6. MATRIZ RECORDATORIO */}
                {activeTab === 6 && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 text-orange-800 dark:text-orange-300 p-4 rounded-lg mb-6 text-sm flex items-center gap-2">
                             <Utensils size={18} /> Registra los alimentos y horarios habituales del paciente para detectar patrones.
                        </div>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-xs border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4">Tiempo de Comida</th>
                                        <th className="px-6 py-4 w-40">Hora</th>
                                        <th className="px-6 py-4">Descripción de Alimentos y Cantidades</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-[#0f172a]">
                                    {Object.entries(formData.recordatorio_24h).map(([key, val]) => (
                                        <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                            <td className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200 capitalize bg-slate-50/50 dark:bg-slate-800/50">
                                                {key.replace(/([0-9])/g, ' $1')}
                                            </td>
                                            <td className="px-6 py-3">
                                                <input 
                                                    type="time" 
                                                    value={val.hora} 
                                                    onChange={(e)=>handleMatrixChange(key, 'hora', e.target.value)} 
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-slate-600 dark:text-white dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert"
                                                />
                                            </td>
                                            <td className="px-6 py-3">
                                                <input 
                                                    type="text" 
                                                    value={val.detalle} 
                                                    onChange={(e)=>handleMatrixChange(key, 'detalle', e.target.value)} 
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-slate-600 dark:text-white placeholder-slate-300 dark:placeholder-slate-600"
                                                    placeholder="Ej: 2 tostadas integrales..."
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 7. ACCESO (LOGIN) */}
                {activeTab === 7 && (
                    <div className="max-w-md mx-auto animate-in fade-in zoom-in duration-300 bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Save size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Crear Acceso App</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Credenciales para que el paciente ingrese a la aplicación móvil.</p>
                        </div>
                        <div className="space-y-5">
                            <InputGroup label="Usuario" name="usuario" value={formData.usuario} onChange={handleChange} placeholder="Ej: jperez" />
                            <InputGroup label="Contraseña Temporal" type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} placeholder="••••••" />
                        </div>
                    </div>
                )}
            </form>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
            <div className="text-xs font-bold text-slate-400">
                Paso {activeTab} de 7
            </div>
            <div className="flex gap-3">
                {/* Botón Atrás (Solo si no es paso 1) */}
                {activeTab > 1 && (
                    <button 
                        onClick={() => setActiveTab(prev => prev - 1)}
                        className="px-4 py-2.5 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <ChevronLeft size={16} /> Atrás
                    </button>
                )}
                
                <button onClick={onClose} className="px-6 py-2.5 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    Cancelar
                </button>

                {activeTab < 7 ? (
                    <button 
                        onClick={() => setActiveTab(prev => prev + 1)}
                        className="px-6 py-2.5 bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold hover:bg-slate-900 dark:hover:bg-slate-200 transition-all flex items-center gap-2"
                    >
                        Siguiente <ChevronRight size={16} />
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className="px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-teal-600/20 flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />} 
                        {loading ? 'Guardando...' : 'Finalizar y Guardar'}
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default NuevoPacienteModal;