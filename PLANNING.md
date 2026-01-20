# IELTS Team Application Development Roadmap

## I. QUÁ KHỨ (ĐÃ HOÀN THÀNH)

### 1. Frontend (FE)

- **Tái cấu trúc Stats Tab**: Chuyển đổi thành "Góc tham khảo" với các sub-tabs chuyên sâu (Speaking, Reading, Writing, Leaderboard).
- **Phát triển WritingView**: Hỗ trợ nộp Essay, tự động đếm số từ và hiển thị đề bài trực quan.
- **Tính năng Cập nhật bài nộp**: Cho phép học viên chỉnh sửa và nộp lại bài làm (Speaking, Reading, Writing) thay vì chỉ nộp một lần.
- **Tối ưu hóa ReferenceCard**: Tích hợp trình phát YouTube trực tiếp và hiển thị "Đề bài" song song với "Bài làm" để tiện đối chiếu.
- **Refactor AdminTab**: Cải tiến giao diện giao nhiệm vụ, hỗ trợ chọn nhiều thành viên cùng lúc cho một Task.
- **Hệ thống lọc & Check-in**: Hoàn thiện logic kiểm tra trạng thái hoàn thành nhiệm vụ và lọc nhiệm vụ cá nhân/tất cả.
- Xử lý mượt mà Dark Mode, IPA Keyboard và các hiệu ứng chuyển cảnh.
- **Uniform UI System**: Đồng bộ giao diện Submission Modals cho tất cả kỹ năng về màu sắc (Theme Colors) và bố cục (Layout), sử dụng `UnifiedSkillView` để quản lý logic chung.
- **Rich Media Support**: Hỗ trợ nhúng trực tiếp Video Youtube, Tiktok và hiển thị link xem trước trong đề bài và bài làm thông qua `RichContent`.
- **Quản lý Chủ đề (Admin)**: Thêm chức năng Chỉnh sửa (Edit) chủ đề và tạo mới; fix lỗi xử lý ngày tháng (Timezone) và cho phép nộp nhiều từ vựng.

### 2. Backend (BE - Google Apps Script)

- **Chuẩn hóa lại Assignments**: Chuyển đổi sang cấu trúc đa thành viên (một Task ID - nhiều User Email), loại bỏ cột `pairWithEmail` để quản lý gọn nhẹ hơn.
- **Nâng cấp Submissions.js**: Hỗ trợ Update-or-Insert (Upsert) dựa trên `assignmentId` và `userEmail`.
- **Mở rộng Stats.js**: API `getStats` giờ đây tổng hợp và trả về toàn bộ tài liệu tham khảo công khai từ các bảng Speaking, Reading, Writing.
- Tối ưu hóa API `getUserSubmissions` trả về dạng Object Map để tăng tốc độ kiểm tra trạng thái bài nộp tại Client.

---

## II. HIỆN TẠI (ĐANG TRIỂN KHAI & CẦN HOÀN THIỆN)

### 1. Frontend (FE)

- **Phản hồi & Chấm điểm**: Hiển thị trạng thái "Đã xem" hoặc "Nhận xét" từ Admin trên từng card bài tập.
- **Hệ thống Thông báo (Toasts)**: Thay thế các hàm `alert()` bằng hệ thống Toast notifications để giao diện hiện đại hơn.
- **GrammarView Editor**: Xây dựng giao diện cho Admin để biên soạn nội dung ngữ pháp trực tiếp thay vì nhập thô.

### 2. Backend (BE - Google Apps Script)

- **Hệ thống Feedback**: Xây dựng bảng `feedback` và API để Admin có thể nhận xét bài viết/bài nói của học viên.
- **Xử lý Ảnh/File đính kèm**: Nghiên cứu cách đính kèm ảnh trực tiếp vào bài viết (thông qua Base64 hoặc Google Drive API).

---

## III. TƯƠNG LAI (DỰ ĐỊNH PHÁT TRIỂN)

6

### 1. Frontend (FE)

- **Trang Dashboard cá nhân (Profile)**: Biểu đồ thống kê số lượng từ vựng đã học và số nhiệm vụ đã hoàn thành theo tháng.
- **Tính năng Flashcard**: Chế độ học từ vựng nhanh từ danh sách `vocabularies` đã lưu.

### 2. Backend (BE - Google Apps Script)

- **Hệ thống Backup tự động**: Script tự động sao lưu dữ liệu Spreadsheet hàng tuần sang một File/Folder dự phòng.
- **Xuất báo cáo PDF**: Tính năng xuất tổng kết kết quả học tập của cá nhân/nhóm định kỳ phục vụ lưu trữ lâu dài.
