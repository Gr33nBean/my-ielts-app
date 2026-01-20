import React from "react";
import BaseCard from "../ui/BaseCard";
import { getCategoryConfig } from "../../utils/constants";

const AdminTopicCard = ({ topic, onDelete, onEdit }) => {
  const config = getCategoryConfig(topic.category);
  return (
    <BaseCard className="flex justify-between items-center py-4 px-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={`text-[9px] font-black px-2 py-0.5 rounded-lg border tracking-[0.1em] uppercase ${config.badge} ${config.border}`}
          >
            {topic.category || "N/A"}
          </span>
          <span className="text-[8px] text-slate-400 font-bold">
            ID: {topic.topicId}
          </span>
        </div>
        <h4 className="text-[14px] font-black text-slate-800 dark:text-slate-100 mb-1">
          {topic.topicName}
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
          {topic.description}
        </p>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit();
          }}
          className="w-9 h-9 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 transition-colors active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-9 h-9 flex items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 transition-colors active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </BaseCard>
  );
};

export default AdminTopicCard;
