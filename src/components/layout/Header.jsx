import React from 'react';

const Header = ({ theme, toggleTheme, onAddClick }) => {
  return (
    <header className="flex justify-between items-center pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] sticky top-0 bg-[#f8fafc]/80 dark:bg-slate-950/80 backdrop-blur-md z-30">
      <div>
        <p className="text-xs font-black text-blue-500 uppercase tracking-wide">8CôTiên</p>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Ielts Team</h1>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={toggleTheme}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-yellow-400 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-xl active:scale-90 transition-all"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <button 
          onClick={onAddClick}
          className="bg-blue-600 text-white w-12 h-12 rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-center text-2xl active:scale-90 transition-all"
        >
          +
        </button>
      </div>
    </header>
  );
};

export default Header;
