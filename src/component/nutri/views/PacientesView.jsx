import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, MoreVertical, Filter, Loader2 } from 'lucide-react';
import NuevoPacienteModal from '../../Pacientes/NuevoPacienteModal'; 
// 1. Importamos la vista del Perfil
import PerfilPaciente from './PerfilPaciente'; 

const PacientesView = ({ user }) => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // --- 2. ESTADO PARA NAVEGACIÓN ---
    const [selectedPatient, setSelectedPatient] = useState(null);

    // --- 3. PACIENTE ESTÁTICO DE EJEMPLO ---
    // Este objeto tiene la estructura necesaria para que PerfilPaciente no falle
    const pacienteEjemplo = {
        id: 'static-1',
        nombre: 'Juan Pérez', // Para el perfil
        cedula: '1712345678',
        sexo: 'hombre', // Minúsculas para coincidir con selects
        edad: 30,
        peso: 85,
        altura: 178,
        ocupacion: 'Arquitecto',
        tipoConsulta: 'presencial',
        // Datos dummy para gráficos
        patronIngesta: { 
            desayuno: { hora: '08:00', detalle: 'Huevos y café' }, 
            colacion1: { hora: '11:00', detalle: 'Manzana' },
            almuerzo: { hora: '14:00', detalle: 'Pollo y arroz' },
            colacion2: { hora: '17:00', detalle: 'Yogurt' },
            cena: { hora: '20:00', detalle: 'Ensalada' },
            extra: { hora: '', detalle: '' }
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchPacientes();
        }
    }, [user]);

    const fetchPacientes = async () => {
        console.log(user);
        console.log(user.empresaConfig.id);
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/tenant/pacientes', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'X-Empresa-ID': user.empresaConfig.id,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPacientes(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Error fetching patients:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePaciente = (newPatient) => {
        setPacientes([newPatient, ...pacientes]); // Agregamos al principio
    };

    // --- 4. COMBINAR DATOS (Estático + API) ---
    // Creamos una lista unificada para mostrar
    const listaCompleta = [pacienteEjemplo, ...pacientes];

    const filteredPacientes = listaCompleta.filter(p => 
        p.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cedula?.includes(searchTerm)
    );

    // --- 5. RENDERIZADO CONDICIONAL DE VISTAS ---
    
    // VISTA A: SI HAY UN PACIENTE SELECCIONADO, MOSTRAMOS SU PERFIL
    if (selectedPatient) {
        return (
            <PerfilPaciente 
                patientData={selectedPatient} 
                onBack={() => setSelectedPatient(null)} // Callback para volver
            />
        );
    }

    // VISTA B: SI NO, MOSTRAMOS LA LISTA (El código original mejorado)
    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-full flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white brand-font flex items-center gap-2">
                        <Users className="text-teal-600" size={24} /> Mis Pacientes
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Gestión de expedientes clínicos electrónicos</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-md shadow-teal-600/20 flex items-center gap-2 text-sm font-bold transform hover:-translate-y-0.5"
                >
                    <Plus size={18} /> Nuevo Paciente
                </button>
            </div>

            {/* Barra de Herramientas */}
            <div className="mb-6 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, cédula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500 dark:text-white dark:placeholder-slate-400 transition-all text-sm"
                    />
                </div>
                <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-teal-600 transition-colors">
                    <Filter size={18} />
                </button>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {/* NOTA: Quitamos el bloqueo total por 'loading' para que 
                   siempre se vea al menos el paciente estático mientras carga la API.
                */}
                
                {filteredPacientes.length === 0 && !loading ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Users size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No se encontraron pacientes.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {filteredPacientes.map(p => (
                            <div 
                                key={p.id} 
                                // EVENTO CLICK PARA ENTRAR AL PERFIL
                                onClick={() => setSelectedPatient(p)}
                                className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-500/50 hover:shadow-md rounded-xl transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                        {p.nombre_completo ? p.nombre_completo[0].toUpperCase() : '?'}
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-slate-700 dark:text-white group-hover:text-teal-600 transition-colors">
                                            {p.nombre_completo}
                                            {/* Etiqueta Visual para el Estático */}
                                            {p.id === 'static-1' && (
                                                <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200">DEMO</span>
                                            )}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
                                            {p.cedula && <span>C.I. {p.cedula}</span>}
                                            {p.sexo_biologico && (
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${p.sexo_biologico.toLowerCase() === 'mujer' ? 'bg-pink-50 text-pink-500 dark:bg-pink-900/20' : 'bg-blue-50 text-blue-500 dark:bg-blue-900/20'}`}>
                                                    {p.sexo_biologico}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <span className="block text-xs font-bold text-slate-500">Última consulta</span>
                                        <span className="text-xs text-slate-400">--/--/----</span>
                                    </div>
                                    <button className="text-slate-300 hover:text-teal-600 p-2 hover:bg-teal-50 dark:hover:bg-slate-700 rounded-full transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Loader pequeño al final si sigue cargando la API pero ya mostramos el estático */}
                {loading && (
                    <div className="py-4 text-center">
                        <Loader2 size={20} className="animate-spin text-teal-500 mx-auto" />
                    </div>
                )}
            </div>

            {/* INTEGRACIÓN DEL MODAL POWER */}
            <NuevoPacienteModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSavePaciente}
                token={user.token}
                empresaId={user.empresaConfig.id}
            />

        </div>
    );
};

export default PacientesView;