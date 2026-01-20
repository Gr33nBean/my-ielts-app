import React from "react";

const WeekFilter = ({ availableWeeks, selectedWeek, onSelectWeek }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
      <button
        onClick={() => onSelectWeek("all")}
        className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all ${
          selectedWeek === "all"
            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none"
            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400"
        }`}
      >
        Tất cả tuần
      </button>
      {availableWeeks.map((week) => (
        <button
          key={week}
          onClick={() => onSelectWeek(week)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all ${
            selectedWeek === week
              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none"
              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400"
          }`}
        >
          {week}
        </button>
      ))}
    </div>
  );
};

export default WeekFilter;
