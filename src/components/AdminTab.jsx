import React, { useState, useEffect } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { TOPIC_CATEGORIES } from "../utils/constants";
import {
  getTopicDeleteWarning,
  getAssignmentDeleteWarning,
  getSafeUser,
} from "../utils/dataSafety";
import AdminTopicCard from "./cards/AdminTopicCard";
import UnifiedTaskCard from "./cards/UnifiedTaskCard";
import FormModal from "./FormModal";
import ConfirmModal from "./ConfirmModal";
import AdminAssignmentDetailModal from "./AdminAssignmentDetailModal";

const AdminTab = ({ sharedSubmissions = {}, refreshStats }) => {
  const {
    topics = [],
    assignments = [],
    users = [],
    loading,
    fetchData,
    adminAction,
  } = useAdmin();
  const [activeSubTab, setActiveSubTab] = useState("assignments"); // 'topics' | 'assignments'

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [topicForm, setTopicForm] = useState({
    topicName: "",
    category: "",
    description: "",
  });
  const [assignForm, setAssignForm] = useState({
    userEmails: [],
    topicId: "",
    startDate: "",
    endDate: "",
  });
  const [isSavingTopic, setIsSavingTopic] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null); // For detail modal
  const [topicCategoryFilter, setTopicCategoryFilter] = useState("all");

  // Filters
  const [assignFilter, setAssignFilter] = useState("active"); // 'all' | 'active' | 'expired'
  const [userEmailFilter, setUserEmailFilter] = useState("");
  const [submissionFilter, setSubmissionFilter] = useState("all"); // 'all' | 'submitted' | 'pending'

  // Flatten submissions into a map: { "assignmentId_email": true }
  const submissionTracker = React.useMemo(() => {
    const map = {};
    Object.values(sharedSubmissions).forEach((categoryList) => {
      if (Array.isArray(categoryList)) {
        categoryList.forEach((sub) => {
          if (sub.assignmentId && sub.userEmail) {
            map[`${sub.assignmentId}_${sub.userEmail}`] = true;
          }
        });
      }
    });
    return map;
  }, [sharedSubmissions]);

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setTopicForm({
      topicName: topic.topicName,
      category: topic.category,
      description: topic.description,
    });
    setShowTopicModal(true);
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    setIsSavingTopic(true);
    try {
      const payload = { ...topicForm };
      if (editingTopic) {
        payload.topicId = editingTopic.topicId;
      }
      const success = await adminAction("saveTopic", { data: payload });
      if (success) {
        setTopicForm({ topicName: "", category: "", description: "" });
        setEditingTopic(null);
        setShowTopicModal(false);
      }
    } finally {
      setIsSavingTopic(false);
    }
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();

    if (new Date(assignForm.endDate) < new Date(assignForm.startDate)) {
      alert("Ngày kết thúc không được trước ngày bắt đầu!");
      return;
    }

    setIsSavingAssignment(true);
    try {
      const dataToSave = {
        ...assignForm,
        userEmail: assignForm.userEmails.join(", "),
      };
      const success = await adminAction("saveAssignment", { data: dataToSave });
      if (success) {
        setAssignForm({
          userEmails: [],
          topicId: "",
          startDate: "",
          endDate: "",
        });
        setShowAssignModal(false);
        if (refreshStats) refreshStats({ silent: true });
      }
    } finally {
      setIsSavingAssignment(false);
    }
  };

  const filteredAssignments = assignments
    .filter((as) => {
      // 1. Term Filter (Active/Expired)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(as.endDate);
      endDate.setHours(23, 59, 59, 999);

      if (assignFilter === "active" && endDate < today) return false;
      if (assignFilter === "expired" && endDate >= today) return false;

      const emails = (as.userEmail || "").split(",").map((e) => e.trim());

      // 2. User Filter
      if (userEmailFilter && !emails.includes(userEmailFilter)) return false;

      // 3. Submission Filter (Only meaningful when a user is selected)
      if (userEmailFilter && submissionFilter !== "all") {
        const key = `${as.assignmentId}_${userEmailFilter}`;
        const isSubmitted = !!submissionTracker[key];
        if (submissionFilter === "submitted" && !isSubmitted) return false;
        if (submissionFilter === "pending" && isSubmitted) return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

  const filteredTopics = topics.filter((t) => {
    if (topicCategoryFilter === "all") return true;
    return t.category === topicCategoryFilter;
  });

  if (loading && topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
          Đang tải bảng quản trị...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Sub-navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
        <button
          onClick={() => setActiveSubTab("topics")}
          className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${activeSubTab === "topics" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400"}`}
        >
          TOPICS
        </button>
        <button
          onClick={() => setActiveSubTab("assignments")}
          className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${activeSubTab === "assignments" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400"}`}
        >
          ASSIGNMENTS
        </button>
      </div>

      {activeSubTab === "topics" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Quản lý chủ đề
            </h3>
            <button
              onClick={() => {
                setEditingTopic(null);
                setTopicForm({ topicName: "", category: "", description: "" });
                setShowTopicModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-100 dark:shadow-none active:scale-95"
            >
              + Thêm chủ đề
            </button>
          </div>

          {/* Topic Form Modal */}
          <FormModal
            isOpen={showTopicModal}
            onClose={() => {
              setShowTopicModal(false);
              setEditingTopic(null);
              setTopicForm({ topicName: "", category: "", description: "" });
            }}
            onSubmit={handleSaveTopic}
            title={editingTopic ? "Cập nhật chủ đề" : "Thêm chủ đề mới"}
            submitText={editingTopic ? "CẬP NHẬT" : "LƯU CHỦ ĐỀ"}
            loading={isSavingTopic}
            size="md"
          >
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">
                  Tên chủ đề
                </label>
                <input
                  type="text"
                  disabled={isSavingTopic}
                  placeholder="Ví dụ: Education"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-xs disabled:opacity-50"
                  value={topicForm.topicName}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, topicName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">
                  Loại bài thi
                </label>
                <select
                  disabled={isSavingTopic}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-xs appearance-none disabled:opacity-50"
                  value={topicForm.category}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, category: e.target.value })
                  }
                  required
                >
                  <option value="">Chọn loại bài thi</option>
                  {Object.values(TOPIC_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">
                  Mô tả / Yêu cầu
                </label>
                <textarea
                  disabled={isSavingTopic}
                  placeholder="Mô tả chi tiết hoặc yêu cầu nhiệm vụ..."
                  className="w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-xs min-h-[100px] resize-none disabled:opacity-50"
                  value={topicForm.description}
                  rows={5}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, description: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
          </FormModal>

          {/* Category Filter */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setTopicCategoryFilter("all")}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all ${topicCategoryFilter === "all" ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"}`}
              >
                Tất cả ({topics.length})
              </button>
              {Object.values(TOPIC_CATEGORIES).map((cat) => {
                const count = topics.filter((t) => t.category === cat).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => setTopicCategoryFilter(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all ${topicCategoryFilter === cat ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"}`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topics List */}
          <div className="space-y-3">
            {filteredTopics.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-4xl mb-3">📚</p>
                <p className="text-xs text-slate-400 italic">
                  {topicCategoryFilter === "all"
                    ? "Chưa có chủ đề nào."
                    : `Không có chủ đề nào thuộc loại "${topicCategoryFilter}".`}
                </p>
              </div>
            ) : (
              filteredTopics.map((t) => (
                <AdminTopicCard
                  key={t.topicId}
                  topic={t}
                  onEdit={() => handleEditTopic(t)}
                  onDelete={() => {
                    const warning = getTopicDeleteWarning(t, assignments);
                    if (window.confirm(warning)) {
                      adminAction("deleteTopic", { id: t.topicId });
                    }
                  }}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Quản lý nhiệm vụ
            </h3>
            <button
              onClick={() => setShowAssignModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-100 dark:shadow-none active:scale-95"
            >
              + Giao nhiệm vụ
            </button>
          </div>

          {/* Modal for Assignment Form */}
          <FormModal
            isOpen={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            onSubmit={handleSaveAssignment}
            title="Giao nhiệm vụ mới"
            submitText="XÁC NHẬN GIAO"
            loading={isSavingAssignment}
            size="md"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  disabled={isSavingAssignment}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-[11px] font-medium disabled:opacity-50"
                  value={assignForm.startDate}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      startDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  disabled={isSavingAssignment}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-[11px] font-medium disabled:opacity-50"
                  value={assignForm.endDate}
                  min={assignForm.startDate}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, endDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">
                  Thành viên tham gia
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent focus-within:border-blue-500/30 transition-all min-h-[48px]">
                  {assignForm.userEmails.map((email) => {
                    const u = getSafeUser(users, email);
                    return (
                      <div
                        key={email}
                        className={`flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-xl shadow-sm border ${u.isDeleted ? "border-amber-200 dark:border-amber-900/50" : "border-slate-100 dark:border-slate-700"}`}
                      >
                        <span
                          className={`text-[10px] font-bold ${u.isDeleted ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"}`}
                        >
                          {u.fullName}
                          {u.isDeleted && " ⚠️"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setAssignForm({
                              ...assignForm,
                              userEmails: assignForm.userEmails.filter(
                                (e) => e !== email,
                              ),
                            })
                          }
                          className="ml-1 text-slate-400 transition-colors active:scale-90"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}

                  <select
                    disabled={isSavingAssignment}
                    className="flex-1 min-w-[120px] bg-transparent text-xs appearance-none outline-none py-1 disabled:opacity-50"
                    value=""
                    onChange={(e) => {
                      const email = e.target.value;
                      if (email && !assignForm.userEmails.includes(email)) {
                        setAssignForm({
                          ...assignForm,
                          userEmails: [...assignForm.userEmails, email],
                        });
                      }
                    }}
                  >
                    <option value="">+ Chọn thành viên...</option>
                    {users
                      .filter((u) => !assignForm.userEmails.includes(u.email))
                      .map((u) => (
                        <option key={u.email} value={u.email}>
                          {u.fullName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">
                  Chủ đề bài học
                </label>
                <select
                  disabled={isSavingAssignment}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-xs appearance-none disabled:opacity-50"
                  value={assignForm.topicId}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, topicId: e.target.value })
                  }
                  required
                >
                  <option value="">Chọn Topic</option>
                  {topics.map((t) => (
                    <option key={t.topicId} value={t.topicId}>
                      {t.topicName} ({t.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </FormModal>

          {/* Assignments List & Filters */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800 space-y-4">
              {/* Row 1: Term Filter */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Kỳ hạn
                </span>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  {["active", "expired", "all"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setAssignFilter(f)}
                      className={`px-3 py-1 text-[9px] font-bold rounded-md transition-all ${assignFilter === f ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400"}`}
                    >
                      {f === "active"
                        ? "CÒN HẠN"
                        : f === "expired"
                          ? "QUÁ HẠN"
                          : "TẤT CẢ"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: User Filter */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <select
                    value={userEmailFilter}
                    onChange={(e) => {
                      setUserEmailFilter(e.target.value);
                      if (!e.target.value) setSubmissionFilter("all");
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-2.5 rounded-xl text-[11px] font-bold appearance-none outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Tất cả thành viên</option>
                    {users.map((u) => (
                      <option key={u.email} value={u.email}>
                        👤 {u.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Row 3: Submission Status (Only if user is selected) */}
                {userEmailFilter && (
                  <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                    {["all", "submitted", "pending"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSubmissionFilter(s)}
                        className={`px-3 py-1.5 text-[9px] font-bold rounded-md transition-all ${submissionFilter === s ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400"}`}
                      >
                        {s === "all"
                          ? "TẤT CẢ"
                          : s === "submitted"
                            ? "ĐÃ NỘP"
                            : "CHƯA NỘP"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {filteredAssignments.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-4xl mb-3">🎐</p>
                  <p className="text-xs text-slate-400 italic">
                    Không tìm thấy nhiệm vụ nào phù hợp.
                  </p>
                </div>
              ) : (
                filteredAssignments.map((as) => (
                  <UnifiedTaskCard
                    key={as.assignmentId}
                    assignment={as}
                    mode="admin"
                    users={users}
                    topics={topics}
                    allSubmissions={submissionTracker}
                    onAdminDelete={() => {
                      const warning = getAssignmentDeleteWarning(
                        as,
                        submissionTracker,
                        topics,
                      );
                      if (window.confirm(warning)) {
                        adminAction("deleteAssignment", {
                          id: as.assignmentId,
                        });
                      }
                    }}
                    onClick={() => {
                      setSelectedAssignment(as);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Assignment Detail Modal */}
      <AdminAssignmentDetailModal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        assignment={selectedAssignment}
        topics={topics}
        users={users}
        submissions={submissionTracker}
        onUpdateAssignment={async (id, newData) => {
          await adminAction("saveAssignment", { data: newData });
          // Optionally show success message or rely on auto-refresh
        }}
      />
    </div>
  );
};

export default AdminTab;
