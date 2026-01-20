import React, { useState, useEffect } from "react";
import UnifiedTaskCard from "./cards/UnifiedTaskCard";
import SubmissionDetailContent from "./SubmissionDetailContent";
import Modal from "./Modal";

const StatsTab = ({
  dashboard = [],
  activities = [],
  sharedSubmissions = {
    speaking: [],
    reading: [],
    writing: [],
    listening: [],
    grammar: [],
  },
  topics = [],
  users = [],
  loading,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState("speaking"); // 'speaking' | 'reading' | 'writing' | 'leaderboard'
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    if (onRefresh) onRefresh({ silent: true });
  }, [onRefresh]);

  const getDisplayName = (emailOrName) => {
    // If it's already a full name (not email), return it
    if (!emailOrName.includes("@")) return emailOrName;

    // Safety check if users is not available yet
    if (!users || users.length === 0) return emailOrName.split("@")[0];

    const found = users.find((u) => u.email === emailOrName);
    if (found) return found.fullName;

    // Manual fallback to match dataSafety behavior
    return `[${emailOrName.split("@")[0]}]`;
  };

  if (loading && dashboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">
          Đang tải tài liệu tham khảo...
        </p>
      </div>
    );
  }

  const subTabs = [
    { id: "speaking", label: "Speaking", icon: "🎙️" },
    { id: "reading", label: "Reading", icon: "📖" },
    { id: "listening", label: "Listening", icon: "🎧" },
    { id: "writing", label: "Writing", icon: "✍️" },
    { id: "grammar", label: "Grammar", icon: "⚙️" },
    { id: "leaderboard", label: "Bảng điểm", icon: "🏆" },
  ];

  const currentList = sharedSubmissions[activeSubTab] || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Sub-tabs */}
      <div className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-black text-slate-800 dark:text-white">
            Góc tham khảo
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Học hỏi từ bài nộp của các thành viên khác
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border ${
                activeSubTab === tab.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none"
                  : "bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-400 active:scale-95"
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering */}
      <div className="space-y-4">
        {activeSubTab === "leaderboard" ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-50 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                Top thành viên tích cực
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-slate-400 dark:text-slate-500 uppercase font-black border-b border-slate-50 dark:border-slate-800">
                    <th className="pb-3 font-black">Thành viên</th>
                    <th className="pb-3 text-center font-black">Từ vựng</th>
                    <th className="pb-3 text-right font-black">Nhiệm vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {dashboard.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-4 text-xs font-bold text-slate-700 dark:text-slate-200">
                        {getDisplayName(item.name || item.userEmail)}
                      </td>
                      <td className="py-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black ${item.vocab >= 7 ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"}`}
                        >
                          {item.vocab}/7
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-lg">
                          {item.total}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {currentList.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-4xl mb-3">🍃</p>
                <p className="text-slate-400 dark:text-slate-500 italic text-xs">
                  Phần này chưa có bài nộp nào để tham khảo.
                </p>
              </div>
            ) : (
              currentList.map((submission) => (
                <UnifiedTaskCard
                  key={submission.submissionId}
                  mode="view_submission"
                  // Mock assignment object since we only view submissions here
                  assignment={{
                    assignmentId: submission.assignmentId,
                    topicId: submission.topicId,
                    startDate: submission.createdAt,
                    endDate: submission.createdAt,
                  }}
                  topics={topics}
                  submission={submission}
                  onClick={() => setSelectedSubmission(submission)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      <Modal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        title={`Bài nộp của ${selectedSubmission?.userName || "Thành viên"}`}
        titleClassName={
          activeSubTab === "speaking"
            ? "text-orange-600 dark:text-orange-500"
            : activeSubTab === "reading"
              ? "text-emerald-600 dark:text-emerald-500"
              : activeSubTab === "listening"
                ? "text-purple-600 dark:text-purple-500"
                : activeSubTab === "writing" || activeSubTab === "grammar"
                  ? "text-blue-600 dark:text-blue-500"
                  : ""
        }
        size="lg"
      >
        {selectedSubmission && (
          <SubmissionDetailContent
            submission={selectedSubmission}
            type={activeSubTab}
            topics={topics}
          />
        )}
      </Modal>
    </div>
  );
};

export default StatsTab;
