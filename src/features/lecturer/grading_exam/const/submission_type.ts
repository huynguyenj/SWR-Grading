import type { SubmissionStatus } from "../types/submission.type";

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  '0': 'Đã nộp',
  '1': 'AI đã chấm',
  '2': 'GV đã duyệt',
  '3': 'Hoàn tất',
}