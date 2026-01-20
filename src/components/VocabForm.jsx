import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const VocabForm = ({
  onOpenIPA,
  onClose,
  onSuccess,
  addVocab,
  tasks = [],
  topics = [],
  initialAssignmentId,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    word: "",
    ipa: "",
    englishMeaning: "",
    vietnameseMeaning: "",
    exampleSentence: "",
    collocationIdiom: "",
    assignmentId: initialAssignmentId || "",
  });

  // Sync initialAssignmentId if it changes
  useEffect(() => {
    if (initialAssignmentId) {
      setFormData((prev) => ({ ...prev, assignmentId: initialAssignmentId }));
    }
  }, [initialAssignmentId]);

  const myTasks = useMemo(() => {
    if (!user || !tasks) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks
      .filter((t) => {
        const isMine = (t.userEmail || "").includes(user.email);
        const end = new Date(t.endDate);
        end.setHours(23, 59, 59, 999);
        return isMine && end >= today;
      })
      .map((t) => {
        const topic = topics.find((tp) => tp.topicId === t.topicId);
        return { ...t, topicName: topic?.topicName || "Unknown Topic" };
      });
  }, [tasks, topics, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.word || !formData.vietnameseMeaning) {
      return alert("Vui lòng nhập ít nhất là Từ vựng và Nghĩa tiếng Việt!");
    }

    setLoading(true);
    const result = await addVocab(formData, user.email);
    setLoading(false);

    if (result && (result.success || result.message)) {
      alert(result.message || "Đã lưu thành công!");
      onSuccess();
      onClose();
    } else {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-2 block">
          Từ vựng <span className="text-red-500">*</span>
        </label>
        <input
          name="word"
          required
          value={formData.word}
          onChange={handleChange}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-base font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-serif"
          placeholder="Ví dụ: Gorgeous"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-2 block">
          Phiên âm (IPA)
        </label>
        <div className="relative">
          <input
            name="ipa"
            value={formData.ipa}
            onChange={handleChange}
            onFocus={(e) => onOpenIPA(e.target)}
            readOnly
            className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-sm font-medium text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-serif italic"
            placeholder="Bấm để mở bàn phím IPA"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            ⌨️
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-2 block">
            Nghĩa Việt <span className="text-red-500">*</span>
          </label>
          <textarea
            name="vietnameseMeaning"
            required
            value={formData.vietnameseMeaning}
            onChange={handleChange}
            rows="3"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none"
            placeholder="Nghĩa là..."
          ></textarea>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-2 block">
            Nghĩa Anh (Tùy chọn)
          </label>
          <textarea
            name="englishMeaning"
            value={formData.englishMeaning}
            onChange={handleChange}
            rows="3"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none"
            placeholder="Definition..."
          ></textarea>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-2 block">
          Ví dụ
        </label>
        <textarea
          name="exampleSentence"
          value={formData.exampleSentence}
          onChange={handleChange}
          rows="4"
          className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all placeholder:text-slate-400 font-serif"
          placeholder="I saw a gorgeous sunrise..."
        ></textarea>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-2 block">
          Collocation / Idiom
        </label>
        <textarea
          name="collocationIdiom"
          value={formData.collocationIdiom}
          onChange={handleChange}
          rows="5"
          className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none"
          placeholder="gorgeous weather..."
        ></textarea>
      </div>

      {myTasks.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-2 block">
            Thuộc nhiệm vụ (Tùy chọn)
          </label>
          <div className="relative">
            <select
              name="assignmentId"
              value={formData.assignmentId}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 p-4 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
            >
              <option value="">-- Không gắn với nhiệm vụ --</option>
              {myTasks.map((t) => (
                <option key={t.assignmentId} value={t.assignmentId}>
                  {t.topicName} (
                  {new Date(t.endDate).toLocaleDateString("vi-VN")})
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-none active:scale-95 transition-all mt-4 ${loading ? "opacity-50" : ""}`}
      >
        {loading ? "Đang lưu..." : "Lưu từ vựng"}
      </button>
    </form>
  );
};

export default VocabForm;
