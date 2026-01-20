import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useVocab } from "../hooks/useVocab";
import { useStats } from "../hooks/useStats";
import { useUserTasks } from "../hooks/useUserTasks";
import { useTheme } from "../hooks/useTheme";
import { useIPAControl } from "../hooks/useIPAControl";
import { USER_ROLES } from "../utils/constants";

import Header from "./layout/Header";
import BottomNav from "./layout/BottomNav";
import HomeTab from "./HomeTab";
import StatsTab from "./StatsTab";
import TasksTab from "./TasksTab";
import AdminTab from "./AdminTab";
import Modal from "./Modal";
import FormModal from "./FormModal";
import VocabForm from "./VocabForm";
import VocabDetail from "./VocabDetail";
import IPAKeyboard from "./IPAKeyboard";

// Skill Views
import UnifiedSkillView from "./skills/UnifiedSkillView";

const Dashboard = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showIPA, openIPA, closeIPA, handleInsertIPA, handleBackspace } =
    useIPAControl();

  const { vocabs, loading: vocabLoading, fetchVocab, addVocab } = useVocab();
  const {
    dashboard,
    activities,
    sharedSubmissions,
    users,
    loading: statsLoading,
    refresh: refreshStats,
  } = useStats();
  const {
    tasks,
    topics,
    submissions,
    loading: tasksLoading,
    fetchTasks,
  } = useUserTasks();

  const [activeTab, setActiveTab] = useState("home");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [activeSkill, setActiveSkill] = useState(null);
  const [selectedTaskForSkill, setSelectedTaskForSkill] = useState(null);
  const [selectedTaskForVocab, setSelectedTaskForVocab] = useState(null);

  const handleOpenSkill = (skill, task = null) => {
    setActiveSkill(skill);
    setSelectedTaskForSkill(task);
  };

  const handleAddVocab = (task = null) => {
    setSelectedTaskForVocab(task);
    setShowAddForm(true);
  };

  const handleCloseSkill = () => {
    setActiveSkill(null);
    setSelectedTaskForSkill(null);
  };

  // Initial Fetch
  useEffect(() => {
    fetchVocab({ silent: false });
    refreshStats({ silent: false });
    fetchTasks({ silent: false });
  }, [fetchVocab, refreshStats, fetchTasks]);

  const handleRefreshAll = useCallback(
    (opts) => {
      fetchVocab(opts);
      fetchTasks(opts);
    },
    [fetchVocab, fetchTasks],
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeTab
            onSelectWord={setSelectedWord}
            onOpenSkill={handleOpenSkill}
            onAddVocab={handleAddVocab}
            vocabs={vocabs}
            loading={vocabLoading || tasksLoading}
            onRefresh={handleRefreshAll}
            tasks={tasks}
            topics={topics}
            submissions={submissions}
            onViewTasks={() => setActiveTab("tasks")}
          />
        );
      case "stats":
        return (
          <StatsTab
            dashboard={dashboard}
            activities={activities}
            sharedSubmissions={sharedSubmissions}
            topics={topics}
            users={users}
            loading={statsLoading}
            onRefresh={refreshStats}
          />
        );
      case "tasks":
        return (
          <TasksTab
            tasks={tasks}
            topics={topics}
            submissions={submissions}
            onOpenSkill={handleOpenSkill}
            onAddVocab={handleAddVocab}
            loading={tasksLoading}
            onRefresh={handleRefreshAll}
          />
        );
      case "admin":
        return (
          <AdminTab
            sharedSubmissions={sharedSubmissions}
            refreshStats={refreshStats}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen pb-28 px-4 bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 relative">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onAddClick={() => setShowAddForm(true)}
      />

      <main className="tab-content">{renderTabContent()}</main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={user?.role === USER_ROLES.ADMIN}
      />

      <Modal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setSelectedTaskForVocab(null);
        }}
        title="Thêm từ mới"
      >
        <VocabForm
          onOpenIPA={openIPA}
          onClose={() => {
            setShowAddForm(false);
            setSelectedTaskForVocab(null);
          }}
          addVocab={addVocab}
          onSuccess={() => fetchVocab({ silent: true })}
          tasks={tasks}
          topics={topics}
          initialAssignmentId={selectedTaskForVocab?.assignmentId}
        />
      </Modal>

      <Modal
        isOpen={!!selectedWord}
        onClose={() => setSelectedWord(null)}
        title="Chi tiết từ vựng"
      >
        {selectedWord && <VocabDetail item={selectedWord} />}
      </Modal>

      <Modal
        isOpen={!!activeSkill}
        onClose={handleCloseSkill}
        title={
          activeSkill === "speaking"
            ? "Luyện Nói (7 từ/tuần)"
            : activeSkill === "reading"
              ? "Luyện Đọc & Dịch"
              : activeSkill === "writing"
                ? "Luyện Viết (Writing)"
                : activeSkill === "listening"
                  ? "Luyện Nghe (Listening)"
                  : "Ngữ Pháp"
        }
        titleClassName={
          activeSkill === "speaking"
            ? "text-orange-600 dark:text-orange-500"
            : activeSkill === "reading"
              ? "text-emerald-600 dark:text-emerald-500"
              : activeSkill === "listening"
                ? "text-purple-600 dark:text-purple-500"
                : activeSkill === "writing" || activeSkill === "grammar"
                  ? "text-blue-600 dark:text-blue-500"
                  : ""
        }
      >
        {activeSkill && (
          <UnifiedSkillView
            skill={activeSkill}
            assignments={tasks}
            topics={topics}
            submissions={submissions}
            selectedAssignment={selectedTaskForSkill}
            onClose={handleCloseSkill}
            onSuccess={() => fetchTasks({ silent: true })}
          />
        )}
      </Modal>

      <IPAKeyboard
        isOpen={showIPA}
        onInsert={handleInsertIPA}
        onBackspace={handleBackspace}
        onClose={closeIPA}
      />
    </div>
  );
};

export default Dashboard;
