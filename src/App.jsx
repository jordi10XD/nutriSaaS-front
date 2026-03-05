import React, { useState, useEffect } from 'react';

// Importa tus componentes originales
import Login from './login'; // Asegúrate que la ruta sea correcta (a veces es ./auth/Login)
import AdminDashboard from './AdminDashboard';
import NutriDashboard from './component/nutri/NutriDashboard';

// --- DATOS FALSOS (MOCKS) PARA PRUEBAS ---
const MOCK_ADMIN = {
  id: 1,
  nombre: 'Jordy',
  apellido: 'Admin',
  rol: 'super_admin', // Esto activa el AdminDashboard
  empresa: 'System',
  token: 'dev-token'
};

const MOCK_NUTRI = {
  id: 2,
  nombre: 'Dra. Ana',
  apellido: 'Nutrición',
  rol: 'nutricionista', // Esto activa el NutriDashboard
  empresaConfig: {
    id: 100, 
    nombre: 'Clínica Vida' 
  },
  email: 'ana@nutri.com',
  imagen: 'https://via.placeholder.com/150',
  empresa: 'Clínica',
  token: 'dev-token'
};

export default function App() {
  // Iniciamos directamente con el Admin para no perder tiempo (o null si prefieres Login)
  const [user, setUser] = useState(MOCK_ADMIN); 
  const [isDark, setIsDark] = useState(true);

  // --- LÓGICA DE TEMA (Original restaurada) ---
  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  // --- MANEJADORES ---
  const handleLogout = () => setUser(null);
  const handleLogin = (userData) => setUser(userData);

  // --- RENDERIZADO CONDICIONAL (El cerebro de tu App) ---
  const renderDashboard = () => {
    if (!user) {
        // Pasamos props falsas al login para que no falle
        return <Login onLogin={handleLogin} onAdminShortcut={() => setUser(MOCK_ADMIN)} />;
    }

    if (user.rol === 'nutricionista') {
      return (
        <NutriDashboard
          user={user}
          onLogout={handleLogout}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      );
    }

    // Por defecto: Admin
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    );
  };

  // --- ESTILOS GLOBALES ---
  const GlobalStyles = () => (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'Nunito', sans-serif; }
        h1, h2, h3, .brand-font { font-family: 'Quicksand', sans-serif; }
        /* Animaciones para el fondo */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </>
  );

  // --- BARRA DE HERRAMIENTAS DE DESARROLLO (SOLO PARA TI) ---
  const DevToolbar = () => (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '15px',
      borderRadius: '10px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      border: '1px solid #444'
    }}>
      <h4 style={{color: '#fff', margin: 0, fontSize: '12px', textAlign:'center'}}>🔧 MODO DEV</h4>
      <button 
        onClick={() => setUser(MOCK_ADMIN)}
        style={{background: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>
        Ver como Admin
      </button>
      <button 
        onClick={() => setUser(MOCK_NUTRI)}
        style={{background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>
        Ver como Nutri
      </button>
      <button 
        onClick={() => setUser(null)}
        style={{background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>
        Ver Login
      </button>
    </div>
  );

  return (
    <div className="App">
      <GlobalStyles />
      
      {/* 1. Renderizamos la app normal */}
      {renderDashboard()}

      {/* 2. Inyectamos tu control remoto personal */}
      <DevToolbar />
    </div>
  );
}