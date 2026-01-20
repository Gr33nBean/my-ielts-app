/**
 * Grammar Logic
 */

function handleGetGrammar(e) {
  const sheet = getOrCreateSheet('grammarPosts'); // Tên bảng: grammarPosts
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return createJSONOutput([]);
  }

  const rows = data.slice(1);

  // Mapping col: 0:postId, 1:authorEmail, 2:title, 3:content, 4:category, 5:createdAt
  const result = rows.map(row => ({
    postId: row[0],
    authorEmail: row[1],
    title: row[2],
    content: row[3],
    category: row[4],
    createdAt: row[5]
  }));

  return createJSONOutput(result);
}
