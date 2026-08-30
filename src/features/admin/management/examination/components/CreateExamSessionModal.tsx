import { useMemo, useState } from "react"
import type { Semester } from "../../semester/types/semester"
import { mockExamPapers, type ExamRuleKey, type ExamSession, type PaperSelectionMode } from "../types/examination.type"
import Modal from "@/components/ui/modal"
import ExamPaperSelector from "./ExamPaperSelector"
import ExamRulesSection from "./ExamRuleSession"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"


interface CreateExamSessionModalProps {
  open: boolean
  onClose: () => void
  onCreate: (session: ExamSession) => void
  semesters: Semester[]
}

export default function CreateExamSessionModal({
  open,
  onClose,
  onCreate,
  semesters,
}: CreateExamSessionModalProps) {
  const [name, setName] = useState('')
  const [semesterId, setSemesterId] = useState('')
  const [paperMode, setPaperMode] = useState<PaperSelectionMode>('assigned')
  const [assignedPaperId, setAssignedPaperId] = useState('')
  const [randomPoolSize, setRandomPoolSize] = useState(1)
  const [examDate, setExamDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(90)
  const [openBeforeMinutes, setOpenBeforeMinutes] = useState(15)
  const [rules, setRules] = useState<ExamRuleKey[]>([])
  const [notes, setNotes] = useState('')

  const availablePapers = useMemo(
    () => mockExamPapers.filter((p) => p.semesterId === semesterId),
    [semesterId],
  )

  function toggleRule(key: ExamRuleKey) {
    setRules((prev) => (prev.includes(key) ? prev.filter((r) => r !== key) : [...prev, key]))
  }

  function resetForm() {
    setName('')
    setSemesterId('')
    setPaperMode('assigned')
    setAssignedPaperId('')
    setRandomPoolSize(1)
    setExamDate('')
    setStartTime('')
    setDurationMinutes(90)
    setOpenBeforeMinutes(15)
    setRules([])
    setNotes('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onCreate({
      id: crypto.randomUUID(),
      name: name || 'Đợt thi chưa đặt tên',
      semesterId,
      paperMode,
      assignedPaperId: paperMode === 'assigned' ? assignedPaperId : undefined,
      randomPoolSize: paperMode === 'random' ? randomPoolSize : undefined,
      examDate: examDate || new Date().toISOString().slice(0, 10),
      startTime: startTime || '08:00',
      durationMinutes,
      openBeforeMinutes,
      rules,
      notes: notes || undefined,
      status: 'draft',
    })
    onClose()
    resetForm()
  }

  return (
    <Modal open={open} onClose={onClose} title="Tạo đợt thi mới" maxWidth="xl">
      <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto px-5 py-4 space-y-6">
        {/* ===== Thông tin chung ===== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Thông tin chung</h3>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Tên đợt thi
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Đợt thi thực hành giữa kỳ - Ca 1"
              size='basic'
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Học kỳ
            </label>
            <select
              value={semesterId}
              onChange={(e) => {
                setSemesterId(e.target.value)
                setAssignedPaperId('')
              }}
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
            >
              <option value="">-- Chọn học kỳ --</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ===== Đề thi ===== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Đề thi</h3>
          <ExamPaperSelector
            mode={paperMode}
            onModeChange={setPaperMode}
            availablePapers={availablePapers}
            assignedPaperId={assignedPaperId}
            onAssignedPaperChange={setAssignedPaperId}
            randomPoolSize={randomPoolSize}
            onRandomPoolSizeChange={setRandomPoolSize}
            disabled={!semesterId}
          />
        </section>

        {/* ===== Thời gian tổ chức ===== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Thời gian tổ chức</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Ngày thi
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Thời lượng làm bài (phút)
              </label>
              <Input
                type="number"
                min={5}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                size='basic'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Mở bài thi trước giờ thi (phút)
              </label>
              <Input
                type="number"
                min={0}
                value={openBeforeMinutes}
                onChange={(e) => setOpenBeforeMinutes(Number(e.target.value))}
                size='basic'
              />
              <p className="mt-1 text-xs text-text-muted">
                Thí sinh sẽ vào được phòng thi trước giờ bắt đầu này để chuẩn bị.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Yêu cầu & quy định khi thi ===== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Yêu cầu & quy định khi thi</h3>
          <ExamRulesSection
            selectedRules={rules}
            onToggleRule={toggleRule}
            notes={notes}
            onNotesChange={setNotes}
          />
        </section>

        <div className="flex items-center justify-end gap-2 border-t border-border-default pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant='basic'
          >
            Hủy
          </Button>
          <Button
            type="submit"
          >
            Tạo đợt thi
          </Button>
        </div>
      </form>
    </Modal>
  )
}