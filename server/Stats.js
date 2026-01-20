/**
 * Stats Logic
 * Calculates dashboard leaderboard and recent activities from multiple submission tables
 */

function handleGetStats(e) {
  const userMap = {};
  const userSheet = getOrCreateSheet("users");
  const userData = userSheet.getDataRange().getValues();
  if (userData.length > 1) {
    userData.slice(1).forEach((row) => {
      if (row[0]) userMap[row[0]] = row[1];
    });
  }

  const getDisplayName = (email) => userMap[email] || email.split("@")[0];

  const vocabData = getOrCreateSheet("vocabularies").getDataRange().getValues();
  const speakingData = getOrCreateSheet("speaking").getDataRange().getValues();
  const writingData = getOrCreateSheet("writing").getDataRange().getValues();
  const readingData = getOrCreateSheet("reading").getDataRange().getValues();
  const listeningData = getOrCreateSheet("listening")
    .getDataRange()
    .getValues();
  const grammarData = getOrCreateSheet("grammar").getDataRange().getValues();
  const assignmentData = getOrCreateSheet("assignments")
    .getDataRange()
    .getValues();

  // Create Assignment -> Topic Mapping
  const assignToTopicMap = {};
  if (assignmentData.length > 1) {
    assignmentData.slice(1).forEach((row) => {
      // assignmentId: col 0, topicId: col 2
      if (row[0]) assignToTopicMap[row[0]] = row[2];
    });
  }

  // 1. Leaderboard
  const userStats = {};
  const processStats = (data, type) => {
    if (data.length <= 1) return;
    data.slice(1).forEach((row) => {
      const email = row[2];
      if (!email) return;
      if (!userStats[email]) {
        userStats[email] = {
          name: getDisplayName(email),
          vocab: 0,
          speaking: 0,
          writing: 0,
          reading: 0,
          listening: 0,
          grammar: 0,
          total: 0,
        };
      }
      if (type === "vocab") userStats[email].vocab++;
      else if (type === "speaking") userStats[email].speaking++;
      else if (type === "writing") userStats[email].writing++;
      else if (type === "reading") userStats[email].reading++;
      else if (type === "listening") userStats[email].listening++;
      else if (type === "grammar") userStats[email].grammar++;
      userStats[email].total++;
    });
  };
  processStats(vocabData, "vocab");
  processStats(speakingData, "speaking");
  processStats(writingData, "writing");
  processStats(readingData, "reading");
  processStats(listeningData, "listening");
  processStats(grammarData, "grammar");
  const dashboard = Object.values(userStats).sort((a, b) => b.total - a.total);

  // 2. Format Submissions for Reference
  const formatSubmissions = (data, headers) => {
    if (data.length <= 1) return [];
    return data
      .slice(1)
      .map((row) => {
        const obj = {};
        headers.forEach((h, i) => (obj[h] = row[i]));
        obj.userName = getDisplayName(obj.userEmail);
        // Link topicId
        obj.topicId = assignToTopicMap[obj.assignmentId] || null;
        return obj;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const sharedSubmissions = {
    speaking: formatSubmissions(speakingData, [
      "submissionId",
      "assignmentId",
      "userEmail",
      "audioLink",
      "transcript",
      "createdAt",
    ]),
    writing: formatSubmissions(writingData, [
      "submissionId",
      "assignmentId",
      "userEmail",
      "essayContent",
      "wordCount",
      "createdAt",
    ]),
    reading: formatSubmissions(readingData, [
      "submissionId",
      "assignmentId",
      "userEmail",
      "translatedText",
      "vocabList",
      "createdAt",
    ]),
    listening: formatSubmissions(listeningData, [
      "submissionId",
      "assignmentId",
      "userEmail",
      "translatedText",
      "vocabList",
      "createdAt",
    ]),
    grammar: formatSubmissions(grammarData, [
      "submissionId",
      "assignmentId",
      "userEmail",
      "notes",
      "createdAt",
    ]),
  };

  // 3. Activities
  let activities = [];
  const addActivities = (data, type) => {
    if (data.length <= 1) return;
    data.slice(1).forEach((row) => {
      activities.push({
        user: getDisplayName(row[2]),
        type: type,
        content:
          type === "vocab"
            ? row[3]
            : type === "speaking"
              ? "bài nói"
              : type === "writing"
                ? "bài viết"
                : type === "reading"
                  ? "bản dịch"
                  : type === "listening"
                    ? "bài nghe"
                    : "bài ngữ pháp",
        timestamp: type === "vocab" ? row[9] : row[row.length - 1],
      });
    });
  };
  addActivities(vocabData, "vocab");
  addActivities(speakingData, "speaking");
  addActivities(writingData, "writing");
  addActivities(readingData, "reading");
  addActivities(listeningData, "listening");
  addActivities(grammarData, "grammar");
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return createJSONOutput({
    dashboard,
    activities: activities.slice(0, 15),
    sharedSubmissions,
  });
}
