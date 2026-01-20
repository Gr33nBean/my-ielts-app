import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { getBaseCategory, CATEGORY_TYPES } from "../../utils/constants";
import RichContent from "../ui/RichContent";

const GrammarView = ({
  assignments = [],
  topics = [],
  submissions = {},
  onClose,
  selectedAssignment,
}) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const { callApi, loading } = useApi();

  // Tìm nhiệm vụ Grammar đang diễn ra
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
        getBaseCategory(topic?.category) === CATEGORY_TYPES.GRAMMAR
      );
    });

  const assignedTopic = topics.find(
    (tp) => tp.topicId === activeAssignment?.topicId,
  );

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await callApi("getGrammar");
      if (data) setPosts(data);
    };
    fetchPosts();
  }, [callApi]);

  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const existingSubmission = activeAssignment
    ? submissions[activeAssignment.assignmentId]
    : null;

  useEffect(() => {
    if (existingSubmission) {
      setNotes(existingSubmission.notes || "");
    }
  }, [existingSubmission]);

  const handleLevelUp = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return;

    setIsSubmitting(true);
    const result = await callApi("saveSubmission", {
      method: "POST",
      payload: {
        category: "Grammar",
        assignmentId: activeAssignment.assignmentId,
        email: user.email,
        data: { notes },
      },
    });
    setIsSubmitting(false);

    if (result?.success) {
      alert(result.message);
      onClose();
    }
  };

  if (loading && posts.length === 0)
    return (
      <div className="text-center py-10 animate-pulse text-xs font-bold text-slate-400 uppercase">
        Đang tải kiến thức...
      </div>
    );

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pb-10 px-1 animate-in slide-in-from-bottom duration-300">
      {/* 1. HIỂN THỊ BÀI HỌC ĐƯỢC GIAO (ƯU TIÊN) */}
      {assignedTopic && (
        <>
          <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/30 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-200 dark:bg-blue-800 w-6 h-6 rounded-lg flex items-center justify-center text-xs">
                ⚙️
              </span>
            </div>
            <h3 className="text-xl font-black text-blue-800 dark:text-blue-400 mb-3">
              {assignedTopic.topicName}
            </h3>
            <div className="mb-2">
              <RichContent content={assignedTopic.description} />
            </div>
          </div>

          <form onSubmit={handleLevelUp} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                Ghi chú / Thu hoạch
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Viết tóm tắt hoặc ví dụ bạn tự đặt..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-2xl p-4 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[120px] font-serif"
              />
            </div>
            <button
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
                isSubmitting
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white shadow-blue-100 dark:shadow-none"
              }`}
            >
              {isSubmitting
                ? "ĐANG LƯU..."
                : existingSubmission
                  ? "CẬP NHẬT GHI CHÚ"
                  : "HOÀN THÀNH NHIỆM VỤ"}
            </button>
          </form>
        </>
      )}

      <div className="flex items-center gap-2 px-1">
        <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Thư viện kiến thức
        </span>
        <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10 space-y-4">
          <p className="text-slate-400 dark:text-slate-500 italic text-xs">
            Chưa có bài viết bổ sung.
          </p>
          <button
            onClick={onClose}
            className="text-blue-600 font-bold text-xs uppercase tracking-widest"
          >
            Đóng
          </button>
        </div>
      ) : (
        posts.map((p, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase rounded-lg tracking-widest border border-slate-200 dark:border-slate-700">
              {p.category}
            </span>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mt-3 mb-3">
              {p.title}
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
              {p.content}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GrammarView;
