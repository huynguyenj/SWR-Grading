import React, { useState } from 'react'
import type { Semester } from '../types/semester'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'

interface CreateSemesterModalProps {
  open: boolean
  onClose: () => void
  onCreate: (semester: Semester) => void
}

export default function CreateSemesterModal({
  open,
  onClose,
  onCreate,
}: CreateSemesterModalProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [errors, setErrors] = useState<Partial<Record<'name' | 'code', string>>>()
  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: Partial<Record<'name' | 'code', string>> = {}

    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập tên'
    }

    if (!code.trim()) {
      newErrors.code = 'Vui lòng nhập mã'
    } else if (!/^(FA|SU|SP)\d{2}$/.test(code)) {
      newErrors.code =
        'Vui lòng nhập mã đúng định dạng kỳ + năm. Ex: FA26'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    if (name && code) {
      onCreate({
        id: crypto.randomUUID(),
        name: name || 'Học kỳ chưa đặt tên',
        code: code || '—',
        startDate: startDate || new Date().toISOString().slice(0, 10),
        endDate: endDate || new Date().toISOString().slice(0, 10),
        status: 'draft',
        courseCount: 0,
        examCount: 0,
      })
      onClose()
      setName('')
      setCode('')
      setStartDate('')
      setEndDate('')
    }
  }
  console.log(errors);
  
  return (
    <Modal open={open} onClose={onClose} title="Tạo học kỳ mới">
      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Tên học kỳ
          </label>
          <Input
            size='basic'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Học kỳ Fall 2026"
            error={errors?.name}
          />
        </div>
 
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Mã học kỳ
          </label>
          <Input
            size='basic'
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="VD: FA26"
            error={errors?.code}
          />
        </div>
 
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Ngày kết thúc
            </label>
            <input
              min={new Date().toISOString().split("T")[0]}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
            />
          </div>
        </div>
 
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant='basic'
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant='default'
          >
            Tạo học kỳ
          </Button>
        </div>
      </form>
    </Modal>
  )
}