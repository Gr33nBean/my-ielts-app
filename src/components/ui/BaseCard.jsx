import React from 'react';

const BaseCard = ({ children, onClick, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800',
    success: 'bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-900/30',
    danger: 'bg-white dark:bg-slate-900 border-rose-100 dark:border-rose-900/30',
    info: 'bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-900/30',
  };

  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border shadow-sm active:scale-[0.98] transition-all cursor-pointer group ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export default BaseCard;
