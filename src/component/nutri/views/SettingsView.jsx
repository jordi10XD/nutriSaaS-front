import React from 'react';
import { 
  User, CreditCard, Shield, Zap, Calendar, 
  Mail, Phone, AlertTriangle, CheckCircle 
} from 'lucide-react';

const SettingsView = ({ user }) => {
  
  // Datos simulados de la suscripción (Mock Data)
  const subscription = {
    plan: 'Premium Profesional',
    status: 'Activo',
    price: '$29.00 / mes',
    nextBilling: '24 de Marzo, 2026',
    cardBrand: 'Visa',
    cardLast4: '4242',
    daysLeft: 28,
    progress: 10 // % del mes consumido
  };

  return (
    <div className="animate-in fade-in zoom-in duration-300 max-w-5xl mx-auto pb-10">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Configuración de Cuenta</h1>
        <p className="text-slate-500 dark:text-slate-400">Gestiona tu perfil, suscripción y métodos de pago.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLUMNA IZQUIERDA: PERFIL --- */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 text-center">
             <div className="w-24 h-24 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-3xl font-bold text-slate-500 dark:text-white mb-4 border-4 border-white dark:border-slate-600 shadow-lg">
                {user.nombre ? user.nombre.charAt(0) : 'U'}
             </div>
             <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user.nombre} {user.apellido}</h2>
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Nutricionista Certificado</p>
             <button className="text-sm font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline">Cambiar Foto</button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
             <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2 text-sm uppercase">
                <User size={16}/> Datos Personales
             </h3>
             
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Correo Electrónico</label>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                   <Mail size={16} className="text-slate-400"/> {user.email}
                </div>
             </div>
             
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Rol / Permisos</label>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                   <Shield size={16} className="text-teal-500"/> Administrador
                </div>
             </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: SUSCRIPCIÓN Y PAGOS --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* TARJETA DE SUSCRIPCIÓN */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Plan Actual</p>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {subscription.plan} 
                            <span className="bg-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Activo</span>
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">{subscription.price}</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg">
                        <Zap size={24} className="text-yellow-400" />
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between text-xs mb-2 font-medium text-slate-300">
                        <span>Progreso del ciclo</span>
                        <span>Renueva el {subscription.nextBilling}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${subscription.progress}%` }}></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-teal-400 font-bold">{subscription.daysLeft} días restantes</p>
                </div>

                {/* Decoración de fondo */}
                <Zap size={150} className="absolute -right-6 -bottom-6 text-white opacity-5 rotate-12" />
            </div>

            {/* MÉTODO DE PAGO */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2 mb-4">
                    <CreditCard size={20} className="text-teal-500"/> Método de Pago
                </h3>
                
                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded flex items-center justify-center">
                            <span className="font-bold text-blue-600 italic text-xs">VISA</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-700 dark:text-white text-sm">•••• •••• •••• {subscription.cardLast4}</p>
                            <p className="text-xs text-slate-400">Expira 12/2028</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline">
                        Actualizar
                    </button>
                </div>
            </div>

            {/* ZONA DE PELIGRO (CANCELAR) */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-6">
                <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-2">
                    <AlertTriangle size={20}/> Cancelar Suscripción
                </h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/70 mb-4">
                    Al cancelar, perderás acceso a las funciones Premium (agenda ilimitada, gráficos avanzados, etc.) al final del ciclo de facturación actual.
                </p>
                <button 
                    onClick={() => alert("Función de cancelación simulada. Aquí se abriría el portal de Stripe/Payment.")}
                    className="px-4 py-2 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-lg text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
                >
                    Cancelar Plan Premium
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsView;