import React, { useState, useMemo } from "react";
import VocabCard from "../VocabCard";
import WeekFilter from "../ui/WeekFilter";
import {
  getWeekLabel,
  getAvailableWeeks,
  groupItemsByWeek,
} from "../../utils/dateUtils";

const VocabListSection = ({ vocabs = [], currentUserEmail, onSelectWord }) => {
  const [filter, setFilter] = useState("me"); // 'me' | 'all'
  const [selectedWeek, setSelectedWeek] = useState("all");

  const availableWeeks = getAvailableWeeks(vocabs);

  const groupedVocabs = useMemo(() => {
    const filtered = vocabs.filter((v) => {
      const userMatch =
        filter === "me" ? v.userEmail === currentUserEmail : true;
      const weekMatch =
        selectedWeek === "all"
          ? true
          : getWeekLabel(v.createdAt) === selectedWeek;
      return userMatch && weekMatch;
    });

    return groupItemsByWeek(filtered);
  }, [vocabs, filter, selectedWeek, currentUserEmail]);

  const sortedWeeks = useMemo(() => {
    return Object.entries(groupedVocabs).sort(([weekA], [weekB]) => {
      if (weekA === "Mới nộp") return -1;
      if (weekB === "Mới nộp") return 1;
      return weekB.localeCompare(weekA);
    });
  }, [groupedVocabs]);

  return (
    <div className="space-y-4">
      <div className="sticky top-[68px] z-30 bg-[#f8fafc] dark:bg-slate-950 -mx-4 px-4 pt-1 pb-2 space-y-2 border-b border-slate-100 dark:border-slate-800/50">
        <div className="bg-slate-100/50 dark:bg-slate-900/50 p-0.5 rounded-xl flex gap-1">
          <button
            onClick={() => setFilter("me")}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black tracking-wide transition-all ${
              filter === "me"
                ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400"
                : "text-slate-400 dark:text-slate-600"
            }`}
          >
            CỦA TÔI
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black tracking-wide transition-all ${
              filter === "all"
                ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400"
                : "text-slate-400 dark:text-slate-400"
            }`}
          >
            TẤT CẢ
          </button>
        </div>

        <WeekFilter
          availableWeeks={availableWeeks}
          selectedWeek={selectedWeek}
          onSelectWeek={setSelectedWeek}
        />
      </div>

      {sortedWeeks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-300 dark:text-slate-700 text-4xl mb-2">☁️</p>
          <p className="text-slate-400 dark:text-slate-600 italic text-xs">
            Chưa có dữ liệu từ vựng.
          </p>
        </div>
      ) : (
        sortedWeeks.map(([week, items]) => (
          <div key={week} className="space-y-2">
            <div className="sticky top-[148px] z-20 flex items-center gap-2 py-3 bg-[#f8fafc] dark:bg-slate-950">
              <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm">
                {week}
              </span>
              <div className="h-[1px] flex-1 bg-slate-200/50 dark:bg-slate-800/50"></div>
            </div>

            <div className="space-y-3">
              {items.map((vocab, idx) => (
                <VocabCard key={idx} item={vocab} onClick={onSelectWord} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VocabListSection;
