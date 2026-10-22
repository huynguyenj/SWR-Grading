import Modal from '@/components/ui/modal'
import type { SemesterType } from '@/features/admin/management/semester/types/semester'
import Tabs from '@/components/ui/tabs'
import UploadSingleMaterialSection from './UploadSingleMaterialSection'
import UploadMultipleMaterialsSection from './UploadMultipleMaterialsSection'
import { useState } from 'react'

export const DOCX_ACCEPT = '.docx'

interface UploadDocumentsModalProps {
  semester: SemesterType | null
  isOpen: boolean
  onClose: () => void
  /** Gọi lại khi upload thành công — dùng để page refetch danh sách/đóng modal */
  onUploaded?: () => void
}

export default function UploadDocumentsModal({
  semester,
  isOpen,
  onClose,
  onUploaded,
}: UploadDocumentsModalProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'multiple'>('single')

  return (
    <Modal open={isOpen} onClose={onClose} title={semester?.name} maxWidth="xl">
      {semester && (
        <>
                <Tabs
                  tabs={[
                    { id: 'single', label: 'Upload đề thi' },
                    { id: 'multiple', label: 'Upload nhiều đề thi' },
                  ]}
                  activeTab={activeTab}
                  onChange={(id) => setActiveTab(id as 'single' | 'multiple')}
                />
                { activeTab === 'single' ?
                  <UploadSingleMaterialSection
                    isSelected = {activeTab === 'single'}
                    onClose={onClose}
                    semester={semester}
                    onUploaded={onUploaded}
                  />
                  :
                  <UploadMultipleMaterialsSection
                    isSelected = {activeTab === 'multiple'}
                    onClose={onClose}
                    semester={semester}
                    onUploaded={onUploaded}
                  />
                }
        </>
      )}
    </Modal>
  )
}