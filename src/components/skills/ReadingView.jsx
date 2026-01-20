import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { getBaseCategory, CATEGORY_TYPES } from "../../utils/constants";
import RichContent from "../ui/RichContent";

const ReadingView = ({
  assignments = [],
  topics = [],
  submissions = {},
  onSuccess,
  onClose,
  selectedAssignment,
}) => {
  const { user } = useAuth();
  const { callApi, loading } = useApi();
  const [translatedText, setTranslatedText] = useState("");
  const [vocabList, setVocabList] = useState("");

  // Tìm nhiệm vụ Reading đang diễn ra
  const activeAssignment =
    selectedAssignment ||
    assignments.find((as) => {
      const assignedEmails = (as.userEmail || "")
        .split(",")
        .map((e) => e.trim());
      if (!assignedEmails.includes(user.email)) return false;
      const today = new Date();
      const start = new Date(as.startDate);
      const end = new Date(as.endDate);
      end.setHours(23, 59, 59, 999);

      const topic = topics.find((tp) => tp.topicId === as.topicId);
      // Skip if topic was deleted
      if (!topic) return false;

      return (
        today >= start &&
        today <= end &&
        getBaseCategory(topic.category) === CATEGORY_TYPES.READING
      );
    });

  const currentSubmission = activeAssignment
    ? submissions[activeAssignment.assignmentId]
    : null;

  useEffect(() => {
    if (currentSubmission) {
      setTranslatedText(currentSubmission.translatedText || "");
      setVocabList(currentSubmission.vocabList || "");
    }
  }, [currentSubmission]);

  const topic = topics.find((tp) => tp.topicId === activeAssignment?.topicId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return alert("Bạn không có nhiệm vụ Reading nào!");
    if (!translatedText) return alert("Vui lòng nhập bản dịch!");

    const res = await callApi("saveSubmission", {
      method: "POST",
      payload: {
        category: "Reading",
        email: user.email,
        assignmentId: activeAssignment.assignmentId,
        data: {
          translatedText,
          vocabList,
        },
      },
    });

    if (res?.success) {
      alert(res.message || "Nộp bài thành công!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } else if (res) {
      alert("Lỗi: " + res.message);
    }
  };

  if (!activeAssignment) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-4xl">📚</p>
        <p className="text-sm text-slate-500 font-medium">
          Bạn chưa được giao nhiệm vụ Reading nào trong tuần này.
        </p>
        <button
          onClick={onClose}
          className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-2"
        >
          Đóng
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pb-10 px-1 animate-in slide-in-from-bottom duration-300">
      {/* Passage / Description */}
      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
        <h3 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="bg-emerald-200 dark:bg-emerald-800 w-6 h-6 rounded-lg flex items-center justify-center text-xs">
            📖
          </span>
          {topic?.topicName}
        </h3>
        <div className="mb-2">
          <RichContent content={topic?.description} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            Bản dịch của bạn
          </label>
          <textarea
            required
            disabled={loading}
            value={translatedText}
            onChange={(e) => setTranslatedText(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-xs dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-h-[160px] resize-none disabled:opacity-50"
            placeholder="Nhập nội dung bạn đã dịch tại đây..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            Từ vựng quan trọng rút ra (Tùy chọn)
          </label>
          <textarea
            disabled={loading}
            value={vocabList}
            onChange={(e) => setVocabList(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-xs dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-h-[80px] resize-none disabled:opacity-50"
            placeholder="Liệt kê các từ mới bạn học được từ bài này..."
          />
        </div>

        <button
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 text-white shadow-emerald-100 dark:shadow-none"}`}
        >
          {loading
            ? "Đang gửi..."
            : currentSubmission
              ? "Cập nhật bản dịch"
              : "Hoàn thành bài dịch"}
        </button>
      </form>
    </div>
  );
};

export default ReadingView;
