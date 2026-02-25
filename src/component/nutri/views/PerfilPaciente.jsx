import React, { useState } from 'react';
import { 
  User, Activity, Scale, Calculator, Dumbbell, ArrowLeft, Save, CheckCircle
} from 'lucide-react';

// Importamos las pestañas modulares
import GeneralTab from './profile/tabs/GeneralTab';
import HistoryTab from './profile/tabs/HistoryTab';
import MeasurementsTab from './profile/tabs/MeasurementsTab';
import PlanningTab from './profile/tabs/PlanningTab';
import TrainingTab from './profile/tabs/TrainingTab';

const PerfilPaciente = ({ patientData, onBack }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  
  // --- 1. ESTADO GLOBAL: DATOS DEL PACIENTE (CON TODOS LOS CAMPOS NUEVOS) ---
  const [patient, setPatient] = useState({
    // Identificación y Contacto
    nombre_completo: '', cedula: '', email: '', telefono: '', tags: [],
    
    // Demografía
    edad: '', fecha_nacimiento: '', sexo: 'mujer', ocupacion: '', tipoConsulta: 'online', 
    
    // Informe Clínico
    motivo: '', expectativas: '', objetivosClinicos: '',

    // Antecedentes Patológicos (con estructura detallada)
    historial_patologico: {
        diabetes: { app: false, fecha_dx: '', apf: false, familiar: '' },
        hta: { app: false, fecha_dx: '', apf: false, familiar: '' },
        cardiacas: { app: false, fecha_dx: '', apf: false, familiar: '' },
        tiroideas: { app: false, fecha_dx: '', apf: false, familiar: '' },
        cancer: { app: false, fecha_dx: '', apf: false, familiar: '' },
        renales: { app: false, fecha_dx: '', apf: false, familiar: '' },
        hepaticas: { app: false, fecha_dx: '', apf: false, familiar: '' },
    },
    hospitalizaciones: '', 

    // Estilo de Vida
    nivel_actividad: 'Sedentario', tipo_entrenamiento: '', horas_sueno: '', calidad_sueno: 'Regular', 
    nivel_estres: '5', picoteo_ansiedad: '', fumador: false, alcohol: '',
    
    // Clínica y Digestiva
    patologias: '', sintomasGI: [], frecuencia_evacuatoria: '', escala_bristol: '',
    medicacion: '', suplementacion: '',
    ciclo_menstrual: '', anticonceptivos: '', // Salud femenina

    // Historia Alimentaria
    alimentos_favoritos: '', alimentos_rechazados: '', alergias: '', litros_agua: '',

    // Mediciones Actuales
    peso: '70', altura: '170', cintura: '', cadera: '',
    somatotipo: 'Mesomorfo', 
    masaGrasa: '', masaMuscular: '', grasaVisceral: '', edadMetabolica: '',
    brazoR: '', brazoC: '', pantorrilla: '',
    
    // Pliegues ISAK
    pliegue_tricipital: '', pliegue_bicipital: '', pliegue_subescapular: '', 
    pliegue_supraespinal: '', pliegue_abdominal: '', pliegue_muslo: '', pliegue_pantorrilla: '',
    
    // Bioquímica
    presionArterial: '', glucemia: '', hba1c: '', colesterol: '', trigliceridos: '',

    // Planificación Nutricional
    pesoObjetivo: '65', formulaTMB: 'mifflin', factorActividad: '1.2', ajusteCalorico: '-300',
    macroProt: '25', macroGrasa: '30', macroCarbo: '45',
    distribucion_comidas: { desayuno: 25, colacion1: 10, almuerzo: 35, colacion2: 10, cena: 20 },
    suplementos_prescritos: [], // Array de objetos {id, nombre, dosis, momento}

    // Entrenamiento (General)
    cardio_tipo: '', cardio_duracion: '', cardio_frecuencia: '', 
    pasos_diarios: '10000', notas_entrenamiento: '',

    // Matriz Recordatorio 24h
    recordatorio_24h: { 
        desayuno: { hora: '08:00', detalle: '' }, colacion1: { hora: '11:00', detalle: '' },
        almuerzo: { hora: '13:00', detalle: '' }, colacion2: { hora: '17:00', detalle: '' },
        cena: { hora: '20:00', detalle: '' }, extra: { hora: '', detalle: '' }
    },
    
    // Sobrescribir con datos que vengan de la lista de pacientes
    ...patientData 
  });

  // --- 2. ESTADO GLOBAL: RUTINA DE ENTRENAMIENTO ---
  const [rutina, setRutina] = useState([
    {
      id: 1,
      nombre: 'Día 1: Torso / Fuerza',
      ejercicios: [
        { id: 101, nombre: 'Press Banca Plano', series: '4', tipo: 'Normal', reps: '6-8', kg: '', rir: '2', descanso: '3m' },
        { id: 102, nombre: 'Remo con Barra', series: '3', tipo: 'Normal', reps: '8-10', kg: '', rir: '1-2', descanso: '2m' },
      ]
    }
  ]);

  // --- 3. ESTADO GLOBAL: HISTÓRICO DE MEDICIONES ---
  const [evaluaciones, setEvaluaciones] = useState([
    {
        id: 1,
        fecha: new Date().toISOString().split('T')[0],
        peso: patientData?.peso || '70', // Iniciar con el peso actual
        pecho: '', brazoDer: '', brazoIzq: '', cintura: '', 
        cadera: '', piernaDer: '', piernaIzq: ''
    }
  ]);

  // --- MANEJADORES ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPatient(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
      setIsSaving(true);
      
      // Simulación de guardado (Aquí conectarías con tu Backend Laravel)
      setTimeout(() => {
          console.log("=== DATOS GUARDADOS ===");
          console.log("Paciente:", patient);
          console.log("Rutina:", rutina);
          console.log("Histórico Eval:", evaluaciones);
          
          setIsSaving(false);
          alert("¡Cambios guardados correctamente! (Datos en consola)");
      }, 800);
  };

  const TABS_CONFIG = [
    { id: 'general', label: 'Información General', icon: User }, 
    { id: 'history', label: 'Historia Clínica', icon: Activity }, 
    { id: 'measurements', label: 'Mediciones', icon: Scale }, 
    { id: 'planning', label: 'Planificación', icon: Calculator }, 
    { id: 'training', label: 'Entrenamiento', icon: Dumbbell }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0f172a] relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors"><ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" /></button>
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    {patient.nombre || patient.nombre_completo || 'Nuevo Paciente'} 
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold uppercase hidden sm:inline-block">Activo</span>
                </h2>
                <p className="text-xs text-slate-500">{patient.cedula ? `C.I. ${patient.cedula}` : 'Sin identificación'} • {new Date().toLocaleDateString()}</p>
            </div>
        </div>
        
        <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-md transition-all
                ${isSaving ? 'bg-teal-800 text-teal-200 cursor-wait' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
        >
            {isSaving ? <Activity size={18} className="animate-spin"/> : <Save size={18} />} 
            <span className="hidden sm:inline">{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto custom-scrollbar">
        {TABS_CONFIG.map((tab) => (
            <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap 
                    ${activeTab === tab.id 
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-slate-100/50 dark:bg-slate-800/50 rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-t-lg'}`}
            >
                <tab.icon size={16} /> {tab.label}
            </button>
        ))}
      </div>

      {/* RENDERIZADO DINÁMICO DE PESTAÑAS */}
      <div className="flex-1 overflow-y-auto pb-10 pr-2 custom-scrollbar">
         {activeTab === 'general' && <GeneralTab patient={patient} setPatient={setPatient} onChange={handleChange} />}
         {activeTab === 'history' && <HistoryTab patient={patient} setPatient={setPatient} onChange={handleChange} />}
         {activeTab === 'measurements' && <MeasurementsTab patient={patient} onChange={handleChange} evaluaciones={evaluaciones} setEvaluaciones={setEvaluaciones} />}
         {activeTab === 'planning' && <PlanningTab patient={patient} setPatient={setPatient} onChange={handleChange} />}
         {activeTab === 'training' && <TrainingTab rutina={rutina} setRutina={setRutina} patient={patient} onChange={handleChange} />}
      </div>
    </div>
  );
};

export default PerfilPaciente;