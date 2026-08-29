export type ExamSessionStatus = 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
export type PaperSelectionMode = 'assigned' | 'random'

/** Quy tắc/yêu cầu khi thi — mỗi key tương ứng 1 checkbox trong form tạo đợt thi */
export const examRuleOptions = [
  { key: 'webcam', label: 'Bật giám sát qua webcam' },
  { key: 'lockdown', label: 'Khóa trình duyệt, cấm chuyển tab' },
  { key: 'faceVerify', label: 'Xác thực khuôn mặt trước khi vào thi' },
  { key: 'noReentry', label: 'Không cho vào lại sau khi đã thoát' },
  { key: 'screenRecord', label: 'Ghi lại màn hình trong suốt quá trình thi' },
] as const

export type ExamRuleKey = (typeof examRuleOptions)[number]['key']

/** Đề thi mà Lecturer đã upload, gắn theo học kỳ — dùng làm ngân hàng đề để Admin chọn/random */
export interface ExamPaper {
  id: string
  fileName: string
  semesterId: string
  uploadedBy: string
}

export const mockExamPapers: ExamPaper[] = [
  { id: 'p1', fileName: 'De_thi_SWR301_ca1.docx', semesterId: '2', uploadedBy: 'Nguyễn Văn A' },
  { id: 'p2', fileName: 'De_thi_SWR301_ca2.docx', semesterId: '2', uploadedBy: 'Nguyễn Văn A' },
  { id: 'p3', fileName: 'De_thi_SWR302_v1.docx', semesterId: '2', uploadedBy: 'Trần Thị B' },
  { id: 'p4', fileName: 'De_thi_SWR302_v2.docx', semesterId: '2', uploadedBy: 'Trần Thị B' },
  { id: 'p5', fileName: 'De_thi_giua_ky_SWR301.docx', semesterId: '3', uploadedBy: 'Nguyễn Văn A' },
]

export interface ExamSession {
  id: string
  name: string
  semesterId: string
  paperMode: PaperSelectionMode
  assignedPaperId?: string
  randomPoolSize?: number
  examDate: string // ISO date
  startTime: string // HH:mm
  durationMinutes: number
  openBeforeMinutes: number
  rules: ExamRuleKey[]
  notes?: string
  status: ExamSessionStatus
}

export const mockExamSessions: ExamSession[] = [
  {
    id: '1',
    name: 'Đợt thi thực hành giữa kỳ - Ca 1',
    semesterId: '2',
    paperMode: 'assigned',
    assignedPaperId: 'p1',
    examDate: '2026-09-02',
    startTime: '08:00',
    durationMinutes: 90,
    openBeforeMinutes: 15,
    rules: ['webcam', 'lockdown'],
    notes: 'Thí sinh cần chuẩn bị laptop có webcam.',
    status: 'scheduled',
  },
  {
    id: '2',
    name: 'Đợt thi thực hành giữa kỳ - Ca 2',
    semesterId: '2',
    paperMode: 'random',
    randomPoolSize: 2,
    examDate: '2026-09-02',
    startTime: '13:30',
    durationMinutes: 90,
    openBeforeMinutes: 10,
    rules: ['webcam', 'lockdown', 'faceVerify'],
    status: 'scheduled',
  },
  {
    id: '3',
    name: 'Đợt thi cuối kỳ Spring 2026',
    semesterId: '3',
    paperMode: 'assigned',
    assignedPaperId: 'p5',
    examDate: '2026-04-20',
    startTime: '09:00',
    durationMinutes: 120,
    openBeforeMinutes: 20,
    rules: ['webcam', 'lockdown', 'faceVerify', 'noReentry', 'screenRecord'],
    notes: 'Áp dụng quy chế thi cuối kỳ.',
    status: 'completed',
  },
]