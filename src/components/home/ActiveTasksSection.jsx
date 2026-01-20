import React from "react";
import UnifiedTaskCard from "../cards/UnifiedTaskCard";
import { getBaseCategory, CATEGORY_TYPES } from "../../utils/constants";

const ActiveTasksSection = ({
  activeTasks = [],
  topics = [],
  submissions = [],
  onOpenSkill,
  onViewTasks,
  onAddVocab,
}) => {
  if (activeTasks.length === 0) return null;

  const displayedTasks = activeTasks.slice(0, 3);
  const remainingCount = activeTasks.length - 3;

  const handleTaskClick = (task) => {
    const topic = topics.find((tp) => tp.topicId === task.topicId);
    const cat = topic?.category || "";
    const base = getBaseCategory(cat);

    if (base === CATEGORY_TYPES.VOCABULARY) {
      if (onAddVocab) onAddVocab(task);
      return;
    }

    if (base && Object.values(CATEGORY_TYPES).includes(base)) {
      if (onOpenSkill) onOpenSkill(base, task);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
          Nhiệm vụ trọng tâm
        </h3>
        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
          Tiến độ tuần
        </span>
      </div>
      <div className="space-y-2">
        {displayedTasks.map((task) => (
          <UnifiedTaskCard
            key={task.assignmentId}
            assignment={task}
            topics={topics}
            submission={submissions?.[task.assignmentId]}
            mode="personal"
            onClick={() => handleTaskClick(task)}
          />
        ))}

        {/* View More Button */}
        {remainingCount > 0 && (
          <button
            onClick={onViewTasks}
            className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-95 border border-slate-100 dark:border-slate-800/50"
          >
            <span>Xem thêm {remainingCount} nhiệm vụ khác</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveTasksSection;
