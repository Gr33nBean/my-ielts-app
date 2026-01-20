import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { getBaseCategory, CATEGORY_TYPES } from "../../utils/constants";
import RichContent from "../ui/RichContent";

const SKILL_CONFIG = {
  speaking: {
    color: "orange",
    icon: "🎙️",
    label: "Chủ đề Speaking",
    categoryType: CATEGORY_TYPES.SPEAKING,
    apiCategory: "Speaking",
  },
  reading: {
    color: "emerald",
    icon: "📖",
    label: "Chủ đề Reading",
    categoryType: CATEGORY_TYPES.READING,
    apiCategory: "Reading",
  },
  listening: {
    color: "purple",
    icon: "🎧",
    label: "Chủ đề Listening",
    categoryType: CATEGORY_TYPES.LISTENING,
    apiCategory: "Listening",
  },
  writing: {
    color: "blue",
    icon: "✍️",
    label: "Chủ đề Writing",
    categoryType: CATEGORY_TYPES.WRITING,
    apiCategory: "Writing",
  },
  grammar: {
    color: "blue",
    icon: "⚙️",
    label: "Chủ đề Grammar",
    categoryType: CATEGORY_TYPES.GRAMMAR,
    apiCategory: "Grammar",
  },
};

const UnifiedSkillView = ({
  skill, // "speaking", "reading", "writing", "listening", "grammar"
  assignments = [],
  topics = [],
  submissions = {},
  onSuccess,
  onClose,
  selectedAssignment,
}) => {
  const { user } = useAuth();
  const { callApi, loading } = useApi();
  const config = SKILL_CONFIG[skill] || SKILL_CONFIG.speaking;

  const [formData, setFormData] = useState({
    audioLink: "",
    transcript: "",
    translatedText: "",
    vocabList: "",
    essayContent: "",
    notes: "",
  });

  // Find active assignment
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
        getBaseCategory(topic?.category) === config.categoryType
      );
    });

  const currentSubmission = activeAssignment
    ? submissions[activeAssignment.assignmentId]
    : null;

  useEffect(() => {
    if (currentSubmission) {
      setFormData({
        audioLink: currentSubmission.audioLink || "",
        transcript: currentSubmission.transcript || "",
        translatedText: currentSubmission.translatedText || "",
        vocabList: currentSubmission.vocabList || "",
        essayContent: currentSubmission.essayContent || "",
        notes: currentSubmission.notes || "",
      });
    } else {
      // Reset form if no submission (or switching skills)
      setFormData({
        audioLink: "",
        transcript: "",
        translatedText: "",
        vocabList: "",
        essayContent: "",
        notes: "",
      });
    }
  }, [currentSubmission, skill]);

  const topic = topics.find((tp) => tp.topicId === activeAssignment?.topicId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return alert("Bạn không có nhiệm vụ nào!");

    // Validation
    if (skill === "speaking" && !formData.audioLink)
      return alert("Vui lòng nhập link bài nói!");
    if (skill === "writing" && !formData.essayContent)
      return alert("Vui lòng nhập bài viết!");
    if (
      (skill === "reading" || skill === "listening") &&
      (!formData.translatedText || !formData.vocabList)
    )
      return alert("Vui lòng nhập đầy đủ bản dịch/thu hoạch và từ vựng!");
    if (skill === "grammar" && !formData.notes)
      return alert("Vui lòng nhập ghi chú!");

    // Prepare payload data based on skill
    let submissionData = {};
    if (skill === "speaking") {
      submissionData = {
        audioLink: formData.audioLink,
        transcript: formData.transcript,
      };
    } else if (skill === "reading" || skill === "listening") {
      submissionData = {
        translatedText: formData.translatedText,
        vocabList: formData.vocabList,
      };
    } else if (skill === "writing") {
      submissionData = {
        essayContent: formData.essayContent,
      };
    } else if (skill === "grammar") {
      submissionData = {
        notes: formData.notes,
      };
    }

    const res = await callApi("saveSubmission", {
      method: "POST",
      payload: {
        category: config.apiCategory,
        email: user.email,
        assignmentId: activeAssignment.assignmentId,
        data: submissionData,
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper for rendering input fields
  const renderTextarea = (
    field,
    label,
    placeholder,
    minHeight = "120px",
    required = true,
  ) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
        {label}
      </label>
      <textarea
        required={required}
        disabled={loading}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-xs dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none font-serif leading-relaxed disabled:opacity-50"
        style={{ minHeight }}
        placeholder={placeholder}
      />
    </div>
  );

  if (!activeAssignment) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-4xl">{config.icon}</p>
        <p className="text-sm text-slate-500 font-medium">
          Bạn chưa được giao nhiệm vụ {config.apiCategory} nào trong tuần này.
        </p>
        <button
          onClick={onClose}
          className={`text-${config.color}-600 font-bold text-xs uppercase tracking-widest mt-2 hover:underline`}
        >
          Đóng
        </button>
      </div>
    );
  }

  // Define theme colors for dynamic styles
  // Cannot use dynamic `bg-${color}-50` safely in Tailwind unless safelisted,
  // but let's assume standard colors are safe or map them explicitly if needed.
  // Explicit mapping for safety:
  const themeStyles = {
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-100 dark:border-orange-800/30",
      icon: "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200",
      title: "text-orange-800 dark:text-orange-400",
      btn: "bg-blue-600", // Unified button color? Or skill specific? Let's use Blue as primary action.
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/10",
      border: "border-emerald-100 dark:border-emerald-800/30",
      icon: "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200",
      title: "text-emerald-800 dark:text-emerald-400",
      btn: "bg-blue-600",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/10",
      border: "border-purple-100 dark:border-purple-800/30",
      icon: "bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200",
      title: "text-purple-800 dark:text-purple-400",
      btn: "bg-blue-600",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/10",
      border: "border-blue-100 dark:border-blue-800/30",
      icon: "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200",
      title: "text-blue-800 dark:text-blue-400",
      btn: "bg-blue-600",
    },
  };

  const theme = themeStyles[config.color] || themeStyles.orange;

  // Word count for writing
  const wordCount = formData.essayContent.trim()
    ? formData.essayContent.trim().split(/\s+/).length
    : 0;

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pb-10 px-1 animate-in slide-in-from-bottom duration-300">
      {/* 1. Topic Block */}
      <div className={`p-5 rounded-3xl border ${theme.bg} ${theme.border}`}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${theme.icon}`}
          >
            {config.icon}
          </span>
        </div>
        <h3 className={`text-xl font-black mb-3 ${theme.title}`}>
          {topic?.topicName}
        </h3>
        <div className="mb-2">
          <RichContent content={topic?.description} />
        </div>

        {/* Partners Logic for Speaking */}
        {skill === "speaking" && activeAssignment.userEmail && (
          <div className="pt-4 border-t border-orange-100 dark:border-orange-800/30 mt-4">
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

      {/* 2. Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {skill === "speaking" && (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
                Link bài ghi âm (Drive/Cloud)
              </label>
              <input
                required
                disabled={loading}
                value={formData.audioLink}
                onChange={(e) => handleInputChange("audioLink", e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-xs dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                placeholder="Dán link folder hoặc file ghi âm tại đây..."
              />
            </div>
            {renderTextarea(
              "transcript",
              "Bản gỡ băng / Transcript (Tùy chọn)",
              "Bạn có thể dán nội dung đã nói vào đây...",
              "120px",
              false,
            )}
          </>
        )}

        {(skill === "reading" || skill === "listening") && (
          <>
            {renderTextarea(
              "translatedText",
              `Bản dịch / Thu hoạch ${skill === "reading" ? "đọc" : "nghe"}`,
              "Nhập bản dịch hoặc nội dung tóm tắt...",
              "200px",
            )}
            {renderTextarea(
              "vocabList",
              skill === "reading" ? "Từ vựng quan trọng" : "Cấu trúc hay",
              "Liệt kê từ mới, cấu trúc hay...",
              "100px",
            )}
          </>
        )}

        {skill === "writing" && (
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
              value={formData.essayContent}
              onChange={(e) =>
                handleInputChange("essayContent", e.target.value)
              }
              className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-5 rounded-3xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[300px] resize-none font-serif leading-relaxed disabled:opacity-50"
              placeholder="Viết bài làm của bạn tại đây..."
            />
          </div>
        )}

        {skill === "grammar" &&
          renderTextarea(
            "notes",
            "Ghi chú / Thu hoạch",
            "Viết tóm tắt hoặc ví dụ bạn tự đặt...",
            "150px",
          )}

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

export default UnifiedSkillView;
