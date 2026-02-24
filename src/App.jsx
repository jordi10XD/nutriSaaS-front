import React, { useState, useEffect } from 'react';
import { Users, Star, Shield } from 'lucide-react'; // Agregué Shield para el botón Admin
import AdminLoginModal from './component/auth/AdminLoginModal';
import defaultLogo from './assets/logonutriaserio.png';

const Login = ({ onLogin }) => { // Ya no necesitamos onAdminShortcut como prop
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- ESTADO PARA EL MODAL DE ADMIN ---
    const [showAdminModal, setShowAdminModal] = useState(false);

    // --- ESTADOS PARA EMPRESAS ---
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);

    // --- EFECTO: CARGAR EMPRESAS ---
    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                //const response = await fetch('http://127.0.0.1:8000/api/empresas');
                const response = await fetch('http://127.0.0.1:8000/api/empresas');
                if (response.ok) {
                    const data = await response.json();

                    const empresasFormateadas = data.data.map(emp => ({
                        id: emp.id,
                        nombre: emp.nombre,
                        logo: emp.logo_url
                    }));

                    setEmpresas(empresasFormateadas);
                    setSelectedEmpresa(null); // Por defecto ninguna seleccionada (Muestra Nutria)
                }
            } catch (err) {
                console.error("Error cargando empresas:", err);
            }
        };

        fetchEmpresas();
    }, []);

    // --- MANEJADOR DE CAMBIO DE EMPRESA ---
    const handleEmpresaChange = (e) => {
        const id = e.target.value;
        if (id === "") {
            setSelectedEmpresa(null);
        } else {
            const empresa = empresas.find(emp => emp.id === parseInt(id));
            setSelectedEmpresa(empresa || null);
        }
    };

    // --- LOGIN NORMAL (Nutricionistas y Clientes) ---
    const handleRealLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. Validación: Usuario normal DEBE seleccionar sede
        if (!selectedEmpresa) {
            setError('Por favor, selecciona tu Sede / Empresa para ingresar.');
            setLoading(false);
            return;
        }

        const usuario = e.target.user.value;
        const password = e.target.pass.value;

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    usuario: usuario,
                    password: password,
                    // Enviamos la empresa para asegurar que el usuario pertenece a ella
                    id_empresa: selectedEmpresa.id
                })
            });

            const data = await response.json();

            if (response.ok) {
                onLogin({
                    ...data.user,
                    rol: data.rol || data.user.rol,
                    token: data.token,
                    empresaConfig: selectedEmpresa
                });
            } else {
                setError(data.message || 'Credenciales incorrectas');
            }

        } catch (error) {
            console.error('Login error:', error);
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIN ADMIN (Callback desde el Modal) ---
    const handleAdminLoginSuccess = (loginData) => {
        // Si es admin de empresa, configuramos la visualización
        let adminEmpresaConfig = null;
        if (loginData.user.id_empresa) {
            adminEmpresaConfig = empresas.find(e => e.id === loginData.user.id_empresa);
        }

        onLogin({
            ...loginData.user,
            token: loginData.token,
            empresaConfig: adminEmpresaConfig
        });
    };

    // --- LÓGICA VISUAL ---
    const currentLogoDisplay = selectedEmpresa?.logo ? selectedEmpresa.logo : defaultLogo;

    return (
        <div className="min-h-screen flex font-sans overflow-hidden relative">

            {/* BOTÓN ADMIN (Abre el Modal) */}
            <button
                onClick={() => setShowAdminModal(true)}
                className="absolute top-4 right-4 z-50 bg-slate-800 text-slate-400 px-3 py-1 rounded border border-slate-700 hover:text-orange-500 hover:border-orange-500 text-xs transition-colors flex items-center gap-2"
            >
                <Shield size={12} /> Admin Mode
            </button>

            {/* LADO IZQUIERDO: Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1e293b] relative items-center justify-center p-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 max-w-lg text-left flex flex-col">

                    {/* IMAGEN IZQUIERDA DINÁMICA */}

                    <div className="mb-10 relative group self-center">
                        <div className="absolute -inset-4 bg-orange-600/40 rounded-lg blur-2xl opacity-80 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative bg-[#1e293b] border border-orange-500/30 p-4 rounded-2xl shadow-2xl shadow-orange-500/20 z-10">
                            {/* AQUI ESTÁ EL CAMBIO: src={currentLogoDisplay} en vez de defaultLogo */}
                            <img
                                src={currentLogoDisplay}
                                alt="Logo Principal"
                                className="h-40 w-40 object-contain drop-shadow-md transition-all duration-500"
                            />
                        </div>
                    </div>


                    <h1 className="text-5xl font-bold text-white mb-2 brand-font leading-tight">
                        ¡Hola, Nutri!
                    </h1>
                    <h2 className="text-5xl font-bold text-orange-500 mb-8 brand-font leading-tight">
                        Tu consultorio ahora fluye mejor.
                    </h2>

                    <div className="mb-12">
                        <p className="text-slate-300 text-lg leading-relaxed mb-2 font-light">
                            Gestión inteligente para nutricionistas modernos.
                        </p>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Dedícate a tus pacientes, nosotros nos encargamos de las dietas, los cálculos y la agenda.
                        </p>
                    </div>

                    <div className="border-t border-slate-700 pt-8 mt-8">
                        <div className="flex gap-1 text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-slate-400 italic text-sm">
                            "Desde que uso Nutria, salgo a tiempo de la consulta."
                        </p>
                    </div>
                </div>
            </div>

            {/* LADO DERECHO: Formulario */}
            <div className="w-full lg:w-1/2 bg-[#0f172a] flex flex-col justify-center items-center p-8 lg:p-24 relative">
                <div className="w-full max-w-md">

                    {/* IMAGEN DERECHA DINÁMICA */}
                    <div className="flex justify-center mb-8 relative">
                        <div className="w-24 h-24 bg-[#1e293b] rounded-full flex items-center justify-center shadow-2xl shadow-orange-900/20 border border-slate-700 p-4 overflow-hidden relative group">
                            <img
                                src={currentLogoDisplay}
                                alt="Logo Empresa"
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h2 className="text-2xl text-white font-bold brand-font mb-2">
                            Bienvenido a {selectedEmpresa ? selectedEmpresa.nombre : 'tu Madriguera'}
                        </h2>
                        <p className="text-slate-400 text-sm">Ingresa para gestionar tus consultas</p>
                    </div>

                    <form onSubmit={handleRealLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded text-center">
                                {error}
                            </div>
                        )}

                        {/* SELECTOR DE EMPRESA */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                                Selecciona tu Sede / Empresa
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3.5 rounded-lg bg-[#1e293b] border border-slate-700 text-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800"
                                    onChange={handleEmpresaChange}
                                    value={selectedEmpresa?.id || ''}
                                    required
                                >
                                    <option value="">Selecciona tu Sede...</option>
                                    {empresas.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.nombre}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Usuario</label>
                            <input
                                name="user" type="text" placeholder="Ej: nutri.juan" required
                                className="w-full px-4 py-3.5 rounded-lg bg-[#1e293b] border border-slate-700 text-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-slate-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Contraseña</label>
                            <input
                                name="pass" type="password" placeholder="••••••••" required
                                className="w-full px-4 py-3.5 rounded-lg bg-[#1e293b] border border-slate-700 text-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-slate-600"
                            />
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-orange-500 hover:text-orange-400 text-sm font-semibold transition-colors">¿Olvidaste tu contraseña?</a>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-orange-900/20 transform hover:-translate-y-0.5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Conectando...' : 'Entrar al Sistema'}
                        </button>
                    </form>

                    <div className="mt-12 text-center border-t border-slate-800 pt-6">
                        <p className="text-slate-500 text-sm">
                            ¿Aún no tienes cuenta? <a href="#" className="text-orange-500 font-bold hover:underline">Prueba gratis</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* MODAL ADMINISTRATIVO */}
            <AdminLoginModal
                isOpen={showAdminModal}
                onClose={() => setShowAdminModal(false)}
                empresas={empresas}
                onAdminLoginSuccess={handleAdminLoginSuccess}
            />

        </div>
    );
};

export default Login;