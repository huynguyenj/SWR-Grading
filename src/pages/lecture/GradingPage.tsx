import Tabs from '@/components/ui/tabs'
import GradingLogDetailView from '@/features/lecturer/grading_exam/components/GradingLogDetailView'
import GradingLogsTable from '@/features/lecturer/grading_exam/components/GradingLogsTable'
import PaperSetTable from '@/features/lecturer/grading_exam/components/PaperSetTable'
import type { GradingDiaryType } from '@/features/lecturer/grading_exam/types/grading-diary.type'
import { useState } from 'react'

export default function GradingPage() {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'logs'>('quizzes')
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

      <Tabs
        tabs={[
          { id: 'quizzes', label: 'Bài kiểm tra' },
          { id: 'logs', label: 'Nhật ký chấm điểm' },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as 'quizzes' | 'logs')}
      />

      {activeTab === 'quizzes' ? (
        <PaperSetTable />
      ) : (
        <GradingLogsTable 
          onSelected={setSelectedDiary}
        />
      )}

      {/*
        TODO: CreateGradingLogModal vẫn đang dùng kiểu dữ liệu mock (onCreate nhận
        GradingLog cũ) — cần chuyển sang gọi API thật + onRefresh giống pattern
        CreateSemesterModal/CreateExamSessionModal ở lượt chỉnh sau.
      */}
    </div>
  )
}