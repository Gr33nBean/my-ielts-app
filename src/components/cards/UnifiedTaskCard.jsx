import React from "react";
import BaseCard from "../ui/BaseCard";
import { useAuth } from "../../context/AuthContext";
import { getCategoryConfig } from "../../utils/constants";
import { getSafeTopic, getSafeUser } from "../../utils/dataSafety";

const UnifiedTaskCard = ({
  // Core Data
  assignment, // The assignment object (required)
  topic: providedTopic, // Optional topic object if already resolved
  topics = [], // List of topics for resolution if providedTopic is missing
  submission, // Optional submission object (for view mode or status check)
  allSubmissions, // Optional: all submissions (for admin stats)

  // Mode Configuration
  mode = "personal", // 'personal' | 'admin' | 'view_submission'

  // Actions
  onClick,
  onAdminDelete, // Admin only
  onAdminEdit, // Admin only

  // Context Data
  users = [], // For Admin mode user resolution
}) => {
  const { user: currentUser } = useAuth();

  // 1. Resolve Data ==========================================================
  const topic = providedTopic || getSafeTopic(topics, assignment?.topicId);
  const category = topic.category || "Unknown";
  const config = getCategoryConfig(category);

  // 2. Computed Properties based on Mode =====================================

  // PERSONAL MODE Logic
  const isPersonalParams = () => {
    if (mode !== "personal") return {};

    // Check submission status if submission prop is passed, or look up in allSubmissions if needed
    // Assuming 'submission' prop is the user's submission if provided
    const isSubmitted =
      !!submission ||
      (allSubmissions && !!allSubmissions[assignment.assignmentId]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(assignment.endDate);
    end.setHours(23, 59, 59, 999);
    const isExpired = today > end;

    return { isSubmitted, isExpired };
  };

  // ADMIN MODE Logic
  const getAdminParams = () => {
    if (mode !== "admin") return {};

    const assignedEmails = (assignment.userEmail || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    // Count submissions if allSubmissions is provided (as a map or array)
    // Assuming allSubmissions is a map { assignmentId_email: sub, ... } or similar
    // We'll rely on parent to pass processed data or simple counts if possible,
    // but here let's assume allSubmissions is the big map 'submissionTracker' from AdminTab
    let count = 0;
    if (allSubmissions) {
      count = assignedEmails.filter(
        (e) => !!allSubmissions[`${assignment.assignmentId}_${e}`],
      ).length;
    }

    return { assignedEmails, submissionCount: count };
  };

  // VIEW SUBMISSION MODE Logic (Stats Tab)
  const getViewParams = () => {
    if (mode !== "view_submission") return {};
    return {
      submitterName: submission?.userName || submission?.userEmail || "Unknown",
      submitterEmail: submission?.userEmail,
      submittedAt: submission?.createdAt,
    };
  };

  // Execute Logic based on mode
  const { isSubmitted, isExpired } = isPersonalParams();
  const { assignedEmails, submissionCount } = getAdminParams();
  const { submitterName, submitterEmail, submittedAt } = getViewParams();

  // 3. Render Helpers ========================================================

  const renderStatusBadge = () => {
    if (mode === "personal") {
      if (isSubmitted) {
        return (
          <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-black uppercase">
            ✓ Đã nộp bài
          </span>
        );
      }
      if (isExpired) {
        return (
          <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-black uppercase">
            Hết hạn
          </span>
        );
      }
      return (
        <span className="text-[8px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-black uppercase">
          Đang học
        </span>
      );
    }

    if (mode === "admin") {
      const isFull =
        assignedEmails && submissionCount === assignedEmails.length;
      return (
        <span
          className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase ${
            isFull
              ? "bg-emerald-100 text-emerald-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {submissionCount}/{assignedEmails?.length || 0} nộp bài
        </span>
      );
    }

    if (mode === "view_submission") {
      return (
        <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full font-black uppercase">
          {new Date(submittedAt).toLocaleDateString("vi-VN")}
        </span>
      );
    }

    return null;
  };

  const getCardBorderClass = () => {
    if (onClick)
      return "cursor-pointer active:scale-[0.99] hover:shadow-md border-transparent hover:border-slate-100 dark:hover:border-slate-800";
    return "";
  };

  // 4. Main Render ===========================================================
  return (
    <BaseCard
      onClick={onClick}
      className={`p-4 flex flex-col gap-4 transition-all group ${getCardBorderClass()} ${
        mode === "personal" && !isSubmitted && isExpired ? "opacity-75" : ""
      }`}
    >
      <div className="flex gap-4">
        {/* Left Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform ${config.bg} ${config.text}`}
        >
          {mode === "view_submission" ? (
            // Avatar for view submission mode
            <div className="text-[10px] font-black uppercase">
              {submitterName.substring(0, 2)}
            </div>
          ) : (
            <span className="text-xl">{config.icon}</span>
          )}
        </div>

        {/* Right Content */}
        <div className="flex-1 min-w-0">
          {/* Badge Row */}
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${config.badge}`}
              >
                {category}
              </span>
              {renderStatusBadge()}
            </div>

            {/* Admin Actions */}
            {mode === "admin" && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdminDelete && onAdminDelete();
                  }}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 truncate mb-1">
            {topic.topicName}
            {topic.isDeleted && (
              <span className="ml-2 text-[8px] text-rose-500">⚠️</span>
            )}
          </h3>

          {/* Sub-info */}
          {mode === "view_submission" ? (
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              {submitterName}
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                {new Date(assignment.startDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                })}{" "}
                -{" "}
                {new Date(assignment.endDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Users List (Admin Only) */}
      {mode === "admin" && assignedEmails && (
        <div className="pt-3 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[9px] font-black text-slate-400 uppercase mr-1">
              Thành viên ({assignedEmails.length}):
            </span>
            {assignedEmails.map((email) => {
              const u = getSafeUser(users, email);
              const hasSubmitted =
                allSubmissions &&
                !!allSubmissions[`${assignment.assignmentId}_${email}`];

              return (
                <span
                  key={email}
                  className={`px-2 py-0.5 rounded-lg text-[9px] font-black border transition-all ${
                    hasSubmitted
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100"
                      : u.isDeleted
                        ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100"
                        : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-100"
                  }`}
                >
                  {u.fullName}
                  {hasSubmitted && " ✓"}
                  {u.isDeleted && " ⚠️"}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default UnifiedTaskCard;
