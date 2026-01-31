import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Building2, ChevronRight } from 'lucide-react';
import ModalForm from '../ui/ModalForm';

const EmpresasView = ({ onSelectEmpresa, token }) => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [logo, setLogo] = useState(null);
  const [creating, setCreating] = useState(false);

  // Cargar empresas
  const loadEmpresas = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://loving-nash.82-165-210-237.plesk.page/empresas', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setEmpresas(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error("Error cargando empresas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmpresas(); }, []);

  // Crear empresa
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    const formData = new FormData();
    formData.append('nombre', nombre);
    if (logo) formData.append('logo', logo);

    try {
      const res = await fetch('https://loving-nash.82-165-210-237.plesk.page/empresas', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // FormData no lleva Content-Type manual
        body: formData
      });
      
      const data = await res.json();

      if (res.ok) {
        setEmpresas([...empresas, data.data]);
        setShowModal(false);
        setNombre('');
        setLogo(null);
      } else {
        alert(data.message || 'Error al crear empresa');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white brand-font">Empresas Registradas</h2>
        <button onClick={() => setShowModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all transform hover:-translate-y-0.5">
          <Plus size={16} /> Nueva Empresa
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-orange-500"><Loader2 size={40} className="animate-spin" /></div>
      ) : empresas.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
          <Building2 size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No hay empresas registradas aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {empresas.map((emp) => (
            <div key={emp.id} className="bg-white dark:bg-[#1e293b] p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-inner border border-slate-200 dark:border-slate-600">
                  {emp.logo_url ? (
                    <img src={emp.logo_url} alt={emp.nombre} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-orange-500 font-bold text-xl">{emp.nombre ? emp.nombre[0].toUpperCase() : '?'}</span>
                  )}
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${emp.estado === 'activo' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600'}`}>
                  {emp.estado}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-1 text-lg truncate brand-font">{emp.nombre}</h3>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  DB: {emp.nombre_bd}
                </span>
              </div>
              <button onClick={() => onSelectEmpresa(emp)} className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 group-hover:bg-orange-500 group-hover:text-white">
                Administrar <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ModalForm isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva Empresa">
        <form onSubmit={handleCreate}>
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre Comercial</label>
            <input autoFocus type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none dark:text-white" placeholder="Ej: Clínica Salud Total" required />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Logo (Opcional)</label>
            <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-slate-700 dark:file:text-slate-300" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancelar</button>
            <button type="submit" disabled={creating} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold text-sm flex items-center gap-2">
              {creating && <Loader2 size={16} className="animate-spin" />} Crear
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
};

export default EmpresasView;