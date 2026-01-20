import React from 'react';
import BaseCard from '../ui/BaseCard';

const SkillCard = ({ title, subtitle, icon, onClick, colorClass = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-active:bg-blue-200 dark:group-active:bg-blue-800/40',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-active:bg-orange-200 dark:group-active:bg-orange-800/40',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-active:bg-emerald-200 dark:group-active:bg-emerald-800/40',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-active:bg-purple-200 dark:group-active:bg-purple-800/40',
  };

  return (
    <BaseCard 
      onClick={onClick} 
      className="flex items-center gap-3 p-4"
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-colors ${colors[colorClass]}`}>
        {icon}
      </div>
      <div className="text-left">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-normal mb-0.5">{subtitle}</p>
        <p className="text-[13px] font-black text-slate-800 dark:text-slate-200">{title}</p>
      </div>
    </BaseCard>
  );
};

export default SkillCard;
