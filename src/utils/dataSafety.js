/**
 * Data Safety Utilities
 * Handle orphaned data when topics or assignments are deleted
 */
import { USER_ROLES } from "./constants";

/**
 * Safely get topic by ID with fallback
 * @param {Array} topics - Array of topics
 * @param {string} topicId - Topic ID to find
 * @returns {Object} Topic object or fallback object
 */
export const getSafeTopic = (topics, topicId) => {
  const topic = topics.find((t) => t.topicId === topicId);
  if (topic) return topic;

  // Return fallback for deleted topics
  return {
    topicId: topicId || "unknown",
    topicName: "[Chủ đề đã xóa]",
    category: "Chưa phân loại",
    description: "Chủ đề này đã bị xóa khỏi hệ thống.",
    isDeleted: true,
  };
};

/**
 * Safely get assignment by ID with fallback
 * @param {Array} assignments - Array of assignments
 * @param {string} assignmentId - Assignment ID to find
 * @returns {Object} Assignment object or null
 */
export const getSafeAssignment = (assignments, assignmentId) => {
  return assignments.find((a) => a.assignmentId === assignmentId) || null;
};

/**
 * Filter active assignments with valid topics
 * @param {Array} assignments - Array of assignments
 * @param {Array} topics - Array of topics
 * @param {string} userEmail - User email
 * @param {string} categoryType - Category type to filter (optional)
 * @returns {Array} Filtered assignments
 */
export const getActiveAssignmentsWithTopics = (
  assignments,
  topics,
  userEmail,
  categoryType = null,
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return assignments.filter((as) => {
    // Check if user is assigned
    const emails = (as.userEmail || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    if (!emails.includes(userEmail)) return false;

    // Check date range
    const start = new Date(as.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(as.endDate);
    end.setHours(23, 59, 59, 999);
    if (today < start || today > end) return false;

    // Check if topic exists
    const topic = topics.find((tp) => tp.topicId === as.topicId);
    if (!topic) return false; // Skip orphaned assignments

    // Check category if specified
    if (categoryType && topic.category !== categoryType) return false;

    return true;
  });
};

/**
 * Check if a topic has any assignments
 * @param {string} topicId - Topic ID
 * @param {Array} assignments - Array of assignments
 * @returns {boolean} True if topic has assignments
 */
export const topicHasAssignments = (topicId, assignments) => {
  return assignments.some((a) => a.topicId === topicId);
};

/**
 * Check if an assignment has any submissions
 * @param {string} assignmentId - Assignment ID
 * @param {Object} submissions - Submissions object
 * @returns {boolean} True if assignment has submissions
 */
export const assignmentHasSubmissions = (assignmentId, submissions) => {
  if (!submissions || typeof submissions !== "object") return false;

  // Check if assignmentId exists as a key in submissions
  if (submissions[assignmentId]) return true;

  // Check if assignmentId exists in any submission object
  return Object.values(submissions).some(
    (sub) => sub && sub.assignmentId === assignmentId,
  );
};

/**
 * Get warning message before deleting a topic
 * @param {Object} topic - Topic to delete
 * @param {Array} assignments - Array of assignments
 * @returns {string} Warning message
 */
export const getTopicDeleteWarning = (topic, assignments) => {
  const assignmentCount = assignments.filter(
    (a) => a.topicId === topic.topicId,
  ).length;

  if (assignmentCount === 0) {
    return `Bạn có chắc muốn xóa chủ đề "${topic.topicName}"?`;
  }

  return `Chủ đề "${topic.topicName}" đang được sử dụng trong ${assignmentCount} nhiệm vụ.\n\nNếu xóa, các nhiệm vụ này sẽ không hiển thị đầy đủ thông tin.\n\nBạn có chắc muốn tiếp tục?`;
};

/**
 * Get warning message before deleting an assignment
 * @param {Object} assignment - Assignment to delete
 * @param {Object} submissions - Submissions object
 * @param {Array} topics - Array of topics
 * @returns {string} Warning message
 */
export const getAssignmentDeleteWarning = (assignment, submissions, topics) => {
  const topic = getSafeTopic(topics, assignment.topicId);
  const hasSubmissions = assignmentHasSubmissions(
    assignment.assignmentId,
    submissions,
  );

  const emails = (assignment.userEmail || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  let message = `Xóa nhiệm vụ "${topic.topicName}" cho ${emails.length} thành viên?`;

  if (hasSubmissions) {
    message += `\n\n⚠️ Nhiệm vụ này đã có bài nộp. Bài nộp sẽ vẫn được lưu trong hệ thống.`;
  }

  return message;
};

/**
 * Safely get user by email with fallback
 * @param {Array} users - Array of users
 * @param {string} email - User email to find
 * @returns {Object} User object or fallback object
 */
export const getSafeUser = (users, email) => {
  if (!email) {
    return {
      email: "",
      fullName: "[Không xác định]",
      role: USER_ROLES.MEMBER,
      isDeleted: true,
    };
  }

  const user = users.find((u) => u.email === email);
  if (user) return user;

  // Return fallback for deleted users
  // Extract name from email (before @)
  const nameFromEmail = email.split("@")[0];

  return {
    email: email,
    fullName: `[${nameFromEmail}]`,
    role: USER_ROLES.MEMBER,
    isDeleted: true,
  };
};

/**
 * Safely get multiple users by emails
 * @param {Array} users - Array of users
 * @param {Array} emails - Array of emails to find
 * @returns {Array} Array of user objects (with fallbacks for deleted users)
 */
export const getSafeUsers = (users, emails) => {
  if (!Array.isArray(emails)) return [];
  return emails.map((email) => getSafeUser(users, email));
};

/**
 * Check if a user has any assignments
 * @param {string} email - User email
 * @param {Array} assignments - Array of assignments
 * @returns {boolean} True if user has assignments
 */
export const userHasAssignments = (email, assignments) => {
  return assignments.some((a) => {
    const emails = (a.userEmail || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    return emails.includes(email);
  });
};

/**
 * Check if a user has any submissions
 * @param {string} email - User email
 * @param {Object} submissions - Submissions object
 * @returns {boolean} True if user has submissions
 */
export const userHasSubmissions = (email, submissions) => {
  if (!submissions || typeof submissions !== "object") return false;

  return Object.values(submissions).some(
    (sub) => sub && sub.userEmail === email,
  );
};

/**
 * Get warning message before deleting a user
 * @param {Object} user - User to delete
 * @param {Array} assignments - Array of assignments
 * @param {Object} submissions - Submissions object
 * @returns {string} Warning message
 */
export const getUserDeleteWarning = (user, assignments, submissions) => {
  const hasAssignments = userHasAssignments(user.email, assignments);
  const hasSubmissions = userHasSubmissions(user.email, submissions);

  let message = `Bạn có chắc muốn xóa người dùng "${user.fullName}" (${user.email})?`;

  const warnings = [];

  if (hasAssignments) {
    warnings.push("• Người dùng này đang có nhiệm vụ được giao");
  }

  if (hasSubmissions) {
    warnings.push("• Người dùng này đã có bài nộp trong hệ thống");
  }

  if (warnings.length > 0) {
    message += "\n\n⚠️ Cảnh báo:\n" + warnings.join("\n");
    message +=
      "\n\nDữ liệu sẽ vẫn được giữ lại nhưng sẽ hiển thị dưới dạng [email].";
  }

  return message;
};
