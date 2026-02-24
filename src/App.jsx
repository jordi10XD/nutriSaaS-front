import React, { useState, useEffect } from 'react';

import Login from './login';
import AdminDashboard from './AdminDashboard';
import NutriDashboard from './component/nutri/NutriDashboard'; 

export default function App() {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);

  // --- DARK MODE LOGIC ---
  useEffect(() => {
    document.documentElement.classList.add('dark');
    setIsDark(true);

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e) => {
      // Listener opcional
    };
    darkModeQuery.addEventListener('change', updateTheme);
    return () => darkModeQuery.removeEventListener('change', updateTheme);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // --- USER PERSISTENCE ---
  useEffect(() => {
    const savedUser = localStorage.getItem('nutrisaas_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser?.nombre) setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('nutrisaas_user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('nutrisaas_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nutrisaas_user');
  };

  const handleAdminShortcut = () => {
    handleLogin({
      id: 99,
      nombre: 'Administrador',
      apellido: 'SaaS',
      rol: 'super_admin',
      token: 'admin-token',
      empresa: 'System'
    });
  };

  // Estilos globales
  const GlobalStyles = () => (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'Nunito', sans-serif; }
        h1, h2, h3, .brand-font { font-family: 'Quicksand', sans-serif; }

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

  // --- RENDERIZADO CONDICIONAL ---
  const renderDashboard = () => {
    if (!user) return <Login onLogin={handleLogin} onAdminShortcut={handleAdminShortcut} />;

    // Si es Nutricionista, mostramos su Dashboard
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

    // Por defecto (Super Admin o Admin Empresa) mostramos AdminDashboard
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    );
  };

  return (
    <>
      <GlobalStyles />
      {renderDashboard()}
    </>
  );
}

