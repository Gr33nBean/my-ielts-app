import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { getBaseCategory, CATEGORY_TYPES } from "../../utils/constants";
import RichContent from "../ui/RichContent";

const WritingView = ({
  assignments = [],
  topics = [],
  submissions = {},
  onSuccess,
  onClose,
  selectedAssignment,
}) => {
  const { user } = useAuth();
  const { callApi, loading } = useApi();
  const [essayContent, setEssayContent] = useState("");

  // Tìm nhiệm vụ Writing đang diễn ra
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
        getBaseCategory(topic?.category) === CATEGORY_TYPES.WRITING
      );
    });

  const currentSubmission = activeAssignment
    ? submissions[activeAssignment.assignmentId]
    : null;

  useEffect(() => {
    if (currentSubmission) {
      setEssayContent(currentSubmission.essayContent || "");
    }
  }, [currentSubmission]);

  const topic = topics.find((tp) => tp.topicId === activeAssignment?.topicId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return alert("Bạn không có nhiệm vụ Writing nào!");
    if (!essayContent) return alert("Vui lòng nhập bài viết!");

    const res = await callApi("saveSubmission", {
      method: "POST",
      payload: {
        category: "Writing",
        email: user.email,
        assignmentId: activeAssignment.assignmentId,
        data: {
          essayContent,
        },
      },
    });

    if (res?.success) {
      alert(res.message || "Nộp bài viết thành công!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } else if (res) {
      alert("Lỗi: " + res.message);
    }
  };

  if (!activeAssignment) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-4xl">✍️</p>
        <p className="text-sm text-slate-500 font-medium">
          Bạn chưa được giao nhiệm vụ Writing nào trong tuần này.
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

  const wordCount = essayContent.trim()
    ? essayContent.trim().split(/\s+/).length
    : 0;

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pb-10 px-1 animate-in slide-in-from-bottom duration-300">
      {/* Passage / Topic Material */}
      <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-200 dark:bg-blue-800 w-6 h-6 rounded-lg flex items-center justify-center text-xs">
            ✍️
          </span>
        </div>
        <h3 className="text-xl font-black text-blue-800 dark:text-blue-400 mb-3">
          {topic?.topicName}
        </h3>
        <div className="mb-2">
          <RichContent content={topic?.description} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-end ml-2 mr-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Nội dung bài viết
            </label>
            <span
              className={`text-[10px] font-black ${wordCount < 150 ? "text-amber-500" : "text-emerald-500"}`}
            >
              Số từ: {wordCount}
            </span>
          </div>
          <textarea
            required
            disabled={loading}
            value={essayContent}
            onChange={(e) => setEssayContent(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-5 rounded-3xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[300px] resize-none font-serif leading-relaxed disabled:opacity-50"
            placeholder="Viết bài làm của bạn tại đây..."
          />
        </div>

        <button
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 text-white shadow-blue-100 dark:shadow-none"}`}
        >
          {loading
            ? "Đang gửi..."
            : currentSubmission
              ? "Cập nhật bài viết"
              : "Xác nhận nộp bài"}
        </button>
      </form>
    </div>
  );
};

export default WritingView;
