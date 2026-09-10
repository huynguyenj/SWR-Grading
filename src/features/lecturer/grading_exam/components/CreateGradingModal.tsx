import React, { useState } from 'react'
import type { GradingLog } from '../types/grading-exam.type'
import Modal from '@/components/ui/modal'

interface CreateGradingLogModalProps {
  open: boolean
  onClose: () => void
  onCreate: (log: GradingLog) => void
}

export default function CreateGradingLogModal({
  open,
  onClose,
  onCreate,
}: CreateGradingLogModalProps) {
  const [name, setName] = useState('')
  const [examSessionName, setExamSessionName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onCreate({
      id: crypto.randomUUID(),
      name: name || 'Nhật ký chấm điểm chưa đặt tên',
      examSessionName: examSessionName || undefined,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'draft',
      folders: [],
    })
    onClose()
    setName('')
    setExamSessionName('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Tạo nhật ký chấm điểm">
      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Tên nhật ký
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Chấm bài giữa kỳ SWR301 - Ca 1"
            className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Đợt thi liên quan <span className="text-text-muted font-normal">(không bắt buộc)</span>
          </label>
          <input
            value={examSessionName}
            onChange={(e) => setExamSessionName(e.target.value)}
            placeholder="VD: Đợt thi thực hành giữa kỳ - Ca 1"
            className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-muted transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-rust transition-colors"
          >
            Tạo nhật ký
          </button>
        </div>
      </form>
    </Modal>
  )
}