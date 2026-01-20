import React, { useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import ActiveTasksSection from "./home/ActiveTasksSection";
import ToolsSection from "./home/ToolsSection";
import VocabListSection from "./home/VocabListSection";

const HomeTab = ({
  onSelectWord,
  onOpenSkill,
  vocabs,
  loading,
  onRefresh,
  tasks = [],
  topics = [],
  submissions = [],
  onViewTasks,
  onAddVocab,
}) => {
  const { user } = useAuth();

  useEffect(() => {
    if (onRefresh) onRefresh({ silent: true });
  }, [onRefresh]);

  // Logic: Active Tasks Selection
  const activeTasks = useMemo(() => {
    if (!submissions || !user) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter user tasks first
    const myTasks = tasks.filter((t) =>
      (t.userEmail || "")
        .split(",")
        .map((e) => e.trim())
        .includes(user.email),
    );

    // Filter active and not submitted (except Vocabulary which allows multiple submissions)
    return myTasks.filter((t) => {
      const end = new Date(t.endDate);
      end.setHours(23, 59, 59, 999);
      const isSubmitted = !!submissions?.[t.assignmentId];

      const topic = topics.find((tp) => tp.topicId === t.topicId);
      const isVocab = (topic?.category || "").toLowerCase().includes("vocab");

      if (isVocab) return today <= end;

      return today <= end && !isSubmitted;
    });
  }, [tasks, submissions, user, topics]);

  if (loading && (vocabs.length === 0 || submissions === null)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Nhiệm vụ trọng tâm */}
      <ActiveTasksSection
        activeTasks={activeTasks}
        topics={topics}
        submissions={submissions}
        onOpenSkill={onOpenSkill}
        onViewTasks={onViewTasks}
        onAddVocab={onAddVocab}
      />

      {/* 2. Công cụ bổ trợ */}
      <ToolsSection onOpenSkill={onOpenSkill} />

      {/* 3. Danh sách từ vựng */}
      <VocabListSection
        vocabs={vocabs}
        currentUserEmail={user?.email}
        onSelectWord={onSelectWord}
      />
    </div>
  );
};

export default HomeTab;
