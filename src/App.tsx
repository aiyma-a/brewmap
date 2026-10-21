import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ExploreScreen from './screens/ExploreScreen';
import FilterScreen from './screens/FilterScreen';
import DetailScreen from './screens/DetailScreen';
import BrewlogScreen from './screens/BrewlogScreen';
import AuthScreen from './screens/AuthScreen';

// A simple client-side guard component
function RequireAuth({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('brewmap_authorised') === 'true';
      setAuthorized(isAuth);
    };

    // Run immediately
    checkAuth();

    // Listen to changes in same tab or across tabs
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth_state_changed', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth_state_changed', checkAuth);
    };
  }, []);

  if (authorized === null) {
    // Loading indicator matching artisanal style
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center font-sans text-center">
        <div className="space-y-4">
          <div className="w-10 h-10 border-4 border-brand/35 border-t-brand rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-bold tracking-widest text-brand uppercase font-mono">Loading Brewmap...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Protected screens */}
        <Route path="/" element={<RequireAuth><ExploreScreen /></RequireAuth>} />
        <Route path="/filter" element={<RequireAuth><FilterScreen /></RequireAuth>} />
        <Route path="/brewlog" element={<RequireAuth><BrewlogScreen /></RequireAuth>} />
        <Route path="/shop/:id" element={<RequireAuth><DetailScreen /></RequireAuth>} />

        {/* Auth page is publicly accessible */}
        <Route path="/auth" element={<AuthScreen />} />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
