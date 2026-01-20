import React from 'react';
import { useAuth } from './context/AuthContext';
import LoginView from './components/LoginView';
import Dashboard from './components/Dashboard';

function App() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[150] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-blue-600 font-bold tracking-tight text-sm uppercase">IELTS TEAM</p>
    </div>
  );

  return user ? <Dashboard /> : <LoginView />;
}

export default App;