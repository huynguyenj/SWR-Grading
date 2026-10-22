import * as XLSX from 'xlsx'
import { formatDate } from '@/utils/format'
import type { SubmissionType } from '@/features/lecturer/grading_exam/types/submission.type'
import { STATUS_LABEL } from '../const/submission_type'


/**
 * Xuất danh sách bài nộp ra file .xlsx — chạy hoàn toàn phía client,
 * không cần gọi thêm API vì dữ liệu đã có sẵn trong state.
 */
export function exportSubmissionsToExcel(submissions: SubmissionType[], fileName = 'danh-sach-bai-nop.xlsx') {
  const rows = submissions.map((submission, index) => ({
    STT: index + 1,
    'File bài làm': submission.submissionFile,
    'Ngày nộp': formatDate(submission.createdDate),
    'Trạng thái': STATUS_LABEL[submission.status] ?? submission.status,
    'Điểm AI': submission.aiScore ?? '',
    'Điểm GV': submission.lecturerScore ?? '',
    'Nhận xét': submission.comment ?? '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)

  // Set độ rộng cột cho dễ đọc thay vì mặc định co cụm
  worksheet['!cols'] = [
    { wch: 5 }, // STT
    { wch: 32 }, // File bài làm
    { wch: 14 }, // Ngày nộp
    { wch: 14 }, // Trạng thái
    { wch: 10 }, // Điểm AI
    { wch: 10 }, // Điểm GV
    { wch: 45 }, // Nhận xét
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bài nộp')
  XLSX.writeFile(workbook, fileName)
}