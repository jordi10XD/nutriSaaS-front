import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Users, Pencil, Trash2, AlertTriangle } from 'lucide-react'; // <-- Importamos Trash2 y AlertTriangle
import ModalForm from '../ui/ModalForm';

const NutricionistasView = ({ empresa, token }) => {
  const [nutris, setNutris] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- ESTADOS FORMULARIO (CREAR/EDITAR) ---
  const [showModal, setShowModal] = useState(false);
  const [editingNutri, setEditingNutri] = useState(null);

  // --- ESTADOS ELIMINACIÓN ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nutriToDelete, setNutriToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // DATOS PERSONALES
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [saving, setSaving] = useState(false);

  // Cargar lista
  const fetchNutris = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/tenant/nutricionistas', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Empresa-ID': empresa.id.toString(),
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setNutris(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error("Error cargando nutris", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNutris(); }, [empresa]);

  // --- LOGICA MODAL CREAR/EDITAR ---
  const handleEditClick = (nutri) => {
      setEditingNutri(nutri);
      setNombre(nutri.nombre);
      setApellido(nutri.apellido);
      setUsuario(nutri.usuario);
      setEmail(nutri.email);
      setPassword('');
      setShowModal(true);
  };

  const handleNewClick = () => {
      setEditingNutri(null);
      setNombre('');
      setApellido('');
      setUsuario('');
      setEmail('');
      setPassword('');
      setShowModal(true);
  };

  const handleCloseModal = () => {
      setShowModal(false);
      setEditingNutri(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const isEditing = !!editingNutri;
    const url = isEditing 
        ? `http://127.0.0.1:8000/api/tenant/nutricionistas/${editingNutri.id}`
        : 'http://127.0.0.1:8000/api/tenant/nutricionistas';
    const method = isEditing ? 'PUT' : 'POST';

    const payload = { 
        nombre, apellido, usuario, email,
        ...(password ? { password } : {}) 
    };

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Empresa-ID': empresa.id.toString()
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (res.ok) {
        fetchNutris(); 
        handleCloseModal();
      } else {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join('\n') : (data.message || 'Error');
        alert(errorMsg);
      }
    } catch (error) { 
        console.error(error); alert('Error de conexión'); 
    } finally { setSaving(false); }
  };

  // --- LÓGICA ELIMINACIÓN ---
  const handleDeleteClick = (nutri) => {
      setNutriToDelete(nutri); // Guardamos a quién vamos a matar
      setShowDeleteModal(true); // Mostramos el modal de advertencia
  };

  const confirmDelete = async () => {
      if (!nutriToDelete) return;
      setIsDeleting(true);

      try {
          const res = await fetch(`http://127.0.0.1:8000/api/tenant/nutricionistas/${nutriToDelete.id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'X-Empresa-ID': empresa.id.toString()
              }
          });

          if (res.ok) {
              fetchNutris(); // Recargamos lista
              setShowDeleteModal(false); // Cerramos modal
              setNutriToDelete(null);
          } else {
              alert("No se pudo eliminar al nutricionista.");
          }
      } catch (error) {
          console.error(error);
          alert("Error de conexión al eliminar.");
      } finally {
          setIsDeleting(false);
      }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white brand-font">Nutricionistas de {empresa.nombre}</h3>
          <p className="text-xs text-slate-500">Gestión del personal médico</p>
        </div>
        <button onClick={handleNewClick} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors shadow-md flex items-center gap-2 text-sm font-bold">
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-orange-500"><Loader2 className="animate-spin inline" size={32} /></div>
      ) : nutris.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
          <Users size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-slate-400 text-sm mb-2">No hay nutricionistas registrados.</p>
          <button onClick={handleNewClick} className="text-orange-500 font-bold text-sm hover:underline">Crear el primero</button>
        </div>
      ) : (
        <div className="space-y-3">
          {nutris.map(n => (
            <div key={n.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold shadow-md text-sm">
                  {n.nombre ? n.nombre[0].toUpperCase() : 'N'}
                </div>
                <div>
                   <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">{n.nombre} {n.apellido}</span>
                   <span className="text-[10px] text-slate-400 font-mono">@{n.usuario}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full mr-2 ${n.estado === 1 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>
                    {n.estado === 1 ? 'Activo' : 'Inactivo'}
                </span>
                
                {/* BOTÓN EDITAR */}
                <button 
                    onClick={() => handleEditClick(n)}
                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Editar"
                >
                    <Pencil size={16} />
                </button>

                {/* BOTÓN ELIMINAR */}
                <button 
                    onClick={() => handleDeleteClick(n)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Eliminar"
                >
                    <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CREAR/EDITAR */}
      <ModalForm isOpen={showModal} onClose={handleCloseModal} title={editingNutri ? "Editar Nutricionista" : "Nuevo Nutricionista"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre</label>
                <input autoFocus={!editingNutri} type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition-all" placeholder="Ej: Juan" required />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Apellido</label>
                <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition-all" placeholder="Ej: Pérez" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Usuario</label>
                <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition-all disabled:opacity-50" placeholder="Ej: jperez" required />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition-all" placeholder="juan@mail.com" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{editingNutri ? "Nueva Contraseña (Opcional)" : "Contraseña"}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition-all" placeholder={editingNutri ? "Dejar en blanco para mantener la actual" : "••••••••"} required={!editingNutri} minLength={6}/>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors">Cancelar</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
              {saving && <Loader2 size={16} className="animate-spin" />} {editingNutri ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </ModalForm>

      {/* --- MODAL CONFIRMACIÓN ELIMINAR --- */}
      <ModalForm isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Eliminar Nutricionista">
        <div className="text-center p-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">¿Estás seguro?</h4>
            <p className="text-slate-500 text-sm mb-6">
                Estás a punto de eliminar a <span className="font-bold text-slate-700 dark:text-white">{nutriToDelete?.nombre} {nutriToDelete?.apellido}</span>. 
                <br/>Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-center gap-3">
                <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5"
                >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Sí, Eliminar
                </button>
            </div>
        </div>
      </ModalForm>
    </div>
  );
};

export default NutricionistasView;