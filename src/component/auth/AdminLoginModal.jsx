import React, { useState } from 'react';
import { Loader2, Shield, Building2 } from 'lucide-react';
// Importamos el mismo modal que usamos en el dashboard para consistencia visual
import ModalForm from '../admin/ui/ModalForm'; 

const AdminLoginModal = ({ isOpen, onClose, empresas, onAdminLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // --- ESTADO CLAVE: ¿Es super admin? ---
  // Si es true, ocultamos el selector de empresa.
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [selectedEmpresaId, setSelectedEmpresaId] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación simple en frontend
    if (!isSuperAdmin && !selectedEmpresaId) {
      setError('Debes seleccionar una empresa para entrar como administrador de sede.');
      setLoading(false);
      return;
    }

    try {
      // Preparamos el payload según el rol
      const payload = {
        usuario,
        password,
        // IMPORTANTE: Solo enviamos el ID de empresa si NO es super admin
        ...(isSuperAdmin ? {} : { id_empresa: selectedEmpresaId }),
        // Opcional: podemos enviar un flag para decirle al back que es intento de admin
        is_admin_attempt: true 
      };

      // Usamos el mismo endpoint de login (el backend debe ser inteligente para validar)
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error de credenciales o permisos.');
      }

      // Validación de seguridad adicional en el front (opcional pero recomendada)
      const allowedRoles = ['super_admin', 'admin_empresa'];
      if (!allowedRoles.includes(data.user.rol)) {
         throw new Error('No tienes permisos administrativos para acceder a esta zona.');
      }

      // Si todo sale bien, cerramos modal y notificamos al padre
      onClose();
      // Pasamos los datos del usuario logueado
      onAdminLoginSuccess(data); 

    } catch (err) {
      console.error("Admin Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reseteamos el formulario al cerrar
  const handleClose = () => {
    setError('');
    setUsuario('');
    setPassword('');
    setSelectedEmpresaId('');
    setIsSuperAdmin(false);
    onClose();
  }

  return (
    <ModalForm isOpen={isOpen} onClose={handleClose} title="Acceso Administrativo">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 bg-orange-500/10 rounded-full text-orange-500 mb-3">
            <Shield size={32} />
        </div>
        <p className="text-slate-500 text-sm">Zona restringida para personal autorizado.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded text-center mb-4">
                {error}
            </div>
        )}

        {/* --- SWITCH SUPER ADMIN --- */}
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <Shield size={18} className={isSuperAdmin ? "text-orange-500" : "text-slate-400"} />
                <div>
                    <p className="font-bold text-sm text-slate-700 dark:text-white">Modo Super Admin</p>
                    <p className="text-[10px] text-slate-500">Acceso global sin empresa específica</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" checked={isSuperAdmin} onChange={(e) => setIsSuperAdmin(e.target.checked)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-500"></div>
            </label>
        </div>

        {/* --- SELECTOR DE EMPRESA (Solo si NO es super admin) --- */}
        {!isSuperAdmin && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                    <Building2 size={14} /> Selecciona la Sede a Administrar
                </label>
                <div className="relative">
                    <select
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all appearance-none cursor-pointer"
                        onChange={(e) => setSelectedEmpresaId(e.target.value)}
                        value={selectedEmpresaId}
                        required={!isSuperAdmin}
                    >
                        <option value="">-- Seleccionar --</option>
                        {empresas.map((emp) => (
                            <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        )}

        {/* --- CAMPOS COMUNES --- */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Usuario Administrativo</label>
          <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition-all" placeholder="Ej: admin_global" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition-all" placeholder="••••••••" required />
        </div>

        <div className="pt-4">
          <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-900/20">
            {loading && <Loader2 size={18} className="animate-spin" />} 
            {isSuperAdmin ? 'Entrar al Panel Global' : 'Entrar a Administrar Sede'}
          </button>
        </div>
      </form>
    </ModalForm>
  );
};

export default AdminLoginModal;