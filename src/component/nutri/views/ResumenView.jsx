import React, { useState } from 'react';
import {
  Calendar, Clock, ArrowRight, Video, MapPin,
  PlusCircle, CheckCircle, XCircle, AlertCircle, X,
  MoreHorizontal, ExternalLink 
} from 'lucide-react';

// --- SUBCOMPONENTE: ITEM DE CITA ---
const AppointmentItem = ({ appointment, onClick, onNameClick }) => {
  const { time, patient, type, status } = appointment;

  const statusColors = {
    'Pendiente': 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900',
    'Finalizada': 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900',
    'Cancelada': 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900',
  };

  return (
    <div
      onClick={onClick} // Ahora toda la fila abre el modal (más fácil de usar)
      className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group"
    >
      <div className="flex flex-col items-center min-w-[60px]">
        <span className={`text-sm font-bold ${status === 'Cancelada' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>
          {time}
        </span>
        <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase">Hoy</span>
      </div>

      <div className="flex-1">
        <h4 className={`text-sm font-bold transition-colors ${status === 'Cancelada' ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200 group-hover:text-teal-500'}`}>
          {patient}
        </h4>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-bold border
            ${type === 'Online'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
              : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'}`}>
            {type === 'Online' ? <Video size={10} /> : <MapPin size={10} />}
            {type}
          </span>

          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${statusColors[status] || statusColors['Pendiente']}`}>
            {status === 'Finalizada' && <CheckCircle size={10} />}
            {status === 'Cancelada' && <XCircle size={10} />}
            {status === 'Pendiente' && <AlertCircle size={10} />}
            {status}
          </span>
        </div>
      </div>

      <button onClick={onNameClick} className="text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 p-1">
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const ResumenView = ({ user, onViewChange, onGoToPatient }) => {

  const [appointments, setAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user && user.token) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch live appointments today
      const citasRes = await fetch('http://127.0.0.1:8000/api/tenant/citas', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'X-Empresa-ID': user.empresaConfig.id,
          'Accept': 'application/json'
        }
      });
      if (citasRes.ok) {
        const citasData = await citasRes.json();
        const todayStr = new Date().toISOString().split('T')[0];
        const todayCitas = citasData
          .filter(c => c.fecha_hora_inicio.startsWith(todayStr))
          .map(ev => {
            const statusMap = {
              'pendiente': 'Pendiente',
              'finalizada': 'Finalizada',
              'cancelada': 'Cancelada'
            };
            return {
              id: ev.id,
              time: new Date(ev.fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              patient: ev.paciente_nombre,
              type: ev.tipo,
              status: statusMap[ev.estado] || 'Pendiente'
            };
          });
        setAppointments(todayCitas);
      }

      // 2. Fetch live recent patients
      const pacRes = await fetch('http://127.0.0.1:8000/api/tenant/pacientes', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'X-Empresa-ID': user.empresaConfig.id,
          'Accept': 'application/json'
        }
      });
      if (pacRes.ok) {
        const pacData = await pacRes.json();
        // Sort securely by creation date descendant, top 5
        const sorted = pacData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

        const now = new Date();
        const recents = sorted.map(p => {
          const createdAt = new Date(p.created_at);
          const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
          let dateStr = 'Hoy';
          if (diffDays === 1) dateStr = 'Ayer';
          else if (diffDays > 1) dateStr = `Hace ${diffDays} días`;

          return {
            id: p.id,
            name: `${p.nombre} ${p.apellidos}`,
            date: dateStr,
            status: 'Activo'
          };
        });
        setRecentPatients(recents);
      }
    } catch (err) {
      console.error("Error fetching ResumenView data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Acción para ir al perfil
  const handleProfileClick = (patientName) => {
    if (onGoToPatient) {
      onGoToPatient({
        nombre_completo: patientName,
        id: Date.now()
      });
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedAppt) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tenant/citas/${selectedAppt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'X-Empresa-ID': user.empresaConfig.id,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ estado: newStatus.toLowerCase() })
      });

      if (response.ok) {
        const updatedList = appointments.map(app =>
          app.id === selectedAppt.id ? { ...app, status: newStatus } : app
        );
        setAppointments(updatedList);
        setSelectedAppt(null); // Close modal
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in duration-300 p-1 h-full flex flex-col relative">

      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Hola, Dra. Ana 👋</h1>
          <p className="text-slate-500 dark:text-slate-400">Aquí está tu agenda operativa del día.</p>
        </div>
        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 hidden sm:block">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* AGENDA */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden min-h-[500px]">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg text-slate-700 dark:text-white flex items-center gap-2">
                <Clock size={20} className="text-teal-500" /> Agenda del Día
              </h3>
              <button onClick={() => onViewChange && onViewChange('agenda')} className="text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline">
                Ver Calendario Completo
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {appointments.map(app => (
                <AppointmentItem
                  key={app.id}
                  appointment={app}
                  onClick={() => setSelectedAppt(app)} // Click general -> Abre Modal
                />
              ))}
            </div>
          </div>
        </div>

        {/* BARRA LATERAL DERECHA */}
        <div className="space-y-6">
          {/* KPI Citas Hoy */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-teal-100 text-xs font-bold uppercase mb-1">Citas para Hoy</p>
              <div className="flex items-end gap-2">
                <h3 className="text-4xl font-bold">{appointments.length}</h3>
                <span className="text-sm font-medium text-teal-100 mb-1.5">pacientes</span>
              </div>
              <p className="text-xs mt-2 text-teal-50 bg-white/20 inline-block px-2 py-1 rounded">
                {appointments.filter(a => a.status === 'Pendiente').length} pendientes por atender
              </p>
            </div>
            <Calendar className="absolute -right-4 -bottom-4 text-white opacity-20" size={100} />
          </div>

          {/* Accesos Rápidos */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 className="font-bold text-slate-700 dark:text-white text-sm mb-4">Acceso Rápido</h3>
            <div className="space-y-3">
              <button onClick={() => onViewChange && onViewChange('pacientes')} className="w-full flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 p-3 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-700">
                <PlusCircle size={18} className="text-teal-500" /> Nuevo Paciente
              </button>
              <button onClick={() => onViewChange && onViewChange('agenda')} className="w-full flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 p-3 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-700">
                <Calendar size={18} className="text-blue-500" /> Agendar Cita
              </button>
            </div>
          </div>

          {/* Pacientes Recientes */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 dark:text-white text-sm">Pacientes Recientes</h3>
              <button onClick={() => onViewChange && onViewChange('pacientes')} className="text-[10px] text-teal-600 hover:underline">Ver todos</button>
            </div>
            <div className="space-y-1">
              {recentPatients.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleProfileClick(p.name)} // Clic para ir al perfil
                  className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.date}</p>
                    </div>
                  </div>
                  <MoreHorizontal size={14} className="text-slate-300 hover:text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE GESTIÓN DE CITA --- */}
      {selectedAppt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Gestionar Cita</h3>

                {/* AQUI ESTA EL CAMBIO: LINK AL PERFIL */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Paciente:</span>
                  <button
                    onClick={() => {
                      handleProfileClick(selectedAppt.patient);
                      setSelectedAppt(null); // Cerramos el modal al irnos
                    }}
                    className="flex items-center gap-1 font-bold text-teal-600 dark:text-teal-400 hover:underline hover:text-teal-700 transition-colors bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded text-sm"
                    title="Ir al Expediente Clínico"
                  >
                    {selectedAppt.patient}
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <p className="text-xs uppercase font-bold text-slate-400 mb-2">Cambiar estado a:</p>

              <button onClick={() => handleStatusChange('Finalizada')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20 dark:hover:border-green-800 group transition-all">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform"><CheckCircle size={18} /></div>
                <div className="text-left"><p className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-green-700 dark:group-hover:text-green-400">Marcar como Finalizada</p><p className="text-xs text-slate-500">El paciente asistió.</p></div>
              </button>

              <button onClick={() => handleStatusChange('Cancelada')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-800 group transition-all">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform"><XCircle size={18} /></div>
                <div className="text-left"><p className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-red-700 dark:group-hover:text-red-400">Cancelar Cita</p><p className="text-xs text-slate-500">No asistió.</p></div>
              </button>

              <button onClick={() => handleStatusChange('Pendiente')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-900/20 dark:hover:border-orange-800 group transition-all">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Clock size={18} /></div>
                <div className="text-left"><p className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-orange-700 dark:group-hover:text-orange-400">Marcar como Pendiente</p><p className="text-xs text-slate-500">Restaurar estado.</p></div>
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex justify-end"><button onClick={() => setSelectedAppt(null)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">Cerrar</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenView;