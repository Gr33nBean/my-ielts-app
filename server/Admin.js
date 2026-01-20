/**
 * Admin Logic
 * CRUD handlers for Topics and Assignments
 */

function handleGetAdminData(e) {
  const topicsSheet = getOrCreateSheet("topics");
  const topicsData = topicsSheet.getDataRange().getValues();
  const topics =
    topicsData.length > 1
      ? topicsData.slice(1).map((row) => ({
        topicId: row[0],
        topicName: row[1],
        category: row[2],
        description: row[3],
      }))
      : [];

  const assignSheet = getOrCreateSheet("assignments");
  const assignData = assignSheet.getDataRange().getValues();
  const assignments =
    assignData.length > 1
      ? assignData.slice(1).map((row) => ({
        assignmentId: row[0],
        userEmail: row[1], // Giờ lưu chuỗi email cách nhau bởi dấu phẩy
        topicId: row[2],
        startDate: row[3],
        endDate: row[4],
      }))
      : [];

  const userSheet = getOrCreateSheet("users");
  const userData = userSheet.getDataRange().getValues();
  const users =
    userData.length > 1
      ? userData.slice(1).map((row) => ({
        email: row[0],
        fullName: row[1],
        role: row[2],
      }))
      : [];

  return createJSONOutput({
    topics: topics,
    assignments: assignments,
    users: users,
  });
}

/**
 * Handle POST Admin Actions
 */
function handleAdminActions(contents) {
  const subAction = contents.subAction;

  if (subAction === "saveTopic") {
    return saveTopic(contents.data);
  } else if (subAction === "deleteTopic") {
    return deleteRowByFieldValue("topics", 0, contents.id);
  } else if (subAction === "saveAssignment") {
    return saveAssignment(contents.data);
  } else if (subAction === "deleteAssignment") {
    return deleteRowByFieldValue("assignments", 0, contents.id);
  }

  return createJSONOutput({ success: false, message: "Invalid Admin Action" });
}

function saveTopic(data) {
  const sheet = getOrCreateSheet("topics");
  const rows = sheet.getDataRange().getValues();
  const id = data.topicId || "T" + new Date().getTime();

  let foundIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      foundIndex = i + 1;
      break;
    }
  }

  const rowValues = [id, data.topicName, data.category, data.description];

  if (foundIndex > -1) {
    sheet.getRange(foundIndex, 1, 1, 4).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return createJSONOutput({ success: true, id: id });
}

function saveAssignment(data) {
  const sheet = getOrCreateSheet("assignments");
  const rows = sheet.getDataRange().getValues();

  let id = data.assignmentId;
  let foundIndex = -1;

  // 1. Search Logic
  if (id) {
    // Nếu có ID (chế độ sửa), tìm theo ID
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === id) {
        foundIndex = i + 1;
        break;
      }
    }
  } else {
    // Nếu không có ID (giao mới), kiểm tra xem topic này đã được giao trong khoảng thời gian này chưa
    for (let i = 1; i < rows.length; i++) {
      const rowTopicId = rows[i][2];
      const rowStart = rows[i][3];
      const rowEnd = rows[i][4];

      // So sánh TopicId và Ngày (date strings)
      if (
        rowTopicId === data.topicId &&
        rowStart === data.startDate &&
        rowEnd === data.endDate
      ) {
        foundIndex = i + 1;
        id = rows[i][0]; // Lấy ID hiện tại để gộp

        // Gộp danh sách email (không trùng lặp)
        const existingEmails = String(rows[i][1] || "")
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        const newEmails = String(data.userEmail || "")
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        const mergedEmails = Array.from(
          new Set([...existingEmails, ...newEmails]),
        );
        data.userEmail = mergedEmails.join(", ");
        break;
      }
    }
  }

  if (!id) id = "AS" + new Date().getTime();

  const rowValues = [
    id,
    data.userEmail,
    data.topicId,
    data.startDate,
    data.endDate,
  ];

  if (foundIndex > -1) {
    sheet.getRange(foundIndex, 1, 1, 5).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return createJSONOutput({
    success: true,
    id: id,
    message:
      foundIndex > -1
        ? "Đã gộp thành viên vào nhiệm vụ hiện có"
        : "Đã tạo nhiệm vụ mới",
  });
}

/**
 * Helper to delete a row based on a value in a specific column
 */
function deleteRowByFieldValue(sheetName, colIndex, value) {
  const sheet = getOrCreateSheet(sheetName);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][colIndex] == value) {
      sheet.deleteRow(i + 1);
      return createJSONOutput({ success: true, message: "Deleted " + value });
    }
  }
  return createJSONOutput({ success: false, message: "Not found " + value });
}
