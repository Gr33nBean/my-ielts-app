import React from "react";
import SkillCard from "../cards/SkillCard";

const ToolsSection = ({ onOpenSkill }) => {
  return (
    <div className="space-y-3 px-1">
      <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
        Công cụ bổ trợ
      </h3>
      <div className="flex gap-3">
        <SkillCard
          title="Ngữ pháp"
          subtitle="Hỗ trợ"
          icon="✍️"
          colorClass="blue"
          onClick={() => onOpenSkill("grammar")}
          className="flex-1"
        />
        <SkillCard
          title="Tra ví dụ"
          subtitle="Hỗ trợ"
          icon="🔍"
          colorClass="purple"
          onClick={() => window.open("https://tatoeba.org/", "_blank")}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default ToolsSection;
