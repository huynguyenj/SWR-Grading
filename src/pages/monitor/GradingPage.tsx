import GradingLogDetailView from '@/features/lecturer/grading_exam/components/GradingLogDetailView'
import GradingLogsTable from '@/features/lecturer/grading_exam/components/GradingLogsTable'
import type { GradingDiaryType } from '@/features/lecturer/grading_exam/types/grading-diary.type'
import { useState } from 'react'

export default function GradingPage() {
  const [selectedDiary, setSelectedDiary] = useState<GradingDiaryType | null>(null)

  // ================= DETAIL VIEW =================
  if (selectedDiary) {
    return (
      <GradingLogDetailView
        diaryId={selectedDiary.gradingDiaryId}
        diaryName={selectedDiary.name}
        onBack={() => setSelectedDiary(null)}
      />
    )
  }
  // ================= LIST VIEW =================
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Chấm điểm</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Quản lý bài kiểm tra và nhật ký chấm điểm bằng AI.
          </p>
        </div>
      </div>

        <GradingLogsTable 
          onSelected={setSelectedDiary}
        />
    </div>
  )
}