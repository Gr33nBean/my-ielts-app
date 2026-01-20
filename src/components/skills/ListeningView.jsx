import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { getBaseCategory, CATEGORY_TYPES } from "../../utils/constants";
import RichContent from "../ui/RichContent";

const ListeningView = ({
  assignments = [],
  topics = [],
  submissions = {},
  onClose,
  onSuccess,
  selectedAssignment,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { callApi } = useApi();
  const [formData, setFormData] = useState({
    translatedText: "",
    vocabList: "",
  });

  // Tìm nhiệm vụ Listening đang diễn ra
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
      return (
        today >= start &&
        today <= end &&
        getBaseCategory(topic?.category) === CATEGORY_TYPES.LISTENING
      );
    });

  const assignedTopic = topics.find(
    (tp) => tp.topicId === activeAssignment?.topicId,
  );
  const existingSubmission = activeAssignment
    ? submissions[activeAssignment.assignmentId]
    : null;

  // Sync existing data if any
  React.useEffect(() => {
    if (existingSubmission) {
      setFormData({
        translatedText: existingSubmission.translatedText || "",
        vocabList: existingSubmission.vocabList || "",
      });
    }
  }, [existingSubmission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return;

    setLoading(true);
    const result = await callApi("saveSubmission", {
      method: "POST",
      payload: {
        category: "Listening",
        assignmentId: activeAssignment.assignmentId,
        email: user.email,
        data: formData,
      },
    });
    setLoading(false);

    if (result?.success) {
      alert(result.message);
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  if (!activeAssignment) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-slate-400 dark:text-slate-500 italic text-xs">
          Hiện tại không có nhiệm vụ Listening nào được giao.
        </p>
        <button
          onClick={onClose}
          className="text-blue-600 font-bold text-xs uppercase tracking-widest"
        >
          Đóng
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in slide-in-from-bottom duration-300"
    >
      {/* 1. Topic Info */}
      <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-3xl border border-purple-100 dark:border-purple-800/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-purple-200 dark:bg-purple-800 w-6 h-6 rounded-lg flex items-center justify-center text-xs">
            🎧
          </span>
        </div>
        <h3 className="text-xl font-black text-purple-800 dark:text-purple-400 mb-3">
          {assignedTopic?.topicName}
        </h3>
        <RichContent content={assignedTopic?.description} />
      </div>

      {/* 2. Translation Content */}
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">
            Bản dịch Reference (Tiếng Việt)
          </label>
          <textarea
            required
            disabled={loading}
            value={formData.translatedText}
            onChange={(e) =>
              setFormData({ ...formData, translatedText: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-5 rounded-[24px] text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[150px] resize-none"
            placeholder="Dịch lại nội dung bài nghe để nắm vững cấu trúc..."
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">
            Từ vựng quan trọng
          </label>
          <textarea
            disabled={loading}
            value={formData.vocabList}
            onChange={(e) =>
              setFormData({ ...formData, vocabList: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-5 rounded-[24px] text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px] resize-none"
            placeholder="Liệt kê 1-3 cấu trúc hay học được..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
          loading
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-emerald-600 text-white shadow-emerald-100 dark:shadow-none"
        }`}
      >
        {loading
          ? "Đang lưu..."
          : existingSubmission
            ? "Cập nhật bài làm"
            : "Nộp bài làm"}
      </button>
    </form>
  );
};

export default ListeningView;
