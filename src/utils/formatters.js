export const groupVocabByWeek = (list) => {
  if (!list) return {};

  return list.reduce((groups, item) => {
    // Giả sử backend trả về createdAt hoặc lấy từ logic date của bạn
    // Ở đây tôi dùng một logic đơn giản để demo
    const date = new Date(); // Bạn nên dùng item.createdAt từ backend
    const day = date.getDay();
    const diff = date.getDate() - (day === 0 ? 6 : day - 1);
    const monday = new Date(date.setDate(diff));
    const weekLabel = `Tuần ${monday.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`;

    if (!groups[weekLabel]) groups[weekLabel] = [];
    groups[weekLabel].push(item);
    return groups;
  }, {});
};