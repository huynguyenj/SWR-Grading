export type GradingLogStatus = 'draft' | 'in_progress' | 'completed'
export type FolderGradingStatus = 'not_graded' | 'grading' | 'graded'

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
    examSessionName: 'Đợt thi thực hành giữa kỳ - Ca 1',
    createdAt: '2026-09-02',
    status: 'completed',
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
    examSessionName: 'Đợt thi cuối kỳ Spring 2026',
    createdAt: '2026-08-20',
    status: 'draft',
    folders: [],
  },
]