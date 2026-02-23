import React, { useState } from 'react';
import { 
  User, Activity, Scale, Calculator, Dumbbell, ArrowLeft, Save
} from 'lucide-react';

// Importamos las pestañas modulares
import GeneralTab from './profile/tabs/GeneralTab';
import HistoryTab from './profile/tabs/HistoryTab';
import MeasurementsTab from './profile/tabs/MeasurementsTab';
import PlanningTab from './profile/tabs/PlanningTab';
import TrainingTab from './profile/tabs/TrainingTab';

const PerfilPaciente = ({ patientData, onBack }) => {
  const [activeTab, setActiveTab] = useState('general');
  
  // ESTADO GLOBAL: PACIENTE
  const [patient, setPatient] = useState({
    nombre_completo: '', cedula: '', edad: '', sexo: 'mujer', email: '', telefono: '', tags: [],
    ocupacion: '', tipoConsulta: 'online', motivo: '', expectativas: '', objetivosClinicos: '',
    nivel_actividad: 'Sedentario', horas_sueno: '', calidad_sueno: 'Regular', fumador: false, alcohol: '', 
    patologias: '', sintomasGI: [], medicacion: '', suplementacion: '', nivel_estres: '5', 
    peso: '70', altura: '170', somatotipo: 'Mesomorfo', cintura: '', cadera: '',
    masaGrasa: '', masaMuscular: '', grasaVisceral: '', edadMetabolica: '',
    brazoR: '', brazoC: '', pantorrilla: '', 
    // Pliegues ISAK (NUEVO)
    pliegue_tricipital: '', pliegue_bicipital: '', pliegue_subescapular: '', 
    pliegue_supraespinal: '', pliegue_abdominal: '', pliegue_muslo: '', pliegue_pantorrilla: '',
    presionArterial: '', glucemia: '', hba1c: '', colesterol: '', trigliceridos: '',
    pesoObjetivo: '65', formulaTMB: 'mifflin', factorActividad: '1.2', ajusteCalorico: '-300',
    macroProt: '25', macroGrasa: '30', macroCarbo: '45',
    // --- NUEVOS CAMPOS DE PLANIFICACIÓN ---
    distribucion_comidas: {
        desayuno: 25, colacion1: 10, almuerzo: 35, colacion2: 10, cena: 20
    },
    suplementos_prescritos: [
        { id: 1, nombre: 'Creatina Monohidratada', dosis: '5g', momento: 'Post-entrenamiento' }
    ],
    // --- NUEVOS CAMPOS DE ENTRENAMIENTO ---
    cardio_tipo: '', cardio_duracion: '', cardio_frecuencia: '', 
    pasos_diarios: '10000', notas_entrenamiento: '',

    recordatorio_24h: { 
        desayuno: { hora: '08:00', detalle: '' }, colacion1: { hora: '11:00', detalle: '' },
        almuerzo: { hora: '13:00', detalle: '' }, colacion2: { hora: '17:00', detalle: '' },
        cena: { hora: '20:00', detalle: '' }, extra: { hora: '', detalle: '' }
    },
    ...patientData 
  });

  // ESTADO GLOBAL: RUTINA DE ENTRENAMIENTO
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
  // ESTADO GLOBAL: HISTÓRICO DE MEDICIONES Y PERÍMETROS
  const [evaluaciones, setEvaluaciones] = useState([
    {
        id: 1,
        fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
        peso: '70',
        pecho: '', brazoDer: '', brazoIzq: '', cintura: '', 
        cadera: '', piernaDer: '', piernaIzq: ''
    }
  ]);

  // Manejador Genérico
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPatient(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
            <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">{patient.nombre || patient.nombre_completo || 'Nuevo Paciente'} <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold uppercase hidden sm:inline-block">Activo</span></h2><p className="text-xs text-slate-500">{patient.cedula ? `C.I. ${patient.cedula}` : 'Sin identificación'} • {new Date().toLocaleDateString()}</p></div>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"><Save size={18} /> <span className="hidden sm:inline">Guardar Cambios</span></button>
      </div>

      {/* PESTAÑAS */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
        {TABS_CONFIG.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><tab.icon size={16} /> {tab.label}</button>
        ))}
      </div>

      {/* RENDERIZADO DINÁMICO DE PESTAÑAS */}
      <div className="flex-1 overflow-y-auto pb-10 pr-2 custom-scrollbar">
         {activeTab === 'general' && (
            <GeneralTab patient={patient} setPatient={setPatient} onChange={handleChange} />
        )}
         {activeTab === 'history' && <HistoryTab patient={patient} setPatient={setPatient} onChange={handleChange} />}
         {activeTab === 'measurements' && (
            <MeasurementsTab 
              patient={patient} 
              onChange={handleChange} 
              evaluaciones={evaluaciones} 
              setEvaluaciones={setEvaluaciones} 
            />
         )}
         {activeTab === 'planning' && <PlanningTab patient={patient} setPatient={setPatient} onChange={handleChange} />}
         {activeTab === 'training' && (
            <TrainingTab 
              rutina={rutina} 
              setRutina={setRutina} 
              patient={patient} 
              onChange={handleChange} 
            />
        )}
      </div>
    </div>
  );
};

export default PerfilPaciente;