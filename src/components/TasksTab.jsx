import React, { useState } from "react";
import UnifiedTaskCard from "./cards/UnifiedTaskCard";
import WeekFilter from "./ui/WeekFilter";
import { useAuth } from "../context/AuthContext";
import {
  getWeekLabel,
  getAvailableWeeks,
  groupItemsByWeek,
} from "../utils/dateUtils";
import {
  TASK_STATUS,
  TASK_LABELS,
  getBaseCategory,
  CATEGORY_TYPES,
} from "../utils/constants";

const TasksTab = ({
  tasks = [],
  topics = [],
  submissions = [],
  onOpenSkill,
  loading,
  onAddVocab,
}) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState(TASK_STATUS.PENDING);
  const [selectedWeek, setSelectedWeek] = useState("all");

  const userTasks = tasks.filter((t) =>
    (t.userEmail || "")
      .split(",")
      .map((e) => e.trim())
      .includes(user.email),
  );

  const availableWeeks = getAvailableWeeks(userTasks, "startDate");

  const taskList =
    submissions === null
      ? []
      : userTasks
          .filter((t) => {
            const isSubmitted = !!submissions?.[t.assignmentId];
            const topic = topics.find((tp) => tp.topicId === t.topicId);
            const isVocab = (topic?.category || "")
              .toLowerCase()
              .includes("vocab");
            const notExpired =
              new Date(t.endDate) >= new Date().setHours(0, 0, 0, 0);

            const matchesFilter =
              filter === TASK_STATUS.PENDING
                ? !isSubmitted || (isVocab && notExpired)
                : filter === TASK_STATUS.COMPLETED
                  ? isSubmitted
                  : true;
            const matchesWeek =
              selectedWeek === "all"
                ? true
                : getWeekLabel(t.startDate) === selectedWeek;
            return matchesFilter && matchesWeek;
          })
          .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

  const groupedTasks = groupItemsByWeek(taskList, "startDate");

  if (loading && (tasks.length === 0 || submissions === null)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
          Đang tải nhiệm vụ...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Tab Header & Filter & Task List */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-800 dark:text-white px-1">
          Lộ trình học tập
        </h2>

        <div className="sticky top-[68px] z-30 bg-[#f8fafc] dark:bg-slate-950 -mx-4 px-4 pt-1 pb-2 space-y-2 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex gap-2 p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl">
            {[TASK_STATUS.PENDING, TASK_STATUS.COMPLETED, TASK_STATUS.ALL].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filter === t ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400"}`}
                >
                  {TASK_LABELS[t]}
                </button>
              ),
            )}
          </div>
          <WeekFilter
            availableWeeks={availableWeeks}
            selectedWeek={selectedWeek}
            onSelectWeek={setSelectedWeek}
          />
        </div>

        <div className="space-y-6 pt-2">
          {Object.keys(groupedTasks).length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-300 dark:text-slate-700 text-4xl mb-2">
                🎈
              </p>
              <p className="text-slate-400 dark:text-slate-600 italic text-xs">
                Không có nhiệm vụ nào trong mục này.
              </p>
            </div>
          ) : (
            Object.entries(groupedTasks)
              .sort(([weekA], [weekB]) => weekB.localeCompare(weekA))
              .map(([week, weekTasks]) => (
                <div key={week} className="space-y-3">
                  <div className="sticky top-[148px] z-20 flex items-center gap-2 py-3 bg-[#f8fafc] dark:bg-slate-950">
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm">
                      {week}
                    </span>
                    <div className="h-[1px] flex-1 bg-slate-200/50 dark:bg-slate-800/50"></div>
                  </div>

                  <div className="space-y-2">
                    {weekTasks.map((task) => (
                      <UnifiedTaskCard
                        key={task.assignmentId}
                        assignment={task}
                        topics={topics}
                        submission={submissions?.[task.assignmentId]}
                        mode="personal"
                        onClick={() => {
                          const topic = topics.find(
                            (tp) => tp.topicId === task.topicId,
                          );
                          const category = topic?.category || "";
                          const base = getBaseCategory(category);

                          if (base === CATEGORY_TYPES.VOCABULARY) {
                            if (onAddVocab) onAddVocab(task);
                          } else if (
                            base &&
                            Object.values(CATEGORY_TYPES).includes(base)
                          ) {
                            if (onOpenSkill) onOpenSkill(base, task);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksTab;
