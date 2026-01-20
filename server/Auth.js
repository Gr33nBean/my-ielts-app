/**
 * Auth Logic
 */

function handleCheckLogin(e) {
  const email = e.parameter.email;
  const sheet = getOrCreateSheet('users'); // Tên bảng: users
  const data = sheet.getDataRange().getValues();

  // Tìm user trong bảng
  // Col 0: email, 1: fullName, 2: role
  let userFound = null;

  // Bỏ qua header dòng 1
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      userFound = {
        email: data[i][0],
        fullName: data[i][1],
        role: data[i][2]
      };
      break;
    }
  }

  if (userFound) {
    return createJSONOutput({
      success: true,
      ...userFound,
      avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(userFound.fullName)
    });
  } else {
    // Tùy chọn: Tự động đăng ký user mới nếu chưa có (để test)
    // Hoặc trả về false nếu muốn chặn
    return createJSONOutput({
      success: true, // Tạm để true để bạn vào được app, sau này đổi thành false nếu muốn strict
      email: email,
      fullName: "New Member",
      role: "member",
      avatar: "https://ui-avatars.com/api/?name=" + email
    });
  }
}
