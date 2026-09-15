import Tabs from '@/components/ui/tabs'
import CreateGradingLogModal from '@/features/lecturer/grading_exam/components/CreateGradingModal'
import GradingLogDetailView from '@/features/lecturer/grading_exam/components/GradingLogDetailView'
import GradingLogsTable from '@/features/lecturer/grading_exam/components/GradingLogsTable'
import QuizPapersTable from '@/features/lecturer/grading_exam/components/QuizPaperTable'
import { mockGradingLogs, mockQuizPapers, type GradingLog } from '@/features/lecturer/grading_exam/types/grading-exam.type'
import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'

export default function GradingPage() {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'logs'>('quizzes')
  const [logs, setLogs] = useState<GradingLog[]>(mockGradingLogs)
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const selectedLog = logs.find((l) => l.id === selectedLogId) ?? null

  function handleCreateLog(log: GradingLog) {
    setLogs((prev) => [log, ...prev])
  }

  // ================= DETAIL VIEW =================
  if (selectedLog) {
    return (
      <GradingLogDetailView
        log={selectedLog}
        onBack={() => setSelectedLogId(null)}
        onUpdateLog={(updater) =>
          setLogs((prev) => prev.map((l) => (l.id === selectedLog.id ? updater(l) : l)))
        }
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
        {activeTab === 'logs' && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-rust transition-colors shrink-0"
          >
            <FiPlus className="w-4 h-4" />
            Tạo nhật ký
          </button>
        )}
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
        <QuizPapersTable quizzes={mockQuizPapers} />
      ) : (
        <GradingLogsTable logs={logs} onOpen={(log) => setSelectedLogId(log.id)} />
      )}

      <CreateGradingLogModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateLog}
      />
    </div>
  )
}