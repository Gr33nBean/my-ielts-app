/**
 * Submissions Logic for Speaking, Writing, Reading
 */

function handleSaveSubmission(contents) {
  const category = contents.category; // 'Speaking', 'Writing', 'Reading'
  const data = contents.data;
  const email = contents.email;
  const assignmentId = contents.assignmentId;

  if (!assignmentId) {
    return createJSONOutput({
      success: false,
      message: "Missing Assignment ID",
    });
  }

  const tableName = category.toLowerCase().split(" ")[0]; // 'speaking', 'writing', 'reading'
  const sheet = getOrCreateSheet(tableName);

  // Initialize Header if empty
  if (sheet.getLastRow() === 0) {
    if (tableName === "speaking") {
      sheet.appendRow([
        "submissionId",
        "assignmentId",
        "userEmail",
        "audioLink",
        "transcript",
        "createdAt",
      ]);
    } else if (tableName === "writing") {
      sheet.appendRow([
        "submissionId",
        "assignmentId",
        "userEmail",
        "essayContent",
        "wordCount",
        "createdAt",
      ]);
    } else if (tableName === "reading" || tableName === "listening") {
      sheet.appendRow([
        "submissionId",
        "assignmentId",
        "userEmail",
        "translatedText",
        "vocabList",
        "createdAt",
      ]);
    } else if (tableName === "grammar") {
      sheet.appendRow([
        "submissionId",
        "assignmentId",
        "userEmail",
        "notes",
        "createdAt",
      ]);
    }
  }

  const allData = sheet.getDataRange().getValues();
  let rowIndex = -1;
  if (allData.length > 1) {
    for (let i = 1; i < allData.length; i++) {
      // assignmentId is at index 1, userEmail is at index 2
      if (allData[i][1] === assignmentId && allData[i][2] === email) {
        rowIndex = i + 1;
        break;
      }
    }
  }

  const createdAt = new Date();
  let rowValues = [];

  if (rowIndex !== -1) {
    // Keep original submissionId (at index 0)
    const submissionId = allData[rowIndex - 1][0];
    rowValues = [submissionId, assignmentId, email];
  } else {
    const submissionId = "S" + new Date().getTime();
    rowValues = [submissionId, assignmentId, email];
  }

  if (tableName === "speaking") {
    rowValues.push(data.audioLink || "", data.transcript || "", createdAt);
  } else if (tableName === "writing") {
    const text = data.essayContent || "";
    const wordCount = text
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    rowValues.push(text, wordCount, createdAt);
  } else if (tableName === "reading" || tableName === "listening") {
    rowValues.push(data.translatedText || "", data.vocabList || "", createdAt);
  } else if (tableName === "grammar") {
    rowValues.push(data.notes || "Đã hoàn thành", createdAt);
  }

  if (rowIndex !== -1) {
    sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
    return createJSONOutput({
      success: true,
      message: "Cập nhật bài nộp thành công!",
    });
  } else {
    sheet.appendRow(rowValues);
    return createJSONOutput({ success: true, message: "Nộp bài thành công!" });
  }
}

function handleGetUserSubmissions(e) {
  const email = e.parameter.email;
  if (!email) return createJSONOutput({});

  const tables = ["speaking", "writing", "reading", "listening", "grammar"];
  const submissionsMap = {};

  tables.forEach((tableName) => {
    const sheet = getOrCreateSheet(tableName);
    const data = sheet.getDataRange().getValues();
    if (data.length > 1) {
      const headers = data[0];
      data.slice(1).forEach((row) => {
        // userEmail is at index 2, assignmentId is at index 1
        if (row[2] === email && row[1]) {
          const subObj = {};
          headers.forEach((h, i) => {
            subObj[h] = row[i];
          });
          submissionsMap[row[1]] = subObj;
        }
      });
    }
  });

  return createJSONOutput(submissionsMap);
}
