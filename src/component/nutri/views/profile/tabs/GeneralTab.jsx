import React from 'react';
import { User, Mail, Phone, Brain, Tag, Target, Camera } from 'lucide-react';
import Card from '../ui/Card';
import { InputGroup, TextAreaGroup } from '../ui/FormComponents';

const GeneralTab = ({ patient, setPatient, onChange }) => {

  // Lista de etiquetas predefinidas para selección rápida
  const AVAILABLE_TAGS = [
      'Vegano', 'Vegetariano', 'Deportista', 'Alto Rendimiento', 
      'Embarazo', 'Lactancia', 'Lesión', 'Ayuno Intermitente', 'Sedentario'
  ];

  // Función para alternar etiquetas
  const toggleTag = (tag) => {
      const currentTags = patient.tags || [];
      const newTags = currentTags.includes(tag)
          ? currentTags.filter(t => t !== tag)
          : [...currentTags, tag];
      
      setPatient(prev => ({ ...prev, tags: newTags }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
      
      {/* --- FILA 1: PERFIL, CONTACTO Y DEMOGRAFÍA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TARJETA 1: Perfil y Contacto */}
        <Card title="Perfil y Contacto" icon={User}>
            <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center sm:items-start">
                {/* Avatar Placeholder */}
                <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden transition-all group-hover:border-teal-500">
                        <User size={40} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-teal-600 text-white p-1.5 rounded-full border-2 border-white dark:border-[#1e293b] shadow-sm">
                        <Camera size={14} />
                    </div>
                </div>

                {/* Datos Principales */}
                <div className="flex-1 w-full space-y-4">
                    <InputGroup label="Nombre Completo" name="nombre_completo" value={patient.nombre_completo} onChange={onChange} placeholder="Ej. Juan Pérez" />
                    <InputGroup label="Documento (C.I. / DNI)" name="cedula" value={patient.cedula} onChange={onChange} />
                </div>
            </div>

            {/* Información de Contacto */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
                <div className="relative">
                    <Mail size={16} className="absolute left-3 top-9 text-slate-400 pointer-events-none" />
                    <InputGroup label="Correo Electrónico" type="email" name="email" value={patient.email} onChange={onChange} placeholder="correo@ejemplo.com" className="[&>div>input]:pl-9" />
                </div>
                <div className="relative">
                    <Phone size={16} className="absolute left-3 top-9 text-slate-400 pointer-events-none" />
                    <InputGroup label="Teléfono / WhatsApp" type="tel" name="telefono" value={patient.telefono} onChange={onChange} placeholder="+593 99 999 9999" className="[&>div>input]:pl-9" />
                </div>
            </div>
        </Card>

        {/* TARJETA 2: Demografía y Etiquetas */}
        <Card title="Demografía y Clasificación" icon={Tag}>
            <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Edad" type="number" name="edad" value={patient.edad} onChange={onChange} suffix="años" />
                    <InputGroup label="Fecha de Nacimiento" type="date" name="fecha_nacimiento" value={patient.fecha_nacimiento} onChange={onChange} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Sexo Biológico" name="sexo" value={patient.sexo} onChange={onChange} options={[{value: 'hombre', label: 'Hombre'}, {value: 'mujer', label: 'Mujer'}]} />
                    <InputGroup label="Tipo de Consulta" name="tipoConsulta" value={patient.tipoConsulta} onChange={onChange} options={[{value: 'online', label: 'Online'}, {value: 'presencial', label: 'Presencial'}, {value: 'hibrido', label: 'Híbrido'}]} />
                </div>

                <InputGroup label="Ocupación / Profesión" name="ocupacion" value={patient.ocupacion} onChange={onChange} placeholder="Ej. Arquitecto, Estudiante..." />
            </div>

            {/* Sistema de Etiquetas (Tags) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 block">
                    Etiquetas del Paciente
                </label>
                <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map(tag => {
                        const isActive = (patient.tags || []).includes(tag);
                        return (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all border
                                    ${isActive 
                                        ? 'bg-teal-100 dark:bg-teal-900/40 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 shadow-sm' 
                                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-teal-400 dark:hover:border-teal-600'
                                    }`}
                            >
                                {isActive ? '✓ ' : '+ '}{tag}
                            </button>
                        )
                    })}
                </div>
            </div>
        </Card>
      </div>

      {/* --- FILA 2: INFORME CLÍNICO / MOTIVACIONAL --- */}
      <Card title="Informe Clínico y Motivacional" icon={Brain} className="border-t-4 border-t-sky-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Motivo y Expectativas */}
              <div className="lg:col-span-2 space-y-6">
                  <InputGroup label="Motivo principal de la Consulta" name="motivo" value={patient.motivo} onChange={onChange} placeholder="Ej. Derivación médica, pérdida de peso, mejorar rendimiento deportivo..." />
                  
                  {/* Usando el nuevo TextAreaGroup */}
                  <TextAreaGroup 
                      label="Expectativas del Paciente" 
                      name="expectativas" 
                      value={patient.expectativas} 
                      onChange={onChange} 
                      rows={4}
                      placeholder="Escribe aquí lo que el paciente espera lograr, sus miedos, dietas previas que le han fallado..." 
                  />
              </div>

              {/* Objetivos del Nutricionista (Destacado) */}
              <div className="bg-sky-50 dark:bg-sky-900/10 p-5 rounded-xl border border-sky-100 dark:border-sky-900/30 h-full flex flex-col">
                  <h4 className="text-sky-700 dark:text-sky-400 font-bold text-xs uppercase mb-4 flex items-center gap-2">
                      <Target size={16} /> Objetivos Clínicos (Profesional)
                  </h4>
                  <div className="flex-1">
                      <TextAreaGroup 
                          label="" 
                          name="objetivosClinicos" 
                          value={patient.objetivosClinicos} 
                          onChange={onChange} 
                          rows={6}
                          className="h-full [&>textarea]:h-full [&>textarea]:bg-white dark:[&>textarea]:bg-slate-900 [&>textarea]:border-sky-200 dark:[&>textarea]:border-sky-800"
                          placeholder="Tus objetivos como profesional. Ej: 1. Reducir grasa visceral. 2. Mejorar perfil lipídico. 3. Aumentar consumo de fibra a 30g..." 
                      />
                  </div>
              </div>

          </div>
      </Card>

    </div>
  );
};

export default GeneralTab;