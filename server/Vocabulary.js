/**
 * Vocabulary Logic
 */

function handleGetVocab(e) {
  const sheet = getOrCreateSheet('vocabularies'); // Tên bảng là vocabularies
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return createJSONOutput([]);

  // Bỏ qua header
  const rows = data.slice(1);

  // Mapping theo thứ tự cột: 
  // 0:vocabId, 1:assignmentId, 2:userEmail, 3:word, 4:ipa, 5:englishMeaning, 
  // 6:vietnameseMeaning, 7:exampleSentence, 8:collocationIdiom, 9:createdAt
  const result = rows.map(row => {
    return {
      vocabId: row[0],
      assignmentId: row[1],
      userEmail: row[2], // Đổi từ fullEmail thành userEmail cho khớp schema
      word: row[3],
      ipa: row[4],
      englishMeaning: row[5],
      vietnameseMeaning: row[6],
      exampleSentence: row[7],
      collocationIdiom: row[8],
      createdAt: row[9]
    };
  }).reverse();

  return createJSONOutput(result);
}

function handleSaveVocabulary(payload) {
  const data = payload.data;
  const email = payload.email;
  const sheet = getOrCreateSheet('vocabularies');

  // Header chuẩn
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'vocabId', 'assignmentId', 'userEmail', 'word', 'ipa',
      'englishMeaning', 'vietnameseMeaning', 'exampleSentence', 'collocationIdiom', 'createdAt'
    ]);
  }

  // Tạo ID: V + timestamp
  const vocabId = 'V' + new Date().getTime();
  const assignmentId = contents.assignmentId || 'ASSIGN_TEMP';

  sheet.appendRow([
    vocabId,
    assignmentId,
    email,
    data.word,
    data.ipa,
    data.englishMeaning,
    data.vietnameseMeaning,
    data.exampleSentence,
    data.collocationIdiom,
    new Date() // Google Sheet sẽ tự format ngày giờ
  ]);

  return createJSONOutput({ success: true, message: 'Đã lưu từ vựng thành công!' });
}
