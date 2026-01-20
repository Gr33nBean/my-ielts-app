export const getWeekLabel = (dateString, fallbackLabel = "Mới nộp") => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return fallbackLabel;
  const d = new Date(date.getTime());
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return (
    "Tuần " +
    monday.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
  );
};

export const getAvailableWeeks = (
  items,
  dateField = "createdAt",
  fallbackLabel = "Mới nộp",
) => {
  return Array.from(
    new Set(items.map((item) => getWeekLabel(item[dateField], fallbackLabel))),
  ).sort((a, b) => {
    if (a === fallbackLabel) return -1;
    if (b === fallbackLabel) return 1;
    return b.localeCompare(a);
  });
};

export const groupItemsByWeek = (
  items,
  dateField = "createdAt",
  fallbackLabel = "Mới nộp",
) => {
  return items.reduce((acc, item) => {
    const week = getWeekLabel(item[dateField], fallbackLabel);
    if (!acc[week]) acc[week] = [];
    acc[week].push(item);
    return acc;
  }, {});
};
