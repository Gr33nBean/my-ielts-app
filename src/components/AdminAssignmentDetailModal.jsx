import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { getSafeUser, getSafeTopic } from "../utils/dataSafety";

// Helper to get YYYY-MM-DD from date string respecting local timezone
const toLocalISOString = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AdminAssignmentDetailModal = ({
  isOpen,
  onClose,
  assignment,
  topics,
  users,
  submissions,
  onUpdateAssignment,
}) => {
  const [endDate, setEndDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (assignment) {
      setEndDate(toLocalISOString(assignment.endDate));
    }
  }, [assignment]);
  // ... (skip) ...
  <input
    type="date"
    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm font-bold"
    value={endDate}
    min={assignment ? toLocalISOString(assignment.startDate) : undefined}
    onChange={(e) => setEndDate(e.target.value)}
    required
  />;

  if (!assignment) return null;

  const topic = getSafeTopic(topics, assignment.topicId);

  const assignedEmails = (assignment.userEmail || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateAssignment(assignment.assignmentId, {
        ...assignment,
        endDate,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update assignment", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Chi tiết Nhiệm vụ"
      submitText="CẬP NHẬT"
      loading={isSaving}
      size="lg"
    >
      <div className="space-y-6">
        {/* Info Section */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl space-y-3">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              Chủ đề
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {topic.topicName}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              Loại bài thi
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold uppercase">
              {topic.category}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <div>
          <label className="text-[11px] font-black text-slate-500 uppercase block mb-2">
            Điều chỉnh hạn nộp (Từ{" "}
            {new Date(assignment.startDate).toLocaleDateString("vi-VN")})
          </label>
          <input
            type="date"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm font-bold"
            value={endDate}
            min={
              assignment ? toLocalISOString(assignment.startDate) : undefined
            }
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {/* Submissions List */}
        <div>
          <h4 className="text-[11px] font-black text-slate-500 uppercase mb-3 flex justify-between items-center">
            <span>Danh sách bài nộp ({assignedEmails.length})</span>
          </h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {assignedEmails.map((email) => {
              const u = getSafeUser(users, email);
              const submission =
                submissions[`${assignment.assignmentId}_${email}`];

              return (
                <div
                  key={email}
                  className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white ${submission ? "bg-emerald-500" : "bg-slate-300"}`}
                    >
                      {u.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {u.fullName} {u.isDeleted && "⚠️"}
                      </p>
                      <p className="text-[10px] text-slate-400">{email}</p>
                    </div>
                  </div>
                  <div>
                    {submission ? (
                      <div className="text-right">
                        <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg font-bold">
                          {new Date(submission.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                        {/* View Button could be added here if needed */}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold italic">
                        Chưa nộp
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default AdminAssignmentDetailModal;
