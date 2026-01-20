import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { getBaseCategory, CATEGORY_TYPES } from "../../utils/constants";
import RichContent from "../ui/RichContent";

const SpeakingView = ({
  onClose,
  assignments = [],
  topics = [],
  submissions = {},
  onSuccess,
  selectedAssignment,
}) => {
  const { user } = useAuth();
  const { callApi, loading } = useApi();
  const [audioLink, setAudioLink] = useState("");
  const [transcript, setTranscript] = useState("");

  // Tìm nhiệm vụ Speaking đang diễn ra
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
        getBaseCategory(topic?.category) === CATEGORY_TYPES.SPEAKING
      );
    });

  const currentSubmission = activeAssignment
    ? submissions[activeAssignment.assignmentId]
    : null;

  useEffect(() => {
    if (currentSubmission) {
      setAudioLink(currentSubmission.audioLink || "");
      setTranscript(currentSubmission.transcript || "");
    }
  }, [currentSubmission]);

  const topic = topics.find((tp) => tp.topicId === activeAssignment?.topicId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeAssignment)
      return alert("Bạn không có nhiệm vụ Speaking nào đang diễn ra!");
    if (!audioLink) return alert("Vui lòng dán link bài nói!");

    const res = await callApi("saveSubmission", {
      method: "POST",
      payload: {
        category: "Speaking",
        email: user.email,
        assignmentId: activeAssignment.assignmentId,
        data: {
          audioLink,
          transcript,
        },
      },
    });

    if (res?.success) {
      alert(res.message || "Nộp bài thành công!");
      if (onSuccess) onSuccess();
      onClose();
    } else if (res) {
      alert("Lỗi: " + res.message);
    }
  };

  if (!activeAssignment) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-4xl">😴</p>
        <p className="text-sm text-slate-500 font-medium">
          Bạn chưa có nhiệm vụ Speaking nào được giao trong tuần này.
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
    <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
      {/* Thông tin chủ đề */}
      <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-3xl border border-orange-100 dark:border-orange-800/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-orange-200 dark:bg-orange-800 w-6 h-6 rounded-lg flex items-center justify-center text-xs">
            🎙️
          </span>
        </div>
        <h3 className="text-xl font-black text-orange-800 dark:text-orange-400 mb-3">
          {topic?.topicName}
        </h3>
        <div className="mb-4">
          <RichContent content={topic?.description} />
        </div>

        {activeAssignment.userEmail && (
          <div className="pt-4 border-t border-orange-100 dark:border-orange-800/30">
            <p className="text-[9px] font-black text-orange-500 uppercase mb-2">
              Nhóm cùng tiến (Partners)
            </p>
            <div className="flex flex-wrap gap-2">
              {activeAssignment.userEmail
                .split(",")
                .map((e) => e.trim())
                .filter((e) => e !== user.email)
                .map((email) => (
                  <span
                    key={email}
                    className="px-2 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-sm border border-orange-50 dark:border-orange-800"
                  >
                    {email.split("@")[0]}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            Link bài ghi âm (Drive/Cloud)
          </label>
          <input
            required
            disabled={loading}
            value={audioLink}
            onChange={(e) => setAudioLink(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-xs dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
            placeholder="Dán link folder hoặc file ghi âm tại đây..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            Bản gỡ băng / Transcript (Tùy chọn)
          </label>
          <textarea
            disabled={loading}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-xs dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px] resize-none disabled:opacity-50"
            placeholder="Bạn có thể dán nội dung đã nói vào đây để lưu trữ..."
          />
        </div>

        <button
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 text-white shadow-blue-100 dark:shadow-none"}`}
        >
          {loading
            ? "Đang gửi..."
            : currentSubmission
              ? "Cập nhật bài nộp"
              : "Xác nhận nộp bài"}
        </button>
      </form>
    </div>
  );
};

export default SpeakingView;
