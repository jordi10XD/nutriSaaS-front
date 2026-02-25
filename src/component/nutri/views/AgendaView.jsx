import React, { useState, useMemo } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar as CalIcon, Plus,
    Clock, MapPin, Video, Search, Filter, List, CalendarDays, X
} from 'lucide-react';

// --- HELPERS DE FECHAS ---
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
};

// --- COMPONENTE PRINCIPAL ---
const AgendaView = ({ user }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para pre-llenar el modal
    const [formData, setFormData] = useState({ date: '', time: '09:00', duration: '60' });

    // Estado para el filtro del listado inferior
    const [listFilter, setListFilter] = useState('week'); // 'week' | 'month'

    // --- DATOS MOCK -> AHORA DESDE API ---
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Efecto para Cargar Citas
    React.useEffect(() => {
        if (user && user.token) {
            fetchCitas();
        }
    }, [user]);

    const fetchCitas = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/tenant/citas', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'X-Empresa-ID': user.empresaConfig.id,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                const formattedEvents = data.map(ev => ({
                    id: ev.id,
                    patient: ev.paciente_nombre,
                    type: ev.tipo,
                    start: new Date(ev.fecha_hora_inicio),
                    duration: ev.duracion_minutos,
                    status: ev.estado
                }));
                setEvents(formattedEvents);
            }
        } catch (err) {
            console.error("Error fetching citas:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- CÁLCULOS DEL GRID ---
    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = [...Array(7)].map((_, i) => addDays(startOfWeek, i));
    const HOURS = [...Array(13)].map((_, i) => i + 8); // 8:00 - 20:00

    // Navegación
    const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
    const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
    const goToToday = () => setCurrentDate(new Date());

    // --- FILTRADO DE LA LISTA INFERIOR ---
    const filteredListEvents = useMemo(() => {
        return events.filter(ev => {
            const evDate = new Date(ev.start);
            const today = new Date(currentDate);

            if (listFilter === 'week') {
                const start = startOfWeek;
                const end = addDays(startOfWeek, 6);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                return evDate >= start && evDate <= end;
            } else {
                return evDate.getMonth() === today.getMonth() && evDate.getFullYear() === today.getFullYear();
            }
        }).sort((a, b) => a.start - b.start);
    }, [events, listFilter, currentDate, startOfWeek]);


    // --- HANDLERS ---
    const handleSlotClick = (day, hour) => {
        const dateStr = formatDateForInput(day);
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        setFormData({ date: dateStr, time: timeStr, duration: '60' });
        setIsModalOpen(true);
    };

    const handleNewBtnClick = () => {
        setFormData({
            date: formatDateForInput(new Date()),
            time: '09:00',
            duration: '60'
        });
        setIsModalOpen(true);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);

        const datePart = form.get('date');
        const timePart = form.get('time');
        const fullDate = new Date(`${datePart}T${timePart}:00`);

        const newEventPayload = {
            paciente_nombre: form.get('patient'),
            tipo: form.get('type'),
            // Formato SQL compatible: "YYYY-MM-DD HH:MM:SS"
            fecha_hora_inicio: datePart + ' ' + timePart + ':00',
            duracion_minutos: parseInt(form.get('duration'))
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/tenant/citas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                    'X-Empresa-ID': user.empresaConfig.id,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newEventPayload)
            });

            if (response.ok) {
                const result = await response.json();
                const ev = result.data;
                const formattedNewEvent = {
                    id: ev.id,
                    patient: ev.paciente_nombre,
                    type: ev.tipo,
                    start: new Date(ev.fecha_hora_inicio),
                    duration: ev.duracion_minutos,
                    status: ev.estado
                };
                setEvents([...events, formattedNewEvent]);
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Error creating cita:", err);
        }
    };

    const getEventStyle = (event) => {
        const startHour = event.start.getHours() + (event.start.getMinutes() / 60);
        const top = (startHour - 8) * 64;
        const height = (event.duration / 60) * 64;
        return { top: `${top}px`, height: `${height}px` };
    };

    return (
        // CORRECCIÓN AQUÍ: Quitamos 'h-full' para permitir que el contenido crezca y active el scroll del Dashboard
        <div className="flex flex-col animate-in fade-in zoom-in duration-300 space-y-8 pb-10">

            {/* --- SECCIÓN 1: GRID CALENDARIO --- */}
            <div className="flex flex-col h-[600px] shrink-0"> {/* shrink-0 evita que se aplaste si falta espacio */}

                {/* Header Controles */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">
                            {startOfWeek.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </h1>
                        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
                            <button onClick={prevWeek} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500"><ChevronLeft size={20} /></button>
                            <button onClick={goToToday} className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">Hoy</button>
                            <button onClick={nextWeek} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500"><ChevronRight size={20} /></button>
                        </div>
                    </div>
                    <button
                        onClick={handleNewBtnClick}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"
                    >
                        <Plus size={18} /> Nueva Cita
                    </button>
                </div>

                {/* Grid Visual */}
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden relative">
                    <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 z-10">
                        <div className="p-4 text-center border-r border-slate-200 dark:border-slate-700"><Clock size={20} className="mx-auto text-slate-400" /></div>
                        {weekDays.map((day, i) => {
                            const isToday = day.toDateString() === new Date().toDateString();
                            return (
                                <div key={i} className={`p-3 text-center border-r border-slate-200 dark:border-slate-700 last:border-0 ${isToday ? 'bg-teal-50/50 dark:bg-teal-900/20' : ''}`}>
                                    <p className={`text-xs font-bold uppercase mb-1 ${isToday ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>{day.toLocaleDateString('es-ES', { weekday: 'short' })}</p>
                                    <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full font-bold text-sm ${isToday ? 'bg-teal-500 text-white shadow-md' : 'text-slate-700 dark:text-white'}`}>{day.getDate()}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        <div className="grid grid-cols-8 relative min-w-[800px]">
                            <div className="border-r border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30">
                                {HOURS.map(hour => (
                                    <div key={hour} className="h-16 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-medium p-2 text-center relative"><span className="-top-2.5 relative bg-slate-50 dark:bg-[#0f172a] px-1 rounded">{hour}:00</span></div>
                                ))}
                            </div>
                            {weekDays.map((day, dayIndex) => {
                                const dayEvents = events.filter(ev => new Date(ev.start).toDateString() === day.toDateString());
                                return (
                                    <div key={dayIndex} className="relative border-r border-slate-100 dark:border-slate-700/50 last:border-0">
                                        {HOURS.map(hour => (
                                            <div key={hour} onClick={() => handleSlotClick(day, hour)} className="h-16 border-b border-slate-50 dark:border-slate-800 hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-colors cursor-pointer group relative">
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"><Plus size={16} className="text-teal-400" /></div>
                                            </div>
                                        ))}
                                        {dayEvents.map(ev => {
                                            const style = getEventStyle(ev);
                                            const isOnline = ev.type === 'Online';
                                            return (
                                                <div key={ev.id} style={style} className={`absolute inset-x-1 p-2 rounded-lg border text-xs shadow-sm cursor-pointer overflow-hidden hover:scale-[1.02] hover:z-10 transition-all flex flex-col justify-between ${isOnline ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-700/50 text-purple-800 dark:text-purple-200' : 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-200'}`}>
                                                    <div className="flex justify-between items-start"><span className="font-bold truncate">{ev.patient}</span>{isOnline ? <Video size={12} className="shrink-0" /> : <MapPin size={12} className="shrink-0" />}</div>
                                                    <div className="flex items-center gap-1 opacity-80"><Clock size={10} /><span>{formatTime(ev.start)} ({ev.duration}m)</span></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 2: LISTADO DE CITAS (FILTRABLE) --- */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-lg text-slate-700 dark:text-white flex items-center gap-2">
                        <List size={20} className="text-teal-500" /> Listado de Citas
                    </h3>

                    {/* Tabs de Filtro */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                        <button
                            onClick={() => setListFilter('week')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2
                      ${listFilter === 'week' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <CalendarDays size={14} /> Esta Semana
                        </button>
                        <button
                            onClick={() => setListFilter('month')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2
                      ${listFilter === 'month' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <CalIcon size={14} /> Este Mes
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-3">Fecha y Hora</th>
                                <th className="px-6 py-3">Paciente</th>
                                <th className="px-6 py-3">Tipo</th>
                                <th className="px-6 py-3">Duración</th>
                                <th className="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredListEvents.length > 0 ? (
                                filteredListEvents.map((ev) => (
                                    <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-white">
                                            {ev.start.toLocaleDateString()} <span className="text-slate-400 font-normal mx-1">|</span> {formatTime(ev.start)}
                                        </td>
                                        <td className="px-6 py-4 text-teal-600 font-medium">{ev.patient}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${ev.type === 'Online' ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                {ev.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{ev.duration} min</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold capitalize">
                                                {ev.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                        No hay citas para el filtro seleccionado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL DE CREACIÓN --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
                        <form onSubmit={handleCreateEvent}>
                            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="font-bold text-lg dark:text-white">Nueva Cita</h3>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                                        <input
                                            required
                                            name="date"
                                            type="date"
                                            defaultValue={formData.date}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-teal-500 dark:text-white dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hora</label>
                                        <input
                                            required
                                            name="time"
                                            type="time"
                                            defaultValue={formData.time}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-teal-500 dark:text-white dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Paciente</label>
                                    <input required name="patient" type="text" placeholder="Nombre del paciente..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-teal-500 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                                        <select name="type" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none dark:text-white">
                                            <option value="Online">Online</option>
                                            <option value="Presencial">Presencial</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duración</label>
                                        <select name="duration" defaultValue={formData.duration} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none dark:text-white">
                                            <option value="30">30 min</option>
                                            <option value="45">45 min</option>
                                            <option value="60">1 hora</option>
                                            <option value="90">1.5 horas</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-bold">Cancelar</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow">Guardar Cita</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendaView;