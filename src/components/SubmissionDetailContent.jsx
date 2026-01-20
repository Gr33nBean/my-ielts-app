import React from "react";
import { getSafeTopic } from "../utils/dataSafety";
import RichContent from "./ui/RichContent";

const SubmissionDetailContent = ({ submission, type, topics = [] }) => {
  // Safe topic lookup
  const topicId =
    submission.topicId ||
    (String(submission.assignmentId || "").includes("_")
      ? String(submission.assignmentId).split("_")[0]
      : submission.assignmentId);

  const topic = getSafeTopic(topics, topicId);

  const themeClasses = {
    speaking: {
      badgeBg: "bg-orange-100 dark:bg-orange-900/40",
      badgeText: "text-orange-600 dark:text-orange-400",
      border: "border-orange-100 dark:border-orange-800/30",
      lightBg: "bg-orange-50 dark:bg-orange-900/10",
    },
    reading: {
      badgeBg: "bg-emerald-100 dark:bg-emerald-900/40",
      badgeText: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-800/30",
      lightBg: "bg-emerald-50 dark:bg-emerald-900/10",
    },
    listening: {
      badgeBg: "bg-purple-100 dark:bg-purple-900/40",
      badgeText: "text-purple-600 dark:text-purple-400",
      border: "border-purple-100 dark:border-purple-800/30",
      lightBg: "bg-purple-50 dark:bg-purple-900/10",
    },
    writing: {
      badgeBg: "bg-blue-100 dark:bg-blue-900/40",
      badgeText: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-800/30",
      lightBg: "bg-blue-50 dark:bg-blue-900/10",
    },
    grammar: {
      badgeBg: "bg-blue-100 dark:bg-blue-900/40",
      badgeText: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-800/30",
      lightBg: "bg-blue-50 dark:bg-blue-900/10",
    },
  };

  const theme = themeClasses[type] || themeClasses.speaking;

  return (
    <div className="space-y-6">
      {/* 2. Topic Content (Prompt) */}
      <div
        className={`p-5 rounded-3xl border ${theme.lightBg} ${theme.border}`}
      >
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${theme.badgeBg} mb-3`}
        >
          <span
            className={`text-[10px] font-black uppercase tracking-wider ${theme.badgeText}`}
          >
            Đề bài / Topic
          </span>
        </div>
        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-2">
          {topic.topicName}
        </h4>
        <div className="mb-2">
          <RichContent content={topic.description} />
        </div>
      </div>

      {/* 3. Submission Content (The Work) */}
      <div className="space-y-3">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${theme.badgeBg} mb-2`}
        >
          <span
            className={`text-[10px] font-black uppercase tracking-wider ${theme.badgeText}`}
          >
            Bài làm / Submission
          </span>
        </div>

        {type === "speaking" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
              <p className="text-[9px] text-slate-400 font-black uppercase mb-2 tracking-widest">
                Link Audio / Video:
              </p>
              <RichContent content={submission.audioLink} />
            </div>

            {submission.transcript && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-2 tracking-widest">
                  Bản gỡ băng (Transcript):
                </p>
                <RichContent content={submission.transcript} />
              </div>
            )}
          </div>
        )}

        {type === "reading" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
              <p className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">
                Bản dịch Reference:
              </p>
              <RichContent content={submission.translatedText} />

              {submission.vocabList && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-2">
                    Từ vựng quan trọng:
                  </p>
                  <RichContent
                    content={submission.vocabList}
                    className={`p-3 rounded-xl ${theme.lightBg}`}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {type === "writing" && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                Nội dung bài viết:
              </p>
              <span className={`text-[9px] font-black ${theme.badgeText}`}>
                {submission.wordCount} words
              </span>
            </div>
            <RichContent content={submission.essayContent} />
          </div>
        )}

        {type === "listening" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
              <p className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">
                Bản dịch / Thu hoạch nghe:
              </p>
              <RichContent content={submission.translatedText} />

              {submission.vocabList && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-2">
                    Cấu trúc hay:
                  </p>
                  <RichContent
                    content={submission.vocabList}
                    className={`p-3 rounded-xl ${theme.lightBg}`}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {type === "grammar" && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
            <p className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">
              Ghi chú học tập:
            </p>
            <RichContent content={submission.notes} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionDetailContent;
