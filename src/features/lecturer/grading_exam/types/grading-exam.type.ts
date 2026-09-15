export type GradingLogStatus = 'draft' | 'in_progress' | 'completed'
export type FolderGradingStatus = 'not_graded' | 'grading' | 'graded'

/** 1 trong 3 file tham chiếu của nhật ký: đề thi / rubric / đáp án */
export interface ReferenceFile {
  fileName: string
  fileUrl?: string
  /** Nội dung để hiển thị trong modal xem trước — dữ liệu giả lập, chưa đọc file thật */
  content: string
}
export interface SubmissionFolder {
  id: string
  fileName: string
  fileSizeLabel: string
  status: FolderGradingStatus
  score: number | null
  aiLogs: string[]
  comment: string
}

export interface GradingLog {
  id: string
  name: string
  examSessionName?: string
  createdAt: string
  status: GradingLogStatus
  folders: SubmissionFolder[]
  examPaperFile?: ReferenceFile
  rubricFile?: ReferenceFile
  answerFile?: ReferenceFile
}

const sampleAiLogs = [
  'Đang đọc nội dung file bài làm...',
  'Phát hiện file báo cáo hợp lệ.',
  'Đối chiếu bài làm với rubric chấm điểm...',
  'Kiểm tra tiêu chí 1: Đặc tả yêu cầu — đạt 8/10',
  'Kiểm tra tiêu chí 2: Mô hình hóa use case — đạt 7/10',
  'Kiểm tra tiêu chí 3: Trình bày & định dạng — đạt 9/10',
  'Không phát hiện dấu hiệu đạo văn đáng kể.',
  'Tổng hợp điểm và tạo nhận xét tự động...',
]

export const mockGradingLogs: GradingLog[] = [
  {
    id: '1',
    name: 'Chấm bài giữa kỳ SWR301 - Ca 1',
    examSessionName: 'FA26 - Đợt 1',
    createdAt: '2026-09-02',
    status: 'completed',
    examPaperFile: {
      fileName: 'De_thi_SWR301_ca1.docx',
      content:
        'ĐỀ THI THỰC HÀNH GIỮA KỲ - SWR301\n\n' +
        'Câu 1 (4 điểm): Viết đặc tả yêu cầu phần mềm (SRS) cho hệ thống đặt vé xem phim trực tuyến. ' +
        'Yêu cầu bao gồm tối thiểu 5 chức năng chính, ràng buộc phi chức năng và giả định.\n\n' +
        'Câu 2 (3 điểm): Vẽ sơ đồ Use Case mô tả tương tác giữa các actor (Khách hàng, Quản trị viên, ' +
        'Cổng thanh toán) với hệ thống.\n\n' +
        'Câu 3 (3 điểm): Trình bày quy trình quản lý thay đổi yêu cầu (Requirement Change Management) ' +
        'áp dụng cho dự án trên.',
    },
    rubricFile: {
      fileName: 'Rubric_cham_diem_SWR301.xlsx',
      content:
        'RUBRIC CHẤM ĐIỂM\n\n' +
        'Tiêu chí 1 — Đặc tả yêu cầu (4đ)\n' +
        '  • Đầy đủ chức năng chính: 2đ\n' +
        '  • Ràng buộc phi chức năng hợp lý: 1đ\n' +
        '  • Trình bày rõ ràng, đúng chuẩn SRS: 1đ\n\n' +
        'Tiêu chí 2 — Use Case Diagram (3đ)\n' +
        '  • Xác định đúng actor: 1đ\n' +
        '  • Quan hệ include/extend hợp lý: 1đ\n' +
        '  • Ký hiệu UML chuẩn: 1đ\n\n' +
        'Tiêu chí 3 — Quy trình quản lý thay đổi (3đ)\n' +
        '  • Nêu đúng các bước quy trình: 2đ\n' +
        '  • Ví dụ minh họa phù hợp: 1đ',
    },
    answerFile: {
      fileName: 'Dap_an_SWR301_ca1.docx',
      content:
        'ĐÁP ÁN THAM KHẢO\n\n' +
        'Câu 1: SRS cần có các mục Chức năng đặt vé, Thanh toán, Quản lý suất chiếu, ' +
        'Thông báo, Đánh giá phim. Ràng buộc phi chức năng: thời gian phản hồi < 2s, ' +
        'hỗ trợ 1000 người dùng đồng thời.\n\n' +
        'Câu 2: Use case tối thiểu gồm Đặt vé, Hủy vé, Thanh toán (include), ' +
        'Áp dụng mã giảm giá (extend Đặt vé), Quản lý suất chiếu (actor Quản trị viên).\n\n' +
        'Câu 3: Quy trình gồm 5 bước: Ghi nhận yêu cầu thay đổi -> Phân tích tác động -> ' +
        'Phê duyệt -> Triển khai -> Cập nhật tài liệu.',
    },
    folders: [
      {
        id: 'f1',
        fileName: 'SE172001_NguyenVanA.docx',
        fileSizeLabel: '1.4 MB',
        status: 'graded',
        score: 8.5,
        aiLogs: sampleAiLogs,
        comment: 'Bài làm tốt, trình bày rõ ràng. Cần bổ sung thêm test case cho use case đăng nhập.',
      },
      {
        id: 'f2',
        fileName: 'SE172002_TranThiB.docx',
        fileSizeLabel: '0.6 MB',
        status: 'graded',
        score: 0,
        aiLogs: [
          'Đang đọc nội dung file bài làm...',
          'Không tìm thấy nội dung hợp lệ trong file nộp bài.',
          'Không thể chấm điểm do thiếu tài liệu bắt buộc.',
        ],
        comment: 'File nộp không hợp lệ, không thể chấm điểm.',
      },
      {
        id: 'f3',
        fileName: 'SE172003_LeVanC.docx',
        fileSizeLabel: '2.1 MB',
        status: 'graded',
        score: 7,
        aiLogs: sampleAiLogs,
        comment: 'Đáp ứng cơ bản yêu cầu đề bài.',
      },
    ],
  },
  {
    id: '2',
    name: 'Chấm bài cuối kỳ SWR302',
    examSessionName: 'FA26 - Đợt 2',
    createdAt: '2026-08-20',
    status: 'draft',
    folders: [],
  },
]

export type QuizStatus = 'draft' | 'published' | 'archived'
export interface QuizPaper {
  id: string
  title: string
  totalQuestions: number
  fileDocs: string
  createDate: string
  status: QuizStatus
}
 
export const mockQuizPapers: QuizPaper[] = [
  {
    id: 'q1',
    title: 'Kiểm tra thực hành - Đặc tả yêu cầu phần mềm',
    totalQuestions: 20,
    fileDocs: 'De_kiem_tra_SWR301_v1.docx',
    createDate: '2026-08-25',
    status: 'published',
  },
  {
    id: 'q2',
    title: 'Kiểm tra thực hành - Mô hình hóa Use Case',
    totalQuestions: 15,
    fileDocs: 'De_kiem_tra_SWR301_v2.docx',
    createDate: '2026-08-28',
    status: 'published',
  },
  {
    id: 'q3',
    title: 'Kiểm tra cuối kỳ - Thiết kế phần mềm',
    totalQuestions: 25,
    fileDocs: 'De_cuoi_ky_SWR302.docx',
    createDate: '2026-08-10',
    status: 'draft',
  },
  {
    id: 'q4',
    title: 'Kiểm tra 15 phút - Sơ đồ tuần tự',
    totalQuestions: 10,
    fileDocs: 'De_15p_sequence_diagram.docx',
    createDate: '2026-07-15',
    status: 'archived',
  },
]